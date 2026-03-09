import { api } from "@/lib/api";
import type { Task, TaskStatus } from "@/types/api";

export async function getProjectTasksList(projectId: string) {
  const res = await api.get<Task[]>(`/api/v1/projects/${projectId}/tasks/list`);
  return res.data ?? [];
}

export async function createTask(
  projectId: string,
  data: {
    title: string;
    status: TaskStatus;
    description?: string;
    assignedTo?: string;
  }
) {
  const res = await api.post<Task>(`/api/v1/projects/${projectId}/tasks`, data);
  return res.data;
}

export async function getTask(projectId: string, taskId: string) {
  const res = await api.get<Task>(
    `/api/v1/projects/${projectId}/tasks/${taskId}`
  );
  return res.data;
}

export async function updateTask(
  projectId: string,
  taskId: string,
  data: {
    title: string;
    status: TaskStatus;
    description?: string;
    assignedTo?: string;
  }
) {
  const res = await api.patch<Task>(
    `/api/v1/projects/${projectId}/tasks/${taskId}`,
    data
  );
  return res.data;
}

export async function changeTaskStatus(
  projectId: string,
  taskId: string,
  newStatus: TaskStatus
) {
  const res = await api.patch<Task>(
    `/api/v1/projects/${projectId}/tasks/${taskId}/status`,
    { newStatus }
  );
  return res.data;
}

export async function deleteTask(projectId: string, taskId: string) {
  await api.delete(`/api/v1/projects/${projectId}/tasks/${taskId}`);
}
