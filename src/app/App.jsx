// import i18n from "./lib/i18n";
import { useAppInitialization } from "@/hooks/useAppInitialization";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "../Routes/index";

export default function App() {
  // const { isLoading } = useAppInitialization();
  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       Loading app data...
  //     </div>
  //   );
  // }
  return (
    <div>
      <Toaster position="bottom-right" richColors closeButton />
      <AppRoutes />
    </div>
  );
}
