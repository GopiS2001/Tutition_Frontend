import { useState } from "react";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Select from "../form/Select";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiClient";
import {
  createUser,
  updateUser,
  type AdminRole,
  type AppUser,
  type CreateUserInput,
} from "../../api/users.api";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin" },
  { value: "super_admin", label: "Super Admin" },
];

interface UserForm {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
}

function buildEmptyForm(): UserForm {
  return { name: "", email: "", password: "", role: "admin" };
}

function buildFormFromUser(user?: AppUser | null): UserForm {
  if (!user) return buildEmptyForm();
  return {
    name: user.name,
    email: user.email,
    password: "",
    role: user.role === "super_admin" ? "super_admin" : "admin",
  };
}

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  user?: AppUser | null;
}

export default function UserFormModal({ isOpen, onClose, onSaved, user }: UserFormModalProps) {
  const { accessToken } = useAuth();
  const [form, setForm] = useState<UserForm>(() => buildFormFromUser(user));
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wasOpen, setWasOpen] = useState(isOpen);

  if (isOpen && !wasOpen) {
    setWasOpen(true);
    setForm(buildFormFromUser(user));
    setError(null);
  } else if (!isOpen && wasOpen) {
    setWasOpen(false);
  }

  function set<K extends keyof UserForm>(key: K, value: UserForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (user) {
        await updateUser(accessToken, user._id, {
          name: form.name,
          email: form.email,
          role: form.role,
        });
      } else {
        const payload: CreateUserInput = {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        };
        await createUser(accessToken, payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[500px] m-4">
      <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-6 text-2xl font-semibold text-gray-800 dark:text-white/90">
          {user ? "Edit User" : "Add User"}
        </h4>
        <form onSubmit={handleSubmit}>
          <div className="px-1 pb-3">
            {error && (
              <div className="mb-4 rounded-lg border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
                {error}
              </div>
            )}
            <div className="grid grid-cols-1 gap-x-6 gap-y-5">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </div>
              {!user && (
                <div>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                  />
                </div>
              )}
              <div>
                <Label>Role</Label>
                <Select
                  options={ROLE_OPTIONS}
                  defaultValue={form.role}
                  onChange={(v) => set("role", v as AdminRole)}
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
