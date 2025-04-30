import PostCargoTab from "./PostCargoTab";
import BrowseTrucksTab from "./BrowseTrucksTab";
import MyRequestsTab from "./MyRequestsTab";
import { useLanguage } from "@/context/LanguageContext";

interface CargoRequesterInterfaceProps {
  activeTab: string;
}

export default function CargoRequesterInterface({ activeTab }: CargoRequesterInterfaceProps) {
  const { t } = useLanguage();
  
  return (
    <div>
      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="flex border-b">
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "postCargo" ? "border-primary" : "border-transparent"}`}>
            {t("cargo.post_cargo")}
          </div>
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "browseTrucks" ? "border-primary" : "border-transparent"}`}>
            {t("truck.list_title")}
          </div>
          <div className={`flex-1 py-3 font-medium text-center border-b-2 ${activeTab === "myRequests" ? "border-primary" : "border-transparent"}`}>
            {t("cargo.my_requests")}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "postCargo" && <PostCargoTab />}
      {activeTab === "browseTrucks" && <BrowseTrucksTab />}
      {activeTab === "myRequests" && <MyRequestsTab />}
    </div>
  );
}
