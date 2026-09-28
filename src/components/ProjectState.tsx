import type { ReactNode } from "react"

export function ProjectSkeleton() {
  return (
    <div className="glass-panel" aria-hidden="true">
      <div className="aspect-[3/2] bg-white/5" />
      <div className="space-y-3 p-5">
        <div className="h-7 w-2/3 bg-white/10" />
        <div className="h-4 w-full bg-white/10" />
        <div className="h-4 w-5/6 bg-white/10" />
        <div className="mt-4 h-1.5 w-full bg-white/10" />
      </div>
    </div>
  )
}

export function ProjectMessage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass-panel px-5 py-10">
      <h3 className="font-display text-2xl font-extrabold leading-[1.15]">{title}</h3>
      <p className="mt-3 max-w-[65ch] text-sm leading-relaxed text-[#D4D4D4]">{children}</p>
    </div>
  )
}
