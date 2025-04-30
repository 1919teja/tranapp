import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ContactModal from "./components/ContactModal";

// Simple Router without any context dependency
function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <Toaster />
      <AppRouter />
      {/* ContactModal will be conditionally rendered within its own component */}
      <ContactModal />
    </TooltipProvider>
  );
}

export default App;
