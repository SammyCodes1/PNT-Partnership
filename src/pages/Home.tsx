import { useEffect, useState } from "react"
import logo from "../assets/logo.png"
import { GoldLink } from "../components/GoldButton.tsx"
import { Reveal } from "../components/Reveal.tsx"
import { Card } from "../components/ui/Card.tsx"
import { ImageLightbox } from "../components/ui/ImageLightbox.tsx"
import { displayProjects } from "../lib/displayProjects.ts"
import { projectImages } from "../lib/projectImages.ts"
import { useProjects } from "../lib/useProjects.ts"

export function Home() {
  const { projects } = useProjects()
  const listed = displayProjects(projects)
  const featured = listed.find((project) => project.title === "Building Project") ?? listed[0]
  const images = projectImages(featured?.image_url ?? null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.title = "Psalmist Nation Tabernacle"
  }, [])

  return (
    <>
      <section className="flex items-center bg-[#0A0A0A] px-4 pb-8 pt-8 sm:min-h-[calc(100dvh-5rem)] sm:py-12">
        <Reveal className="mx-auto flex w-full min-w-0 max-w-3xl flex-col items-center text-center">
          <img src={logo} alt="" className="mx-auto block h-24 w-auto max-w-[70%] sm:h-36 sm:max-w-full" />
          <h1 className="mt-6 max-w-full font-display text-[2rem] font-extrabold leading-[1.15] text-balance text-[#F4F4F5] sm:text-4xl md:text-5xl">
            Psalmist Nation Tabernacle
          </h1>
          <p className="mt-4 max-w-full px-1 text-[0.7rem] font-medium uppercase leading-relaxed tracking-[0.14em] text-[#D4AF37] sm:text-xs sm:tracking-[0.22em]">
            (Purity, Power, Precision)
          </p>
          <div className="mt-8 flex w-full justify-center">
            <GoldLink to="/partner">Become a Partner</GoldLink>
          </div>
        </Reveal>
      </section>

      <section className="bg-[#0A0A0A] px-4 pb-12 pt-8 sm:py-16 md:px-8 md:py-24">
        <Reveal className="mx-auto w-full min-w-0 max-w-3xl">
          <h2 className="font-display text-3xl font-extrabold leading-[1.15] text-balance md:text-5xl">Our Vision</h2>
          <p className="mt-6 text-base leading-relaxed text-[#D4D4D4]">
            Our vision is a tabernacle where the name of Jesus is honored in song, prayer, and daily life. We
            see a people made clean by the Word, strengthened by the Spirit, and careful in how they serve. From
            this house, worship and mercy go out into the city.
          </p>
        </Reveal>
      </section>

      <section className="bg-[#0A0A0A] px-4 py-12 sm:py-16 md:px-8 md:py-24">
        <Reveal className="mx-auto w-full min-w-0 max-w-7xl">
          <h2 className="font-display text-3xl font-extrabold leading-[1.15] text-balance md:text-5xl">Featured Project</h2>
          {featured ? (
            <Card className="mt-8 grid grid-cols-1 md:grid-cols-2">
              {images.length > 0 ? (
                <button
                  type="button"
                  className="aspect-[3/2] w-full overflow-hidden bg-white/5 md:aspect-auto md:min-h-80"
                  onClick={() => setOpen(true)}
                  aria-label={`Open ${featured.title} photos`}
                >
                  <img src={images[0]} alt="" className="h-full w-full object-cover" />
                </button>
              ) : (
                <div className="aspect-[3/2] bg-white/5 md:aspect-auto md:min-h-80" />
              )}
              <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6 md:p-10">
                <h3 className="font-display text-2xl font-extrabold leading-[1.15]">{featured.title}</h3>
                {featured.description ? (
                  <p className="mt-4 max-w-[48ch] text-base leading-relaxed text-[#D4D4D4]">{featured.description}</p>
                ) : null}
                <div className="mt-8">
                  <GoldLink to="/projects">View All Projects</GoldLink>
                </div>
              </div>
              {open && images.length > 0 ? (
                <ImageLightbox title={featured.title} images={images} startIndex={0} onClose={() => setOpen(false)} />
              ) : null}
            </Card>
          ) : null}
        </Reveal>
      </section>
    </>
  )
}
