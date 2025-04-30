import MainNavigation from "@/components/MainNavigation";
import { useLanguage } from "@/context/LanguageContext";
import { CheckCircle2 } from "lucide-react";

export default function PartnersPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("partners.title")}</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            {t("partners.description")}
          </p>
        </div>
      </section>
      
      {/* Partners Showcase */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Strategic Partnerships</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              {t("app.title")} collaborates with leading organizations to create a robust logistics ecosystem.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Government Partnerships */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Government Partners</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">Telangana Agriculture Department</h4>
                    <p className="text-gray-600">Collaboration for farm-to-market transportation initiatives and subsidies for farmers.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">Telangana Transport Department</h4>
                    <p className="text-gray-600">Streamlined processes for commercial vehicle registrations and compliance.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">T-Hub Innovation Center</h4>
                    <p className="text-gray-600">Technology incubation and development support for our platform.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Industry Partnerships */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-2xl font-semibold mb-6 text-primary">Industry Partners</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">Telangana Truck Owners Association</h4>
                    <p className="text-gray-600">Coordinated efforts to improve commercial vehicle operations and standards.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">Retailer Federation of India</h4>
                    <p className="text-gray-600">Integration with retail supply chains for streamlined delivery services.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">Farmers Producer Organizations</h4>
                    <p className="text-gray-600">Direct partnerships with FPOs for collective bargaining and better rates for farmers.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Featured Technology Partners</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Tech Partner 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center">
              <div className="h-20 w-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500">GPS Tech</span>
              </div>
            </div>
            
            {/* Tech Partner 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center">
              <div className="h-20 w-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500">PaySys</span>
              </div>
            </div>
            
            {/* Tech Partner 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center">
              <div className="h-20 w-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500">CloudHost</span>
              </div>
            </div>
            
            {/* Tech Partner 4 */}
            <div className="bg-white p-8 rounded-lg shadow-sm flex items-center justify-center">
              <div className="h-20 w-full bg-gray-200 rounded flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-500">MapTech</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partner Benefits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Benefits of Partnering With Us</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary/5 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">For Business Partners</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Access to our growing network of transporters</li>
                <li>• Reduced logistics costs and streamlined operations</li>
                <li>• Data-driven insights on transportation patterns</li>
                <li>• Co-branding opportunities and marketing support</li>
              </ul>
            </div>
            
            <div className="bg-primary/5 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">For Technology Partners</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Integration with our platform serving thousands of users</li>
                <li>• Real-world deployment of your technology solutions</li>
                <li>• Joint R&D opportunities in rural logistics</li>
                <li>• Revenue-sharing models for value-added services</li>
              </ul>
            </div>
            
            <div className="bg-primary/5 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">For Community Organizations</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Improved logistics infrastructure for rural communities</li>
                <li>• Job creation and economic development</li>
                <li>• Reduced waste and environmental impact</li>
                <li>• Enhanced market access for local producers</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Partnership CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white font-bold mb-6">Become a Partner</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Interested in partnering with {t("app.title")} to transform rural logistics? Reach out to our partnership team today.
          </p>
          <a 
            href="mailto:partnerships@loopout.in" 
            className="inline-block px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition"
          >
            Contact Our Partnership Team
          </a>
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