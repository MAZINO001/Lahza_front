import React from "react";
import ProjectsTable from "./components/ProjectsTable";

export default function ProjectsManagement() {
  return (
    <div>
      <div className="space-y-0.5 mb-4">
        <h1 className="text-xl font-bold tracking-tight">
          Projects Management
        </h1>
        <p className="text-muted-foreground text-xs">
          Manage your projects and their configurations
        </p>
      </div>

      <ProjectsTable />
    </div>
  );
}
