import { useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import BatchesTable from "../../components/tables/BatchesTable";
import type { TableHandle } from "../../components/tables/TableHandle";

export default function Batches() {
  const tableRef = useRef<TableHandle>(null);

  return (
    <>
      <PageMeta
        title="Batches | Tuition Centre Management System"
        description="List of Morning/Evening batches fetched from the backend"
      />
      <PageBreadcrumb
        pageTitle="Batches"
        actions={
          <Button
            size="sm"
            type="button"
            startIcon={<PlusIcon />}
            onClick={() => tableRef.current?.openCreate()}
          >
            Add Batch
          </Button>
        }
      />
      <div className="space-y-6">
        <ComponentCard title="All Batches">
          <BatchesTable ref={tableRef} />
        </ComponentCard>
      </div>
    </>
  );
}
