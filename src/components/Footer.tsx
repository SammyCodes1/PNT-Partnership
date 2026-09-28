import logo from "../assets/logo.png"

export function Footer() {
  return (
    <footer className="glass-bar mt-8">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-10 sm:flex-row sm:justify-between sm:gap-8 md:px-8">
        <img src={logo} alt="Psalmist Nation Tabernacle" className="h-16 w-16 shrink-0 object-contain" />
        <address className="text-sm not-italic leading-relaxed text-[#D4D4D4]">
          <p>Contact Us At</p>
          <a
            href="mailto:psalmistnationtabernacle@gmail.com"
            className="mt-2 inline-flex max-w-full items-center gap-2 break-all text-[#F4F4F5] hover:text-[var(--gold)]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-none stroke-current">
              <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5" />
              <path d="M4 7l8 6 8-6" strokeWidth="1.5" />
            </svg>
            psalmistnationtabernacle@gmail.com
          </a>
        </address>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-[#C8C8C8] md:px-8">
          © 2026 Psalmist Nation Tabernacle
        </p>
      </div>
    </footer>
  )
}
