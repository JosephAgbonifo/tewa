import { apiFetch } from "@/lib/api-client";
import { LoginResponse } from "@/types/api";

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(token: string): Promise<void> {
  await apiFetch<{ message: string }>("/admin/auth/logout", {
    method: "POST",
    token,
  });
}
