import { useEffect, useState } from "react"
import { supabase } from "./supabase.ts"
import type { Project } from "./types.ts"

type Status = "loading" | "ready" | "empty" | "error" | "unconfigured"

type ProjectRow = {
  id: string | number
  created_at: string
  title: string
  description: string | null
  image_url: string | null
  funding_goal: number | string | null
  funding_raised: number | string | null
}

function toAmount(value: number | string | null): number | null {
  if (value == null || value === "") return null
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : null
}

function toProject(row: ProjectRow): Project {
  return {
    id: String(row.id),
    created_at: row.created_at,
    title: row.title,
    description: row.description ?? "",
    image_url: row.image_url?.trim() ? row.image_url : null,
    funding_goal: toAmount(row.funding_goal),
    funding_raised: toAmount(row.funding_raised) ?? 0,
  }
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [status, setStatus] = useState<Status>(supabase ? "loading" : "unconfigured")

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let active = true

    async function load() {
      try {
        const { data, error } = await client
          .from("projects")
          .select("id, created_at, title, description, image_url, funding_goal, funding_raised")
          .order("created_at", { ascending: false })
        if (!active) return
        if (error) {
          setStatus("error")
          return
        }
        const rows = ((data ?? []) as ProjectRow[]).map(toProject)
        setProjects(rows)
        setStatus(rows.length ? "ready" : "empty")
      } catch {
        if (active) setStatus("error")
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  return { projects, status }
}
