import { apiRequest } from "../lib/apiClient";

export interface Batch {
  _id: string;
  name: string;
  key: "morning" | "evening" | "special";
  class: string;
  section: string;
  timing_start: string;
  timing_end: string;
  days: string[];
  capacity: number;
  academic_year: string;
  is_active: boolean;
  student_count?: number;
}

export interface BatchInput {
  name: string;
  key: "morning" | "evening" | "special";
  class: string;
  section: string;
  timing_start: string;
  timing_end: string;
  days: string[];
  capacity: number;
  academic_year: string;
}

export function listBatches(token: string) {
  return apiRequest<Batch[]>("/batches", { token });
}

export function createBatch(token: string, input: BatchInput) {
  return apiRequest<Batch>("/batches", { method: "POST", body: input, token });
}

export function updateBatch(token: string, id: string, input: BatchInput) {
  return apiRequest<Batch>(`/batches/${id}`, { method: "PUT", body: input, token });
}

export function deleteBatch(token: string, id: string) {
  return apiRequest<Batch>(`/batches/${id}`, { method: "DELETE", token });
}
