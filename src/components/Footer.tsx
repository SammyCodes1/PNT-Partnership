import logo from "../assets/logo.png"

export function Footer() {
  return (
    <footer className="glass-bar mt-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between sm:gap-8 md:px-8">
        <img src={logo} alt="Psalmist Nation Tabernacle" className="h-16 w-auto" />
        <address className="text-sm not-italic leading-relaxed text-[#D4D4D4]">
          <p>Contact Us At</p>
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
