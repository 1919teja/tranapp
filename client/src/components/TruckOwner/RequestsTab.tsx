import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Truck } from "lucide-react";

export default function RequestsTab() {
  const { user, setContactModalOpen, setCurrentContact } = useUser();

  // Fetch cargo requests
  const { data: cargoRequests, isLoading: cargoLoading } = useQuery({
    queryKey: ['/api/cargo-requests'],
    queryFn: async () => {
      const res = await fetch('/api/cargo-requests');
      if (!res.ok) throw new Error('Failed to fetch cargo requests');
      return res.json();
    },
  });

  // Fetch farmer requests
  const { data: farmerRequests, isLoading: farmerLoading } = useQuery({
    queryKey: ['/api/farmer-requests'],
    queryFn: async () => {
      const res = await fetch('/api/farmer-requests');
      if (!res.ok) throw new Error('Failed to fetch farmer requests');
      return res.json();
    },
  });

  const handleContactRequester = (phone: string, name: string) => {
    setCurrentContact({
      phone,
      name
    });
    setContactModalOpen(true);
  };

  if (cargoLoading || farmerLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Transport Requests</h3>
          <div className="flex">
            <span className="bg-gray-200 animate-pulse text-transparent text-xs rounded-full h-6 w-6 flex items-center justify-center">
              0
            </span>
          </div>
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

  // Combine and sort requests by creation date
  const combinedRequests = [
    ...(cargoRequests || []).map(req => ({ ...req, type: 'cargo' })),
    ...(farmerRequests || []).map(req => ({ ...req, type: 'farmer' }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">Transport Requests</h3>
          <div className="flex">
            <Badge variant="default">{combinedRequests.length}</Badge>
          </div>
        </div>
      </div>

      {combinedRequests.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Truck className="h-12 w-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium text-gray-900">No Transport Requests</h3>
          <p className="text-gray-500 mt-1">Transport requests will appear here when cargo requesters or farmers need your services.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {combinedRequests.map((request) => (
            <div 
              key={`${request.type}-${request.id}`} 
              className={`bg-white rounded-lg shadow-md p-4 border-l-4 ${
                request.type === 'farmer' ? 'border-secondary' : 'border-accent'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  {request.type === 'farmer' ? (
                    <Badge variant="secondary">Farmer</Badge>
                  ) : (
                    <Badge variant="accent">Cargo</Badge>
                  )}
                  {request.type === 'farmer' && request.urgency === 'immediate' && (
                    <Badge variant="urgent" className="ml-2">Urgent</Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                </span>
              </div>
              
              <h4 className="font-medium text-gray-800 mb-1">
                {request.type === 'farmer' 
                  ? `${request.cropType} Crop Transport`
                  : request.title
                }
              </h4>
              
              <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                <div>
                  <p className="text-gray-500">From:</p>
                  <p className="font-medium">{request.pickupLocation}</p>
                </div>
                <div>
                  <p className="text-gray-500">To:</p>
                  <p className="font-medium">{request.deliveryLocation}</p>
                </div>
                
                {request.type === 'farmer' ? (
                  <>
                    <div>
                      <p className="text-gray-500">Crop:</p>
                      <p className="font-medium">{request.cropType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Urgency:</p>
                      <p className="font-medium">{request.urgency}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-gray-500">Weight:</p>
                      <p className="font-medium">{request.weight} Tons</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Date:</p>
                      <p className="font-medium">{request.date}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => handleContactRequester(
                    "9876543210", 
                    request.type === 'farmer' ? request.farmerName : "Cargo Requester"
                  )}
                >
                  Contact {request.type === 'farmer' ? 'Farmer' : 'Requester'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
