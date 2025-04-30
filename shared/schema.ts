import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Types
export const userTypes = ["truck-owner", "cargo-requester", "farmer"] as const;
export type UserType = typeof userTypes[number];

// User Schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  userType: text("user_type").notNull(),
  phoneNumber: text("phone_number"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  userType: true,
  phoneNumber: true,
});

// Truck Schema
export const trucks = pgTable("trucks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  truckType: text("truck_type").notNull(),
  capacity: integer("capacity").notNull(),
  registrationNumber: text("registration_number"),
  available: boolean("available").default(false),
  location: text("location"),
  farmerFriendly: boolean("farmer_friendly").default(false),
});

export const insertTruckSchema = createInsertSchema(trucks).pick({
  userId: true,
  truckType: true,
  capacity: true,
  registrationNumber: true,
  available: true,
  location: true,
  farmerFriendly: true,
});

// Cargo Request Schema
export const cargoRequests = pgTable("cargo_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  deliveryLocation: text("delivery_location").notNull(),
  description: text("description"),
  weight: integer("weight"),
  date: text("date"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCargoRequestSchema = createInsertSchema(cargoRequests).pick({
  userId: true,
  title: true,
  pickupLocation: true,
  deliveryLocation: true,
  description: true,
  weight: true,
  date: true,
  status: true,
});

// Farmer Request Schema
export const farmerRequests = pgTable("farmer_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  farmerName: text("farmer_name").notNull(),
  pickupLocation: text("pickup_location").notNull(),
  deliveryLocation: text("delivery_location").notNull(),
  cropType: text("crop_type").notNull(),
  urgency: text("urgency").notNull(),
  weight: integer("weight"),
  status: text("status").default("pending"),
  assignedTruckId: integer("assigned_truck_id"),
  pickupTime: text("pickup_time"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFarmerRequestSchema = createInsertSchema(farmerRequests).pick({
  userId: true,
  farmerName: true,
  pickupLocation: true,
  deliveryLocation: true,
  cropType: true,
  urgency: true,
  weight: true,
  status: true,
  assignedTruckId: true,
  pickupTime: true,
});

// Type Exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Truck = typeof trucks.$inferSelect;
export type InsertTruck = z.infer<typeof insertTruckSchema>;

export type CargoRequest = typeof cargoRequests.$inferSelect;
export type InsertCargoRequest = z.infer<typeof insertCargoRequestSchema>;

export type FarmerRequest = typeof farmerRequests.$inferSelect;
export type InsertFarmerRequest = z.infer<typeof insertFarmerRequestSchema>;
