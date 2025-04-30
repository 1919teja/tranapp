import UrgentRequestTab from "./UrgentRequestTab";
import BrowseTrucksTab from "./BrowseTrucksTab";
import MyRequestsTab from "./MyRequestsTab";

interface FarmerInterfaceProps {
  activeTab: string;
}

export default function FarmerInterface({ activeTab }: FarmerInterfaceProps) {
  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "urgentRequest" ? "border-secondary" : "border-transparent"}`}>
            Urgent Request
          </div>
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "browseTrucks" ? "border-secondary" : "border-transparent"}`}>
            Browse Trucks
          </div>
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "myRequests" ? "border-secondary" : "border-transparent"}`}>
            My Requests
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "urgentRequest" && <UrgentRequestTab />}
      {activeTab === "browseTrucks" && <BrowseTrucksTab />}
      {activeTab === "myRequests" && <MyRequestsTab />}
    </div>
  );
}
