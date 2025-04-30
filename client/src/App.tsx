import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import LandingPage from "@/pages/LandingPage";
import AboutPage from "@/pages/AboutPage";
import InvestorsPage from "@/pages/InvestorsPage";
import PartnersPage from "@/pages/PartnersPage";
import ContactModal from "./components/ContactModal";
import { UserProvider } from "@/context/UserContext";
import { LanguageProvider } from "@/context/LanguageContext";

// Router with all application routes
function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/app" component={Home} />
      <Route path="/about" component={AboutPage} />
      <Route path="/investors" component={InvestorsPage} />
      <Route path="/partners" component={PartnersPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <UserProvider>
        <LanguageProvider>
          <Toaster />
          <AppRouter />
          {/* ContactModal will be conditionally rendered within its own component */}
          <ContactModal />
        </LanguageProvider>
      </UserProvider>
    </TooltipProvider>
  );
}

export default App;
