import { apiRequest } from "../lib/apiClient";
import type { Batch } from "./batches.api";

export interface Staff {
  _id: string;
  name: string;
  mobile: string;
  subjects: string[];
  assigned_batches: Batch[];
  academic_year: string;
  is_active: boolean;
}

export interface CreateStaffInput {
  name: string;
  email: string;
  password: string;
  mobile: string;
  subjects?: string[];
  assigned_batches?: string[];
  academic_year: string;
}

export interface UpdateStaffInput {
  name?: string;
  mobile?: string;
  subjects?: string[];
  assigned_batches?: string[];
  academic_year?: string;
}

export function listStaff(token: string) {
  return apiRequest<Staff[]>("/staff", { token });
}

export function createStaff(token: string, input: CreateStaffInput) {
  return apiRequest<Staff>("/staff", { method: "POST", body: input, token });
}

export function updateStaff(token: string, id: string, input: UpdateStaffInput) {
  return apiRequest<Staff>(`/staff/${id}`, { method: "PUT", body: input, token });
}

export function deleteStaff(token: string, id: string) {
  return apiRequest<Staff>(`/staff/${id}`, { method: "DELETE", token });
}
