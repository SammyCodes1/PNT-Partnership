import type { HTMLAttributes, PointerEvent } from "react"

type CardProps = HTMLAttributes<HTMLElement>

export function Card({ className = "", onPointerMove, onPointerLeave, ...props }: CardProps) {
  function move(event: PointerEvent<HTMLElement>) {
    const node = event.currentTarget
    const rect = node.getBoundingClientRect()
    node.style.setProperty("--sheen-x", `${event.clientX - rect.left}px`)
    node.style.setProperty("--sheen-y", `${event.clientY - rect.top}px`)
    onPointerMove?.(event)
  }

  function leave(event: PointerEvent<HTMLElement>) {
    const node = event.currentTarget
    node.style.setProperty("--sheen-x", "50%")
    node.style.setProperty("--sheen-y", "0%")
    onPointerLeave?.(event)
  }

  return <article {...props} className={`glass-panel ${className}`} onPointerMove={move} onPointerLeave={leave} />
}
