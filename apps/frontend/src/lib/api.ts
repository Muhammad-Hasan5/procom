import type { ApiResponse } from "@/types/api";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export interface ApiError {
  statusCode: number;
  message: string;
  data?: unknown;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err: ApiError = {
      statusCode: body.statusCode ?? res.status,
      message: body.message ?? res.statusText ?? "Request failed",
      data: body.data,
    };
    throw err;
  }

  return body as ApiResponse<T>;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "POST", body: data ? JSON.stringify(data) : undefined }),
  patch: <T>(path: string, data?: unknown) =>
    request<T>(path, { method: "PATCH", body: data ? JSON.stringify(data) : undefined }),
  delete: <T>(path: string, data?: unknown) =>
    request<T>(path, {
      method: "DELETE",
      ...(data ? { body: JSON.stringify(data) } : {}),
    }),
};

