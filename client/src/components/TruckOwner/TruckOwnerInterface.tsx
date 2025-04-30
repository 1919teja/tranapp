import MyTruckTab from "./MyTruckTab";
import RequestsTab from "./RequestsTab";
import { useLanguage } from "@/context/LanguageContext";

interface TruckOwnerInterfaceProps {
  activeTab: string;
}

export default function TruckOwnerInterface({ activeTab }: TruckOwnerInterfaceProps) {
  const { t } = useLanguage();
  
  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "myTruck" ? "border-primary" : "border-transparent"}`}>
            {t("truck.my_truck")}
          </div>
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "requests" ? "border-primary" : "border-transparent"}`}>
            {t("truck.requests")}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "myTruck" && <MyTruckTab />}
      {activeTab === "requests" && <RequestsTab />}
    </div>
  );
}
