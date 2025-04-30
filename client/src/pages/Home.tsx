import { useState } from "react";
import Header from "@/components/Header";
import UserTypeSelection from "@/components/UserTypeSelection";
import TruckOwnerInterface from "@/components/TruckOwner/TruckOwnerInterface";
import CargoRequesterInterface from "@/components/CargoRequester/CargoRequesterInterface";
import FarmerInterface from "@/components/Farmer/FarmerInterface";
import BottomNavigation from "@/components/BottomNavigation";
import { UserProvider, useUser } from "@/context/UserContext";

// Separate component to use context
function HomeContent() {
  try {
    const { user, userType } = useUser();
    const [activeTab, setActiveTab] = useState(() => {
      if (userType === "truck-owner") return "myTruck";
      if (userType === "cargo-requester") return "postCargo";
      if (userType === "farmer") return "urgentRequest";
      return "";
    });

    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto p-4 pb-20">
          {!user ? (
            <UserTypeSelection />
          ) : userType === "truck-owner" ? (
            <TruckOwnerInterface activeTab={activeTab} />
          ) : userType === "cargo-requester" ? (
            <CargoRequesterInterface activeTab={activeTab} />
          ) : userType === "farmer" ? (
            <FarmerInterface activeTab={activeTab} />
          ) : null}
        </main>
        
        {user && <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />}
      </div>
    );
  } catch (error) {
    // If context error, show a friendly error message
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center p-6 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
          <p className="mb-6">We're having trouble loading the app. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
}

// Main export that wraps the content with the provider
export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  );
}
