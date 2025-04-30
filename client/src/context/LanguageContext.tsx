import { createContext, useContext, useState, ReactNode } from "react";

type Language = "english" | "telugu" | "hindi" | "tamil";

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for different languages
type TranslationsType = Record<Language, Record<string, string>>;

const translations: TranslationsType = {
  english: {
    "app.title": "TruckConnect",
    "app.language": "Language",
    "app.select_user_type": "Choose Your Role",
    "app.tagline": "Connecting Farmers & Businesses with Reliable Transport",
    "app.description": "A logistics platform that connects truck owners with cargo requesters and farmers for efficient transportation solutions.",
    "app.cta": "Get Started",
    
    "user.truck_owner": "Truck Owner",
    "user.cargo_requester": "Cargo Requester",
    "user.farmer": "Farmer (Rythu Suvidha)",
    
    "truck.list_title": "Available Trucks",
    "truck.capacity": "Capacity",
    "truck.location": "Location",
    "truck.book_now": "Book Now",
    
    "cargo.post_title": "Post Cargo Request",
    "cargo.my_requests": "My Requests",
    
    "farmer.urgent_request": "Urgent Request",
    
    "button.submit": "Submit",
    "button.cancel": "Cancel",
    "button.book": "Book",
    "button.contact": "Contact Driver",
    "button.logout": "Logout",
    "button.learn_more": "Learn More",
    
    "trip.status": "Trip Status",
    "trip.estimated_arrival": "Estimated Arrival",
    "trip.pickup": "Pickup",
    "trip.delivery": "Delivery",
    "trip.driver": "Driver",
    "trip.fare": "Fare",
    "trip.track": "Track Trip",
    "trip.completed": "Completed",
    "trip.in_progress": "In Progress",
    "trip.not_started": "Not Started",
    
    "error.general": "An error occurred. Please try again.",
    
    "login.success": "Successfully logged in",
    
    "logout.success": "Successfully logged out",
    "logout.message": "You have been logged out of your account",
    
    "nav.home": "Home",
    "nav.about": "About",
    "nav.investors": "Investors",
    "nav.partners": "Partners",
    
    "home.hero.title": "Fast, Reliable Transportation Solutions",
    "home.hero.subtitle": "Connect with trucks nearby for all your cargo needs",
    "home.section1.title": "How It Works",
    "home.section1.step1": "Select your user type",
    "home.section1.step2": "Post your request or find available trucks",
    "home.section1.step3": "Book a truck and track your shipment",
    "home.section2.title": "Why Choose TruckConnect?",
    "home.section2.reason1": "Reliable truck owners and verified routes",
    "home.section2.reason2": "Real-time tracking and updates",
    "home.section2.reason3": "Priority service for farmers",
    "home.testimonials.title": "What Our Users Say",
    
    "about.title": "About TruckConnect",
    "about.mission": "Our Mission",
    "about.vision": "Our Vision",
    "about.team": "Our Team",
    
    "partners.title": "Our Partners",
    "partners.description": "Working together to provide the best transportation solutions",
    
    "investors.title": "Investors",
    "investors.description": "Backing our mission to transform rural transportation"
  },
  telugu: {
    "app.title": "ట్రక్ కనెక్ట్",
    "app.language": "భాష",
    "app.select_user_type": "మీ పాత్రను ఎంచుకోండి",
    "user.truck_owner": "ట్రక్ యజమాని",
    "user.cargo_requester": "కార్గో అభ్యర్థిదారు",
    "user.farmer": "రైతు (రైతు సువిధ)",
    "truck.list_title": "అందుబాటులో ఉన్న ట్రక్కులు",
    "truck.capacity": "సామర్థ్యం",
    "truck.location": "ప్రాంతం",
    "truck.book_now": "ఇప్పుడే బుక్ చేయండి",
    "cargo.post_title": "కార్గో అభ్యర్థన పోస్ట్ చేయండి",
    "cargo.my_requests": "నా అభ్యర్థనలు",
    "farmer.urgent_request": "అత్యవసర అభ్యర్థన",
    "button.submit": "సమర్పించు",
    "button.cancel": "రద్దు చేయండి",
    "button.book": "బుక్",
    "button.contact": "డ్రైవర్‌ని సంప్రదించండి",
    "trip.status": "ట్రిప్ స్థితి",
    "trip.estimated_arrival": "అంచనా రాక",
    "trip.pickup": "పికప్",
    "trip.delivery": "డెలివరీ",
    "trip.driver": "డ్రైవర్",
    "trip.fare": "ట్రిప్ ఛార్జీ",
    "trip.track": "ట్రిప్ ట్రాక్ చేయండి",
    "trip.completed": "పూర్తయింది",
    "trip.in_progress": "ప్రగతిలో ఉంది",
    "trip.not_started": "ప్రారంభించలేదు",
    "error.general": "లోపం సంభవించింది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    "login.success": "విజయవంతంగా లాగిన్ అయ్యారు",
    "logout.success": "విజయవంతంగా లాగ్ అవుట్ అయ్యారు"
  },
  hindi: {
    "app.title": "ट्रक कनेक्ट",
    "app.language": "भाषा",
    "app.select_user_type": "अपनी भूमिका चुनें",
    "user.truck_owner": "ट्रक मालिक",
    "user.cargo_requester": "कार्गो अनुरोधकर्ता",
    "user.farmer": "किसान (किसान सुविधा)",
    "truck.list_title": "उपलब्ध ट्रक",
    "truck.capacity": "क्षमता",
    "truck.location": "स्थान",
    "truck.book_now": "अभी बुक करें",
    "cargo.post_title": "कार्गो अनुरोध पोस्ट करें",
    "cargo.my_requests": "मेरे अनुरोध",
    "farmer.urgent_request": "तत्काल अनुरोध",
    "button.submit": "जमा करें",
    "button.cancel": "रद्द करें",
    "button.book": "बुक करें",
    "button.contact": "ड्राइवर से संपर्क करें",
    "trip.status": "यात्रा की स्थिति",
    "trip.estimated_arrival": "अनुमानित आगमन",
    "trip.pickup": "पिकअप",
    "trip.delivery": "डिलीवरी",
    "trip.driver": "ड्राइवर",
    "trip.fare": "किराया",
    "trip.track": "यात्रा को ट्रैक करें",
    "trip.completed": "पूरा हुआ",
    "trip.in_progress": "प्रगति में है",
    "trip.not_started": "शुरू नहीं हुआ",
    "error.general": "एक त्रुटि हुई। कृपया पुन: प्रयास करें।",
    "login.success": "सफलतापूर्वक लॉग इन किया गया",
    "logout.success": "सफलतापूर्वक लॉग आउट किया गया"
  },
  tamil: {
    "app.title": "டிரக் கனெக்ட்",
    "app.language": "மொழி",
    "app.select_user_type": "உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்",
    "user.truck_owner": "லாரி உரிமையாளர்",
    "user.cargo_requester": "சரக்கு கோரிக்கையாளர்",
    "user.farmer": "விவசாயி (விவசாயி சேவை)",
    "truck.list_title": "கிடைக்கக்கூடிய லாரிகள்",
    "truck.capacity": "திறன்",
    "truck.location": "இருப்பிடம்",
    "truck.book_now": "இப்போது புக் செய்யுங்கள்",
    "cargo.post_title": "சரக்கு கோரிக்கையை பதிவு செய்யுங்கள்",
    "cargo.my_requests": "எனது கோரிக்கைகள்",
    "farmer.urgent_request": "அவசர கோரிக்கை",
    "button.submit": "சமர்ப்பி",
    "button.cancel": "ரத்து செய்",
    "button.book": "புக் செய்",
    "button.contact": "டிரைவரை தொடர்பு கொள்ளுங்கள்",
    "trip.status": "பயண நிலை",
    "trip.estimated_arrival": "மதிப்பிடப்பட்ட வருகை",
    "trip.pickup": "பிக்கப்",
    "trip.delivery": "டெலிவரி",
    "trip.driver": "டிரைவர்",
    "trip.fare": "கட்டணம்",
    "trip.track": "பயணத்தை கண்காணிக்க",
    "trip.completed": "முடிந்தது",
    "trip.in_progress": "முன்னேற்றத்தில்",
    "trip.not_started": "தொடங்கவில்லை",
    "error.general": "பிழை ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்.",
    "login.success": "வெற்றிகரமாக உள்நுழைந்தது",
    "logout.success": "வெற்றிகரமாக வெளியேறியது"
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("english");

  // Translation function
  const t = (key: string): string => {
    if (!translations[language][key]) {
      console.warn(`Translation key "${key}" missing for language "${language}"`);
      return key;
    }
    return translations[language][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}