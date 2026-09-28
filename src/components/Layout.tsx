import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Footer } from "./Footer.tsx"
import { Navbar } from "./Navbar.tsx"
import { AmbientBackground } from "./ui/AmbientBackground.tsx"

export function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="relative isolate flex min-h-[100dvh] flex-col bg-[var(--black)] font-sans text-[#F4F4F5] antialiased">
      <AmbientBackground />
      <div className="relative z-10 flex min-h-[100dvh] flex-col">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:rounded-[12px] focus:bg-[var(--gold)] focus:px-4 focus:py-3 focus:text-[var(--black)]"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="content" className="min-w-0 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
