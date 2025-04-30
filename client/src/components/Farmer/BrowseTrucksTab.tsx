import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Truck, MapPin, Calendar, IndianRupee, MapPinned, 
  Route as RouteIcon, CheckCircle, Leaf, AlertCircle 
} from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import TripTracker from "@/components/TripTracker";
import { Truck as TruckType } from "@shared/schema";

export default function BrowseTrucksTab() {
  const { user, setContactModalOpen, setCurrentContact } = useUser();
  const { toast } = useToast();
  const [selectedTruck, setSelectedTruck] = useState<any>(null);
  const [bookingStep, setBookingStep] = useState<number>(0);
  const [bookingDetails, setBookingDetails] = useState({
    pickupLocation: "",
    deliveryLocation: "",
    pickupDate: "",
    cropType: "",
    weight: "1",
    urgency: "standard",
    notes: ""
  });
  const [fareEstimate, setFareEstimate] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [showTrackingUI, setShowTrackingUI] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string>("");
  const [showSubsidyApplied, setShowSubsidyApplied] = useState(false);

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
      pickupDate: new Date().toISOString().split('T')[0],
      cropType: "",
      weight: "1",
      urgency: "standard",
      notes: ""
    });
    setShowBookingDialog(true);
    setShowSubsidyApplied(false);
  };

  const calculateFare = () => {
    if (!selectedTruck) return;
    
    // Calculate farmer-specific fare with discounts for farmer-friendly trucks
    const baseFare = selectedTruck.truckType === "mini" ? 700 : 
                     selectedTruck.truckType === "light" ? 1200 :
                     selectedTruck.truckType === "medium" ? 2000 :
                     selectedTruck.truckType === "heavy" ? 3500 : 4500;
    
    // Add some randomness and consider the weight and urgency
    const weightMultiplier = Number(bookingDetails.weight) || 1;
    const distanceEstimate = Math.floor(Math.random() * 80) + 10; // km
    
    let calculatedFare = Math.round(baseFare + (weightMultiplier * 80) + (distanceEstimate * 8));
    
    // Apply urgency multiplier
    if (bookingDetails.urgency === "same_day") {
      calculatedFare = Math.round(calculatedFare * 1.3);
    } else if (bookingDetails.urgency === "immediate") {
      calculatedFare = Math.round(calculatedFare * 1.5);
    }
    
    // Apply farmer-friendly discount
    if (selectedTruck.farmerFriendly) {
      calculatedFare = Math.round(calculatedFare * 0.8); // 20% discount
      setShowSubsidyApplied(true);
    }
    
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
      const randomCode = "F" + Math.random().toString(36).substring(2, 7).toUpperCase();
      setConfirmationCode(randomCode);
      
      // Submit the request to the API
      submitBookingRequest(randomCode);
    }, 1500);
  };
  
  const submitBookingRequest = async (bookingCode: string) => {
    if (!user || !selectedTruck) return;
    
    try {
      console.log("Submitting booking request for user:", user);
      
      const requestData = {
        userId: user.id,
        farmerName: user.username,
        pickupLocation: bookingDetails.pickupLocation,
        deliveryLocation: bookingDetails.deliveryLocation,
        cropType: bookingDetails.cropType || "Mixed Produce",
        urgency: bookingDetails.urgency,
        weight: Number(bookingDetails.weight) || 1,
        status: "confirmed",
        assignedTruckId: selectedTruck.id,
        pickupTime: bookingDetails.pickupDate + " (Code: " + bookingCode + ")"
      };

      console.log("Sending booking request data:", requestData);
      
      const response = await apiRequest("POST", "/api/farmer-requests", requestData);
      console.log("Booking request response:", response);
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-requests/user', user.id] });
      
      // Fetch the updated data immediately to ensure UI reflects the change
      const updatedRequests = await fetch(`/api/farmer-requests/user/${user.id}`);
      const requestsData = await updatedRequests.json();
      console.log("Updated farmer requests:", requestsData);
      
      // Show confirmation message
      toast({
        title: "Booking Created Successfully",
        description: `Your booking #${bookingCode} has been saved and is now visible in My Requests`,
        variant: "default"
      });
      
    } catch (error) {
      console.error("Failed to create booking record:", error);
      
      // Show error message
      toast({
        title: "Booking Failed",
        description: "There was an error saving your booking. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleBookingComplete = () => {
    toast({
      title: "Farmer Transport Booked",
      description: `Your priority booking (#${confirmationCode}) has been confirmed. Starting trip tracking...`,
    });
    
    setShowBookingDialog(false);
    setBookingStep(0);
    setShowTrackingUI(true);
  };
  
  const handleContactDriver = () => {
    if (!selectedTruck) return;
    
    setCurrentContact({
      phone: "9876543210", // In a real app, this would be the driver's contact
      name: `Farmer-Priority Driver (${selectedTruck.registrationNumber})`
    });
    setContactModalOpen(true);
    setShowBookingDialog(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Priority Trucks For Farmers</h3>
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

  // Filter trucks and prioritize farmer-friendly ones
  const availableTrucks = (trucks || []).sort((a: TruckType, b: TruckType) => {
    if (a.farmerFriendly && !b.farmerFriendly) return -1;
    if (!a.farmerFriendly && b.farmerFriendly) return 1;
    return 0;
  });

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
            driverName={`Farmer-Priority Driver (${selectedTruck.registrationNumber.substring(0, 4)})`}
            pickupLocation={bookingDetails.pickupLocation}
            deliveryLocation={bookingDetails.deliveryLocation}
            estimatedTime={
              bookingDetails.urgency === "immediate" 
                ? "15-30 minutes" 
                : bookingDetails.urgency === "same_day" 
                  ? "1-3 hours" 
                  : "24-48 hours"
            }
            fare={fareEstimate || 0}
            onClose={() => setShowTrackingUI(false)}
            onContactDriver={handleContactDriver}
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Priority Trucks For Farmers</h3>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {availableTrucks.length} Available
              </Badge>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              <Leaf className="inline-block h-4 w-4 text-green-600 mr-1" /> 
              Farmer-friendly trucks offer discounted rates and priority service
            </p>
          </div>

          {availableTrucks.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <Truck className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No Trucks Available</h3>
              <p className="text-gray-500 mt-1">Check back later for available trucks.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {availableTrucks.map((truck: TruckType) => (
                <div 
                  key={truck.id} 
                  className={`bg-white rounded-lg shadow-md p-4 ${truck.farmerFriendly ? 'border-l-4 border-green-600' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">
                      {truck.truckType === "mini" && "Mini Truck"}
                      {truck.truckType === "light" && "Light Commercial Truck"}
                      {truck.truckType === "medium" && "Medium Duty Truck"}
                      {truck.truckType === "heavy" && "Heavy Duty Truck"}
                      {truck.truckType === "tractor" && "Tractor with Trailer"}
                    </h4>
                    <div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Available
                      </Badge>
                      {truck.farmerFriendly && (
                        <Badge className="ml-1 bg-green-600">
                          <Leaf className="h-3 w-3 mr-1" /> Farmer-Friendly
                        </Badge>
                      )}
                    </div>
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
                      <p className="text-gray-500">Est. Fare:</p>
                      <p className="font-medium">
                        {truck.farmerFriendly ? (
                          <span className="text-green-600 flex items-center">
                            {formatCurrency(truck.capacity * 160)}/trip
                            <span className="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded">-20%</span>
                          </span>
                        ) : (
                          formatCurrency(truck.capacity * 200) + "/trip"
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Priority:</p>
                      <p className="font-medium">
                        {truck.farmerFriendly ? (
                          <span className="text-green-600">High Priority</span>
                        ) : (
                          "Standard"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button 
                      className={`${truck.farmerFriendly ? 'bg-green-600 hover:bg-green-700' : 'bg-secondary hover:bg-secondary/90'}`}
                      onClick={() => handleStartBooking(truck)}
                    >
                      Book Priority Transport
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Farmer Booking Dialog - Multi-step form */}
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
                <DialogTitle>Book Farmer Priority Transport</DialogTitle>
                <DialogDescription>
                  Enter your transport details to book this truck with priority
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="pickupLocation">Farm Location (Pickup)</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="pickupLocation"
                      className="pl-9"
                      value={bookingDetails.pickupLocation}
                      onChange={(e) => setBookingDetails({...bookingDetails, pickupLocation: e.target.value})}
                      placeholder="Enter your farm address"
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
                      placeholder="Enter market or delivery address"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="pickupDate">Pickup Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="pickupDate"
                        type="date"
                        className="pl-9"
                        value={bookingDetails.pickupDate}
                        onChange={(e) => setBookingDetails({...bookingDetails, pickupDate: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="weight">Crop Weight (Tons)</Label>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Input
                      id="cropType"
                      value={bookingDetails.cropType}
                      onChange={(e) => setBookingDetails({...bookingDetails, cropType: e.target.value})}
                      placeholder="e.g., Rice, Wheat, Vegetables"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="urgency">Urgency Level</Label>
                    <Select 
                      value={bookingDetails.urgency} 
                      onValueChange={(value) => setBookingDetails({...bookingDetails, urgency: value})}
                    >
                      <SelectTrigger id="urgency">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard (Within 48h)</SelectItem>
                        <SelectItem value="same_day">Same Day (+30%)</SelectItem>
                        <SelectItem value="immediate">Immediate (+50%)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={bookingDetails.notes}
                    onChange={(e) => setBookingDetails({...bookingDetails, notes: e.target.value})}
                    placeholder="Any special instructions for the driver?"
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
                  className={selectedTruck?.farmerFriendly ? "bg-green-600 hover:bg-green-700" : ""}
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
                  Review the estimated cost for your priority transport
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6">
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="flex items-center mb-3">
                    <RouteIcon className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Route</p>
                      <p className="font-medium">{bookingDetails.pickupLocation} → {bookingDetails.deliveryLocation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <Calendar className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{bookingDetails.pickupDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-3">
                    <AlertCircle className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Urgency</p>
                      <p className="font-medium">
                        {bookingDetails.urgency === "standard" ? "Standard (Within 48h)" : 
                         bookingDetails.urgency === "same_day" ? "Same Day (+30%)" : 
                         "Immediate (+50%)"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-green-600 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Vehicle</p>
                      <p className="font-medium">
                        {selectedTruck.truckType === "mini" && "Mini Truck"}
                        {selectedTruck.truckType === "light" && "Light Commercial"}
                        {selectedTruck.truckType === "medium" && "Medium Duty"}
                        {selectedTruck.truckType === "heavy" && "Heavy Duty"}
                        {selectedTruck.truckType === "tractor" && "Tractor with Trailer"} ({selectedTruck.capacity} Ton)
                        {selectedTruck.farmerFriendly && " - Farmer-Friendly"}
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
                  
                  {/* Show urgency surcharge if applicable */}
                  {bookingDetails.urgency !== "standard" && (
                    <div className="flex justify-between items-center mt-2 text-amber-600">
                      <span>{bookingDetails.urgency === "same_day" ? "Same-day surcharge" : "Immediate surcharge"}</span>
                      <span>+{bookingDetails.urgency === "same_day" ? "30%" : "50%"}</span>
                    </div>
                  )}
                  
                  {/* Show subsidy if farmer-friendly truck */}
                  {showSubsidyApplied && (
                    <div className="flex justify-between items-center mt-2 text-green-600 font-medium">
                      <span>Farmer subsidy discount</span>
                      <span>-20%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-semibold">Total Fare</span>
                  <span className={`text-lg font-semibold ${showSubsidyApplied ? "text-green-600" : "text-primary"}`}>
                    {formatCurrency(fareEstimate!)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mt-2">
                  This is an estimated fare. The final fare may vary based on actual route taken and additional charges if any.
                </p>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBookingStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={handleContinueToPayment}
                  className={selectedTruck?.farmerFriendly ? "bg-green-600 hover:bg-green-700" : ""}
                >
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
                  Choose how you'd like to pay for this priority transport
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className={`text-lg font-semibold ${showSubsidyApplied ? "text-green-600" : "text-primary"}`}>
                    {formatCurrency(fareEstimate!)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer ${paymentMethod === "cash" ? "border-green-600 bg-green-50" : ""}`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${paymentMethod === "cash" ? "border-green-600" : "border-gray-300"} flex items-center justify-center mr-3`}>
                        {paymentMethod === "cash" && <div className="w-3 h-3 rounded-full bg-green-600"></div>}
                      </div>
                      <div>
                        <p className="font-medium">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay with cash when the truck arrives at your farm</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer ${paymentMethod === "kisan_credit" ? "border-green-600 bg-green-50" : ""}`}
                    onClick={() => setPaymentMethod("kisan_credit")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${paymentMethod === "kisan_credit" ? "border-green-600" : "border-gray-300"} flex items-center justify-center mr-3`}>
                        {paymentMethod === "kisan_credit" && <div className="w-3 h-3 rounded-full bg-green-600"></div>}
                      </div>
                      <div>
                        <p className="font-medium">Kisan Credit Card</p>
                        <p className="text-sm text-gray-500">Pay using your Kisan Credit Card</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-3 cursor-pointer ${paymentMethod === "upi" ? "border-green-600 bg-green-50" : ""}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border ${paymentMethod === "upi" ? "border-green-600" : "border-gray-300"} flex items-center justify-center mr-3`}>
                        {paymentMethod === "upi" && <div className="w-3 h-3 rounded-full bg-green-600"></div>}
                      </div>
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-gray-500">Pay using UPI apps like GPay, PhonePe, etc.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setBookingStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={handlePayment} 
                  disabled={processing}
                  className={selectedTruck?.farmerFriendly ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {processing ? "Processing..." : "Confirm & Pay"}
                </Button>
              </DialogFooter>
            </>
          )}
          
          {/* Step 4: Booking confirmation */}
          {bookingStep === 4 && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-green-600">Farmer Priority Booking Confirmed!</DialogTitle>
              </DialogHeader>
              
              <div className="py-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-2">Booking #{confirmationCode}</h3>
                <p className="text-gray-600 mb-6">Your priority transport has been booked successfully.</p>
                
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
                      <p className="font-medium">{bookingDetails.pickupDate}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Crop:</p>
                      <p className="font-medium">{bookingDetails.cropType || "Mixed Produce"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment:</p>
                      <p className="font-medium capitalize">
                        {paymentMethod === "kisan_credit" ? "Kisan Credit Card" : paymentMethod}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Amount:</p>
                      <p className="font-medium">{formatCurrency(fareEstimate!)}</p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">
                  Driver details will be sent to you shortly. You can contact the driver directly for coordination.
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
                  className={`sm:flex-1 ${selectedTruck?.farmerFriendly ? "bg-green-600 hover:bg-green-700" : ""}`}
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
