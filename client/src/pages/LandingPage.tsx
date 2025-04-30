import MainNavigation from "@/components/MainNavigation";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Truck, CircleDollarSign, Clock, Shield, FileCheck } from "lucide-react";
import { Link } from "wouter";

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <MainNavigation />
      
      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-primary to-blue-400 opacity-60 z-10"></div>
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/videos/logistics-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="absolute inset-0 bg-[url('/images/moving-dots.svg')] bg-repeat opacity-30 z-20"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-24 relative z-30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                {t("home.hero.title")}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                {t("home.hero.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/app">
                  <Button size="lg" className="font-medium text-base bg-white text-primary hover:bg-gray-100">
                    {t("app.cta")} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="font-medium text-base border-white text-white hover:bg-white/10">
                  {t("button.learn_more")}
                </Button>
              </div>
            </div>
            
            <div className="hidden md:block">
              <img 
                src="/images/truck-illustration.svg" 
                alt="Transportation Illustration" 
                className="w-full h-auto max-h-[400px] object-contain animate-bounce-slow" 
                style={{ animationDuration: '6s' }}
              />
            </div>
          </div>
        </div>
        
        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0 z-40">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full h-auto">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("home.section1.title")}</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.section1.step1")}</h3>
              <p className="text-gray-600">
                Choose between truck owner, cargo requester, or farmer based on your needs.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.section1.step2")}</h3>
              <p className="text-gray-600">
                List your truck or create a request specifying your cargo details and location.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("home.section1.step3")}</h3>
              <p className="text-gray-600">
                Get real-time updates on your cargo's location and estimated arrival time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose loopout.in?</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary mb-4">
                <Truck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.section2.reason1")}</h3>
              <p className="text-gray-600">
                We verify all truck owners and ensure they follow optimal routes for your cargo.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary mb-4">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.section2.reason2")}</h3>
              <p className="text-gray-600">
                Track your shipment in real-time and get instant notifications about its status.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary mb-4">
                <Shield className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("home.section2.reason3")}</h3>
              <p className="text-gray-600">
                Farmers get priority service with special rates and urgent handling of perishable goods.
              </p>
            </div>

            {/* Feature 4 - Insurance */}
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <div className="text-primary mb-4">
                <FileCheck className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Comprehensive Insurance</h3>
              <p className="text-gray-600">
                Every shipment is automatically covered by our insurance policy, protecting your goods against damage or loss during transit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t("home.testimonials.title")}</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center text-primary font-bold">
                  RP
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Rajesh Patel</h4>
                  <p className="text-sm text-gray-500">Farmer, Warangal</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "TruckConnect helped me transport my rice harvest during peak season when other options were unavailable. The priority service for farmers is a lifesaver!"
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center text-primary font-bold">
                  SK
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Sunita Khanna</h4>
                  <p className="text-sm text-gray-500">Business Owner, Hyderabad</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "We use TruckConnect for all our retail shipments now. The real-time tracking keeps our customers informed, and the pricing is very competitive."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg p-8 shadow-md border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="rounded-full w-12 h-12 bg-primary/20 flex items-center justify-center text-primary font-bold">
                  VP
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold">Venkatesh Prasad</h4>
                  <p className="text-sm text-gray-500">Truck Owner, Karimnagar</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "As a truck owner, I'm able to keep my vehicle running at full capacity thanks to the constant stream of cargo requests in my area."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-primary to-blue-600 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to simplify your transportation needs?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust TruckConnect for reliable transportation solutions.
            </p>
            <Link href="/app">
              <Button size="lg" className="font-medium text-base bg-white text-primary hover:bg-gray-100">
                {t("app.cta")} <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{t("app.title")}</h3>
              <p className="text-gray-400">
                {t("app.description")}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white">Home</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white">About</Link></li>
                <li><Link href="/investors" className="text-gray-400 hover:text-white">Investors</Link></li>
                <li><Link href="/partners" className="text-gray-400 hover:text-white">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">For Truck Owners</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">For Cargo Requesters</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">For Farmers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <address className="text-gray-400 not-italic">
                123 Transport Street<br />
                Hyderabad, Telangana 500001<br />
                India<br />
                <a href="mailto:info@truckconnect.in" className="hover:text-white">info@truckconnect.in</a>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 TruckConnect Telangana. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}