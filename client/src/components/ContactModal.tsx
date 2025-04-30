import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { X, Phone, MessageCircle } from "lucide-react";

export default function ContactModal() {
  try {
    const { currentContact, setContactModalOpen, contactModalOpen } = useUser();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);

    const handleClose = () => {
      setContactModalOpen(false);
    };

    const handleCopyNumber = () => {
      if (currentContact?.phone) {
        navigator.clipboard.writeText(currentContact.phone);
        setCopied(true);
        toast({
          title: "Copied",
          description: "Phone number copied to clipboard"
        });
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const handleSimulateCall = () => {
      toast({
        title: "Call Simulation",
        description: `Simulating call to ${currentContact?.name || "user"}`
      });
      setTimeout(() => {
        setContactModalOpen(false);
      }, 1000);
    };

    const handleSimulateSMS = () => {
      toast({
        title: "SMS Simulation",
        description: `Simulating SMS to ${currentContact?.name || "user"}`
      });
      setTimeout(() => {
        setContactModalOpen(false);
      }, 1000);
    };

    // Only render if the modal is supposed to be open
    if (!contactModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-sm w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Details</h3>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mb-4">
            <p className="text-gray-700 mb-2">You can contact this person directly at:</p>
            <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">{currentContact?.phone || "9876543210"}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopyNumber}
                className="text-primary text-sm"
              >
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          <div className="mt-6">
            <p className="text-gray-500 text-sm mb-4">This is a simulation. In a real app, you would be able to call or message directly.</p>
            <div className="flex space-x-2">
              <Button 
                className="flex-1" 
                onClick={handleSimulateCall}
              >
                <Phone className="h-4 w-4 mr-2" />
                Simulate Call
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-primary text-primary hover:bg-primary/5"
                onClick={handleSimulateSMS}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Simulate SMS
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    // If there's a context error, just return null - the modal won't be shown
    return null;
  }
}
