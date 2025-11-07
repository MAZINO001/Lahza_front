import { useTranslation } from "react-i18next";
import { Button } from "@/Components/ui/button";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "en", name: "English" },
    { code: "fr", name: "Français" },
  ];

  return (
    <div className="flex gap-2">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          variant={i18n.language === lang.code ? "default" : "outline"}
          size="sm"
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
