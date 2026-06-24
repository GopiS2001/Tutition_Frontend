import { apiRequest } from "../lib/apiClient";

export type Role = "super_admin" | "admin" | "staff" | "parent" | "student";

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

export function loginRequest(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function logoutRequest(token: string) {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    token,
  });
}
