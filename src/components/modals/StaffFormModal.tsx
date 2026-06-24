import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import MultiSelect from "../form/MultiSelect";
import { useAuth } from "../../context/AuthContext";
import { useApiData } from "../../hooks/useApiData";
import { ApiError } from "../../lib/apiClient";
import { listBatches } from "../../api/batches.api";
import {
  createStaff,
  updateStaff,
  type CreateStaffInput,
  type Staff,
  type UpdateStaffInput,
} from "../../api/staff.api";

interface StaffForm {
  name: string;
  email: string;
  password: string;
  mobile: string;
  subjects: string;
  assigned_batches: string[];
  academic_year: string;
}

const emptyForm: StaffForm = {
  name: "",
  email: "",
  password: "",
  mobile: "",
  subjects: "",
  assigned_batches: [],
  academic_year: "2024-25",
};

function buildFormFromStaff(staff?: Staff | null): StaffForm {
  if (!staff) return emptyForm;
  return {
    name: staff.name,
    email: "",
    password: "",
    mobile: staff.mobile,
    subjects: staff.subjects.join(", "),
    assigned_batches: staff.assigned_batches.map((b) => b._id),
    academic_year: staff.academic_year,
  };
}

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  staff?: Staff | null;
}

export default function StaffFormModal({ isOpen, onClose, onSaved, staff }: StaffFormModalProps) {
  const { accessToken } = useAuth();
  const { data: batches } = useApiData(listBatches);
  const [form, setForm] = useState<StaffForm>(() => buildFormFromStaff(staff));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set<K extends keyof StaffForm>(key: K, value: StaffForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);
    setError(null);
    const subjects = form.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      if (staff) {
        const payload: UpdateStaffInput = {
          name: form.name,
          mobile: form.mobile,
          subjects,
          assigned_batches: form.assigned_batches,
          academic_year: form.academic_year,
        };
        await updateStaff(accessToken, staff._id, payload);
      } else {
        const payload: CreateStaffInput = {
          name: form.name,
          email: form.email,
          password: form.password,
          mobile: form.mobile,
          subjects,
          assigned_batches: form.assigned_batches,
          academic_year: form.academic_year,
        };
        await createStaff(accessToken, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save staff member");
    } finally {
      setIsSubmitting(false);
    }
  }

  const batchOptions = (batches ?? []).map((b) => ({
    value: b._id,
    text: `${b.name} (${b.class}-${b.section})`,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {staff ? "Edit Staff" : "Add Staff"}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-1 pb-3">
            {error && (
              <div className="mb-4 rounded-lg border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <Label>Mobile</Label>
                <Input value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
              </div>
              {!staff && (
                <>
                  <div>
                    <Label>Email (login)</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input
                      type="password"
                      value={form.password}
                      onChange={(e) => set("password", e.target.value)}
                    />
                  </div>
                </>
              )}
              <div>
                <Label>Academic Year</Label>
                <Input
                  placeholder="2024-25"
                  value={form.academic_year}
                  onChange={(e) => set("academic_year", e.target.value)}
                />
              </div>
              <div>
                <Label>Subjects (comma separated)</Label>
                <Input
                  placeholder="Maths, Science"
                  value={form.subjects}
                  onChange={(e) => set("subjects", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <MultiSelect
                  label="Assigned Batches"
                  options={batchOptions}
                  value={form.assigned_batches}
                  onChange={(selected) => set("assigned_batches", selected)}
                  placeholder={
                    batchOptions.length === 0 ? "No batches available" : "Select batches"
                  }
                />
              </div>
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
