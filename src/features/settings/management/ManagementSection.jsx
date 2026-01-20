import React from "react";
import TeamManagement from "../team-management/TeamManagement";
import UserManagement from "../user-management/UserManagement";
import ProjectsManagement from "../projects-management/ProjectsManagement";

export default function ManagementSection({ section }) {
  switch (section) {
    case "team_management":
      return <TeamManagement />;
    case "users_management":
      return <UserManagement />;
    case "projects_management":
      return <ProjectsManagement />;
    default:
      return <div>Management section not found</div>;
  }
}
