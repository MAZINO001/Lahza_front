// // PackDetail.jsx
// import React, { useMemo, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { Button } from "@/components/ui/button";

// import { Plus, Edit, Trash2, Check } from "lucide-react";
// import { usePack, useDeletePack } from "@/features/plans/hooks/usePacks";
// import { usePlans } from "@/features/plans/hooks/usePlans";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { useAuthContext } from "@/hooks/AuthContext";
// import Plan from "./Plan";

// export default function PackDetail() {
//   const location = useLocation();
//   const { role } = useAuthContext();
//   const navigate = useNavigate();

//   const pathSegments = location.pathname.split("/");
//   const plansManagementIndex = pathSegments.indexOf("plans_management");
//   const id =
//     plansManagementIndex !== -1 &&
//     plansManagementIndex + 1 < pathSegments.length
//       ? pathSegments[plansManagementIndex + 1]
//       : null;

//   const { data: pack, isLoading: packLoading } = usePack(id);
//   const { data: plansData, isLoading: plansLoading } = usePlans(id);

//   const plans = useMemo(() => {
//     return plansData?.data || [];
//   }, [plansData]);

//   const [isAnnual, setIsAnnual] = useState(false);
//   const deletePack = useDeletePack();

//   const handleDeletePack = () => {
//     if (
//       !window.confirm(`Delete entire pack "${pack?.name}" and all its plans?`)
//     )
//       return;
//     deletePack.mutate(id, {
//       onSuccess: () => {
//         toast.success("Pack deleted");
//         navigate(`/${role}/settings/plans_management`);
//       },
//     });
//   };

//   if (packLoading || plansLoading) {
//     return <div className="p-12 text-center">Loading...</div>;
//   }

//   if (!pack) {
//     return (
//       <div className="p-12 text-center text-muted-foreground">
//         Pack not found
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen ">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="font-semibold text-lg">Plans in :{pack?.name}</h1>
//         <Button
//           onClick={() =>
//             navigate(`/${role}/settings/plans_management/${id}/plans/new`)
//           }
//         >
//           <Plus className="mr-2 h-4 w-4" /> Add New Plan
//         </Button>
//       </div>

//       {plans.length === 0 ? (
//         <div className="p-4 text-center flex items-center justify-center flex-col">
//           <p className="text-muted-foreground mb-4">
//             No plans in this pack yet
//           </p>
//           <Button
//             onClick={() =>
//               navigate(`/${role}/settings/plans_management/${id}/plans/new`)
//             }
//           >
//             Create First Plan
//           </Button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
//           {plans.map((plan) => (
//             <Plan key={plan.id} plan={plan} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// PackDetail.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

import { Plus, Edit, Trash2, Check } from "lucide-react";
import { usePack, useDeletePack } from "@/features/plans/hooks/usePacks";
import { usePlans } from "@/features/plans/hooks/usePlans";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/hooks/AuthContext";
import Plan from "./Plan";

export default function PackDetail() {
  const location = useLocation();
  const { role } = useAuthContext();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/");
  const plansManagementIndex = pathSegments.indexOf("plans_management");
  const id =
    plansManagementIndex !== -1 &&
    plansManagementIndex + 1 < pathSegments.length
      ? pathSegments[plansManagementIndex + 1]
      : null;

  const { data: pack, isLoading: packLoading } = usePack(id);
  const { data: plansData, isLoading: plansLoading } = usePlans(id);

  const plans = useMemo(() => {
    return plansData?.data || [];
  }, [plansData]);

  const [isAnnual, setIsAnnual] = useState(false);
  const deletePack = useDeletePack();

  const handleDeletePack = () => {
    if (
      !window.confirm(`Delete entire pack "${pack?.name}" and all its plans?`)
    )
      return;
    deletePack.mutate(id, {
      onSuccess: () => {
        toast.success("Pack deleted");
        navigate(`/${role}/settings/plans_management`);
      },
    });
  };

  if (packLoading || plansLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-sm">
          Loading pack details...
        </div>
      </div>
    );
  }

  if (!pack) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-tight">
            Pack not found
          </h2>
          <p className="text-muted-foreground text-sm">
            The requested subscription pack could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Plans in {pack?.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage subscription plans for this pack
          </p>
        </div>

        <Button
          onClick={() =>
            navigate(`/${role}/settings/plans_management/${id}/plans/new`)
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="space-y-3 max-w-md">
            <h2 className="text-xl font-semibold tracking-tight">
              No plans yet
            </h2>
            <p className="text-muted-foreground">
              This pack doesn't have any subscription plans. Create one to get
              started.
            </p>
          </div>

          <Button
            size="lg"
            onClick={() =>
              navigate(`/${role}/settings/plans_management/${id}/plans/new`)
            }
          >
            <Plus className="mr-2 h-5 w-5" />
            Create First Plan
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {plans.map((plan) => (
            <Plan key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
