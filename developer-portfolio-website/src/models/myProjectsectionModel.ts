// src/models/projectModel.ts
import type { Project } from "@/src/models/types/myProjectSectionTypes";

export async function fetchProjects(): Promise<Project[]> {
  const res = await fetch("/data/projects.json");
  if (!res.ok) throw new Error("Failed to fetch projects");
  return res.json();
}