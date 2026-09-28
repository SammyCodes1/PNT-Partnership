import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { GoldButton } from "./GoldButton.tsx"
import {
  AREAS_OF_PARTNERSHIP,
  PARTNERSHIP_TYPES,
  PAYMENT_METHODS,
  PLEDGE_FREQUENCIES,
} from "../lib/partnership.ts"
import { supabase } from "../lib/supabase.ts"

type Fields = {
  full_name: string
  email: string
  phone: string
  location: string
  partnership_type: string
  pledge_frequency: string
  amount: string
  area_of_partnership: string
  payment_method: string
  message: string
  agree_contact: boolean
}

type Errors = Partial<Record<keyof Fields, string>>

const fieldClass = "glass-input text-base placeholder:text-[#B5B5B5]"

const TITHE_ACCOUNT = "0886166691"
const BUILDING_ACCOUNT = "1312749443"

const showAmount = (pt: string) => pt === "One-Time Partner" || pt === "Recurring Partner"
const showFrequency = (pt: string) => pt === "Recurring Partner"
const showPayment = (pt: string) => pt === "One-Time Partner" || pt === "Recurring Partner"

function parseAmount(value: string): number | null {
  const cleaned = value.trim().replace(/,/g, "")
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null
  const amount = Number(cleaned)
  if (!Number.isFinite(amount) || amount < 0) return null
  return amount
}

function validate(fields: Fields): Errors {
  const errors: Errors = {}

  if (!fields.full_name.trim()) errors.full_name = "Enter your full name."
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
    errors.email = "Enter a valid email address."
  }
  if (fields.phone.trim().length < 7) errors.phone = "Enter a phone number we can reach."
  if (!PARTNERSHIP_TYPES.some((t) => t.value === fields.partnership_type)) {
    errors.partnership_type = "Select a partnership type."
  }
  if (showFrequency(fields.partnership_type) && !fields.pledge_frequency) {
    errors.pledge_frequency = "Select a pledge frequency."
  }
  if (showAmount(fields.partnership_type)) {
    if (parseAmount(fields.amount) == null) {
      errors.amount = "Enter a valid amount."
    }
  }
  if (!fields.area_of_partnership) {
    errors.area_of_partnership = "Select an area of partnership."
  }
  if (showPayment(fields.partnership_type) && !fields.payment_method) {
    errors.payment_method = "Select a preferred payment method."
  }
  if (fields.message.trim().length > 2000) {
    errors.message = "Keep the message under 2,000 characters."
  }
  if (!fields.agree_contact) {
    errors.agree_contact = "Agree to be contacted about this partnership."
  }

  return errors
}

