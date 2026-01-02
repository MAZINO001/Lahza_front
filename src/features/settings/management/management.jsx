"use client";

import React from "react";
import Team_management from "../components/management/teamManagement/team_management";
import Projects_management from "../components/management/ProjectsManagement/projects_managementPage";
import User_management from "../components/management/usermanagement/user_management";

export default function ManagementSection({ section }) {
  const renderSection = () => {
    switch (section) {
      case "team_management":
        return <Team_management />;
      case "projects_management":
        return <Projects_management />;
      case "users_management":
        return <User_management />;
      default:
        return null;
    }
  };

  return renderSection();
}
