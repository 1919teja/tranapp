import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ClipboardList, MapPin, ExternalLink, Truck, ArrowRightCircle, Calendar, Package } from "lucide-react";
import TripTracker from "@/components/TripTracker";

export default function MyRequestsTab() {
  const { user, setCurrentContact } = useUser();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showTracker, setShowTracker] = useState(false);

  // Query to get user's cargo requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['/api/cargo-requests/user', user?.id],
    queryFn: async ({ queryKey }) => {
      if (!user) return [];
      const res = await fetch(`/api/cargo-requests/user/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch cargo requests');
      return res.json();
    },
    enabled: !!user,
  });

  const handleCancelRequest = async (requestId: number) => {
    try {
      await apiRequest("PUT", `/api/cargo-requests/${requestId}`, {
        status: "cancelled"
      });
      
      toast({
        title: "Success",
        description: "Request cancelled successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/cargo-requests/user', user?.id] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel request",
        variant: "destructive",
      });
    }
  };

  const handleViewTracking = (request: any) => {
    setSelectedRequest(request);
    setShowTracker(true);
  };

  const handleCloseTracker = () => {
    setShowTracker(false);
  };

  const handleContactDriver = () => {
    // In a real app, this would connect to the driver
    if (selectedRequest) {
      setCurrentContact({
        name: "Driver " + selectedRequest.assignedTruckId,
        phone: "+91 98765 43210"
      });
    }
  };

  // Generate a trip ID from request
  const generateTripId = (request: any) => {
    return `C${request.id}${request.assignedTruckId || ''}`;
  };

  // Calculate estimated fare based on weight and distance (simplified)
  const calculateEstimatedFare = (request: any) => {
    const baseRate = 1500; // Base rate in rupees
    const weightFactor = request.weight || 1; // Weight in tons
    return baseRate * weightFactor;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold">My Cargo Requests</h3>
        <div className="mt-4 space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between mb-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
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

  const myRequests = requests || [];

  return (
    <div>
      {showTracker && selectedRequest ? (
        <div>
          <div className="mb-4">
            <Button 
              variant="ghost" 
              className="text-sm flex items-center gap-1" 
              onClick={() => setShowTracker(false)}
            >
              <ArrowRightCircle className="h-4 w-4 rotate-180" /> Back to requests
            </Button>
          </div>
          
          <TripTracker 
            tripId={generateTripId(selectedRequest)}
            vehicleType={selectedRequest.vehicleType || "Commercial Truck"}
            driverName={selectedRequest.driverName || "Assigned Driver"}
            pickupLocation={selectedRequest.pickupLocation}
            deliveryLocation={selectedRequest.deliveryLocation}
            estimatedTime={selectedRequest.estimatedTime || "3h 45m"}
            fare={selectedRequest.price || calculateEstimatedFare(selectedRequest)}
            onClose={handleCloseTracker}
            onContactDriver={handleContactDriver}
          />
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold">My Cargo Requests</h3>
          </div>

          {myRequests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">No Requests Found</h3>
              <p className="text-gray-500 mt-1">You haven't created any cargo requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {myRequests.map((request) => (
                <div 
                  key={request.id} 
                  className={`bg-white rounded-lg shadow-md p-4 ${
                    request.status === "confirmed" ? "cursor-pointer hover:shadow-lg transition-shadow" : ""
                  }`}
                  onClick={() => request.status === "confirmed" && handleViewTracking(request)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-800">{request.title || "Cargo Transport"}</h4>
                    <Badge 
                      variant={
                        request.status === "pending" ? "pending" : 
                        request.status === "confirmed" ? "success" : 
                        request.status === "cancelled" ? "destructive" : 
                        "default"
                      }
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <p className="text-gray-500">From:</p>
                      <p className="font-medium">{request.pickupLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">To:</p>
                      <p className="font-medium">{request.deliveryLocation}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date:</p>
                      <p className="font-medium">{request.date}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Weight:</p>
                      <p className="font-medium">{request.weight} Tons</p>
                    </div>
                  </div>
                  
                  {request.status === "confirmed" && (
                    <div className="bg-gray-50 p-3 rounded-md text-sm mb-3">
                      <div className="flex justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <p className="font-medium">Pickup: {request.pickupTime || "2025-04-30"}</p>
                        </div>
                        
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="text-primary p-0 h-auto flex items-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewTracking(request);
                          }}
                        >
                          <Truck className="h-4 w-4 mr-1" />
                          Track Shipment
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        <div className="relative flex items-center w-full">
                          <div className="flex-1 border-t-2 border-gray-200"></div>
                          <div className="flex-shrink-0 mx-2 text-gray-400 text-xs">
                            <Package className="h-4 w-4 text-amber-500 inline-block" />
                            <span className="mx-2">Shipment ID: {request.trackingCode || "CARG8723"}</span>
                            <Truck className="h-4 w-4 text-blue-500 inline-block" />
                          </div>
                          <div className="flex-1 border-t-2 border-gray-200"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {request.status === "pending" && (
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        className="border-destructive text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelRequest(request.id);
                        }}
                      >
                        Cancel Request
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
