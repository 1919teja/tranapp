import MainNavigation from "@/components/MainNavigation";
import { useLanguage } from "@/context/LanguageContext";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("about.title")}</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            TruckConnect Telangana is revolutionizing the way cargo transportation works in rural and urban areas.
          </p>
        </div>
      </section>
      
      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("about.mission")}</h2>
            <p className="text-lg text-gray-600 mb-8">
              Our mission is to create an accessible and efficient logistics network that empowers farmers, 
              businesses, and truck owners across Telangana. We aim to reduce transportation costs, minimize 
              waste, and maximize efficiency for all stakeholders.
            </p>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("about.vision")}</h2>
            <p className="text-lg text-gray-600 mb-8">
              We envision a future where transportation is not a barrier for farmers bringing their produce to 
              market or for businesses seeking to expand their reach. TruckConnect aims to be the backbone 
              of logistics infrastructure in Telangana, connecting every village and town with reliable 
              transportation options.
            </p>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("about.team")}</h2>
            <p className="text-lg text-gray-600 mb-8">
              Founded by a team of logistics experts and technology innovators, TruckConnect combines deep 
              industry knowledge with cutting-edge technology to solve real-world transportation challenges.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Rajesh Kumar</h3>
                <p className="text-gray-500">Founder & CEO</p>
              </div>
              
              {/* Team Member 2 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Priya Sharma</h3>
                <p className="text-gray-500">CTO</p>
              </div>
              
              {/* Team Member 3 */}
              <div className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold">Vikram Reddy</h3>
                <p className="text-gray-500">Head of Operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 TruckConnect Telangana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}