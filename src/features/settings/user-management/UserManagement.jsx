import UserTable from "./components/UserTable";
export default function UserManagement() {
  return (
    <div>
      <div className="space-y-0.5 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          User Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your system users and permissions
        </p>
      </div>
      <UserTable />
    </div>
  );
}
