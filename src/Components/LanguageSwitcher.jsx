// import { useTranslation } from "react-i18next";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// export default function LanguageSwitcher() {
//   const { i18n } = useTranslation();

//   const languages = [
//     { code: "en", name: "English" },
//     { code: "fr", name: "Français" },
//   ];

//   const currentLanguage =
//     languages.find((lang) => lang.code === i18n.language) || languages[0];

//   const handleLanguageChange = (code) => {
//     i18n.changeLanguage(code);
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button className="px-2 gap-2 border border-border rounded-md flex items-center justify-center text-sm">
//           <span className="hidden sm:inline">{currentLanguage.name}</span>
//           <span className="sm:hidden uppercase">{currentLanguage.code}</span>
//         </button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end" className="max-h-60 overflow-y-auto">
//         {languages.map((lang) => (
//           <DropdownMenuItem
//             key={lang.code}
//             onClick={() => handleLanguageChange(lang.code)}
//             className={i18n.language === lang.code ? "bg-accent" : ""}
//           >
//             {lang.name}
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

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

const languages = [
  { code: "en", label: "English", short: "EN", flag: "🇬🇧" },
  { code: "fr", label: "Français", short: "FR", flag: "🇫🇷" },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

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
              onClick={() => i18n.changeLanguage(lang.code)}
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
