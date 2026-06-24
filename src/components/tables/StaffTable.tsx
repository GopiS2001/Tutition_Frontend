import { forwardRef, useImperativeHandle, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiClient";
import { deleteStaff, listStaff, type Staff } from "../../api/staff.api";
import StaffFormModal from "../modals/StaffFormModal";
import type { TableHandle } from "./TableHandle";

const StaffTable = forwardRef<TableHandle>(function StaffTable(_props, ref) {
  const { accessToken } = useAuth();
  const { data: staff, isLoading, error, reload } = useApiData(listStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openCreate() {
    setEditingStaff(null);
    setIsModalOpen(true);
  }

  useImperativeHandle(ref, () => ({ openCreate }));

  function openEdit(member: Staff) {
    setEditingStaff(member);
    setIsModalOpen(true);
  }

  async function handleDelete(member: Staff) {
    if (!accessToken) return;
    if (!window.confirm(`Deactivate staff "${member.name}"?`)) return;
    setDeleteError(null);
    try {
      await deleteStaff(accessToken, member._id);
      reload();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete staff");
    }
  }

  return (
    <div>
      {deleteError && (
        <div className="mb-4 rounded-lg border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
          {deleteError}
        </div>
      )}

      {isLoading && <p className="text-sm text-gray-500 dark:text-gray-400">Loading staff...</p>}
      {error && <p className="text-sm text-error-500">{error}</p>}
      {!isLoading && !error && (!staff || staff.length === 0) && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No staff added yet.</p>
      )}

      {!isLoading && !error && staff && staff.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Mobile
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Subjects
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Assigned Batches
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
                {staff.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell className="px-5 py-4 text-start font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {member.name}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {member.mobile}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {member.subjects.length > 0 ? member.subjects.join(", ") : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400 capitalize">
                      {member.assigned_batches.length > 0
                        ? member.assigned_batches.map((b) => b.name).join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={member.is_active ? "success" : "error"}>
                        {member.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(member)}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label="Edit staff"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(member)}
                          className="text-gray-500 hover:text-error-500 dark:text-gray-400"
                          aria-label="Delete staff"
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

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={reload}
        staff={editingStaff}
      />
    </div>
  );
});

export default StaffTable;
