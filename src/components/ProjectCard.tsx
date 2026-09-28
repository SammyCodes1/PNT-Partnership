import { useState } from "react"
import { FundingBar } from "./FundingBar.tsx"
import { GoldLink } from "./GoldButton.tsx"
import { Card } from "./ui/Card.tsx"
import { ImageLightbox } from "./ui/ImageLightbox.tsx"
import { projectImages } from "../lib/projectImages.ts"
import type { Project } from "../lib/types.ts"

export function ProjectCard({ project }: { project: Project }) {
  const images = projectImages(project.image_url)
  const [imageFailed, setImageFailed] = useState(false)
  const [open, setOpen] = useState(false)
  const showImage = images.length > 0 && !imageFailed
  const showFunding = project.funding_goal != null && project.funding_goal > 0

  return (
    <Card className="flex h-full flex-col">
      {showImage ? (
        <button
          type="button"
          className="aspect-[3/2] w-full overflow-hidden bg-white/5"
          onClick={() => setOpen(true)}
          aria-label={`Open ${project.title} photos`}
        >
          <img
            src={images[0]}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </button>
      ) : (
        <div className="aspect-[3/2] bg-white/5" role="img" aria-label={`${project.title} image placeholder`} />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h2 className="font-display text-2xl font-extrabold leading-[1.15] text-[#F4F4F5]">{project.title}</h2>
        {project.description ? (
          <p className="mt-3 flex-1 text-sm leading-relaxed break-words text-[#D4D4D4]">{project.description}</p>
        ) : null}
        {showFunding ? (
          <div className="mt-5">
            <FundingBar raised={project.funding_raised} goal={project.funding_goal ?? 0} />
          </div>
        ) : null}
        <div className="mt-6">
          <GoldLink to="/partner" wide>
            Partner with this project
          </GoldLink>
        </div>
      </div>
      {open && showImage ? (
        <ImageLightbox title={project.title} images={images} startIndex={0} onClose={() => setOpen(false)} />
      ) : null}
    </Card>
  )
}
