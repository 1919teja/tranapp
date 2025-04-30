import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertTruckSchema, 
  insertCargoRequestSchema, 
  insertFarmerRequestSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });

  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.json(user);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Truck routes
  app.post("/api/trucks", async (req: Request, res: Response) => {
    try {
      const truckData = insertTruckSchema.parse(req.body);
      const truck = await storage.createTruck(truckData);
      res.status(201).json(truck);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid truck data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create truck" });
      }
    }
  });

  app.get("/api/trucks/:id", async (req: Request, res: Response) => {
    try {
      const truckId = parseInt(req.params.id);
      const truck = await storage.getTruck(truckId);
      if (!truck) {
        res.status(404).json({ message: "Truck not found" });
      } else {
        res.json(truck);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch truck" });
    }
  });

  app.get("/api/trucks/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const trucks = await storage.getTrucksByUserId(userId);
      res.json(trucks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trucks for user" });
    }
  });

  app.get("/api/trucks", async (_req: Request, res: Response) => {
    try {
      const trucks = await storage.getAllAvailableTrucks();
      res.json(trucks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available trucks" });
    }
  });

  app.put("/api/trucks/:id", async (req: Request, res: Response) => {
    try {
      const truckId = parseInt(req.params.id);
      const updates = req.body;
      const updatedTruck = await storage.updateTruck(truckId, updates);
      if (!updatedTruck) {
        res.status(404).json({ message: "Truck not found" });
      } else {
        res.json(updatedTruck);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update truck" });
    }
  });

  // Cargo request routes
  app.post("/api/cargo-requests", async (req: Request, res: Response) => {
    try {
      const requestData = insertCargoRequestSchema.parse(req.body);
      const cargoRequest = await storage.createCargoRequest(requestData);
      res.status(201).json(cargoRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid cargo request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create cargo request" });
      }
    }
  });

  app.get("/api/cargo-requests/:id", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const cargoRequest = await storage.getCargoRequest(requestId);
      if (!cargoRequest) {
        res.status(404).json({ message: "Cargo request not found" });
      } else {
        res.json(cargoRequest);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cargo request" });
    }
  });

  app.get("/api/cargo-requests/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await storage.getCargoRequestsByUserId(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cargo requests for user" });
    }
  });

  app.get("/api/cargo-requests", async (_req: Request, res: Response) => {
    try {
      const requests = await storage.getAllCargoRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cargo requests" });
    }
  });

  app.put("/api/cargo-requests/:id", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const updates = req.body;
      const updatedRequest = await storage.updateCargoRequest(requestId, updates);
      if (!updatedRequest) {
        res.status(404).json({ message: "Cargo request not found" });
      } else {
        res.json(updatedRequest);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update cargo request" });
    }
  });

  // Farmer request routes
  app.post("/api/farmer-requests", async (req: Request, res: Response) => {
    try {
      const requestData = insertFarmerRequestSchema.parse(req.body);
      const farmerRequest = await storage.createFarmerRequest(requestData);
      res.status(201).json(farmerRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid farmer request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create farmer request" });
      }
    }
  });

  app.get("/api/farmer-requests/:id", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const farmerRequest = await storage.getFarmerRequest(requestId);
      if (!farmerRequest) {
        res.status(404).json({ message: "Farmer request not found" });
      } else {
        res.json(farmerRequest);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer request" });
    }
  });

  app.get("/api/farmer-requests/user/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const requests = await storage.getFarmerRequestsByUserId(userId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer requests for user" });
    }
  });

  app.get("/api/farmer-requests", async (_req: Request, res: Response) => {
    try {
      const requests = await storage.getAllFarmerRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer requests" });
    }
  });

  app.put("/api/farmer-requests/:id", async (req: Request, res: Response) => {
    try {
      const requestId = parseInt(req.params.id);
      const updates = req.body;
      const updatedRequest = await storage.updateFarmerRequest(requestId, updates);
      if (!updatedRequest) {
        res.status(404).json({ message: "Farmer request not found" });
      } else {
        res.json(updatedRequest);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update farmer request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
