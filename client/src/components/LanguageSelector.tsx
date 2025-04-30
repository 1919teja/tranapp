import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  const languages = [
    { code: "english", name: "English" },
    { code: "telugu", name: "తెలుగు" },
    { code: "hindi", name: "हिंदी" },
    { code: "tamil", name: "தமிழ்" }
  ];

  // Choose appropriate flag icon based on the selected language
  const getLanguageIcon = () => {
    return <Languages className="h-4 w-4 mr-2" />;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="sm" className="h-8 gap-1 px-3 bg-white text-primary hover:bg-gray-100 border-white">
          {getLanguageIcon()}
          {language === "english" ? "English" : 
           language === "telugu" ? "తెలుగు" : 
           language === "hindi" ? "हिंदी" : "தமிழ்"}
          <span className="sr-only">{t("app.language")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-32">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as any)}
            className={`${language === lang.code ? "bg-accent font-medium" : ""} px-4 py-2 cursor-pointer`}
          >
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}