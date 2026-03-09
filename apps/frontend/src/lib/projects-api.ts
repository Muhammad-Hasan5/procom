import { api } from "@/lib/api";
import type { Project } from "@/types/api";

export async function getProjects(q?: string) {
  const path = q ? `/api/v1/projects?q=${encodeURIComponent(q)}` : "/api/v1/projects";
  const res = await api.get<Project[]>(path);
  return res.data ?? [];
}

export async function getProject(projectId: string) {
  const res = await api.get<Project>(`/api/v1/projects/${projectId}`);
  return res.data;
}

export async function createProject(data: { title: string; description?: string }) {
  const res = await api.post<Project>("/api/v1/projects", data);
  return res.data;
}

export async function updateProject(
  projectId: string,
  data: { title?: string; description?: string; ownerEmail?: string; membersEmails?: string[] }
) {
  const res = await api.patch<Project>(`/api/v1/projects/${projectId}`, data);
  return res.data;
}

export async function deleteProject(projectId: string) {
  await api.delete(`/api/v1/projects/${projectId}`);
}

export async function addMember(projectId: string, memberEmail: string) {
  const res = await api.post<Project>(`/api/v1/projects/${projectId}/members`, {
    memberEmail,
  });
  return res.data;
}

export async function removeMember(
  projectId: string,
  memberId: string,
  memberEmail: string
) {
  await api.delete(`/api/v1/projects/${projectId}/members/${memberId}`, {
    memberEmail,
  });
}
