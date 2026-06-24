import { forwardRef, useImperativeHandle, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiClient";
import { deleteBatch, listBatches, type Batch } from "../../api/batches.api";
import BatchFormModal from "../modals/BatchFormModal";
import type { TableHandle } from "./TableHandle";

const BatchesTable = forwardRef<TableHandle>(function BatchesTable(_props, ref) {
  const { accessToken } = useAuth();
  const { data: batches, isLoading, error, reload } = useApiData(listBatches);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openCreate() {
    setEditingBatch(null);
    setIsModalOpen(true);
  }

  useImperativeHandle(ref, () => ({ openCreate }));

  function openEdit(batch: Batch) {
    setEditingBatch(batch);
    setIsModalOpen(true);
  }

  async function handleDelete(batch: Batch) {
    if (!accessToken) return;
    if (!window.confirm(`Deactivate batch "${batch.name}"?`)) return;
    setDeleteError(null);
    try {
      await deleteBatch(accessToken, batch._id);
      reload();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete batch");
    }
  }

  return (
    <div>
      {deleteError && (
        <div className="mb-4 rounded-lg border border-error-500 bg-error-50 px-4 py-3 text-sm text-error-600 dark:border-error-500/30 dark:bg-error-500/15 dark:text-error-400">
          {deleteError}
        </div>
      )}

      {isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading batches...</p>
      )}
      {error && <p className="text-sm text-error-500">{error}</p>}
      {!isLoading && !error && (!batches || batches.length === 0) && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No batches created yet.</p>
      )}

      {!isLoading && !error && batches && batches.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Class
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Timing
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Days
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Capacity
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
                {batches.map((batch) => (
                  <TableRow key={batch._id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90 capitalize">
                        {batch.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400 capitalize">
                        {batch.key}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {batch.class} - {batch.section}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {batch.timing_start} - {batch.timing_end}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {batch.days.join(", ")}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {batch.student_count ?? 0} / {batch.capacity}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={batch.is_active ? "success" : "error"}>
                        {batch.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(batch)}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label="Edit batch"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(batch)}
                          className="text-gray-500 hover:text-error-500 dark:text-gray-400"
                          aria-label="Delete batch"
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

      <BatchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={reload}
        batch={editingBatch}
      />
    </div>
  );
});

export default BatchesTable;
