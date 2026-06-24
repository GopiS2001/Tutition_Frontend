import { forwardRef, useImperativeHandle, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiClient";
import { deleteUser, listUsers, type AppUser } from "../../api/users.api";
import UserFormModal from "../modals/UserFormModal";
import type { TableHandle } from "./TableHandle";

const UsersTable = forwardRef<TableHandle>(function UsersTable(_props, ref) {
  const { accessToken } = useAuth();
  const { data: allUsers, isLoading, error, reload } = useApiData(listUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const users = (allUsers ?? []).filter(
    (u) => u.role === "admin" || u.role === "super_admin",
  );

  function openCreate() {
    setEditingUser(null);
    setIsModalOpen(true);
  }

  useImperativeHandle(ref, () => ({ openCreate }));

  function openEdit(user: AppUser) {
    setEditingUser(user);
    setIsModalOpen(true);
  }

  async function handleDelete(user: AppUser) {
    if (!accessToken) return;
    if (!window.confirm(`Deactivate user "${user.name}"?`)) return;
    setDeleteError(null);
    try {
      await deleteUser(accessToken, user._id);
      reload();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete user");
    }
  }

  return (
    <div>
      {deleteError && (
        <div className="mb-4 rounded-lg border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
          {deleteError}
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading users...</p>}
      {error && <p className="text-sm text-error-500">{error}</p>}
      {!isLoading && !error && users.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No admin users added yet.</p>
      )}

      {!isLoading && !error && users.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Email
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Role
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {user.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400 capitalize">
                      {user.role.replace("_", " ")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={user.is_active ? "success" : "error"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(user)}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label="Edit user"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="text-gray-500 hover:text-error-500 dark:text-gray-400"
                          aria-label="Delete user"
                        >
                          <TrashBinIcon className="size-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <UserFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={reload}
        user={editingUser}
      />
    </div>
  );
});

export default UsersTable;
