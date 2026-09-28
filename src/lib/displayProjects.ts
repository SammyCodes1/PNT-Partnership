import type { Project } from "./types.ts"

export function displayProjects(projects: Project[]): Project[] {
  return projects
    .filter((project) => project.title !== "Children's Ministry Center")
    .map((project) => {
      const title =
        project.title === "New Sanctuary Building" || project.title === "Our Building"
          ? "Building Project"
          : project.title
      const description = /placeholder description/i.test(project.description) ? "" : project.description
      return title === "Building Project"
        ? { ...project, title, description, funding_goal: null }
        : { ...project, title, description }
    })
}
