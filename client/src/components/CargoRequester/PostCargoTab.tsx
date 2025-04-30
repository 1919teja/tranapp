import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Validation schema for cargo details
const cargoSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  pickupLocation: z.string().min(1, { message: "Pickup location is required" }),
  deliveryLocation: z.string().min(1, { message: "Delivery location is required" }),
  description: z.string().optional(),
  weight: z.string().min(1, { message: "Weight is required" }),
  date: z.string().min(1, { message: "Date is required" }),
  contactPhone: z.string().min(10, { message: "Valid phone number is required" }).max(15),
});

type CargoFormValues = z.infer<typeof cargoSchema>;

export default function PostCargoTab() {
  const { toast } = useToast();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cargo form with validation
  const form = useForm<CargoFormValues>({
    resolver: zodResolver(cargoSchema),
    defaultValues: {
      title: "",
      pickupLocation: "",
      deliveryLocation: "",
      description: "",
      weight: "",
      date: "",
      contactPhone: user?.phoneNumber || "",
    },
  });

  const onSubmit = async (data: CargoFormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post a cargo request",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const cargoData = {
        userId: user.id,
        title: data.title,
        pickupLocation: data.pickupLocation,
        deliveryLocation: data.deliveryLocation,
        description: data.description,
        weight: parseInt(data.weight),
        date: data.date,
        status: "pending"
      };

      await apiRequest("POST", "/api/cargo-requests", cargoData);
      toast({
        title: "Success",
        description: "Your cargo request has been posted",
      });

      // Reset form and invalidate queries
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/cargo-requests/user', user.id] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post cargo request",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">Post Your Cargo Details</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Construction Materials" {...field} />
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
                <FormLabel>Pickup Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter pickup location" {...field} />
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
                <FormLabel>Delivery Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter delivery location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Briefly describe your cargo (type, packaging, etc.)" 
                    rows={3}
                    {...field} 
                  />
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
                  <FormLabel>Weight (Tons)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Approx. weight" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pickup Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Posting..." : "Post Cargo Request"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
