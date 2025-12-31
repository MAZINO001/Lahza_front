"use client";

import React from "react";
import Notifications from "./preferences/notifications";
import Preferences from "./preferences/general";
import Security from "./preferences/security";
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
