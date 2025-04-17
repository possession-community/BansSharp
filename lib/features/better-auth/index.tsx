import { EditUserDialog } from "./components/dialogs/edit-user-dialog";
import { UserTable } from "./components/user-table";
import { UserTableProvider } from "./context/user-table-context";

interface UserManagementProps {
  className?: string;
}

function UserManagementContent({ className }: UserManagementProps) {
  return (
    <>
      <div className={className}>
        <UserTable />
      </div>
      <EditUserDialog />
    </>
  );
}

export default function UserManagement({ className }: UserManagementProps) {
  return (
    <UserTableProvider>
      <UserManagementContent className={className} />
    </UserTableProvider>
  );
}
