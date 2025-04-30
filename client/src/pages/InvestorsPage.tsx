import MainNavigation from "@/components/MainNavigation";
import { useLanguage } from "@/context/LanguageContext";

export default function InvestorsPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="bg-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t("investors.title")}</h1>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            {t("investors.description")}
          </p>
        </div>
      </section>
      
      {/* Investors Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Investors</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600">
              {t("app.title")} Telangana is backed by leading investors who believe in our vision of 
              transforming rural transportation and logistics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Investor 1 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-3xl font-bold text-primary">TVC</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Telangana Venture Capital</h3>
              <p className="text-gray-600">Early stage investor focused on rural innovation and technology solutions.</p>
            </div>
            
            {/* Investor 2 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-3xl font-bold text-primary">IIF</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">India Innovation Fund</h3>
              <p className="text-gray-600">Supporting startups that create technological solutions for India's unique challenges.</p>
            </div>
            
            {/* Investor 3 */}
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <div className="text-3xl font-bold text-primary">AGT</div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AgriTech Growth</h3>
              <p className="text-gray-600">Specialized investment fund focusing on agricultural technology and infrastructure.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Investment Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Investment Highlights</h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Market Opportunity</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• ₹500 billion transportation market in Telangana</li>
                  <li>• 70% unorganized sector with significant inefficiency</li>
                  <li>• Growing demand for reliable logistics in rural areas</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Growth Metrics</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 150% YoY growth in user base</li>
                  <li>• 10,000+ registered truck owners</li>
                  <li>• 25,000+ successful deliveries completed</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Social Impact</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• 30% increase in farmer income through better market access</li>
                  <li>• 40% reduction in post-harvest losses</li>
                  <li>• Employment generation for rural youth</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Future Roadmap</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Expansion to neighboring states by Q3 2025</li>
                  <li>• Introduction of cold chain logistics services</li>
                  <li>• Advanced analytics and AI-based route optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl text-white font-bold mb-6">Interested in investing?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join us in our mission to transform transportation and logistics in rural India.
          </p>
          <a 
            href="mailto:investors@loopout.in" 
            className="inline-block px-8 py-3 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition"
          >
            Contact Our Investment Team
          </a>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 {t("app.title")} Telangana. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}