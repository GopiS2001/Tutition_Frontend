import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import { useApiData } from "../../hooks/useApiData";
import { listStudents } from "../../api/students.api";
import { listBatches } from "../../api/batches.api";
import { listStaff } from "../../api/staff.api";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
      <span className="block text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="mt-2 block text-2xl font-semibold text-gray-800 dark:text-white/90">
        {value}
      </span>
    </div>
  );
}

export default function Reports() {
  const { data: students, isLoading: loadingStudents } = useApiData(listStudents);
  const { data: batches, isLoading: loadingBatches } = useApiData(listBatches);
  const { data: staff, isLoading: loadingStaff } = useApiData(listStaff);

  const isLoading = loadingStudents || loadingBatches || loadingStaff;

  const activeStudents = students?.filter((s) => s.is_active).length ?? 0;
  const activeBatches = batches?.filter((b) => b.is_active).length ?? 0;
  const activeStaff = staff?.filter((s) => s.is_active).length ?? 0;
  const morningBatches = batches?.filter((b) => b.is_active && b.key === "morning").length ?? 0;
  const eveningBatches = batches?.filter((b) => b.is_active && b.key === "evening").length ?? 0;
  const totalCapacity = batches?.reduce((sum, b) => (b.is_active ? sum + b.capacity : sum), 0) ?? 0;

  return (
    <>
      <PageMeta
        title="Reports | Tuition Centre Management System"
        description="Summary statistics across students, batches, and staff"
      />
      <PageBreadcrumb pageTitle="Reports" />
      <div className="space-y-6">
        <ComponentCard title="Overview">
          {isLoading ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Loading report data...</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <StatCard label="Active Students" value={activeStudents} />
              <StatCard label="Active Batches" value={activeBatches} />
              <StatCard label="Active Staff" value={activeStaff} />
              <StatCard label="Morning Batches" value={morningBatches} />
              <StatCard label="Evening Batches" value={eveningBatches} />
              <StatCard label="Total Batch Capacity" value={totalCapacity} />
            </div>
          )}
        </ComponentCard>
      </div>
    </>
  );
}
