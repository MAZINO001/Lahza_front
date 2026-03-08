// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ArrowLeft, Briefcase, User } from "lucide-react";
// import { Link } from "react-router-dom";
// import { Button } from "@/Components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../../Components/ui/card";
// import { Separator } from "../../Components/ui/separator";
// import { ClientForm } from "../../Components/auth/ClientForm";
// import { TeamClientForm } from "../../Components/auth/TeamClientForm";
// import Login from "./Login";

// export default function Register() {
//   const [mode, setMode] = useState("welcome");

//   const contentVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.98 },
//     visible: { opacity: 1, y: 0, scale: 1 },
//     exit: { opacity: 0, y: -20, scale: 0.98 },
//   };

//   const getTitle = () => {
//     switch (mode) {
//       case "client_form":
//         return "Client Registration";
//       case "worker_form":
//         return "Worker Registration";
//       case "login":
//         return "Login";
//       default:
//         return "Welcome to Lahza";
//     }
//   };

//   // Updated max-width: forms are wider now
//   const getCardWidthClass = () =>
//     mode === "welcome" ? "w-full max-w-4xl" : "w-full max-w-6xl";

//   return (
//     <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-4 relative overflow-hidden bg-background text-foreground">
//       <AnimatePresence mode="wait">
//         {/* WELCOME SCREEN */}
//         {mode === "welcome" && (
//           <motion.div
//             key="welcome"
//             variants={contentVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             transition={{ duration: 0.4 }}
//             className={`relative z-20 ${getCardWidthClass()} px-2 sm:px-4`}
//           >
//             <Card className="bg-background text-foreground border-none shadow-none">
//               <CardHeader className="text-center space-y-3 p-2">
//                 <CardTitle className="text-3xl font-extrabold text-foreground">
//                   Welcome to Lahza
//                 </CardTitle>
//                 <CardDescription className="text-muted-foreground text-sm">
//                   Choose how you want to continue your journey
//                 </CardDescription>
//               </CardHeader>

//               <CardContent className="grid sm:grid-cols-2 gap-4 p-4">
//                 {/* CLIENT CARD */}
//                 <motion.div
//                   className="rounded-xl border border-border
//                              bg-[color-mix(in oklch, var(--primary) 10%, white)]
//                              p-4 flex flex-col items-center text-center
//                              hover:border-primary
//                              transition-colors duration-300 ease-in-out"
//                 >
//                   <div className="p-4 rounded-full bg-[color-mix(in oklch, var(--primary) 20%, white)] text-primary mb-4 shadow-lg">
//                     <User className="w-9 h-9" />
//                   </div>

//                   <h3 className="font-bold text-xl mb-2 text-primary">
//                     I am a client
//                   </h3>
//                   <p className="text-sm text-muted-foreground mb-5">
//                     Looking for services or to publish new projects.
//                   </p>

//                   <Button
//                     onClick={() => setMode("client_form")}
//                     className="w-full bg-primary hover:bg-[color-mix(in oklch, var(--primary) 85%, black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
//                   >
//                     Continue as client
//                   </Button>
//                 </motion.div>

//                 {/* WORKER CARD */}
//                 <motion.div
//                   className="rounded-xl border border-border
//                              bg-[color-mix(in oklch, var(--secondary) 10%, white)]
//                              p-4 flex flex-col items-center text-center
//                              hover:border-black
//                              transition-colors duration-300 ease-in-out"
//                 >
//                   <div className="p-4 rounded-full bg-[color-mix(in oklch, var(--secondary) 20%, white)] text-foreground mb-4 shadow-lg">
//                     <Briefcase className="w-9 h-9" />
//                   </div>

//                   <h3 className="font-bold text-xl mb-2 text-foreground">
//                     I am a worker
//                   </h3>
//                   <p className="text-sm text-muted-foreground mb-5">
//                     Ready to accept new jobs, tasks or projects.
//                   </p>

//                   <Button
//                     onClick={() => setMode("worker_form")}
//                     className="w-full bg-secondary hover:bg-[color-mix(in oklch, var(--secondary) 75%, black)] text-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
//                   >
//                     Continue as worker
//                   </Button>
//                 </motion.div>
//               </CardContent>

//               <Separator className="my-4 border-border" />
//             </Card>
//           </motion.div>
//         )}


// <p className="text-center text-sm text-muted-foreground flex">
//                 <span className="mr-2">Already have an account?</span>
//                 <Link
//                 to={"/auth/login"}
//                   className="text-primary font-semibold hover:underline hover:text-[color-mix(in oklch, var(--primary) 70%, black)] transition-colors cursor-pointer"
//                 >
//                   Log in
//                 </Link>
//               </p>
//         {/* FORM / LOGIN SCREENS */}
//         {(mode === "client_form" ||
//           mode === "worker_form") && (
//           <motion.div
//             key={mode}
//             variants={contentVariants}
//             initial="hidden"
//             animate="visible"
//             exit="exit"
//             transition={{ duration: 0.4 }}
//             className={`relative z-20 ${getCardWidthClass()} px-2 sm:px-4`}
//           >
//             <Card className="w-full max-w-full shadow-2xl border border-border bg-background text-foreground backdrop-blur-md rounded-2xl">
//               <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-8 pb-4">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setMode("welcome")}
//                   className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-(--card)/10 transition-colors"
//                 >
//                   <ArrowLeft className="w-4 h-4" /> Back
//                 </Button>
//                 <CardTitle
//                   className="text-2xl font-bold text-transparent bg-clip-text
//                              bg-linear-to-r from-primary to-(--primary-gradient-end)"
//                 >
//                   {getTitle()}
//                 </CardTitle>
//               </CardHeader>

