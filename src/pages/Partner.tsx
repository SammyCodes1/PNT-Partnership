import { PartnerForm } from "../components/PartnerForm.tsx"

export function Partner() {
  return (
    <section className="mx-auto w-full min-w-0 max-w-3xl px-4 py-10 sm:py-16 md:px-8">
      <h1 className="font-display text-3xl font-extrabold leading-[1.15] text-balance sm:text-4xl">Partner With Us</h1>
      <p className="mt-3 max-w-[60ch] leading-relaxed text-[#D4D4D4]">
        Every gift, prayer, and act of service builds the house. Please fill in the form below.
      </p>
      <div className="mt-10">
        <PartnerForm />
      </div>
    </section>
  )
}
