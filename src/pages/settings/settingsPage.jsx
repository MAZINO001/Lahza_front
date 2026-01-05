import SettingsSideBar from "@/features/settings/layout_components/settingsSideBar";
import SettingsMainContent from "@/features/settings/layout_components/settingsPage";

export default function SettingsLayout() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto">
        <div className="flex gap-4">
          <SettingsSideBar />
          <SettingsMainContent />
        </div>
      </div>
    </div>
  );
}
