import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Truck } from "lucide-react";

export default function BrowseTrucksTab() {
  const { user } = useUser();
  const { toast } = useToast();

  // Query to get all available trucks
  const { data: trucks, isLoading } = useQuery({
    queryKey: ['/api/trucks'],
    queryFn: async () => {
      const res = await fetch('/api/trucks');
      if (!res.ok) throw new Error('Failed to fetch trucks');
      return res.json();
    },
  });

  const handleRequestTransport = async (truckId: number) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to request transport",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a farmer request for this truck
      const requestData = {
        userId: user.id,
        farmerName: user.username,
        pickupLocation: "Your Farm",
        deliveryLocation: "Local Market",
        cropType: "Mixed Produce",
        urgency: "Within 24 hours",
        weight: 2,
        status: "pending",
        assignedTruckId: truckId
      };

      await apiRequest("POST", "/api/farmer-requests", requestData);
      
      toast({
        title: "Success",
        description: "Priority transport request sent successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-requests/user', user.id] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send transport request",
        variant: "destructive",
      });
    }
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
  const availableTrucks = (trucks || []).sort((a, b) => {
    if (a.farmerFriendly && !b.farmerFriendly) return -1;
    if (!a.farmerFriendly && b.farmerFriendly) return 1;
    return 0;
  });

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Priority Trucks For Farmers</h3>
          <Badge variant="success">{availableTrucks.length} Available</Badge>
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
            <div 
              key={truck.id} 
              className={`bg-white rounded-lg shadow-md p-4 ${truck.farmerFriendly ? 'border-l-4 border-secondary' : ''}`}
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
                  <Badge variant="success">Available</Badge>
                  {truck.farmerFriendly && (
                    <Badge variant="secondary" className="ml-1">Farmer-Friendly</Badge>
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
                  <p className="text-gray-500">Owner:</p>
                  <p className="font-medium">Truck Owner</p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  className="bg-secondary hover:bg-secondary/90"
                  onClick={() => handleRequestTransport(truck.id)}
                >
                  Request Priority Transport
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
