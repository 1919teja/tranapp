import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Truck, MapPin, Clock, Phone, MessageCircle, 
  Navigation, Star, Share2, AlertCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

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
  const { toast } = useToast();
  const [status, setStatus] = useState<"picking_up" | "in_transit" | "near_delivery" | "delivered">("picking_up");
  const [progress, setProgress] = useState(0);
  const [currentLocation, setCurrentLocation] = useState("");
  const [estimatedArrival, setEstimatedArrival] = useState(estimatedTime);
  const [minutes, setMinutes] = useState(Math.floor(Math.random() * 30) + 15);

  // Simulate trip progress
  useEffect(() => {
    // Initial status
    setCurrentLocation("Driver is heading to pickup location");
    
    // Simulate status updates
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        
        // Update status based on progress
        if (prevProgress < 25 && prevProgress + 5 >= 25) {
          setStatus("picking_up");
          setCurrentLocation("Driver has arrived at pickup location");
          toast({
            title: "Driver has arrived",
            description: "Your driver has arrived at the pickup location"
          });
        } else if (prevProgress < 50 && prevProgress + 5 >= 50) {
          setStatus("in_transit");
          setCurrentLocation("Cargo picked up, now in transit");
          toast({
            title: "Cargo picked up",
            description: "Your cargo is now in transit to the destination"
          });
        } else if (prevProgress < 80 && prevProgress + 5 >= 80) {
          setStatus("near_delivery");
          setCurrentLocation("Almost at delivery location");
          toast({
            title: "Almost there",
            description: "Your delivery is almost at the destination"
          });
        } else if (prevProgress < 100 && prevProgress + 5 >= 100) {
          setStatus("delivered");
          setCurrentLocation("Arrived at delivery location");
          toast({
            title: "Delivery completed",
            description: "Your cargo has been delivered successfully"
          });
        }
        
        // Update ETA
        if (prevProgress < 100) {
          const newMinutes = Math.max(0, minutes - 1);
          setMinutes(newMinutes);
          setEstimatedArrival(newMinutes > 0 ? `${newMinutes} minutes` : "Just arrived");
        }
        
        return prevProgress + 5;
      });
    }, 3000); // Update every 3 seconds
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case "picking_up":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Arriving for pickup</Badge>;
      case "in_transit":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">In Transit</Badge>;
      case "near_delivery":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Near Destination</Badge>;
      case "delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Delivered</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Get progress status text
  const getProgressText = () => {
    if (progress < 25) return "Driver on the way";
    if (progress < 50) return "Loading cargo";
    if (progress < 80) return "In transit";
    if (progress < 100) return "Near destination";
    return "Delivered";
  };

  // Simulate sharing trip details
  const handleShareTrip = () => {
    toast({
      title: "Trip Shared",
      description: "Trip details have been shared via SMS"
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-md mx-auto">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Track Your Transport</h2>
          <p className="text-sm text-gray-500">Trip #{tripId}</p>
        </div>
        {getStatusBadge()}
      </div>
      
      <div className="bg-gray-50 p-3 rounded-lg mb-4">
        <div className="flex">
          <div className="flex flex-col items-center mr-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="bg-gray-300 w-0.5 h-10 my-1"></div>
            <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white">
              <Navigation className="h-4 w-4" />
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-3">
              <p className="text-xs text-gray-500">FROM</p>
              <p className="font-medium">{pickupLocation}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">TO</p>
              <p className="font-medium">{deliveryLocation}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="mr-2 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Truck className="h-6 w-6 text-gray-700" />
          </div>
          <div>
            <p className="font-medium">{vehicleType}</p>
            <p className="text-sm text-gray-500">Driver: {driverName}</p>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{getProgressText()}</span>
          <span className="text-sm">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex justify-between mb-6">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1 text-primary" />
          <span className="text-sm">ETA: {estimatedArrival}</span>
        </div>
        <div className="text-sm font-medium text-primary">
          {formatCurrency(fare)}
        </div>
      </div>
      
      <div className="bg-blue-50 p-3 rounded-lg mb-4 text-sm">
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
          <p className="text-blue-700">{currentLocation}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Button variant="outline" className="flex items-center justify-center" onClick={onContactDriver}>
          <Phone className="h-4 w-4 mr-2" />
          Call Driver
        </Button>
        <Button variant="outline" className="flex items-center justify-center" onClick={handleShareTrip}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Trip
        </Button>
      </div>
      
      {status === "delivered" && (
        <div className="mb-4">
          <p className="text-sm font-medium mb-2">Rate your trip</p>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-8 w-8 cursor-pointer text-gray-300 hover:text-yellow-400" 
                onClick={() => {
                  toast({
                    title: "Thanks for your feedback",
                    description: `You rated this trip ${star} stars`
                  });
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      <Button 
        className="w-full" 
        variant={status === "delivered" ? "default" : "outline"}
        onClick={onClose}
      >
        {status === "delivered" ? "Trip Completed" : "Close Tracking"}
      </Button>
    </div>
  );
}