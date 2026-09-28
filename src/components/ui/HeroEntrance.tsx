import { Children, type ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

export function HeroEntrance({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const items = Children.toArray(children)

  return (
    <div className={className}>
      {items.map((child, index) => {
        const beat = items.length === 5 && index >= 3 ? index - 1 : index
        return (
          <motion.div
            key={index}
            className="w-full max-w-full"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.4, delay: reduce ? 0 : beat * 0.08, ease: "easeOut" }}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}
