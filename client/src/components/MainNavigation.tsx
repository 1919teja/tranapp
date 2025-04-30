import { Link, useLocation } from "wouter";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSelector from "@/components/LanguageSelector";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MainNavigation() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const { user, setUser, setUserType } = useUser();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setUserType(null);
    toast({
      title: t("logout.success"),
      description: t("logout.message")
    });
  };

  const navigationItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.investors"), href: "/investors" },
    { name: t("nav.partners"), href: "/partners" },
  ];

  return (
    <header className="bg-gradient-to-r from-primary-dark via-primary to-purple-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and App title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-xl md:text-2xl font-bold flex items-center">
              {t("app.title")} Telangana
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`text-sm font-medium transition-colors hover:text-white/80 ${
                  location === item.href ? "text-white underline underline-offset-4" : "text-white/70"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User controls and language */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            {user && (
              <div className="flex items-center">
                <span className="text-sm mr-2">
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
                  {t("button.logout")}
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-3">
            <LanguageSelector />
            <button
              type="button"
              className="p-2 rounded-md text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-primary to-purple-800 border-t border-white/10">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navigationItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === item.href ? "bg-primary-dark text-white" : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {user && (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4 bg-white text-primary hover:bg-gray-100 justify-center"
                onClick={handleLogout}
              >
                {t("button.logout")}
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}