import { 
  TruckIcon, 
  ClipboardListIcon, 
  PlusIcon, 
  SearchIcon, 
  ListIcon,
  ClockIcon 
} from "lucide-react";
import { useUser } from "@/context/UserContext";

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  try {
    const { userType } = useUser();
    
    if (!userType) return null;

    // Truck Owner Navigation
    if (userType === "truck-owner") {
      return (
        <nav className="bg-white fixed bottom-0 w-full shadow-lg border-t border-gray-200">
          <div className="flex justify-around">
            <button 
              className={`flex flex-col items-center p-3 w-1/2 ${activeTab === "myTruck" ? "text-primary font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("myTruck")}
            >
              <TruckIcon className={`h-6 w-6 ${activeTab === "myTruck" ? "text-primary" : "text-gray-500"}`} />
              <span className="text-xs mt-1">My Truck</span>
            </button>
            <button 
              className={`flex flex-col items-center p-3 w-1/2 ${activeTab === "requests" ? "text-primary font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("requests")}
            >
              <ClipboardListIcon className={`h-6 w-6 ${activeTab === "requests" ? "text-primary" : "text-gray-500"}`} />
              <span className="text-xs mt-1">Requests</span>
            </button>
          </div>
        </nav>
      );
    }

    // Cargo Requester Navigation
    if (userType === "cargo-requester") {
      return (
        <nav className="bg-white fixed bottom-0 w-full shadow-lg border-t border-gray-200">
          <div className="flex justify-around">
            <button 
              className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "postCargo" ? "text-primary font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("postCargo")}
            >
              <PlusIcon className={`h-6 w-6 ${activeTab === "postCargo" ? "text-primary" : "text-gray-500"}`} />
              <span className="text-xs mt-1">Post Cargo</span>
            </button>
            <button 
              className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "browseTrucks" ? "text-primary font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("browseTrucks")}
            >
              <SearchIcon className={`h-6 w-6 ${activeTab === "browseTrucks" ? "text-primary" : "text-gray-500"}`} />
              <span className="text-xs mt-1">Browse</span>
            </button>
            <button 
              className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "myRequests" ? "text-primary font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("myRequests")}
            >
              <ListIcon className={`h-6 w-6 ${activeTab === "myRequests" ? "text-primary" : "text-gray-500"}`} />
              <span className="text-xs mt-1">My Requests</span>
            </button>
          </div>
        </nav>
      );
    }

    // Farmer Navigation
    if (userType === "farmer") {
      return (
        <nav className="bg-white fixed bottom-0 w-full shadow-lg border-t border-gray-200">
          <div className="flex justify-around">
            <button 
              className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "urgentRequest" ? "text-green-600 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("urgentRequest")}
            >
              <ClockIcon className={`h-6 w-6 ${activeTab === "urgentRequest" ? "text-green-600" : "text-gray-500"}`} />
              <span className="text-xs mt-1">Urgent</span>
            </button>
            <button 
              className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "browseTrucks" ? "text-green-600 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("browseTrucks")}
            >
              <SearchIcon className={`h-6 w-6 ${activeTab === "browseTrucks" ? "text-green-600" : "text-gray-500"}`} />
              <span className="text-xs mt-1">Browse</span>
            </button>
            <button 
              className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "myRequests" ? "text-green-600 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("myRequests")}
            >
              <ListIcon className={`h-6 w-6 ${activeTab === "myRequests" ? "text-green-600" : "text-gray-500"}`} />
              <span className="text-xs mt-1">My Requests</span>
            </button>
          </div>
        </nav>
      );
    }
    
    return null;
  } catch (error) {
    // If there's a context error, return a simplified navigation
    console.error("Navigation error:", error);
    return null;
  }
}
