import React from "react";
import TeamManagement from "../team-management/TeamManagement";
import UserManagement from "../user-management/UserManagement";
import ProjectsManagement from "../projects-management/ProjectsManagement";
import PlansManagement from "../plans-management/PlansManagement";

export default function ManagementSection({ section }) {
  switch (section) {
    case "team_management":
      return <TeamManagement />;
    case "users_management":
      return <UserManagement />;
    case "projects_management":
      return <ProjectsManagement />;
    case "plans_management":
      return <PlansManagement />;
    default:
      return <div>Management section not found</div>;
  }
}
