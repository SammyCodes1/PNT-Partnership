import { motion, useReducedMotion } from "framer-motion"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import { Link } from "react-router-dom"

const primary =
  "inline-flex min-h-12 items-center justify-center rounded-[12px] bg-[var(--gold)] px-6 text-sm font-semibold text-[var(--black)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"

const secondary =
  "inline-flex min-h-12 items-center justify-center rounded-[12px] border border-[var(--gold)] bg-[var(--glass-fill)] px-6 text-sm font-semibold text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"

type ButtonLinkProps = {
  to: string
  children: ReactNode
  variant?: "primary" | "secondary"
  wide?: boolean
}

export function ButtonLink({ to, children, variant = "primary", wide = false }: ButtonLinkProps) {
  const reduce = useReducedMotion()
  const width = wide ? "w-full" : "w-full sm:w-auto"

  return (
    <motion.div
      className={`inline-flex ${width}`}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
    >
      <Link to={to} className={`${variant === "primary" ? primary : secondary} ${width}`}>
        {children}
      </Link>
    </motion.div>
  )
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: "primary" | "secondary"
}

export function Button({ children, className = "", disabled, type = "submit", variant = "primary", ...props }: ButtonProps) {
  const reduce = useReducedMotion()
  const look = variant === "primary" ? primary : secondary

  return (
    <motion.div
      className="inline-flex w-full sm:w-auto"
      whileTap={reduce || disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.12 }}
    >
      <button
        type={type}
        disabled={disabled}
        className={`${look} w-full sm:w-auto disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
        {...props}
      >
        {children}
      </button>
    </motion.div>
  )
}
