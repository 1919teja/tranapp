import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { TruckIcon, BoxIcon, FolderIcon } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function UserTypeSelection() {
  try {
    const { setUserType, setUser } = useUser();
    const { t } = useLanguage();
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false);
    
    const handleUserTypeSelect = async (userType: "truck-owner" | "cargo-requester" | "farmer") => {
      setLoading(true);
      
      try {
        // Create a generic user for this demo
        const username = `${userType}-${Math.floor(Math.random() * 10000)}`;
        const response = await apiRequest("POST", "/api/users", {
          username,
          password: "password123", // Simple password for demo
          userType,
          phoneNumber: "9876543210" // Demo phone number
        });
        
        const userData = await response.json();
        setUser(userData);
        setUserType(userType);
        
        toast({
          title: `${t("app.title")}`,
          description: `You are now logged in as a ${userType.replace("-", " ")}`
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to create user. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">{t("app.select_user_type")}</h2>
        
        <div className="grid grid-cols-1 gap-6 w-full max-w-md">
          {/* Truck Owner Card */}
          <button 
            onClick={() => handleUserTypeSelect("truck-owner")}
            disabled={loading}
            className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-primary transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <TruckIcon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("user.truck_owner")}</h3>
            </div>
            <p className="text-gray-600 text-sm">List your truck and find cargo requests from farmers and businesses.</p>
          </button>
          
          {/* General Cargo Requester Card */}
          <button 
            onClick={() => handleUserTypeSelect("cargo-requester")}
            disabled={loading}
            className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-primary transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="bg-accent/10 p-3 rounded-full mr-4">
                <BoxIcon className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("user.cargo_requester")}</h3>
            </div>
            <p className="text-gray-600 text-sm">Post your cargo needs and connect with available truck owners.</p>
          </button>
          
          {/* Farmer Card */}
          <button 
            onClick={() => handleUserTypeSelect("farmer")}
            disabled={loading}
            className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-primary transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="bg-secondary/10 p-3 rounded-full mr-4">
                <FolderIcon className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">{t("user.farmer")}</h3>
            </div>
            <p className="text-gray-600 text-sm">Urgent transport for your crops. Priority service for farmers.</p>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    // Fallback UI if context is not available
    console.error("Error in UserTypeSelection:", error);
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Welcome to TruckConnect</h2>
        <p className="text-center text-gray-600 mb-4">
          An error occurred while loading the user selection. Please refresh the page.
        </p>
      </div>
    );
  }
}
