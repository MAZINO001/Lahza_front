// import { ChartBarDefault } from "./overViewChart";

// export default function Overview({ project, tasks }) {
//     return (
//         <div className="space-y-4">
//             <ChartBarDefault
//                 startDate={project.start_date}
//                 endDate={project.estimated_end_date}
//                 tasks={tasks}
//             />
//         </div>
//     );
// }


import { ChartBarDefault } from "./overViewChart";

export default function Overview({ project, tasks }) {
  // Add debugging
  console.log("Overview - project dates:", {
    start: project?.start_date,
    end: project?.estimated_end_date,
  });
  console.log("Overview - tasks:", tasks?.length);
  console.log(
    "Overview - completed tasks:",
    tasks?.filter(
      (t) =>
        t.status === "done" || t.status === "completed" || t.percentage === 100
    ).length
  );

  return (
    <div className="space-y-4">
      <ChartBarDefault
        tasks={tasks || []}
        startDate={project?.start_date}
        endDate={project?.estimated_end_date}
      />
    </div>
  );
}