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
          <a
            href="https://wa.me/2348141680363"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message us on WhatsApp at +234 814 168 0363"
            className="mt-2 flex max-w-full items-center gap-2 text-[#F4F4F5] hover:text-[var(--gold)]"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 shrink-0 fill-current">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.43 9.43 0 0 1-4.8-1.32l-.35-.2-3.57.93.95-3.48-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.24-9.44 9.45-9.44 2.52 0 4.9.98 6.68 2.77a9.38 9.38 0 0 1 2.76 6.68c0 5.21-4.24 9.44-9.45 9.44zm8.04-17.49A11.3 11.3 0 0 0 12.05.68C5.78.68.68 5.78.68 12.05c0 2 .52 3.96 1.52 5.68L.58 23.64l6.04-1.58a11.33 11.33 0 0 0 5.43 1.38h.01c6.27 0 11.37-5.1 11.37-11.37 0-3.04-1.18-5.9-3.34-8.06z" />
            </svg>
            +234 814 168 0363
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
