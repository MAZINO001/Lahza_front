// import i18n from "./lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "../Routes/index";

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <AppRoutes />;
    </>
  );
}
