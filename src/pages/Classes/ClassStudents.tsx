import { useRef } from "react";
import { useParams } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import StudentsTable from "../../components/tables/StudentsTable";
import type { TableHandle } from "../../components/tables/TableHandle";

export default function ClassStudents() {
  const { classNumber } = useParams<{ classNumber: string }>();
  const tableRef = useRef<TableHandle>(null);

  return (
    <>
      <PageMeta
        title={`Class ${classNumber} | Tuition Centre Management System`}
        description={`Students enrolled in Class ${classNumber}`}
      />
      <PageBreadcrumb
        pageTitle={`Class ${classNumber}`}
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
        <ComponentCard title={`Students - Class ${classNumber}`}>
          <StudentsTable ref={tableRef} classFilter={classNumber} />
        </ComponentCard>
      </div>
    </>
  );
}
