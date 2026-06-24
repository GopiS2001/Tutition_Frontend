import { apiRequest } from "../lib/apiClient";
import type { Role } from "./auth.api";

export type AdminRole = "admin" | "super_admin";

export interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: Role;
  is_active: boolean;
  last_login_at?: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: AdminRole;
}

export function listUsers(token: string) {
  return apiRequest<AppUser[]>("/users", { token });
}

export function createUser(token: string, input: CreateUserInput) {
  return apiRequest<AppUser>("/users", { method: "POST", body: input, token });
}

export function updateUser(token: string, id: string, input: UpdateUserInput) {
  return apiRequest<AppUser>(`/users/${id}`, { method: "PUT", body: input, token });
}

export function deleteUser(token: string, id: string) {
  return apiRequest<AppUser>(`/users/${id}`, { method: "DELETE", token });
}
