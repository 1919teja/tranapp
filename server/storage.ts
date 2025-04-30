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
  
  // Store in session for persistence across restarts
  private saveToSessionStorage() {
    try {
      // Store data in global object to persist between server restarts
      if (typeof global !== 'undefined') {
        (global as any).__memStorage = {
          users: Array.from(this.users.entries()),
          trucks: Array.from(this.trucks.entries()),
          cargoRequests: Array.from(this.cargoRequests.entries()),
          farmerRequests: Array.from(this.farmerRequests.entries()),
          userIdCounter: this.userIdCounter,
          truckIdCounter: this.truckIdCounter,
          cargoRequestIdCounter: this.cargoRequestIdCounter,
          farmerRequestIdCounter: this.farmerRequestIdCounter,
        };
      }
    } catch (error) {
      console.error('Failed to save storage to session:', error);
    }
  }
  
  private loadFromSessionStorage() {
    try {
      // Try to load data from global object
      if (typeof global !== 'undefined' && (global as any).__memStorage) {
        const data = (global as any).__memStorage;
        
        this.users = new Map(data.users);
        this.trucks = new Map(data.trucks);
        this.cargoRequests = new Map(data.cargoRequests);
        this.farmerRequests = new Map(data.farmerRequests);
        this.userIdCounter = data.userIdCounter;
        this.truckIdCounter = data.truckIdCounter;
        this.cargoRequestIdCounter = data.cargoRequestIdCounter;
        this.farmerRequestIdCounter = data.farmerRequestIdCounter;
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to load storage from session:', error);
      return false;
    }
  }

  constructor() {
    this.users = new Map();
    this.trucks = new Map();
    this.cargoRequests = new Map();
    this.farmerRequests = new Map();
    this.userIdCounter = 1;
    this.truckIdCounter = 1;
    this.cargoRequestIdCounter = 1;
    this.farmerRequestIdCounter = 1;
    
    // Try to load data from session storage first
    const loaded = this.loadFromSessionStorage();
    
    // If no data was loaded, create dummy data
    if (!loaded) {
      // Add some sample trucks for testing
      this.createDummyData();
    }
  }
  
  private createDummyData() {
    // Add a dummy truck owner
    const truckOwner: User = {
      id: this.userIdCounter++,
      username: "truck_owner1",
      password: "password",
      userType: "truck-owner" as const,
      phoneNumber: "9876543210",
      createdAt: new Date(),
    };
    this.users.set(truckOwner.id, truckOwner);
    
    // Add some sample trucks with different specifications
    const dummyTrucks: InsertTruck[] = [
      {
        userId: truckOwner.id,
        truckType: "mini" as const,
        capacity: 1.5,
        registrationNumber: "TS01AB1234",
        driverName: "Raj Kumar",
        location: "Hyderabad Central",
        description: "Small pickup for light loads",
        farmerFriendly: true,
        available: true
      },
      {
        userId: truckOwner.id,
        truckType: "light" as const,
        capacity: 3,
        registrationNumber: "TS02CD5678",
        driverName: "Suresh Reddy",
        location: "Secunderabad",
        description: "Light commercial vehicle for general cargo",
        farmerFriendly: false,
        available: true
      },
      {
        userId: truckOwner.id,
        truckType: "medium" as const,
        capacity: 6,
        registrationNumber: "TS03EF9012",
        driverName: "Venkat Rao",
        location: "Gachibowli",
        description: "Medium duty truck for larger loads",
        farmerFriendly: true,
        available: true
      },
      {
        userId: truckOwner.id,
        truckType: "heavy" as const,
        capacity: 12,
        registrationNumber: "TS04GH3456",
        driverName: "Mohammad Ali",
        location: "Uppal",
        description: "Heavy duty truck for industrial cargo",
        farmerFriendly: false,
        available: true
      },
      {
        userId: truckOwner.id,
        truckType: "tractor" as const,
        capacity: 15,
        registrationNumber: "TS05IJ7890",
        driverName: "Ramesh Chandra",
        location: "Warangal",
        description: "Tractor with trailer for agricultural loads",
        farmerFriendly: true,
        available: true
      }
    ];
    
    // Create trucks in the storage
    dummyTrucks.forEach(truck => {
      this.createTruck(truck);
    });
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
