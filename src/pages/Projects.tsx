import { useEffect } from "react"
import { ProjectCard } from "../components/ProjectCard.tsx"
import { ProjectMessage, ProjectSkeleton } from "../components/ProjectState.tsx"
import { Reveal } from "../components/Reveal.tsx"
import { displayProjects } from "../lib/displayProjects.ts"
import { useProjects } from "../lib/useProjects.ts"
import type { Project } from "../lib/types.ts"

export function Projects() {
  const { projects, status } = useProjects()
  const ourBuilding: Project = {
    id: "our-building",
    created_at: "",
    title: "Building Project",
    description: "",
    image_url: null,
    funding_goal: null,
    funding_raised: 0,
  }
  const visible = displayProjects(projects)
  const cards = visible.length > 0 ? visible : status === "loading" || status === "unconfigured" ? [] : [ourBuilding]

  useEffect(() => {
    document.title = "Our Projects | Psalmist Nation Tabernacle"
  }, [])

  return (
    <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 sm:py-16 md:px-8">
      <h1 className="font-display text-3xl font-extrabold leading-[1.15] text-balance sm:text-4xl md:text-5xl">Our Projects</h1>
      <p className="mt-4 max-w-[48ch] leading-relaxed text-[#D4D4D4]">
        These are the works in front of the house, and what has already been given toward each one.
      </p>

      {status === "loading" ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectSkeleton />
          <ProjectSkeleton />
          <ProjectSkeleton />
        </div>
      ) : null}

      {cards.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cards.map((project) => (
            <Reveal key={project.id} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      ) : null}

      {status === "empty" && cards.length === 0 ? (
        <div className="mt-10">
          <ProjectMessage title="No projects yet">
            When the church publishes a work, it will show here with its goal and what partners have given.
          </ProjectMessage>
        </div>
      ) : null}

      {status === "error" && cards.length === 0 ? (
        <div className="mt-10">
          <ProjectMessage title="Projects are unavailable">
            Refresh the page in a moment. The list will return when the connection does.
          </ProjectMessage>
        </div>
      ) : null}

      {status === "unconfigured" ? (
        <div className="mt-10">
          <ProjectMessage title="Projects will appear here">
            Connect this site to Supabase with the anon key in .env.local, then publish a project.
          </ProjectMessage>
        </div>
      ) : null}
    </section>
  )
}
