import { apiRequest } from "../lib/apiClient";
import type { Batch } from "./batches.api";

export interface Student {
  _id: string;
  name: string;
  class: string;
  section: string;
  roll_no: string;
  batch_id: Batch | string;
  batch_timing: "morning" | "evening" | "special";
  student_login_id: string;
  academic_year: string;
  is_active: boolean;
  dob?: string;
  gender?: string;
  school_name?: string;
  blood_group?: string;
  address?: string;
  bus_route?: string;
  guardian: {
    father_name?: string;
    mother_name?: string;
    primary_mobile: string;
    alternate_mobile?: string;
    email?: string;
    occupation?: string;
    relation?: string;
  };
}

export interface StudentGuardianInput {
  father_name?: string;
  mother_name?: string;
  primary_mobile: string;
  alternate_mobile?: string;
  email?: string;
  occupation?: string;
  relation?: string;
}

export interface CreateStudentInput {
  name: string;
  dob?: string;
  gender?: string;
  class: string;
  section: string;
  batch_id: string;
  school_name?: string;
  blood_group?: string;
  address?: string;
  bus_route?: string;
  academic_year: string;
  guardian: StudentGuardianInput;
  password?: string;
}

export interface UpdateStudentInput {
  name?: string;
  dob?: string;
  gender?: string;
  class?: string;
  section?: string;
  school_name?: string;
  blood_group?: string;
  address?: string;
  bus_route?: string;
  guardian?: StudentGuardianInput;
}

export interface StudentListParams {
  class?: string;
}

export function listStudents(token: string, params?: StudentListParams) {
  const query = params?.class ? `?class=${encodeURIComponent(params.class)}` : "";
  return apiRequest<Student[]>(`/students${query}`, { token });
}

export function createStudent(token: string, input: CreateStudentInput) {
  return apiRequest<Student>("/students", { method: "POST", body: input, token });
}

export function updateStudent(token: string, id: string, input: UpdateStudentInput) {
  return apiRequest<Student>(`/students/${id}`, { method: "PUT", body: input, token });
}

export function deleteStudent(token: string, id: string) {
  return apiRequest<Student>(`/students/${id}`, { method: "DELETE", token });
}
