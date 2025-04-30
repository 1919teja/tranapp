import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { X, Phone, MessageCircle, Calendar, IndianRupee, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

export default function ContactModal() {
  try {
    const { currentContact, setContactModalOpen, contactModalOpen } = useUser();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState("1500");
    const [message, setMessage] = useState("");
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showScheduleDialog, setShowScheduleDialog] = useState(false);
    const [pickupDate, setPickupDate] = useState("");
    const [processing, setProcessing] = useState(false);

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

    const handleInitiatePayment = () => {
      setShowPaymentDialog(true);
    };

    const handleProcessPayment = () => {
      if (!paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Please enter a valid payment amount",
          variant: "destructive"
        });
        return;
      }

      setProcessing(true);
      
      // Simulate payment processing
      setTimeout(() => {
        setProcessing(false);
        setShowPaymentDialog(false);
        
        toast({
          title: "Payment Request Sent",
          description: `Payment request of ${formatCurrency(Number(paymentAmount))} sent to ${currentContact?.name}. You will be notified when they complete the payment.`,
        });
      }, 1500);
    };

    const handleSchedulePickup = () => {
      setShowScheduleDialog(true);
    };

    const handleConfirmSchedule = () => {
      if (!pickupDate) {
        toast({
          title: "Date Required",
          description: "Please select a pickup date",
          variant: "destructive"
        });
        return;
      }

      setProcessing(true);
      
      // Simulate schedule processing
      setTimeout(() => {
        setProcessing(false);
        setShowScheduleDialog(false);
        
        toast({
          title: "Pickup Scheduled",
          description: `Pickup has been scheduled for ${pickupDate}. Details sent to ${currentContact?.name}.`,
        });
        
        // Close main modal after scheduling
        setContactModalOpen(false);
      }, 1500);
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
            <div className="flex items-center mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <span className="text-primary font-semibold">
                  {currentContact?.name?.substring(0, 2).toUpperCase() || "TU"}
                </span>
              </div>
              <div>
                <h4 className="font-medium">{currentContact?.name || "User"}</h4>
                <p className="text-sm text-gray-500">Transport Partner</p>
              </div>
            </div>
            
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <div className="flex items-center justify-between">
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
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={handleSimulateCall}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={handleSimulateSMS}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  SMS
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={handleInitiatePayment}
                >
                  <IndianRupee className="h-4 w-4 mr-1" />
                  Payment
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center justify-center"
                  onClick={handleSchedulePickup}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Schedule
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <Label htmlFor="messageInput">Send a Message</Label>
            <Textarea
              id="messageInput"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[100px]"
            />
            <Button 
              className="w-full"
              disabled={!message.trim()}
              onClick={() => {
                toast({
                  title: "Message Sent",
                  description: "Your message has been sent successfully"
                });
                setMessage("");
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
        
        {/* Payment Dialog */}
        <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Send Payment Request</DialogTitle>
              <DialogDescription>
                Enter the amount you want to request for your services.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="paymentAmount">Amount (₹)</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="paymentAmount"
                    className="pl-9"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    type="number"
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="paymentNote">Note (Optional)</Label>
                <Textarea
                  id="paymentNote"
                  placeholder="Add a note about this payment..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleProcessPayment} disabled={processing}>
                {processing ? "Processing..." : "Send Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Schedule Dialog */}
        <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Schedule Pickup</DialogTitle>
              <DialogDescription>
                Select a date and time for the cargo pickup.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="pickupDate">Pickup Date</Label>
                <Input
                  id="pickupDate"
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pickupTime">Pickup Time</Label>
                <Input
                  id="pickupTime"
                  type="time"
                  defaultValue="09:00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scheduleNote">Additional Instructions</Label>
                <Textarea
                  id="scheduleNote"
                  placeholder="Add any special instructions for pickup..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmSchedule} disabled={processing}>
                {processing ? "Processing..." : "Confirm Schedule"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  } catch (error) {
    // If there's a context error, just return null - the modal won't be shown
    return null;
  }
}