//               <CardContent className="p-4 sm:p-8 pt-0">
//                 {mode === "client_form" && <ClientForm />}
//                 {mode === "worker_form" && <TeamClientForm />}
//               </CardContent>
//             </Card>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, User, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../Components/ui/card";
import { Separator } from "../../Components/ui/separator";
import { ClientForm } from "../../Components/auth/ClientForm";
import { TeamClientForm } from "../../Components/auth/TeamClientForm";
import Login from "./Login";

export default function Register() {
  const { t } = useTranslation();
  const [mode, setMode] = useState("welcome");

  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  const getTitle = () => {
    switch (mode) {
      case "client_form":
        return t("register.client_form_title");
      case "worker_form":
        return t("register.worker_form_title");
      case "login":
        return t("register.login_title");
      default:
        return t("register.welcome_title");
    }
  };

  const getCardWidthClass = () =>
    mode === "welcome" ? "w-full max-w-4xl" : "w-full max-w-6xl";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 py-6 sm:py-8 overflow-auto bg-background">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {/* WELCOME SCREEN */}
        {mode === "welcome" && (
          <motion.div
            key="welcome"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
            className={`relative z-10 w-full ${getCardWidthClass()} px-0 sm:px-2`}
          >
            <Card className="bg-background border-none shadow-none">
              <CardHeader className="text-center space-y-3 sm:space-y-4 p-4 sm:p-6 pb-2 sm:pb-4">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                  {t("register.welcome_title")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t("register.welcome_description")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 sm:space-y-6 pb-6 sm:pb-8 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* CLIENT CARD */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="min-w-0"
                  >
                    <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 group h-full">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <CardContent className="relative p-3 sm:p-4 flex flex-col items-center text-center h-full justify-between min-h-0">
                        <div className="min-w-0 w-full">
                          <div className="mx-auto w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                            <User className="w-4 h-4 text-foreground shrink-0" />
                          </div>

                          <h3 className="font-semibold text-lg sm:text-2xl mb-2 sm:mb-3">
                            {t("register.client_card_title")}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                            {t("register.client_card_desc")}
                          </p>
                        </div>

                        <Button
                          className="cursor-pointer w-full shrink-0"
                          onClick={() => setMode("client_form")}
                          size="lg"
                          variant="default"
                        >
                          {t("register.client_button")}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* WORKER CARD */}
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ duration: 0.2 }}
                    className="min-w-0"
                  >
                    <Card className="relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group h-full">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <CardContent className="relative p-3 sm:p-4 flex flex-col items-center text-center h-full justify-between min-h-0">
                        <div className="min-w-0 w-full">
                          <div className="mx-auto w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                            <Briefcase className="w-4 h-4 text-foreground shrink-0" />
                          </div>

                          <h3 className="font-semibold text-lg sm:text-2xl mb-2 sm:mb-3">
                            {t("register.worker_card_title")}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                            {t("register.worker_card_desc")}
                          </p>
                        </div>

                        <Button
                          className="cursor-pointer w-full shrink-0"
                          onClick={() => setMode("worker_form")}
                          variant="outline"
                          size="lg"
                        >
                          {t("register.worker_button")}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                <Separator className="my-4 sm:my-6" />

                <p className="text-center text-xs sm:text-sm text-muted-foreground flex flex-wrap justify-center items-center gap-x-1 gap-y-0">
                  {t("register.login_text")}{" "}
                  <Link
                    to="/auth/login"
                    className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    {t("register.login_link")}
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* FORM SCREENS */}
        {(mode === "client_form" || mode === "worker_form") && (
          <motion.div
            key={mode}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
            className={`relative z-10 w-full ${getCardWidthClass()} px-0 sm:px-2 min-w-0 max-w-full`}
          >
            <Card className="bg-background border-none shadow-none overflow-hidden">
              <CardHeader className="space-y-1 sticky top-0 p-3 sm:p-4 bg-background z-10 border-b border-border/40">
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMode("welcome")}
                    className="gap-1.5 sm:gap-2 shrink-0 text-xs sm:text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 shrink-0" />
                    <span className="truncate">{t("register.back_button")}</span>
                  </Button>
                  <div className="absolute left-1/2 -translate-x-1/2 min-w-0 max-w-[60%] sm:max-w-none px-1">
                    <CardTitle className="text-base sm:text-2xl font-bold truncate text-center">
                      {getTitle()}
                    </CardTitle>
                  </div>
                  <div className="w-16 sm:w-20 shrink-0" aria-hidden />
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="pt-3 sm:pt-4 p-3 sm:p-4 md:p-6 overflow-x-hidden">
                {mode === "client_form" && <ClientForm />}
                {mode === "worker_form" && <TeamClientForm />}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}