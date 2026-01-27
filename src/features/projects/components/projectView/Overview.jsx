import { ChartBarDefault } from "./overViewChart";

export default function Overview({ project, tasks }) {
    return (
        <div className="space-y-4">
            <ChartBarDefault
                startDate={project.start_date}
                endDate={project.estimated_end_date}
                tasks={tasks}
            />
        </div>
    );
}
