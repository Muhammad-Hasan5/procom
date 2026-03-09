/** API success response shape from backend */
export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface User {
  _id: string;
  fullname: string;
  username: string;
  email: string;
  avatar?: { url: string | null; localPath: string | null };
  isEmailVerified?: boolean;
}

export interface Project {
  _id: string;
  title: string;
  description?: string;
  owner: string | User;
  members?: (string | User)[];
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatus = "todo" | "in-progress" | "review" | "done";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: string;
  status: TaskStatus;
  assignedTo?: string | User | null;
  createdBy?: string | User;
  createdAt?: string;
  updatedAt?: string;
}

export interface Note {
  _id: string;
  title: string;
  content: string;
  project: string;
  user?: string | User;
  isArchived?: boolean;
  isPinned?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TaskCountByStatus {
  _id: TaskStatus;
  count: number;
}