export function PartnerForm() {
  const [fields, setFields] = useState<Fields>({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    partnership_type: "",
    pledge_frequency: "",
    amount: "",
    area_of_partnership: "",
    payment_method: "",
    message: "",
    agree_contact: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "failed">("idle")
  const [failure, setFailure] = useState("")
  const [copied, setCopied] = useState("")

  async function copyAccount(account: string) {
    try {
      await navigator.clipboard.writeText(account)
      setCopied(account)
      window.setTimeout(() => setCopied(""), 2000)
    } catch {
      setCopied("")
    }
  }

  function update(key: keyof Fields, value: string | boolean) {
    setFields((current) => {
      const next = { ...current, [key]: value }
      // Clear dependent fields when partnership_type changes
      if (key === "partnership_type") {
        next.pledge_frequency = ""
        next.payment_method = ""
        if (!showAmount(value as string)) next.amount = ""
      }
      return next
    })
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(fields)
    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    if (!supabase) {
      setStatus("failed")
      setFailure("This form will send once the church database is connected.")
      return
    }

    setStatus("saving")
    setFailure("")

    const { error } = await supabase.from("partners").insert({
      full_name: fields.full_name.trim(),
      email: fields.email.trim(),
      phone: fields.phone.trim(),
      location: fields.location.trim() || null,
      partnership_type: fields.partnership_type,
      pledge_frequency: showFrequency(fields.partnership_type) ? fields.pledge_frequency || null : null,
      area_of_partnership: fields.area_of_partnership,
      amount: showAmount(fields.partnership_type) ? parseAmount(fields.amount) : null,
      payment_method: showPayment(fields.partnership_type) ? fields.payment_method || null : null,
      is_anonymous: false,
      message: fields.message.trim() || null,
    })

    if (error) {
      setStatus("failed")
      setFailure("We could not save your partnership. Please try again.")
      return
    }
    setStatus("sent")
  }

  const sent = status === "sent"

  return (
    <motion.div
      layout
      className="glass-panel px-4 py-6 sm:px-5 sm:py-8 md:px-8"
      transition={{ layout: { duration: 0.35, ease: "easeOut" } }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {sent ? (
          <motion.div
            key="received"
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            <h2 className="font-display text-3xl font-extrabold leading-[1.15]">Thank you.</h2>
            <p className="mt-4 max-w-[65ch] leading-relaxed text-[#D4D4D4]">
              Your partnership has been received. The Lord bless you.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28 }}
          >
            {/* Row 1: Full Name, Email, Phone */}
            <Field label="Full Name" error={errors.full_name} htmlFor="full_name" required>
              <input
                id="full_name"
                name="full_name"
                autoComplete="name"
                value={fields.full_name}
                onChange={(e) => update("full_name", e.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.full_name)}
              />
            </Field>

            <Field label="Email" error={errors.email} htmlFor="email" required>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={(e) => update("email", e.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.email)}
              />
            </Field>

            <Field label="Phone" error={errors.phone} htmlFor="phone" required>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={fields.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.phone)}
              />
            </Field>

            {/* Location */}
            <Field label="Location" error={errors.location} htmlFor="location">
              <input
                id="location"
                name="location"
                autoComplete="address-level2"
                placeholder="City, Country"
                value={fields.location}
                onChange={(e) => update("location", e.target.value)}
                className={fieldClass}
              />
            </Field>

            {/* Partnership Type — 4 selectable cards, full width */}
            <Field
              label="Partnership Type"
              error={errors.partnership_type}
              htmlFor="partnership_type"
              className="md:col-span-2"
              required
            >
              <div
                id="partnership_type"
                role="group"
                aria-label="Partnership type"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                {PARTNERSHIP_TYPES.map((type) => {
                  const selected = fields.partnership_type === type.value
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => update("partnership_type", type.value)}
                      aria-pressed={selected}
                      className={[
                        "flex min-h-14 w-full items-center rounded-[12px] border px-4 py-4 text-left transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]",
                        selected
                          ? "border-[var(--gold)] bg-[rgba(212,175,55,0.08)] text-[#F4F4F5]"
                          : "border-[var(--glass-border)] bg-[var(--glass-fill)] text-[#B5B5B5] hover:border-[rgba(212,175,55,0.45)] hover:text-[#F4F4F5]",
                      ].join(" ")}
                    >
                      <span className="text-base font-semibold leading-snug">{type.value}</span>
                    </button>
                  )
                })}
              </div>
            </Field>

            {/* Pledge Frequency — only for Recurring Partner */}
            {showFrequency(fields.partnership_type) && (
              <Field
                label="Pledge Frequency"
                error={errors.pledge_frequency}
                htmlFor="pledge_frequency"
                required
              >
                <select
                  id="pledge_frequency"
                  name="pledge_frequency"
                  value={fields.pledge_frequency}
                  onChange={(e) => update("pledge_frequency", e.target.value)}
                  className={fieldClass}
                  aria-invalid={Boolean(errors.pledge_frequency)}
                >
                  <option value="">Select frequency</option>
                  {PLEDGE_FREQUENCIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {/* Pledge Amount — only for One-Time Partner or Recurring Partner */}
            {showAmount(fields.partnership_type) && (
              <Field label="Pledge Amount" error={errors.amount} htmlFor="amount" required>
                <input
                  id="amount"
                  name="amount"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={fields.amount}
                  onChange={(e) => update("amount", e.target.value)}
                  className={fieldClass}
                  aria-invalid={Boolean(errors.amount)}
                />
              </Field>
            )}

            {/* Area of Partnership */}
            <Field
              label="Area of Partnership"
              error={errors.area_of_partnership}
              htmlFor="area_of_partnership"
              required
            >
              <select
                id="area_of_partnership"
                name="area_of_partnership"
                value={fields.area_of_partnership}
                onChange={(e) => update("area_of_partnership", e.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.area_of_partnership)}
              >
                <option value="">Select an area of partnership</option>
                {AREAS_OF_PARTNERSHIP.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </Field>

            {fields.area_of_partnership === "Tithe and Offerings" ? (
              <div className="glass-panel flex items-center justify-between gap-4 px-4 py-4 md:col-span-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#F4F4F5]">Account details</p>
                  <p className="mt-3 text-sm text-[#D4D4D4]">Bank: GT Bank</p>
                  <p className="mt-1 text-sm text-[#D4D4D4]">Account name: Psalmist Nation Tabernacle</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="text-base font-semibold tracking-wide text-[#F4F4F5]">{TITHE_ACCOUNT}</p>
                    <button
                      type="button"
                      onClick={() => copyAccount(TITHE_ACCOUNT)}
                      className="min-h-11 rounded-[12px] border border-[var(--gold)] px-4 text-sm font-semibold text-[var(--gold)]"
                    >
                      {copied === TITHE_ACCOUNT ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <img src="/gtbank.svg" alt="GTBank" className="h-16 w-16 shrink-0 sm:h-20 sm:w-20" />
              </div>
            ) : null}

            {fields.area_of_partnership === "Building Project" ? (
              <div className="glass-panel flex items-center justify-between gap-4 px-4 py-4 md:col-span-2">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#F4F4F5]">Account details</p>
                  <p className="mt-3 text-sm text-[#D4D4D4]">Bank: Zenith Bank</p>
                  <p className="mt-1 text-sm text-[#D4D4D4]">Account name: Psalmist Nation Tabernacle Projects</p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <p className="text-base font-semibold tracking-wide text-[#F4F4F5]">{BUILDING_ACCOUNT}</p>
                    <button
                      type="button"
                      onClick={() => copyAccount(BUILDING_ACCOUNT)}
                      className="min-h-11 rounded-[12px] border border-[var(--gold)] px-4 text-sm font-semibold text-[var(--gold)]"
                    >
                      {copied === BUILDING_ACCOUNT ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
                <img src="/zenith.svg" alt="Zenith Bank" className="h-16 w-auto shrink-0 sm:h-20" />
              </div>
            ) : null}

            {/* Preferred Payment Method — only for One-Time Partner or Recurring Partner */}
            {showPayment(fields.partnership_type) && (
              <Field
                label="Preferred Payment Method"
                error={errors.payment_method}
                htmlFor="payment_method"
                required
              >
                <select
                  id="payment_method"
                  name="payment_method"
                  value={fields.payment_method}
                  onChange={(e) => update("payment_method", e.target.value)}
                  className={fieldClass}
                  aria-invalid={Boolean(errors.payment_method)}
                >
                  <option value="">Select a preferred payment method</option>
                  {PAYMENT_METHODS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
            )}

            {/* Message / Prayer Request — full width */}
            <Field
              label="Message / Prayer Request"
              error={errors.message}
              htmlFor="message"
              className="md:col-span-2"
            >
              <textarea
                id="message"
                name="message"
                rows={5}
                placeholder="Optional — share a prayer request or note for our leaders."
                value={fields.message}
                onChange={(e) => update("message", e.target.value)}
                className={fieldClass}
                aria-invalid={Boolean(errors.message)}
              />
            </Field>

            {/* Agree to contact checkbox — full width */}
            <div className="md:col-span-2">
              <div className="flex min-h-11 items-center gap-3">
                <input
                  id="agree_contact"
                  name="agree_contact"
                  type="checkbox"
                  checked={fields.agree_contact}
                  onChange={(e) => update("agree_contact", e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--gold)]"
                  aria-invalid={Boolean(errors.agree_contact)}
                />
                <label htmlFor="agree_contact" className="cursor-pointer text-sm text-[#D4D4D4]">
                  I agree to be contacted about this partnership
                  <span className="ml-0.5 text-[var(--gold)]">*</span>
                </label>
              </div>
              {errors.agree_contact ? (
                <p className="mt-2 text-sm text-[#F0B4B4]" role="alert">
                  {errors.agree_contact}
                </p>
              ) : null}
            </div>

            {/* Submit — full width */}
            <div className="w-full md:col-span-2">
              <GoldButton type="submit" disabled={status === "saving"} className="w-full sm:w-full">
                {status === "saving" ? "Sending…" : "Send partnership"}
              </GoldButton>
              {status === "failed" && (
                <p className="mt-3 text-sm text-[#F0B4B4]" role="alert">
                  {failure}
                </p>
              )}
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function Field({
  label,
  htmlFor,
  error,
  hint,
  className = "",
  required = false,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  hint?: string
  className?: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <div className={`flex w-full min-w-0 flex-col gap-2 ${className}`}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-[#F4F4F5]">
        {label}
        {required && <span className="ml-0.5 text-[var(--gold)]">*</span>}
      </label>
      {children}
      {hint && (
        <p id={`${htmlFor}-hint`} className="text-sm text-[#C8C8C8]">
          {hint}
        </p>
      )}
      {error && (
        <p className="text-sm text-[#F0B4B4]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
