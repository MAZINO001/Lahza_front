import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdditionalTD from "./teamManagement/additionalTD";
import All_team from "./teamManagement/all_team";
export default function team_management() {
  return (
    <div>
      <Tabs defaultValue="additional" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="additional">Additional Team Data</TabsTrigger>
          <TabsTrigger value="all_team">All Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="additional">
          <AdditionalTD />
        </TabsContent>
        <TabsContent value="all_team">
          <All_team />
        </TabsContent>
      </Tabs>
    </div>
  );
}
