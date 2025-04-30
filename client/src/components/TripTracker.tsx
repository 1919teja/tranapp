import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { 
  Truck, MapPin, MapPinned, Route as RouteIcon, Clock, IndianRupee, 
  Phone, X, CheckCircle2, AlertCircle
} from "lucide-react";

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
  const [tripStatus, setTripStatus] = useState<string>("Confirmed");
  const [statusDescription, setStatusDescription] = useState<string>("Driver is being assigned");
  
  // Simulate trip progress - in a real app this would use real-time updates
  useEffect(() => {
    const statusStages = [
      { 
        progress: 5, 
        status: "Confirmed", 
        description: "Driver is being assigned" 
      },
      { 
        progress: 20, 
        status: "Driver Assigned", 
        description: `${driverName} is on the way to pickup location` 
      },
      { 
        progress: 40, 
        status: "Arriving at Pickup", 
        description: "Driver is approaching pickup location" 
      },
      { 
        progress: 55, 
        status: "Loading", 
        description: "Cargo is being loaded" 
      },
      { 
        progress: 70, 
        status: "In Transit", 
        description: "Cargo is in transit to delivery location" 
      },
      { 
        progress: 85, 
        status: "Arriving at Delivery", 
        description: "Driver is approaching delivery location" 
      },
      { 
        progress: 100, 
        status: "Delivered", 
        description: "Cargo has been delivered successfully" 
      }
    ];
    
    // Start with first stage
    setTripProgress(statusStages[0].progress);
    setTripStatus(statusStages[0].status);
    setStatusDescription(statusStages[0].description);
    
    // Simulate progress through stages
    let currentStage = 0;
    
    const interval = setInterval(() => {
      if (currentStage < statusStages.length - 1) {
        currentStage++;
        setTripProgress(statusStages[currentStage].progress);
        setTripStatus(statusStages[currentStage].status);
        setStatusDescription(statusStages[currentStage].description);
      } else {
        clearInterval(interval);
      }
    }, 6000); // Update every 6 seconds for the demo
    
    return () => clearInterval(interval);
  }, [driverName]);

  const getStatusColor = () => {
    if (tripProgress < 40) return "text-amber-500";
    if (tripProgress < 70) return "text-blue-500";
    if (tripProgress < 100) return "text-purple-500";
    return "text-green-600";
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5 text-primary" />
          Trip Tracker
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
            <div className={`text-md font-medium ${getStatusColor()}`}>{tripStatus}</div>
            <div className="text-sm text-gray-500">{statusDescription}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="relative mt-2 pt-2">
            <Progress value={tripProgress} className="h-3" />
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Pickup</span>
              <span>In Transit</span>
              <span>Delivery</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Pickup</p>
                <p className="font-medium">{pickupLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPinned className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Delivery</p>
                <p className="font-medium">{deliveryLocation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Truck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Vehicle</p>
                <p className="font-medium">{vehicleType}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Estimated Time</p>
                <p className="font-medium">{estimatedTime}</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 mt-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-green-600" />
                <span className="font-medium">Total Fare</span>
              </div>
              <span className="font-medium text-lg">{formatCurrency(fare)}</span>
            </div>
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