import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

type ImageLightboxProps = {
  title: string
  images: string[]
  startIndex: number
  onClose: () => void
}

export function ImageLightbox({ title, images, startIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(startIndex)
  const current = images[index] ?? images[0]
  const hasMany = images.length > 1

  function showPrevious() {
    setIndex((value) => (value - 1 + images.length) % images.length)
  }

  function showNext() {
    setIndex((value) => (value + 1) % images.length)
  }

  useEffect(() => {
    const scrollY = window.scrollY
    const { style } = document.body
    const previous = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
      overflow: style.overflow,
    }
    style.position = "fixed"
    style.top = `-${scrollY}px`
    style.left = "0"
    style.right = "0"
    style.width = "100%"
    style.overflow = "hidden"

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
      if (event.key === "ArrowRight") showNext()
      if (event.key === "ArrowLeft") showPrevious()
    }

    window.addEventListener("keydown", onKey)
    return () => {
      style.position = previous.position
      style.top = previous.top
      style.left = previous.left
      style.right = previous.right
      style.width = previous.width
      style.overflow = previous.overflow
      window.scrollTo(0, scrollY)
      window.removeEventListener("keydown", onKey)
    }
  }, [images.length, onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onClick={onClose}
    >
      <div
        className="glass-panel flex max-h-[92dvh] w-full max-w-3xl flex-col p-4 sm:p-5"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="font-display text-lg font-extrabold leading-tight">{title}</p>
          <button
            type="button"
            className="min-h-11 shrink-0 rounded-[12px] border border-[var(--gold)] px-4 text-sm font-semibold text-[var(--gold)]"
            onClick={onClose}
          >
            Close
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] border border-[var(--gold)] text-lg font-semibold text-[var(--gold)] disabled:opacity-40"
            onClick={showPrevious}
            disabled={!hasMany}
            aria-label="Previous photo"
          >
            ‹
          </button>
          <img src={current} alt="" className="max-h-[42dvh] min-w-0 flex-1 rounded-[12px] object-contain sm:max-h-[62dvh]" />
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] border border-[var(--gold)] text-lg font-semibold text-[var(--gold)] disabled:opacity-40"
            onClick={showNext}
            disabled={!hasMany}
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
        {hasMany ? (
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((image, imageIndex) => (
              <button
                key={image}
                type="button"
                className={`h-16 w-20 shrink-0 overflow-hidden rounded-[12px] border ${
                  imageIndex === index ? "border-[var(--gold)]" : "border-white/20"
                }`}
                onClick={() => setIndex(imageIndex)}
                aria-label={`Show photo ${imageIndex + 1}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
