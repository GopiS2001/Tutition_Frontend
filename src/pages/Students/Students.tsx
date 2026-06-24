import { useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import StudentsTable from "../../components/tables/StudentsTable";
import type { TableHandle } from "../../components/tables/TableHandle";

export default function Students() {
  const tableRef = useRef<TableHandle>(null);

  return (
    <>
      <PageMeta
        title="Students | Tuition Centre Management System"
        description="List of enrolled students fetched from the backend"
      />
      <PageBreadcrumb
        pageTitle="Students"
        actions={
          <Button
            size="sm"
            type="button"
            startIcon={<PlusIcon />}
            onClick={() => tableRef.current?.openCreate()}
          >
            Add Student
          </Button>
        }
      />
      <div className="space-y-6">
        <ComponentCard title="All Students">
          <StudentsTable ref={tableRef} />
        </ComponentCard>
      </div>
    </>
  );
}
