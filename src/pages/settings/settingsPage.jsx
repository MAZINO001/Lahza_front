// "use client";

// import React from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// import Agency_info from "@/features/settings/components/agency_info";
// import Notifications from "@/features/settings/components/notifications";
// import Preferences from "@/features/settings/components/preferences";
// import Security from "@/features/settings/components/security";
// import User_team_management from "@/features/settings/components/user_team_management";

// export default function SettingsPage() {
//   return (
//     <div className="p-4">
//       <Card className="py-4">
//         <CardContent className="px-4">
//           <Tabs defaultValue="agency_info" className="w-full">
//             <TabsList className="flex items-center justify-between w-full mb-4">
//               <TabsTrigger className="w-1/5" value="agency_info">
//                 Agency Info
//               </TabsTrigger>
//               <TabsTrigger className="w-1/5" value="notifications">
//                 Notifications
//               </TabsTrigger>
//               <TabsTrigger className="w-1/5" value="preferences">
//                 Preferences
//               </TabsTrigger>
//               <TabsTrigger className="w-1/5" value="security">
//                 Security
//               </TabsTrigger>
//               <TabsTrigger className="w-1/5" value="user_team_management">
//                 User&Team Management
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="agency_info" className="space-y-4">
//               <Agency_info />
//             </TabsContent>
//             <TabsContent value="notifications" className="space-y-4">
//               <Notifications />
//             </TabsContent>
//             <TabsContent value="preferences" className="space-y-4">
//               <Preferences />
//             </TabsContent>
//             <TabsContent value="security" className="space-y-4">
//               <Security />
//             </TabsContent>
//             <TabsContent value="user_team_management" className="space-y-4">
//               <User_team_management />
//             </TabsContent>
//           </Tabs>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import SettingsSideBar from "@/features/settings/components/layout_components/settingsPage";
import SettingsMainContent from "@/features/settings/components/layout_components/settingsSideBar";

export default function SettingsLayout() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto">
        <div className="flex gap-4">
          <SettingsMainContent />
          <SettingsSideBar />
        </div>
      </div>
    </div>
  );
}
