"use client";

import React from "react";
import Notifications from "../preferences/components/NotificationPreferences";
import Preferences from "../preferences/components/GeneralPreferences";
import Security from "../preferences/components/SecurityPreferences";
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
