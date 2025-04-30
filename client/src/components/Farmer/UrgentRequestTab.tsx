import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Validation schema for farmer request
const farmerRequestSchema = z.object({
  farmerName: z.string().min(1, { message: "Name is required" }),
  pickupLocation: z.string().min(1, { message: "Farm location is required" }),
  deliveryLocation: z.string().min(1, { message: "Market/storage location is required" }),
  cropType: z.string().min(1, { message: "Crop type is required" }),
  urgency: z.enum(["immediate", "within24", "within48"], {
    required_error: "Please select urgency level",
  }),
  weight: z.string().min(1, { message: "Weight is required" }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required" }).max(15),
});

type FarmerRequestFormValues = z.infer<typeof farmerRequestSchema>;

export default function UrgentRequestTab() {
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Farmer request form with validation
  const form = useForm<FarmerRequestFormValues>({
    resolver: zodResolver(farmerRequestSchema),
    defaultValues: {
      farmerName: "",
      pickupLocation: "",
      deliveryLocation: "",
      cropType: "",
      urgency: "within24",
      weight: "",
      contactPhone: user?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: FarmerRequestFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a request",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData = {
        userId: user.id,
        farmerName: data.farmerName,
        pickupLocation: data.pickupLocation,
        deliveryLocation: data.deliveryLocation,
        cropType: data.cropType,
        urgency: data.urgency === "immediate" ? "Immediate" : 
                data.urgency === "within24" ? "Within 24 hours" : "Within 48 hours",
        weight: parseInt(data.weight),
        status: "pending",
      };

      await apiRequest("POST", "/api/farmer-requests", requestData);
      toast({
        title: "Success",
        description: "Your urgent transport request has been submitted",
      });

      // Reset form and invalidate queries
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-requests/user', user.id] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <div className="flex-shrink-0 bg-secondary/10 p-2 rounded-full">
          <Clock className="h-6 w-6 text-secondary" />
        </div>
        <h3 className="text-lg font-semibold ml-3">Rythu Suvidha - Urgent Transport</h3>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="farmerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farmer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pickupLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Farm Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter farm location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="deliveryLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Market/Storage Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter market or storage location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cropType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crop Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Crop Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="rice">Rice (Paddy)</SelectItem>
                    <SelectItem value="cotton">Cotton</SelectItem>
                    <SelectItem value="maize">Maize</SelectItem>
                    <SelectItem value="chili">Chili</SelectItem>
                    <SelectItem value="turmeric">Turmeric</SelectItem>
                    <SelectItem value="sugarcane">Sugarcane</SelectItem>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="urgency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency Level</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-3 gap-2"
                  >
                    <div className="flex items-center border rounded-md p-2 cursor-pointer hover:bg-secondary/5">
                      <RadioGroupItem value="immediate" id="immediate" className="text-secondary" />
                      <Label htmlFor="immediate" className="ml-2 text-sm">Immediate</Label>
                    </div>
                    <div className="flex items-center border rounded-md p-2 cursor-pointer hover:bg-secondary/5">
                      <RadioGroupItem value="within24" id="within24" className="text-secondary" />
                      <Label htmlFor="within24" className="ml-2 text-sm">Within 24 hrs</Label>
                    </div>
                    <div className="flex items-center border rounded-md p-2 cursor-pointer hover:bg-secondary/5">
                      <RadioGroupItem value="within48" id="within48" className="text-secondary" />
                      <Label htmlFor="within48" className="ml-2 text-sm">Within 48 hrs</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Weight (Tons)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Approx. weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="10-digit mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-secondary hover:bg-secondary/90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Urgent Transport Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
