import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import MultiSelect from "../form/MultiSelect";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiClient";
import { createBatch, updateBatch, type Batch, type BatchInput } from "../../api/batches.api";

const DAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
  value: d,
  text: d,
}));

const KEY_OPTIONS = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
  { value: "special", label: "Special" },
];

const CLASS_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `Class ${i + 1}`,
}));

const emptyForm: BatchInput = {
  name: "",
  key: "morning",
  class: "1",
  section: "A",
  timing_start: "06:00",
  timing_end: "09:00",
  days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  capacity: 30,
  academic_year: "2024-25",
};

function buildFormFromBatch(batch?: Batch | null): BatchInput {
  if (!batch) return emptyForm;
  return {
    name: batch.name,
    key: batch.key,
    class: batch.class,
    section: batch.section,
    timing_start: batch.timing_start,
    timing_end: batch.timing_end,
    days: batch.days,
    capacity: batch.capacity,
    academic_year: batch.academic_year,
  };
}

interface BatchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  batch?: Batch | null;
}

export default function BatchFormModal({ isOpen, onClose, onSaved, batch }: BatchFormModalProps) {
  const { accessToken } = useAuth();
  const [form, setForm] = useState<BatchInput>(() => buildFormFromBatch(batch));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set<K extends keyof BatchInput>(key: K, value: BatchInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (batch) {
        await updateBatch(accessToken, batch._id, form);
      } else {
        await createBatch(accessToken, form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save batch");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[600px] m-4">
      <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {batch ? "Edit Batch" : "Add Batch"}
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
                <Label>Batch Name</Label>
                <Input
                  placeholder="Morning Batch"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </div>
              <div>
                <Label>Batch Type</Label>
                <Select
                  options={KEY_OPTIONS}
                  defaultValue={form.key}
                  onChange={(v) => set("key", v as BatchInput["key"])}
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
                <Input
                  placeholder="A"
                  value={form.section}
                  onChange={(e) => set("section", e.target.value)}
                />
              </div>
              <div>
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={form.timing_start}
                  onChange={(e) => set("timing_start", e.target.value)}
                />
              </div>
              <div>
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={form.timing_end}
                  onChange={(e) => set("timing_end", e.target.value)}
                />
              </div>
              <div>
                <Label>Capacity</Label>
                <Input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => set("capacity", Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Academic Year</Label>
                <Input
                  placeholder="2024-25"
                  value={form.academic_year}
                  onChange={(e) => set("academic_year", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <MultiSelect
                  label="Days"
                  options={DAY_OPTIONS}
                  value={form.days}
                  onChange={(selected) => set("days", selected)}
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
