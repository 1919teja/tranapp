import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  try {
    const { user, setUser, setUserType } = useUser();
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
          <h1 className="text-xl font-bold">TruckConnect Telangana</h1>
          {user && (
            <div className="text-sm flex items-center">
              <span className="mr-2">
                {user.userType === "truck-owner" && "Truck Owner"}
                {user.userType === "cargo-requester" && "Cargo Requester"}
                {user.userType === "farmer" && "Farmer"}
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
      </header>
    );
  } catch (error) {
    // Fallback header without context-dependent features
    return (
      <header className="bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">TruckConnect Telangana</h1>
        </div>
      </header>
    );
  }
}
