// import { useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Globe } from "lucide-react";
// import { cn } from "@/lib/utils";
// import {
//   usePreferences,
//   useUpdatePreferences,
// } from "@/features/settings/hooks/usePreferencesQuery";

// const languages = [
//   { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
//   { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
// ];

// export default function LanguageSwitcher() {
//   const { i18n } = useTranslation();
//    const { data: preferences } = usePreferences();
//    const updatePreferences = useUpdatePreferences();

//    useEffect(() => {
//      const prefLang = preferences?.ui?.language;
//      if (prefLang && prefLang !== i18n.language) {
//        i18n.changeLanguage(prefLang);
//      }
//    }, [preferences?.ui?.language, i18n]);

//    const handleChangeLanguage = (code) => {
//      i18n.changeLanguage(code);

//      const currentUi =
//        preferences?.ui ?? {
//          language: "en",
//          dark_mode: false,
//          currency: "eur",
//        };

//      updatePreferences.mutate({
//        ui: {
//          ...currentUi,
//          language: code,
//        },
//      });
//    };

//   const currentLang =
//     languages.find((l) => l.code === i18n.language) ?? languages[0];

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button
//           variant="outline"
//           size="sm"
//           className={cn(
//             "h-9 px-3 sm:px-4 gap-1.5 sm:gap-2 text-sm font-medium",
//             "border-border/70 hover:border-border",
//             "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
//           )}
//         >
//           <Globe className="h-[18px] w-[18px] sm:h-4 sm:w-4 opacity-80" />
//           <span className="hidden sm:inline">{currentLang.short}</span>
//           <span className="sm:hidden font-mono tracking-wider uppercase">
//             {currentLang.code}
//           </span>
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent align="end" className="min-w-[140px] p-1">
//         {languages.map((lang) => {
//           const isActive = i18n.language === lang.code;

//           return (
//             <DropdownMenuItem
//               key={lang.code}
//               onClick={() => handleChangeLanguage(lang.code)}
//               className={cn(
//                 "cursor-pointer flex items-center gap-2.5 py-2.5 px-3 text-sm",
//                 "focus:bg-accent focus:text-accent-foreground",
//                 isActive && "bg-accent/70 font-medium",
//               )}
//             >
//               <span className="text-base leading-none">{lang.flag}</span>
//               <span>{lang.label}</span>
//               {isActive && (
//                 <span className="ml-auto text-xs text-muted-foreground font-mono">
//                   ✓
//                 </span>
//               )}
//             </DropdownMenuItem>
//           );
//         })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  usePreferences,
  useUpdatePreferences,
} from "@/features/settings/hooks/usePreferencesQuery";

const languages = [
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
];

const LANGUAGE_STORAGE_KEY = "app_language_preference";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { data: preferences } = usePreferences();
  const updatePreferences = useUpdatePreferences();

  // Initialize language from localStorage or preferences
  useEffect(() => {
    // Priority: 1. User preferences (if authenticated), 2. localStorage, 3. default
    const prefLang = preferences?.ui?.language;
    const storedLang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    
    const targetLang = prefLang || storedLang || "en";
    
    if (targetLang !== i18n.language) {
      i18n.changeLanguage(targetLang);
    }
  }, [preferences?.ui?.language, i18n]);

  const handleChangeLanguage = (code) => {
    // Always update i18n
    i18n.changeLanguage(code);
    
    // Always store in localStorage (works for both authenticated and unauthenticated)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);

    // If user is authenticated, also update their preferences
    if (preferences) {
      const currentUi = preferences?.ui ?? {
        language: "en",
        dark_mode: false,
        currency: "eur",
      };

      updatePreferences.mutate({
        ui: {
          ...currentUi,
          language: code,
        },
      });
    }
  };

  const currentLang =
    languages.find((l) => l.code === i18n.language) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 px-3 sm:px-4 gap-1.5 sm:gap-2 text-sm font-medium",
            "border-border/70 hover:border-border",
            "focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
          )}
        >
          <Globe className="h-[18px] w-[18px] sm:h-4 sm:w-4 opacity-80" />
          <span className="hidden sm:inline">{currentLang.short}</span>
          <span className="sm:hidden font-mono tracking-wider uppercase">
            {currentLang.code}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-[140px] p-1">
        {languages.map((lang) => {
          const isActive = i18n.language === lang.code;

          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleChangeLanguage(lang.code)}
              className={cn(
                "cursor-pointer flex items-center gap-2.5 py-2.5 px-3 text-sm",
                "focus:bg-accent focus:text-accent-foreground",
                isActive && "bg-accent/70 font-medium",
              )}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
              {isActive && (
                <span className="ml-auto text-xs text-muted-foreground font-mono">
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}