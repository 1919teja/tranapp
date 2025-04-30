import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/context/UserContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { ClipboardList } from "lucide-react";

export default function MyRequestsTab() {
  const { user } = useUser();
  const { toast } = useToast();

  // Query to get user's farmer requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['/api/farmer-requests/user', user?.id],
    queryFn: async ({ queryKey }) => {
      if (!user) return [];
      const res = await fetch(`/api/farmer-requests/user/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch farmer requests');
      return res.json();
    },
    enabled: !!user,
  });

  const handleCancelRequest = async (requestId: number) => {
    try {
      await apiRequest("PUT", `/api/farmer-requests/${requestId}`, {
        status: "cancelled"
      });
      
      toast({
        title: "Success",
        description: "Request cancelled successfully",
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-requests/user', user?.id] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel request",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold">My Transport Requests</h3>
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
              <div className="h-12 bg-gray-200 rounded mb-3"></div>
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
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h3 className="text-lg font-semibold">My Transport Requests</h3>
      </div>

      {myRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No Requests Found</h3>
          <p className="text-gray-500 mt-1">You haven't created any transport requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-800">{request.cropType} Crop Transport</h4>
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
                  <p className="text-gray-500">Urgency:</p>
                  <p className="font-medium">{request.urgency}</p>
                </div>
                <div>
                  <p className="text-gray-500">Weight:</p>
                  <p className="font-medium">{request.weight} Tons</p>
                </div>
              </div>
              
              {request.status === "confirmed" && request.pickupTime && (
                <div className="bg-gray-50 p-2 rounded text-sm mb-3">
                  <p className="font-medium">Pickup scheduled for: {request.pickupTime}</p>
                  {request.assignedTruckId && (
                    <p className="text-gray-600">Truck has been assigned to your request</p>
                  )}
                </div>
              )}
              
              {request.status === "pending" && (
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    className="border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => handleCancelRequest(request.id)}
                  >
                    Cancel Request
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
