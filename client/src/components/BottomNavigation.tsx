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
  const { userType } = useUser();
  
  if (!userType) return null;

  // Truck Owner Navigation
  if (userType === "truck-owner") {
    return (
      <nav className="bg-white fixed bottom-0 w-full shadow-lg border-t border-gray-200">
        <div className="flex justify-around">
          <button 
            className={`flex flex-col items-center p-3 w-1/2 ${activeTab === "myTruck" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("myTruck")}
          >
            <TruckIcon className="h-6 w-6" />
            <span className="text-xs mt-1">My Truck</span>
          </button>
          <button 
            className={`flex flex-col items-center p-3 w-1/2 ${activeTab === "requests" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            <ClipboardListIcon className="h-6 w-6" />
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
            className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "postCargo" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("postCargo")}
          >
            <PlusIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Post Cargo</span>
          </button>
          <button 
            className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "browseTrucks" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("browseTrucks")}
          >
            <SearchIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Browse</span>
          </button>
          <button 
            className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "myRequests" ? "bottom-nav-active" : ""}`}
            onClick={() => setActiveTab("myRequests")}
          >
            <ListIcon className="h-6 w-6" />
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
            className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "urgentRequest" ? "bottom-nav-farmer-active" : ""}`}
            onClick={() => setActiveTab("urgentRequest")}
          >
            <ClockIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Urgent</span>
          </button>
          <button 
            className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "browseTrucks" ? "bottom-nav-farmer-active" : ""}`}
            onClick={() => setActiveTab("browseTrucks")}
          >
            <SearchIcon className="h-6 w-6" />
            <span className="text-xs mt-1">Browse</span>
          </button>
          <button 
            className={`flex flex-col items-center p-3 w-1/3 ${activeTab === "myRequests" ? "bottom-nav-farmer-active" : ""}`}
            onClick={() => setActiveTab("myRequests")}
          >
            <ListIcon className="h-6 w-6" />
            <span className="text-xs mt-1">My Requests</span>
          </button>
        </div>
      </nav>
    );
  }
  
  return null;
}
