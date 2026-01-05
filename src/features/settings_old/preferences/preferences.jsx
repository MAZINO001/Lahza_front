"use client";

import React from "react";
import Notifications from "../components/preferences_comp/notifications";
import Preferences from "../components/preferences_comp/general";
import Security from "../components/preferences_comp/security";
export default function PreferencesSection({ section }) {
  const renderSection = () => {
    switch (section) {
      case "notifications":
        return <Notifications />;
      case "preferences":
        return <Preferences />;
      case "security":
        return <Security />;
      default:
        return null;
    }
  };

  return renderSection();
}
