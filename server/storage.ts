import { users, sizeCalculations, type User, type InsertUser, type SizeCalculation, type InsertSizeCalculation } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSizeCalculation(calculation: InsertSizeCalculation): Promise<SizeCalculation>;
  getSizeCalculations(): Promise<SizeCalculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sizeCalculations: Map<number, SizeCalculation>;
  private currentUserId: number;
  private currentCalculationId: number;

  constructor() {
    this.users = new Map();
    this.sizeCalculations = new Map();
    this.currentUserId = 1;
    this.currentCalculationId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createSizeCalculation(insertCalculation: InsertSizeCalculation): Promise<SizeCalculation> {
    const id = this.currentCalculationId++;
    const calculation: SizeCalculation = { ...insertCalculation, id };
    this.sizeCalculations.set(id, calculation);
    return calculation;
  }

  async getSizeCalculations(): Promise<SizeCalculation[]> {
    return Array.from(this.sizeCalculations.values());
  }
}

export const storage = new MemStorage();
