import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import LanguageSelector from "@/components/LanguageSelector";

export default function Header() {
  try {
    const { user, setUser, setUserType } = useUser();
    const { t } = useLanguage();
    const { toast } = useToast();

    const handleLogout = () => {
      setUser(null);
      setUserType(null);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account"
      });
    };

    return (
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">{t("app.title")} Telangana</h1>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            {user && (
              <div className="text-sm flex items-center">
                <span className="mr-2">
                  {user.userType === "truck-owner" && t("user.truck_owner")}
                  {user.userType === "cargo-requester" && t("user.cargo_requester")}
                  {user.userType === "farmer" && t("user.farmer")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 bg-white text-primary hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  } catch (error) {
    // Fallback header without context-dependent features
    return (
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">TruckConnect Telangana</h1>
          <LanguageSelector />
        </div>
      </header>
    );
  }
}
