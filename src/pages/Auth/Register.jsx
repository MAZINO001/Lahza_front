/* eslint-disable no-unused-vars */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Briefcase, Link, User } from "lucide-react";
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

export default function Register({
  auth = { user: { name: "John Doe", email: "john@example.com" } },
}) {
  const [mode, setMode] = useState("welcome");

  const contentVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.98 },
  };

  const getTitle = () => {
    switch (mode) {
      case "client_form":
        return "Inscription Client";
      case "worker_form":
        return "Inscription Travailleur";
      case "login":
        return "Connexion";
      default:
        return "Bienvenue sur Lahza";
    }
  };

  // Updated max-width: forms are wider now
  const getCardWidthClass = () =>
    mode === "welcome" ? "w-full max-w-4xl" : "w-full max-w-6xl";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-background text-foreground">
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
            className={`relative z-20 ${getCardWidthClass()} px-2 sm:px-4`}
          >
            <Card className="bg-card text-foreground border-none shadow-none">
              <CardHeader className="text-center space-y-3 p-6 sm:p-8">
                <CardTitle className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary to-(--primary-gradient-end)">
                  Bienvenue sur Lahza
                </CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Choisissez comment vous souhaitez poursuivre votre parcours
                </CardDescription>
              </CardHeader>

              <CardContent className="grid sm:grid-cols-2 gap-6 p-6 sm:p-8 pt-0">
                {/* CLIENT CARD */}
                <motion.div
                  className="rounded-xl border border-border
                             bg-[color-mix(in oklch, var(--primary) 10%, white)]
                             p-6 flex flex-col items-center text-center
                             hover:border-primary
                             transition-colors duration-300 ease-in-out"
                >
                  <div className="p-4 rounded-full bg-[color-mix(in oklch, var(--primary) 20%, white)] text-primary mb-4 shadow-lg">
                    <User className="w-9 h-9" />
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-primary">
                    Je suis un client
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    À la recherche de services ou pour publier de nouveaux
                    projets.
                  </p>

                  <Button
                    onClick={() => setMode("client_form")}
                    className="w-full bg-primary hover:bg-[color-mix(in oklch, var(--primary) 85%, black)] text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Continuer en tant que client
                  </Button>
                </motion.div>

                {/* WORKER CARD */}
                <motion.div
                  className="rounded-xl border border-border
                             bg-[color-mix(in oklch, var(--secondary) 10%, white)]
                             p-6 flex flex-col items-center text-center
                             hover:border-black
                             transition-colors duration-300 ease-in-out"
                >
                  <div className="p-4 rounded-full bg-[color-mix(in oklch, var(--secondary) 20%, white)] text-foreground mb-4 shadow-lg">
                    <Briefcase className="w-9 h-9" />
                  </div>

                  <h3 className="font-bold text-xl mb-2 text-foreground">
                    Je suis un travailleur
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Prêt à accepter de nouveaux emplois, tâches ou projets.
                  </p>

                  <Button
                    onClick={() => setMode("worker_form")}
                    className="w-full bg-secondary hover:bg-[color-mix(in oklch, var(--secondary) 75%, black)] text-foreground font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Continuer en tant que travailleur
                  </Button>
                </motion.div>
              </CardContent>

              <Separator className="my-6 border-border" />

              {!auth.user && (
                <p className="text-center text-sm text-muted-foreground pb-6">
                  Vous avez déjà un compte ?{" "}
                  {/* <span
                    onClick={() => setMode("login")}
                    className="text-[var(--primary)] font-semibold hover:underline hover:text-[color-mix(in oklch, var(--primary) 70%, black)] transition-colors cursor-pointer"
                  >
                    Se connecter
                  </span> */}
                  <Link
                    href={"/login"}
                    className="text-primary font-semibold hover:underline hover:text-[color-mix(in oklch, var(--primary) 70%, black)] transition-colors"
                  >
                    Se connecter
                  </Link>
                </p>
              )}
            </Card>
          </motion.div>
        )}

        {/* FORM / LOGIN SCREENS */}
        {(mode === "client_form" ||
          mode === "worker_form" ||
          mode === "login") && (
          <motion.div
            key={mode}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.4 }}
            className={`relative z-20 ${getCardWidthClass()} px-2 sm:px-4`}
          >
            <Card className="w-full max-w-full shadow-2xl border border-border bg-card text-foreground backdrop-blur-md rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between p-6 sm:p-8 pb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMode("welcome")}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-(--card)/10 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Retour
                </Button>
                <CardTitle
                  className="text-2xl font-bold text-transparent bg-clip-text
                             bg-linear-to-r from-primary to-(--primary-gradient-end)"
                >
                  {getTitle()}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 pt-0">
                {mode === "client_form" && <ClientForm />}
                {mode === "worker_form" && <TeamClientForm />}
                {mode === "login" && <Login />}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
