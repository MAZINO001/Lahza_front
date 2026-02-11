import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdditionalTeamDetails from "./components/AdditionalTeamDetails";
import TeamTable from "./components/TeamTable";
export default function TeamManagement() {
  return (
    <div>
      <div className="space-y-0.5 mb-4">
        <h1 className="text-2xl font-bold tracking-tight">
          Team Management
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage your teams and team members
        </p>
      </div>

      <Tabs defaultValue="additional" className="w-ful">
        <TabsList className="grid w-[25%] md:w-[40%] grid-cols-2">
          <TabsTrigger value="additional">Additional Team Data</TabsTrigger>
          <TabsTrigger value="all_team">All Teams</TabsTrigger>
        </TabsList>
        <TabsContent value="additional" className="w-full">
          <AdditionalTeamDetails />
        </TabsContent>
        <TabsContent value="all_team" className="w-full">
          <TeamTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
