// import i18n from "./lib/i18n";
import { Toaster } from "@/components/ui/sonner";
import AppRoutes from "./Routes/index";

export default function App() {
  // <div>
  {
    /* <h1>{t("welcome_message")}</h1> */
  }
  {
    /* <button onClick={() => i18n.changeLanguage("fr")}>🇫🇷</button> */
  }
  {
    /* <button onClick={() => i18n.changeLanguage("en")}>🇺🇸</button> */
  }
  // </div>;

  return (
    <>
      <Toaster position="bottom-right" richColors closeButton />
      <AppRoutes />;
    </>
  );
}
