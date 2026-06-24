import { useRef } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import Button from "../../components/ui/button/Button";
import { PlusIcon } from "../../icons";
import UsersTable from "../../components/tables/UsersTable";
import type { TableHandle } from "../../components/tables/TableHandle";

export default function Users() {
  const tableRef = useRef<TableHandle>(null);

  return (
    <>
      <PageMeta
        title="Users | Tuition Centre Management System"
        description="Admin and Super Admin login accounts"
      />
      <PageBreadcrumb
        pageTitle="Users"
        actions={
          <Button
            size="sm"
            type="button"
            startIcon={<PlusIcon />}
            onClick={() => tableRef.current?.openCreate()}
          >
            Add User
          </Button>
        }
      />
      <div className="space-y-6">
        <ComponentCard title="Admin & Super Admin Users">
          <UsersTable ref={tableRef} />
        </ComponentCard>
      </div>
    </>
  );
}
