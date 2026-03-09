import { api } from "@/lib/api";
import type { User } from "@/types/api";

export async function register(data: {
  fullname: string;
  username: string;
  email: string;
  password: string;
}) {
  const res = await api.post<User>("/api/v1/auth/register-user", data);
  return res;
}

export async function login(data: { email: string; password: string }) {
  const res = await api.post<User>("/api/v1/auth/login-user", data);
  return res;
}

export async function logout() {
  await api.post("/api/v1/auth/logout-user");
}
