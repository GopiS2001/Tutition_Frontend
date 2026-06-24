import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../ui/table";
import Badge from "../ui/badge/Badge";
import { PencilIcon, TrashBinIcon } from "../../icons";
import { useApiData } from "../../hooks/useApiData";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/apiClient";
import { deleteStudent, listStudents, type Student } from "../../api/students.api";
import StudentFormModal from "../modals/StudentFormModal";
import type { TableHandle } from "./TableHandle";

function batchLabel(student: Student) {
  if (typeof student.batch_id === "string") return student.batch_timing;
  return student.batch_id?.name ?? student.batch_timing;
}

interface StudentsTableProps {
  classFilter?: string;
}

const StudentsTable = forwardRef<TableHandle, StudentsTableProps>(function StudentsTable(
  { classFilter },
  ref,
) {
  const { accessToken } = useAuth();
  const fetcher = useCallback(
    (token: string) => listStudents(token, classFilter ? { class: classFilter } : undefined),
    [classFilter],
  );
  const { data: students, isLoading, error, reload } = useApiData(fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function openCreate() {
    setEditingStudent(null);
    setIsModalOpen(true);
  }

  useImperativeHandle(ref, () => ({ openCreate }));

  function openEdit(student: Student) {
    setEditingStudent(student);
    setIsModalOpen(true);
  }

  async function handleDelete(student: Student) {
    if (!accessToken) return;
    if (!window.confirm(`Deactivate student "${student.name}"?`)) return;
    setDeleteError(null);
    try {
      await deleteStudent(accessToken, student._id);
      reload();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : "Failed to delete student");
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
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading students...</p>
      )}
      {error && <p className="text-sm text-error-500">{error}</p>}
      {!isLoading && !error && (!students || students.length === 0) && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No students enrolled yet.</p>
      )}

      {!isLoading && !error && students && students.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Login ID
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Class
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Batch
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Guardian Mobile
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
                {students.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className="px-5 py-4 text-start">
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {student.name}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        Roll No: {student.roll_no}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.student_login_id}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.class} - {student.section}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400 capitalize">
                      {batchLabel(student)}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start text-gray-500 text-theme-sm dark:text-gray-400">
                      {student.guardian?.primary_mobile}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <Badge size="sm" color={student.is_active ? "success" : "error"}>
                        {student.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(student)}
                          className="text-gray-500 hover:text-brand-500 dark:text-gray-400"
                          aria-label="Edit student"
                        >
                          <PencilIcon className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(student)}
                          className="text-gray-500 hover:text-error-500 dark:text-gray-400"
                          aria-label="Delete student"
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

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={reload}
        student={editingStudent}
        defaultClass={classFilter}
      />
    </div>
  );
});

export default StudentsTable;
