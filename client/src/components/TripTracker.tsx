import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { 
  Truck, MapPin, MapPinned, Route as RouteIcon, Clock, IndianRupee, 
  Phone, X, CheckCircle2, AlertCircle, Timer, TruckIcon, Package, ShieldCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TripTrackerProps {
  tripId: string;
  vehicleType: string;
  driverName: string;
  pickupLocation: string;
  deliveryLocation: string;
  estimatedTime: string;
  fare: number;
  onClose: () => void;
  onContactDriver: () => void;
}

// Format time like "1h 20m" or "45m"
const formatTimeRemaining = (minutes: number): string => {
  if (minutes <= 0) return "0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

// Calculate a timestamp in the format "10:45 AM" based on minutes from now
const calculateETA = (minutesFromNow: number): string => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesFromNow);
  return now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true
  });
};

export default function TripTracker({
  tripId,
  vehicleType,
  driverName,
  pickupLocation,
  deliveryLocation,
  estimatedTime,
  fare,
  onClose,
  onContactDriver
}: TripTrackerProps) {
  const [tripProgress, setTripProgress] = useState(0);
  const [tripStatus, setTripStatus] = useState<string>("Booking Confirmed");
  const [statusDescription, setStatusDescription] = useState<string>("Driver is being assigned");
  const [currentETA, setCurrentETA] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [completePickupTime, setCompletePickupTime] = useState<string>("");
  const [completeDeliveryTime, setCompleteDeliveryTime] = useState<string>("");
  const [showDetailedTimeline, setShowDetailedTimeline] = useState(false);
  
  // Parse estimated time into minutes for calculations (e.g. "2h 30m" -> 150)
  const parseEstimatedMinutes = (estimatedTimeStr: string): number => {
    const hoursMatch = estimatedTimeStr.match(/(\d+)h/);
    const minutesMatch = estimatedTimeStr.match(/(\d+)m/);
    
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
    
    return (hours * 60) + minutes;
  };
  
  // Total estimated minutes for the trip
  const totalEstimatedMinutes = parseEstimatedMinutes(estimatedTime);
  
  // Simulate trip progress - in a real app this would use real-time updates
  useEffect(() => {
    // First, generate some fixed time estimates
    const pickupTimeMinutes = Math.floor(totalEstimatedMinutes * 0.3); // 30% of total time to reach pickup
    const loadingTimeMinutes = Math.floor(totalEstimatedMinutes * 0.1); // 10% of total time for loading
    const transitTimeMinutes = Math.floor(totalEstimatedMinutes * 0.5); // 50% of total time for transit
    const unloadingTimeMinutes = Math.floor(totalEstimatedMinutes * 0.1); // 10% of total time for unloading
    
    const statusStages = [
      { 
        progress: 0, 
        status: "Booking Confirmed", 
        description: "Your booking has been confirmed",
        etaMinutes: pickupTimeMinutes + loadingTimeMinutes + transitTimeMinutes,
        timeToReachPickup: pickupTimeMinutes
      },
      { 
        progress: 10, 
        status: "Driver Assigned", 
        description: `${driverName} is on the way to pickup location`,
        etaMinutes: pickupTimeMinutes + loadingTimeMinutes + transitTimeMinutes,
        timeToReachPickup: pickupTimeMinutes
      },
      { 
        progress: 25, 
        status: "En Route to Pickup", 
        description: `Driver heading to ${pickupLocation}`,
        etaMinutes: pickupTimeMinutes + loadingTimeMinutes + transitTimeMinutes,
        timeToReachPickup: Math.floor(pickupTimeMinutes * 0.6) // 60% of pickup time remaining
      },
      { 
        progress: 40, 
        status: "Arriving for Pickup", 
        description: "Driver is approaching pickup location",
        etaMinutes: Math.floor(pickupTimeMinutes * 0.2) + loadingTimeMinutes + transitTimeMinutes, // 20% of pickup time remaining
        timeToReachPickup: Math.floor(pickupTimeMinutes * 0.2) // 20% of pickup time remaining
      },
      { 
        progress: 50, 
        status: "At Pickup Location", 
        description: "Driver has arrived at pickup location",
        etaMinutes: loadingTimeMinutes + transitTimeMinutes,
        timeToReachPickup: 0
      },
      { 
        progress: 55, 
        status: "Loading Cargo", 
        description: "Cargo is being loaded onto the truck",
        etaMinutes: Math.floor(loadingTimeMinutes * 0.5) + transitTimeMinutes, // 50% of loading time remaining
        timeToReachPickup: 0
      },
      { 
        progress: 60, 
        status: "Departing Pickup", 
        description: "Cargo loaded, departing for delivery",
        etaMinutes: transitTimeMinutes,
        timeToReachPickup: 0
      },
      { 
        progress: 70, 
        status: "In Transit", 
        description: "Cargo is in transit to delivery location",
        etaMinutes: Math.floor(transitTimeMinutes * 0.7), // 70% of transit time remaining
        timeToReachPickup: 0
      },
      { 
        progress: 85, 
        status: "Approaching Delivery", 
        description: "Driver is nearing delivery location",
        etaMinutes: Math.floor(transitTimeMinutes * 0.2), // 20% of transit time remaining
        timeToReachPickup: 0
      },
      { 
        progress: 90, 
        status: "Arrived at Delivery", 
        description: "Driver has arrived at delivery location",
        etaMinutes: unloadingTimeMinutes,
        timeToReachPickup: 0
      },
      { 
        progress: 95, 
        status: "Unloading Cargo", 
        description: "Cargo is being unloaded",
        etaMinutes: Math.floor(unloadingTimeMinutes * 0.5), // 50% of unloading time remaining
        timeToReachPickup: 0
      },
      { 
        progress: 100, 
        status: "Delivered", 
        description: "Cargo has been delivered successfully",
        etaMinutes: 0,
        timeToReachPickup: 0
      }
    ];
    
    // Start with first stage
    setTripProgress(statusStages[0].progress);
    setTripStatus(statusStages[0].status);
    setStatusDescription(statusStages[0].description);
    setTimeRemaining(formatTimeRemaining(statusStages[0].etaMinutes));
    setCurrentETA(calculateETA(statusStages[0].etaMinutes));
    
    // Simulate progress through stages
    let currentStage = 0;
    
    // Timestamps for completed stages
    const nowTimestamp = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true
    });
    
    const interval = setInterval(() => {
      if (currentStage < statusStages.length - 1) {
        currentStage++;
        setTripProgress(statusStages[currentStage].progress);
        setTripStatus(statusStages[currentStage].status);
        setStatusDescription(statusStages[currentStage].description);
        setTimeRemaining(formatTimeRemaining(statusStages[currentStage].etaMinutes));
        setCurrentETA(calculateETA(statusStages[currentStage].etaMinutes));
        
        // Record timestamp when reaching pickup
        if (statusStages[currentStage].status === "At Pickup Location") {
          setCompletePickupTime(nowTimestamp);
        }
        
        // Record timestamp when delivery is complete
        if (statusStages[currentStage].status === "Delivered") {
          setCompleteDeliveryTime(nowTimestamp);
        }
      } else {
        clearInterval(interval);
      }
    }, 5000); // Update every 5 seconds for the demo
    
    return () => clearInterval(interval);
  }, [driverName, totalEstimatedMinutes, pickupLocation]);

  const getStatusColor = () => {
    if (tripProgress < 40) return "text-amber-500";
    if (tripProgress < 70) return "text-blue-500";
    if (tripProgress < 100) return "text-purple-500";
    return "text-green-600";
  };

  const getStatusBadge = () => {
    if (tripProgress < 40) return "bg-amber-100 text-amber-800";
    if (tripProgress < 70) return "bg-blue-100 text-blue-800";
    if (tripProgress < 100) return "bg-purple-100 text-purple-800";
    return "bg-green-100 text-green-800";
  };

  const toggleDetailedTimeline = () => {
    setShowDetailedTimeline(!showDetailedTimeline);
  };

  return (
    <Card className="w-full mb-6 shadow-lg border-t-4 border-t-primary">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Trip Tracker
          <Badge className={getStatusBadge()}>{tripStatus}</Badge>
          <span className="text-sm font-normal text-gray-500 ml-auto">#{tripId}</span>
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 h-7 w-7"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <CardDescription>
          <div className="mt-1">
            <div className="text-sm text-gray-600">{statusDescription}</div>
            {tripProgress < 100 && (
              <div className="flex items-center gap-2 mt-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  ETA: {currentETA} ({timeRemaining} remaining)
                </span>
              </div>
            )}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="relative mt-2 pt-2">
            <Progress value={tripProgress} className="h-3" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <div className="flex flex-col items-center">
                <MapPin className="h-3 w-3" />
                <span>Pickup</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-3 w-3" />
                <span>In Transit</span>
              </div>
              <div className="flex flex-col items-center">
                <MapPinned className="h-3 w-3" />
                <span>Delivery</span>
              </div>
            </div>
          </div>
          
          {/* Timeline section */}
          <div className="mt-6 rounded-lg border border-gray-100 p-3 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-gray-700">Trip Timeline</h4>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs" 
                onClick={toggleDetailedTimeline}
              >
                {showDetailedTimeline ? "Show Less" : "Show Details"}
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center mt-1">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center ${tripProgress >= 50 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div className="w-0.5 h-10 bg-gray-200"></div>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-1">Pickup</h5>
                  <p className="text-xs text-gray-600">{pickupLocation}</p>
                  {completePickupTime && (
                    <p className="text-xs text-green-600 mt-1">Completed at {completePickupTime}</p>
                  )}
                </div>
                <div className="ml-auto">
                  {tripProgress < 50 && timeRemaining && (
                    <Badge variant="outline" className="text-xs">
                      {timeRemaining} remaining
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center mt-1">
                  <div className={`h-5 w-5 rounded-full flex items-center justify-center ${tripProgress >= 100 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium mb-1">Delivery</h5>
                  <p className="text-xs text-gray-600">{deliveryLocation}</p>
                  {completeDeliveryTime && (
                    <p className="text-xs text-green-600 mt-1">Completed at {completeDeliveryTime}</p>
                  )}
                </div>
                <div className="ml-auto">
                  {tripProgress < 100 && tripProgress >= 50 && timeRemaining && (
                    <Badge variant="outline" className="text-xs">
                      {timeRemaining} remaining
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Detailed timeline steps */}
            {showDetailedTimeline && (
              <div className="mt-4 border-t border-gray-200 pt-4 space-y-3">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Detailed Status Updates</h4>
                
                <div className={`flex items-center gap-2 ${tripProgress >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs">Booking Confirmed</span>
                </div>
                
                <div className={`flex items-center gap-2 ${tripProgress >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                  <TruckIcon className="h-4 w-4" />
                  <span className="text-xs">Driver Assigned: {driverName}</span>
                </div>
                
                <div className={`flex items-center gap-2 ${tripProgress >= 40 ? 'text-green-600' : 'text-gray-400'}`}>
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs">Arrived at Pickup Location</span>
                </div>
                
                <div className={`flex items-center gap-2 ${tripProgress >= 55 ? 'text-green-600' : 'text-gray-400'}`}>
                  <Package className="h-4 w-4" />
                  <span className="text-xs">Cargo Loaded</span>
                </div>
                
                <div className={`flex items-center gap-2 ${tripProgress >= 70 ? 'text-green-600' : 'text-gray-400'}`}>
                  <RouteIcon className="h-4 w-4" />
                  <span className="text-xs">In Transit to Destination</span>
                </div>
                
                <div className={`flex items-center gap-2 ${tripProgress >= 90 ? 'text-green-600' : 'text-gray-400'}`}>
                  <MapPinned className="h-4 w-4" />
                  <span className="text-xs">Arrived at Delivery Location</span>
                </div>
                
                <div className={`flex items-center gap-2 ${tripProgress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs">Delivery Completed</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-2">
              <Truck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">{vehicleType}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Timer className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Estimated Total Time</p>
                <p className="font-medium">{estimatedTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <IndianRupee className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Total Fare</p>
                <p className="font-medium">{formatCurrency(fare)}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Insurance Coverage</p>
                <p className="font-medium">Included</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-4 pt-4">
            {tripProgress >= 100 && (
              <div className="mt-2 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">Trip completed successfully</span>
              </div>
            )}
            {tripProgress < 20 && (
              <div className="mt-2 text-xs text-gray-500">
                <AlertCircle className="h-3 w-3 inline-block mr-1" />
                Payment will be processed on trip completion
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2"
          onClick={onContactDriver}
        >
          <Phone className="h-4 w-4" /> Contact Driver
        </Button>
        {tripProgress < 100 && (
          <Button 
            variant="outline" 
            className="w-full flex items-center gap-2"
            onClick={onClose}
          >
            <RouteIcon className="h-4 w-4" /> View Route
          </Button>
        )}
        {tripProgress >= 100 && (
          <Button 
            className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
            onClick={onClose}
          >
            <CheckCircle2 className="h-4 w-4" /> Complete Trip
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}