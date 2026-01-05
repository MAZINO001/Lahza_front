import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdditionalTD from "./additionalTD";
import All_team_table from "./All_team_table";
export default function team_management() {
  return (
    <div>
      <Tabs defaultValue="additional" className="w-full">
        <TabsList className="grid  w-[25%] md:w-[40%] grid-cols-2">
          <TabsTrigger value="additional">Additional Team Data</TabsTrigger>
          <TabsTrigger value="all_team">All Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="additional" className="max-w-full">
          <AdditionalTD />
        </TabsContent>
        <TabsContent value="all_team" className="max-w-full">
          <All_team_table />
        </TabsContent>
      </Tabs>
    </div>
  );
}
