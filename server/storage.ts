import {
  users, 
  trucks, 
  cargoRequests, 
  farmerRequests,
  type User, 
  type InsertUser, 
  type Truck, 
  type InsertTruck, 
  type CargoRequest, 
  type InsertCargoRequest, 
  type FarmerRequest,
  type InsertFarmerRequest
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Truck operations
  createTruck(truck: InsertTruck): Promise<Truck>;
  getTruck(id: number): Promise<Truck | undefined>;
  getTrucksByUserId(userId: number): Promise<Truck[]>;
  getAllAvailableTrucks(): Promise<Truck[]>;
  updateTruck(id: number, updates: Partial<InsertTruck>): Promise<Truck | undefined>;
  
  // Cargo request operations
  createCargoRequest(request: InsertCargoRequest): Promise<CargoRequest>;
  getCargoRequest(id: number): Promise<CargoRequest | undefined>;
  getCargoRequestsByUserId(userId: number): Promise<CargoRequest[]>;
  getAllCargoRequests(): Promise<CargoRequest[]>;
  updateCargoRequest(id: number, updates: Partial<InsertCargoRequest>): Promise<CargoRequest | undefined>;
  
  // Farmer request operations
  createFarmerRequest(request: InsertFarmerRequest): Promise<FarmerRequest>;
  getFarmerRequest(id: number): Promise<FarmerRequest | undefined>;
  getFarmerRequestsByUserId(userId: number): Promise<FarmerRequest[]>;
  getAllFarmerRequests(): Promise<FarmerRequest[]>;
  updateFarmerRequest(id: number, updates: Partial<InsertFarmerRequest>): Promise<FarmerRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private trucks: Map<number, Truck>;
  private cargoRequests: Map<number, CargoRequest>;
  private farmerRequests: Map<number, FarmerRequest>;
  private userIdCounter: number;
  private truckIdCounter: number;
  private cargoRequestIdCounter: number;
  private farmerRequestIdCounter: number;

  constructor() {
    this.users = new Map();
    this.trucks = new Map();
    this.cargoRequests = new Map();
    this.farmerRequests = new Map();
    this.userIdCounter = 1;
    this.truckIdCounter = 1;
    this.cargoRequestIdCounter = 1;
    this.farmerRequestIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      phoneNumber: insertUser.phoneNumber ?? null 
    };
    this.users.set(id, user);
    return user;
  }

  // Truck methods
  async createTruck(insertTruck: InsertTruck): Promise<Truck> {
    const id = this.truckIdCounter++;
    const truck: Truck = { 
      ...insertTruck, 
      id,
      registrationNumber: insertTruck.registrationNumber ?? null,
      available: insertTruck.available ?? null,
      location: insertTruck.location ?? null,
      farmerFriendly: insertTruck.farmerFriendly ?? null
    };
    this.trucks.set(id, truck);
    return truck;
  }

  async getTruck(id: number): Promise<Truck | undefined> {
    return this.trucks.get(id);
  }

  async getTrucksByUserId(userId: number): Promise<Truck[]> {
    return Array.from(this.trucks.values()).filter(
      (truck) => truck.userId === userId
    );
  }

  async getAllAvailableTrucks(): Promise<Truck[]> {
    return Array.from(this.trucks.values()).filter(
      (truck) => truck.available
    );
  }

  async updateTruck(id: number, updates: Partial<InsertTruck>): Promise<Truck | undefined> {
    const truck = this.trucks.get(id);
    if (!truck) return undefined;
    
    const updatedTruck = { ...truck, ...updates };
    this.trucks.set(id, updatedTruck);
    return updatedTruck;
  }

  // Cargo request methods
  async createCargoRequest(insertRequest: InsertCargoRequest): Promise<CargoRequest> {
    const id = this.cargoRequestIdCounter++;
    const now = new Date();
    const request: CargoRequest = { 
      ...insertRequest, 
      id, 
      createdAt: now,
      date: insertRequest.date ?? null,
      status: insertRequest.status ?? null,
      description: insertRequest.description ?? null,
      weight: insertRequest.weight ?? null
    };
    this.cargoRequests.set(id, request);
    return request;
  }

  async getCargoRequest(id: number): Promise<CargoRequest | undefined> {
    return this.cargoRequests.get(id);
  }

  async getCargoRequestsByUserId(userId: number): Promise<CargoRequest[]> {
    return Array.from(this.cargoRequests.values()).filter(
      (request) => request.userId === userId
    );
  }

  async getAllCargoRequests(): Promise<CargoRequest[]> {
    return Array.from(this.cargoRequests.values());
  }

  async updateCargoRequest(id: number, updates: Partial<InsertCargoRequest>): Promise<CargoRequest | undefined> {
    const request = this.cargoRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.cargoRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  // Farmer request methods
  async createFarmerRequest(insertRequest: InsertFarmerRequest): Promise<FarmerRequest> {
    const id = this.farmerRequestIdCounter++;
    const now = new Date();
    const request: FarmerRequest = { 
      ...insertRequest, 
      id, 
      createdAt: now,
      status: insertRequest.status ?? null,
      weight: insertRequest.weight ?? null,
      assignedTruckId: insertRequest.assignedTruckId ?? null,
      pickupTime: insertRequest.pickupTime ?? null
    };
    this.farmerRequests.set(id, request);
    return request;
  }

  async getFarmerRequest(id: number): Promise<FarmerRequest | undefined> {
    return this.farmerRequests.get(id);
  }

  async getFarmerRequestsByUserId(userId: number): Promise<FarmerRequest[]> {
    return Array.from(this.farmerRequests.values()).filter(
      (request) => request.userId === userId
    );
  }

  async getAllFarmerRequests(): Promise<FarmerRequest[]> {
    return Array.from(this.farmerRequests.values());
  }

  async updateFarmerRequest(id: number, updates: Partial<InsertFarmerRequest>): Promise<FarmerRequest | undefined> {
    const request = this.farmerRequests.get(id);
    if (!request) return undefined;
    
    const updatedRequest = { ...request, ...updates };
    this.farmerRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
