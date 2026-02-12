import PlansTable from "./components/PlansTable";
import PacksList from "@/pages/plans/PacksList";
import PackDetail from "@/pages/plans/PackDetail";
import PlanCreate from "@/pages/plans/PlanCreate";
import PlanEdit from "@/pages/plans/PlanEdit";
import { useLocation } from "react-router-dom";

export default function PlansManagement() {
    const location = useLocation();

    // Extract the pack ID from the URL path
    const pathSegments = location.pathname.split("/");
    const plansManagementIndex = pathSegments.indexOf("plans_management");
    const packId = plansManagementIndex !== -1 && plansManagementIndex + 1 < pathSegments.length
        ? pathSegments[plansManagementIndex + 1]
        : null;

    // Debug logging
    console.log("PlansManagement - Current path:", location.pathname);
    console.log("PlansManagement - Pack ID:", packId);

    // Check if the path includes plan creation or editing
    if (location.pathname.includes('/plans/new')) {
        console.log("PlansManagement - Rendering PlanCreate");
        return <PlanCreate />;
    }

    // More specific check for edit route - should match /plans/{id}/edit
    if (location.pathname.match(/\/plans\/\d+\/edit$/)) {
        console.log("PlansManagement - Rendering PlanEdit");
        return <PlanEdit />;
    }

    // If packId is a number, show pack details, otherwise show packs list
    if (packId && !isNaN(packId)) {
        return <PackDetail />;
    }

    return (
        <div>
            <PacksList />
        </div>
    );
}
