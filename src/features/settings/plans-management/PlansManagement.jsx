import PlansTable from "./components/PlansTable";
import PacksList from "@/pages/plans/PacksList";
import PackDetail from "@/pages/plans/PackDetail";
import PlanCreate from "@/pages/plans/PlanCreate";
import PlanEdit from "@/pages/plans/PlanEdit";
import { useLocation } from "react-router-dom";

export default function PlansManagement() {
  const location = useLocation();

  const pathSegments = location.pathname.split("/");
  const plansManagementIndex = pathSegments.indexOf("plans_management");
  const packId =
    plansManagementIndex !== -1 &&
    plansManagementIndex + 1 < pathSegments.length
      ? pathSegments[plansManagementIndex + 1]
      : null;

  if (location.pathname.includes("/plans/new")) {
    return <PlanCreate />;
  }

  if (location.pathname.match(/\/plans\/\d+\/edit$/)) {
    return <PlanEdit />;
  }

  if (packId && !isNaN(packId)) {
    return <PackDetail />;
  }

  return (
    <div>
      <PacksList />
    </div>
  );
}
