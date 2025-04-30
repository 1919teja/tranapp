import { useState } from "react";
import MyTruckTab from "./MyTruckTab";
import RequestsTab from "./RequestsTab";

interface TruckOwnerInterfaceProps {
  activeTab: string;
}

export default function TruckOwnerInterface({ activeTab }: TruckOwnerInterfaceProps) {
  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "myTruck" ? "border-primary" : "border-transparent"}`}>
            My Truck
          </div>
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "requests" ? "border-primary" : "border-transparent"}`}>
            Requests
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "myTruck" && <MyTruckTab />}
      {activeTab === "requests" && <RequestsTab />}
    </div>
  );
}
