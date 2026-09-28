import { Children, isValidElement, type ReactNode } from "react"
import { HeroEntrance } from "./ui/HeroEntrance.tsx"

type RevealProps = {
  children: ReactNode
  className?: string
}

function isHeroStack(children: ReactNode) {
  const items = Children.toArray(children)
  const first = items[0]
  const second = items[1]
  return isValidElement(first) && first.type === "img" && isValidElement(second) && second.type === "h1"
}

export function Reveal({ children, className }: RevealProps) {
  if (isHeroStack(children)) {
    return <HeroEntrance className={className}>{children}</HeroEntrance>
  }

  return <div className={className}>{children}</div>
}
