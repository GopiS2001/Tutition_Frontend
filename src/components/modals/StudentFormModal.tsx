import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import { useAuth } from "../../context/AuthContext";
import { useApiData } from "../../hooks/useApiData";
import { ApiError } from "../../lib/apiClient";
import { listBatches } from "../../api/batches.api";
import {
  createStudent,
  updateStudent,
  type CreateStudentInput,
  type Student,
  type UpdateStudentInput,
} from "../../api/students.api";

const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}));

function buildEmptyForm(defaultClass?: string): CreateStudentInput {
  return {
    name: "",
    class: defaultClass ?? "1",
    section: "A",
    batch_id: "",
    academic_year: "2024-25",
    guardian: { primary_mobile: "" },
  };
}

function buildFormFromStudent(
  student: Student | null | undefined,
  defaultClass?: string,
): CreateStudentInput {
  if (!student) return buildEmptyForm(defaultClass);
  return {
    name: student.name,
    dob: student.dob,
    gender: student.gender,
    class: student.class,
    section: student.section,
    batch_id: typeof student.batch_id === "string" ? student.batch_id : student.batch_id._id,
    school_name: student.school_name,
    blood_group: student.blood_group,
    address: student.address,
    bus_route: student.bus_route,
    academic_year: student.academic_year,
    guardian: student.guardian,
  };
}

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  student?: Student | null;
  defaultClass?: string;
}

export default function StudentFormModal({
  isOpen,
  onClose,
  onSaved,
  student,
  defaultClass,
}: StudentFormModalProps) {
  const { accessToken } = useAuth();
  const { data: batches } = useApiData(listBatches);
  const [form, setForm] = useState<CreateStudentInput>(() =>
    buildFormFromStudent(student, defaultClass),
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setForm(buildFormFromStudent(student, defaultClass));
    setError(null);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  function set<K extends keyof CreateStudentInput>(key: K, value: CreateStudentInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setGuardian(field: keyof CreateStudentInput["guardian"], value: string) {
    setForm((prev) => ({ ...prev, guardian: { ...prev.guardian, [field]: value } }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (student) {
        const payload: UpdateStudentInput = {
          name: form.name,
          dob: form.dob,
          gender: form.gender,
          class: form.class,
          section: form.section,
          school_name: form.school_name,
          blood_group: form.blood_group,
          address: form.address,
          bus_route: form.bus_route,
          guardian: form.guardian,
        };
        await updateStudent(accessToken, student._id, payload);
      } else {
        await createStudent(accessToken, form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save student");
    } finally {
      setIsSubmitting(false);
    }
  }

  const batchOptions = (batches ?? []).map((b) => ({
    value: b._id,
    label: `${b.name} (${b.class}-${b.section})`,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {student ? "Edit Student" : "Add Student"}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-1 pb-3">
            {error && (
              <div className="mb-4 rounded-lg border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <Label>Student Name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="col-span-2 lg:col-span-1">
                <Label>Date of Birth</Label>
                <Input
                  type="date"
                  value={form.dob ?? ""}
                  onChange={(e) => set("dob", e.target.value)}
                />
              </div>
              <div>
                <Label>Class</Label>
                <Select
                  options={CLASS_OPTIONS}
                  defaultValue={form.class}
                  onChange={(v) => set("class", v)}
                />
              </div>
              <div>
                <Label>Section</Label>
                <Input value={form.section} onChange={(e) => set("section", e.target.value)} />
              </div>
              {!student && (
                <div className="col-span-2">
                  <Label>Batch</Label>
                  <Select
                    options={batchOptions}
                    defaultValue={form.batch_id}
                    placeholder={
                      batchOptions.length === 0 ? "No batches available - create one first" : "Select a batch"
                    }
                    onChange={(v) => set("batch_id", v)}
                  />
                </div>
              )}
              {!student && (
                <div>
                  <Label>Academic Year</Label>
                  <Input
                    placeholder="2024-25"
                    value={form.academic_year}
                    onChange={(e) => set("academic_year", e.target.value)}
                  />
                </div>
              )}
              <div className="col-span-2">
                <Label>School Name</Label>
                <Input
                  value={form.school_name ?? ""}
                  onChange={(e) => set("school_name", e.target.value)}
                />
              </div>
              <div>
                <Label>Blood Group</Label>
                <Input
                  value={form.blood_group ?? ""}
                  onChange={(e) => set("blood_group", e.target.value)}
                />
              </div>
              <div>
                <Label>Bus Route</Label>
                <Input
                  value={form.bus_route ?? ""}
                  onChange={(e) => set("bus_route", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Label>Address</Label>
                <Input
                  value={form.address ?? ""}
                  onChange={(e) => set("address", e.target.value)}
                />
              </div>

              <div className="col-span-2 mt-2">
                <h5 className="text-base font-medium text-gray-800 dark:text-white/90">
                  Guardian Details
                </h5>
              </div>
              <div>
                <Label>Father Name</Label>
                <Input
                  value={form.guardian.father_name ?? ""}
                  onChange={(e) => setGuardian("father_name", e.target.value)}
                />
              </div>
              <div>
                <Label>Mother Name</Label>
                <Input
                  value={form.guardian.mother_name ?? ""}
                  onChange={(e) => setGuardian("mother_name", e.target.value)}
                />
              </div>
              <div>
                <Label>Primary Mobile</Label>
                <Input
                  value={form.guardian.primary_mobile}
                  onChange={(e) => setGuardian("primary_mobile", e.target.value)}
                />
              </div>
              <div>
                <Label>Alternate Mobile</Label>
                <Input
                  value={form.guardian.alternate_mobile ?? ""}
                  onChange={(e) => setGuardian("alternate_mobile", e.target.value)}
                />
              </div>
              {!student && (
                <div className="col-span-2">
                  <Label>Student Password (optional)</Label>
                  <Input
                    type="password"
                    placeholder="Defaults to centre's standard password if left blank"
                    value={form.password ?? ""}
                    onChange={(e) => set("password", e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 px-1 mt-4 lg:justify-end">
            <Button type="button" size="sm" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
