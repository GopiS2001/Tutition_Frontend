import { useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import StaffTable from "../../components/tables/StaffTable";
import type { TableHandle } from "../../components/tables/TableHandle";

export default function Staff() {
  const tableRef = useRef<TableHandle>(null);

  return (
    <>
      <PageMeta
        title="Staff | Tuition Centre Management System"
        description="List of staff members fetched from the backend"
      />
      <PageBreadcrumb
        pageTitle="Staff"
        actions={
          <Button
            size="sm"
            type="button"
            startIcon={<PlusIcon />}
            onClick={() => tableRef.current?.openCreate()}
          >
            Add Staff
          </Button>
        }
      />
      <div className="space-y-6">
        <ComponentCard title="All Staff">
          <StaffTable ref={tableRef} />
        </ComponentCard>
      </div>
    </>
  );
}
