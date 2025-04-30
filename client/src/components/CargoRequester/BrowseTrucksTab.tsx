import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Truck, MapPin, Calendar, IndianRupee, MapPinned, Route as RouteIcon, CheckCircle } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import TripTracker from "@/components/TripTracker";

export default function BrowseTrucksTab() {
  const { user, setContactModalOpen, setCurrentContact } = useUser();
  const { toast } = useToast();
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [bookingDetails, setBookingDetails] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    date: "",
    cargo: "",
    weight: "1",
    notes: ""
  });
  const [fareEstimate, setFareEstimate] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showTrackingUI, setShowTrackingUI] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");

  // Query to get all available trucks
  const { data: trucks, isLoading } = useQuery({
    queryKey: ['/api/trucks'],
    queryFn: async () => {
      const res = await fetch('/api/trucks');
      if (!res.ok) throw new Error('Failed to fetch trucks');
      return res.json();
    },
  });

  const handleStartBooking = (truck: any) => {
    setSelectedTruck(truck);
    setBookingStep(1);
    setBookingDetails({
      pickupLocation: "",
      deliveryLocation: "",
      date: new Date().toISOString().split('T')[0],
      cargo: "",
      weight: "1",
      notes: ""
    });
    setShowBookingDialog(true);
  };

  const calculateFare = () => {
    if (!selectedTruck) return;
    
    // Generate a realistic fare based on truck type and capacity
    const baseFare = selectedTruck.truckType === "mini" ? 800 : 
                     selectedTruck.truckType === "light" ? 1500 :
                     selectedTruck.truckType === "medium" ? 2500 :
                     selectedTruck.truckType === "heavy" ? 4000 : 5000;
    
    // Add some randomness and consider the weight
    const weightMultiplier = Number(bookingDetails.weight) || 1;
    const distanceEstimate = Math.floor(Math.random() * 100) + 10; // km
    
    const calculatedFare = Math.round(baseFare + (weightMultiplier * 100) + (distanceEstimate * 10));
    setFareEstimate(calculatedFare);
    
    setBookingStep(2);
  };
  
  const handleContinueToPayment = () => {
    setBookingStep(3);
  };
  
  const handlePayment = () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setBookingStep(4);
      
      // Generate a random booking confirmation code
      const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      setConfirmationCode(randomCode);
      
      // Actually submit the request to the API
      submitBookingRequest(randomCode);
    }, 1500);
  };
  
  const submitBookingRequest = async (bookingCode: string) => {
    if (!user || !selectedTruck) return;
    
    try {
      const cargoData = {
        userId: user.id,
        title: bookingDetails.cargo || "Transport Request",
        pickupLocation: bookingDetails.pickupLocation,
        deliveryLocation: bookingDetails.deliveryLocation,
        description: bookingDetails.notes || "Booking #" + bookingCode,
        weight: Number(bookingDetails.weight) || 1,
        date: bookingDetails.date,
        status: "confirmed"
      };

      await apiRequest("POST", "/api/cargo-requests", cargoData);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/cargo-requests/user', user.id] });
    } catch (error) {
      console.error("Failed to create booking record:", error);
    }
  };
  
  const handleBookingComplete = () => {
    toast({
      title: "Booking Confirmed",
      description: `Your booking (#${confirmationCode}) has been confirmed. Starting trip tracking...`,
    });
    
    setShowBookingDialog(false);
    setBookingStep(0);
    setShowTrackingUI(true);
  };
  
  const handleContactDriver = () => {
    if (!selectedTruck) return;
    
    setCurrentContact({
      phone: "9876543210", // In a real app, this would be the driver's contact
      name: `Driver (${selectedTruck.registrationNumber})`
    });
    setContactModalOpen(true);
    setShowBookingDialog(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Available Trucks</h3>
          <div className="h-6 w-24 bg-gray-200 animate-pulse rounded-full"></div>
        </div>
        <div className="mt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const availableTrucks = trucks || [];

  return (
    <div>
      {showTrackingUI && selectedTruck ? (
        <div className="pt-4">
          <TripTracker
            tripId={confirmationCode}
            vehicleType={
              selectedTruck.truckType === "mini" ? "Mini Truck" :
              selectedTruck.truckType === "light" ? "Light Commercial Truck" :
              selectedTruck.truckType === "medium" ? "Medium Duty Truck" :
              selectedTruck.truckType === "heavy" ? "Heavy Duty Truck" :
              "Tractor with Trailer"
            }
            driverName={`Driver ${selectedTruck.registrationNumber.substring(0, 4)}`}
            pickupLocation={bookingDetails.pickupLocation}
            deliveryLocation={bookingDetails.deliveryLocation}
            estimatedTime={(Math.floor(Math.random() * 30) + 15) + " minutes"}
            fare={fareEstimate || 0}
            onClose={() => setShowTrackingUI(false)}
            onContactDriver={handleContactDriver}
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Available Trucks</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {availableTrucks.length} Available
              </Badge>
            </div>
          </div>

          {availableTrucks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Truck className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No Trucks Available</h3>
              <p className="text-gray-500 mt-1">Check back later for available trucks.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableTrucks.map((truck) => (
                <div key={truck.id} className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">
                      {truck.truckType === "mini" && "Mini Truck"}
                      {truck.truckType === "light" && "Light Commercial Truck"}
                      {truck.truckType === "medium" && "Medium Duty Truck"}
                      {truck.truckType === "heavy" && "Heavy Duty Truck"}
                      {truck.truckType === "tractor" && "Tractor with Trailer"}
                    </h4>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {truck.farmerFriendly ? "Farmer-Friendly" : "Available"}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">Type:</p>
                      <p className="font-medium">
                        {truck.truckType === "mini" && "Mini Truck"}
                        {truck.truckType === "light" && "Light Commercial"}
                        {truck.truckType === "medium" && "Medium Duty"}
                        {truck.truckType === "heavy" && "Heavy Duty"}
                        {truck.truckType === "tractor" && "Tractor with Trailer"} ({truck.capacity} Ton)
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location:</p>
                      <p className="font-medium">{truck.location}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Reg. Number:</p>
                      <p className="font-medium">{truck.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Est. Fare:</p>
                      <p className="font-medium">{formatCurrency(truck.capacity * 200)}/trip</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={() => handleStartBooking(truck)}>
                      Book Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Booking Dialog - Multi-step form similar to Uber/Rapido */}
      <Dialog open={showBookingDialog} onOpenChange={(open) => {
        if (!open) {
          setBookingStep(0);
        }
        setShowBookingDialog(open);
      }}>
        <DialogContent className="sm:max-w-[500px]">
          {/* Step 1: Enter booking details */}
          {bookingStep === 1 && (
            <>
              <DialogHeader>
                <DialogTitle>Book Transport</DialogTitle>
                <DialogDescription>
                  Enter your transport details to book this truck
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="pickupLocation">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="pickupLocation"
                      className="pl-9"
                      value={bookingDetails.pickupLocation}
                      onChange={(e) => setBookingDetails({...bookingDetails, pickupLocation: e.target.value})}
                      placeholder="Enter pickup address"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="deliveryLocation">Delivery Location</Label>
                  <div className="relative">
                    <MapPinned className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="deliveryLocation"
                      className="pl-9"
                      value={bookingDetails.deliveryLocation}
                      onChange={(e) => setBookingDetails({...bookingDetails, deliveryLocation: e.target.value})}
                      placeholder="Enter delivery address"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="date"
                        type="date"
                        className="pl-9"
                        value={bookingDetails.date}
                        onChange={(e) => setBookingDetails({...bookingDetails, date: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Cargo Weight (Tons)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={bookingDetails.weight}
                      onChange={(e) => setBookingDetails({...bookingDetails, weight: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cargo">Cargo Description</Label>
                  <Input
                    id="cargo"
                    value={bookingDetails.cargo}
                    onChange={(e) => setBookingDetails({...bookingDetails, cargo: e.target.value})}
                    placeholder="What are you transporting?"
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={bookingDetails.notes}
                    onChange={(e) => setBookingDetails({...bookingDetails, notes: e.target.value})}
                    placeholder="Any special instructions?"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={calculateFare}
                  disabled={!bookingDetails.pickupLocation || !bookingDetails.deliveryLocation}
                >
                  Continue
                </Button>
              </DialogFooter>
            </>
          )}
          
          {/* Step 2: Review fare estimate */}
          {bookingStep === 2 && (
            <>
              <DialogHeader>
                <DialogTitle>Review Fare Estimate</DialogTitle>
                <DialogDescription>
                  Review the estimated cost for your transport
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-3">
                    <RouteIcon className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{bookingDetails.pickupLocation} → {bookingDetails.deliveryLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{bookingDetails.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-primary mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">
                        {selectedTruck.truckType === "mini" && "Mini Truck"}
                        {selectedTruck.truckType === "light" && "Light Commercial"}
                        {selectedTruck.truckType === "medium" && "Medium Duty"}
                        {selectedTruck.truckType === "heavy" && "Heavy Duty"}
                        {selectedTruck.truckType === "tractor" && "Tractor with Trailer"} ({selectedTruck.capacity} Ton)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-b py-4 my-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Base fare</span>
                    <span>{formatCurrency(Math.round(fareEstimate! * 0.7))}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Distance charge</span>
                    <span>{formatCurrency(Math.round(fareEstimate! * 0.2))}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-700">Weight charge</span>
                    <span>{formatCurrency(Math.round(fareEstimate! * 0.1))}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold">Total Fare</span>
                  <span className="text-lg font-semibold text-primary">{formatCurrency(fareEstimate!)}</span>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  This is an estimated fare. The final fare may vary based on actual route taken and additional charges if any.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBookingStep(1)}>
                  Back
                </Button>
                <Button onClick={handleContinueToPayment}>
                  Continue to Payment
                </Button>
              </DialogFooter>
            </>
          )}
          
          {/* Step 3: Payment selection */}
          {bookingStep === 3 && (
            <>
              <DialogHeader>
                <DialogTitle>Select Payment Method</DialogTitle>
                <DialogDescription>
                  Choose how you'd like to pay for this trip
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-lg font-semibold text-primary">{formatCurrency(fareEstimate!)}</span>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer ${paymentMethod === "cash" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${paymentMethod === "cash" ? "border-primary" : "border-gray-300"} flex items-center justify-center mr-3`}>
                        {paymentMethod === "cash" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay with cash when the truck arrives</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer ${paymentMethod === "upi" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${paymentMethod === "upi" ? "border-primary" : "border-gray-300"} flex items-center justify-center mr-3`}>
                        {paymentMethod === "upi" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                      </div>
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-gray-500">Pay using UPI apps like GPay, PhonePe, etc.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${paymentMethod === "card" ? "border-primary" : "border-gray-300"} flex items-center justify-center mr-3`}>
                        {paymentMethod === "card" && <div className="w-3 h-3 rounded-full bg-primary"></div>}
                      </div>
                      <div>
                        <p className="font-medium">Credit/Debit Card</p>
                        <p className="text-sm text-gray-500">Pay securely with your card</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBookingStep(2)}>
                  Back
                </Button>
                <Button onClick={handlePayment} disabled={processing}>
                  {processing ? "Processing..." : "Confirm & Pay"}
                </Button>
              </DialogFooter>
            </>
          )}
          
          {/* Step 4: Booking confirmation */}
          {bookingStep === 4 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-green-600">Booking Confirmed!</DialogTitle>
              </DialogHeader>
              
              <div className="py-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Booking #{confirmationCode}</h3>
                <p className="text-gray-600 mb-6">Your transport has been booked successfully.</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4 text-left">
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">From:</p>
                      <p className="font-medium">{bookingDetails.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">To:</p>
                      <p className="font-medium">{bookingDetails.deliveryLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date:</p>
                      <p className="font-medium">{bookingDetails.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Truck:</p>
                      <p className="font-medium">{selectedTruck.registrationNumber}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment:</p>
                      <p className="font-medium capitalize">{paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount:</p>
                      <p className="font-medium">{formatCurrency(fareEstimate!)}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">
                  Driver details will be sent to you shortly. You can contact the driver directly once assigned.
                </p>
              </div>
              
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button 
                  variant="outline" 
                  className="sm:flex-1"
                  onClick={handleContactDriver}
                >
                  Contact Driver
                </Button>
                <Button 
                  className="sm:flex-1"
                  onClick={handleBookingComplete}
                >
                  Done
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
