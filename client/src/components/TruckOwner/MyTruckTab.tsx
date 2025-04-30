import { useState, useEffect } from "react";
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
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// Validation schema for truck details
const truckSchema = z.object({
  truckType: z.string().min(1, { message: "Truck type is required" }),
  capacity: z.string().min(1, { message: "Capacity is required" }),
  registrationNumber: z.string().min(1, { message: "Registration number is required" }),
  available: z.enum(["available", "unavailable"]),
  location: z.string().min(1, { message: "Location is required" }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required" }).max(15),
  farmerFriendly: z.boolean().optional(),
});

type TruckFormValues = z.infer<typeof truckSchema>;

export default function MyTruckTab() {
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [truckExists, setTruckExists] = useState(false);
  const [truckId, setTruckId] = useState<number | null>(null);

  // Query to get the user's truck
  const { data: userTruck, isLoading } = useQuery({
    queryKey: ['/api/trucks/user', user?.id],
    queryFn: async ({ queryKey }) => {
      if (!user) return null;
      const res = await fetch(`/api/trucks/user/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch truck');
      const trucks = await res.json();
      return trucks.length > 0 ? trucks[0] : null;
    },
    enabled: !!user,
  });

  // Truck form with validation
  const form = useForm<TruckFormValues>({
    resolver: zodResolver(truckSchema),
    defaultValues: {
      truckType: "",
      capacity: "",
      registrationNumber: "",
      available: "unavailable",
      location: "",
      contactPhone: user?.phoneNumber || "",
      farmerFriendly: false,
    },
  });

  // Update form values when truck data is loaded
  useEffect(() => {
    if (userTruck) {
      setTruckExists(true);
      setTruckId(userTruck.id);
      form.reset({
        truckType: userTruck.truckType,
        capacity: String(userTruck.capacity),
        registrationNumber: userTruck.registrationNumber,
        available: userTruck.available ? "available" : "unavailable",
        location: userTruck.location,
        contactPhone: user?.phoneNumber || "",
        farmerFriendly: userTruck.farmerFriendly || false,
      });
    }
  }, [userTruck, user, form]);

  const onSubmit = async (data: TruckFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update truck details",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const truckData = {
        userId: user.id,
        truckType: data.truckType,
        capacity: parseInt(data.capacity),
        registrationNumber: data.registrationNumber,
        available: data.available === "available",
        location: data.location,
        farmerFriendly: data.farmerFriendly,
      };

      if (truckExists && truckId) {
        // Update existing truck
        await apiRequest("PUT", `/api/trucks/${truckId}`, truckData);
        toast({
          title: "Success",
          description: "Your truck details have been updated",
        });
      } else {
        // Create new truck
        await apiRequest("POST", "/api/trucks", truckData);
        toast({
          title: "Success",
          description: "Your truck has been registered",
        });
        setTruckExists(true);
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/trucks/user', user.id] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update truck details",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="truckType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Truck Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Truck Type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mini">Mini Truck (1-2 Ton)</SelectItem>
                    <SelectItem value="light">Light Commercial (2-5 Ton)</SelectItem>
                    <SelectItem value="medium">Medium Duty (5-10 Ton)</SelectItem>
                    <SelectItem value="heavy">Heavy Duty (10+ Ton)</SelectItem>
                    <SelectItem value="tractor">Tractor with Trailer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (Tons)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Enter capacity in tons" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="registrationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Registration Number</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., TS 07 AB 1234" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="available"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability Status</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="available" id="available" />
                      <Label htmlFor="available">Available Now</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unavailable" id="unavailable" />
                      <Label htmlFor="unavailable">Not Available</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Kazipet, Telangana" {...field} />
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

          <FormField
            control={form.control}
            name="farmerFriendly"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Farmer Friendly</FormLabel>
                  <p className="text-sm text-gray-500">
                    Mark your truck as farmer-friendly to prioritize farmer requests
                  </p>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : (truckExists ? "Update Truck Details" : "Register Truck")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
