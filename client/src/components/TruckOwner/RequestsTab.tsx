import { useUser } from "@/context/UserContext";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Truck, CheckCircle, MessageCircle, IndianRupee } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

export default function RequestsTab() {
  const { user, setContactModalOpen, setCurrentContact } = useUser();
  const { toast } = useToast();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDealDialog, setShowDealDialog] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [dealTerms, setDealTerms] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);
  const [processingDeal, setProcessingDeal] = useState(false);

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

  const handleInitiatePayment = (request: any) => {
    setSelectedRequest(request);
    // Calculate suggested payment based on distance and cargo type
    const suggestedAmount = request.type === 'farmer' 
      ? Math.floor(Math.random() * 1000) + 1000 
      : Math.floor(Math.random() * 3000) + 2000;
    setPaymentAmount(suggestedAmount.toString());
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

    setProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false);
      setShowPaymentDialog(false);
      
      toast({
        title: "Payment Initiated",
        description: `Payment of ${formatCurrency(Number(paymentAmount))} initiated successfully. You will receive a confirmation shortly.`,
      });
      
      // After payment, show deal confirmation
      setShowDealDialog(true);
    }, 1500);
  };

  const handleInitiateDeal = () => {
    if (!dealTerms.trim()) {
      toast({
        title: "Terms Required",
        description: "Please enter the terms of your deal",
        variant: "destructive"
      });
      return;
    }

    setProcessingDeal(true);
    
    // Simulate deal processing
    setTimeout(() => {
      setProcessingDeal(false);
      setShowDealDialog(false);
      
      toast({
        title: "Deal Confirmed",
        description: "Your deal has been confirmed. You will receive the details via SMS.",
      });
    }, 1500);
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
                    <Badge variant="destructive" className="ml-2">Urgent</Badge>
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
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => handleContactRequester(
                    "9876543210", 
                    request.type === 'farmer' ? request.farmerName : "Cargo Requester"
                  )}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Contact
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary/5"
                  onClick={() => handleInitiatePayment(request)}
                >
                  <IndianRupee className="h-4 w-4 mr-1" />
                  Set Price
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowDealDialog(true);
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Make Deal
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Set Transport Price</DialogTitle>
            <DialogDescription>
              Enter the amount you want to charge for this transport service.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="paymentAmount">Price (₹)</Label>
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
              <p className="text-sm text-gray-500">
                Suggested price based on distance and cargo type
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleProcessPayment} disabled={processingPayment}>
              {processingPayment ? "Processing..." : "Confirm Price"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Deal Confirmation Dialog */}
      <Dialog open={showDealDialog} onOpenChange={setShowDealDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Transport Deal</DialogTitle>
            <DialogDescription>
              Specify the terms of the transport agreement to finalize the deal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dealTerms">Deal Terms</Label>
              <Textarea
                id="dealTerms"
                value={dealTerms}
                onChange={(e) => setDealTerms(e.target.value)}
                placeholder="e.g., Will pick up on Monday at 9 AM, deliver by Tuesday evening. Payment on delivery."
                rows={4}
              />
            </div>
            {selectedRequest && (
              <div className="bg-gray-50 p-3 rounded-md text-sm">
                <p className="font-medium mb-1">Transport Details:</p>
                <p>From: {selectedRequest.pickupLocation}</p>
                <p>To: {selectedRequest.deliveryLocation}</p>
                <p>
                  {selectedRequest.type === 'farmer' ? 
                    `Crop Type: ${selectedRequest.cropType}` : 
                    `Cargo: ${selectedRequest.title}`
                  }
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDealDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInitiateDeal} disabled={processingDeal}>
              {processingDeal ? "Processing..." : "Confirm Deal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
