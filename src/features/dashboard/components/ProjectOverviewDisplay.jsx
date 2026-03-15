import React from "react";
import ProjectOverviewCard from "./ProjectOverviewCard";
import UpcomingMeetingsCard from "./UpcomingMeetingsCard";

export default function ProjectOverview() {
  return (
    <div className="space-y-4 text-foreground w-full">
      <h2 className="text-xl font-normal tracking-tight text-foreground">
        Planning & Details
      </h2>
      <div className="grid gap-4 lg:grid-cols-7 w-full h-full">
        <div className="lg:col-span-5">
          <ProjectOverviewCard />
        </div>
        <div className="lg:col-span-2">
          <UpcomingMeetingsCard />
        </div>
      </div>
    </div>
  );
}
