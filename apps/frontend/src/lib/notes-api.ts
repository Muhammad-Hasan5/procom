import { api } from "@/lib/api";
import type { Note } from "@/types/api";

const notesBase = (projectId: string) =>
  `/api/v1/project/${projectId}/notes`;

export async function getNotes(projectId: string, q?: string) {
  const path = q ? `${notesBase(projectId)}?q=${encodeURIComponent(q)}` : notesBase(projectId);
  const res = await api.get<Note[]>(path);
  return res.data ?? [];
}

export async function getNote(projectId: string, noteId: string) {
  const res = await api.get<Note>(`${notesBase(projectId)}/${noteId}`);
  return res.data;
}

export async function createNote(
  projectId: string,
  data: { title: string; content?: string }
) {
  const res = await api.post<Note>(notesBase(projectId), data);
  return res.data;
}

export async function updateNote(
  projectId: string,
  noteId: string,
  data: { title?: string; content?: string }
) {
  const res = await api.patch<Note>(`${notesBase(projectId)}/${noteId}`, data);
  return res.data;
}

export async function deleteNote(projectId: string, noteId: string) {
  await api.delete(`${notesBase(projectId)}/${noteId}`);
}

export async function archiveNote(projectId: string, noteId: string) {
  await api.patch(`${notesBase(projectId)}/${noteId}/archive`);
}

export async function pinNote(projectId: string, noteId: string) {
  await api.patch(`${notesBase(projectId)}/${noteId}/pin`);
}
