import { useState } from "react";
import Header from "@/components/Header";
import UserTypeSelection from "@/components/UserTypeSelection";
import TruckOwnerInterface from "@/components/TruckOwner/TruckOwnerInterface";
import CargoRequesterInterface from "@/components/CargoRequester/CargoRequesterInterface";
import FarmerInterface from "@/components/Farmer/FarmerInterface";
import BottomNavigation from "@/components/BottomNavigation";
import { useUser } from "@/context/UserContext";

export default function Home() {
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
}
