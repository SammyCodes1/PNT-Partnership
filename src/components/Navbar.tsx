import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useState } from "react"
import { NavLink } from "react-router-dom"
import logo from "../assets/logo.png"

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/partner", label: "Partner With Us", end: false },
  { to: "/projects", label: "Our Projects", end: false },
]

function itemClass(isActive: boolean) {
  return `text-sm font-medium transition-colors duration-200 ${
    isActive ? "text-[var(--gold)]" : "text-[#F4F4F5] hover:text-[var(--gold)]"
  }`
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <header className="glass-bar fixed inset-x-0 top-0 z-30">
      <nav
        className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 md:px-8"
        aria-label="Primary"
      >
        <NavLink to="/" className="inline-flex items-center" onClick={() => setOpen(false)}>
          <img src={logo} alt="Psalmist Nation Tabernacle" className="h-14 w-14 shrink-0 object-contain" />
        </NavLink>
        <ul className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink to={link.to} end={link.end} className={({ isActive }) => itemClass(isActive)}>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="inline-flex h-12 w-12 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 h-0.5 w-6 bg-[var(--gold)] transition-transform duration-200 ${
                open ? "top-2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-2 h-0.5 w-6 bg-[var(--gold)] transition-opacity duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-6 bg-[var(--gold)] transition-transform duration-200 ${
                open ? "top-2 -rotate-45" : "top-4"
              }`}
            />
          </span>
        </button>
      </nav>
      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="mx-4 mb-3 rounded-2xl border border-[var(--gold)]/30 bg-[#121218]/95 p-2 shadow-2xl backdrop-blur-xl md:hidden"
            initial={reduce ? false : { opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <ul className="px-4 py-2">
              {links.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) => `flex min-h-12 items-center ${itemClass(isActive)}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
