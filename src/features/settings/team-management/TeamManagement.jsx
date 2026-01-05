import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdditionalTeamDetails from "./components/AdditionalTeamDetails";
import TeamTable from "./components/TeamTable";
export default function TeamManagement() {
    return (
        <div>
            <Tabs defaultValue="additional" className="w-full">
                <TabsList className="grid  w-[25%] md:w-[40%] grid-cols-2">
                    <TabsTrigger value="additional">Additional Team Data</TabsTrigger>
                    <TabsTrigger value="all_team">All Teams</TabsTrigger>
                </TabsList>
                <TabsContent value="additional" className="max-w-full">
                    <AdditionalTeamDetails />
                </TabsContent>
                <TabsContent value="all_team" className="max-w-full">
                    <TeamTable />
                </TabsContent>
            </Tabs>
        </div>
    );
}