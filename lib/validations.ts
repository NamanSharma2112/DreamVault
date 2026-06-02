import { z } from "zod";

export const itemCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  price: z.number().positive("Price must be positive"),
  currency: z.string().default("INR"),
  imageUrl: z.string().url().optional().nullable().or(z.literal("")),
  sourceUrl: z.string().url().optional().nullable().or(z.literal("")),
  category: z
    .enum([
      "WISHLIST",
      "BUY_LIST",
      "TRIP",
      "EXPERIENCE",
      "HOME",
      "VEHICLE",
      "ELECTRONICS",
      "FASHION",
      "HEALTH",
      "EDUCATION",
      "OTHER",
    ])
    .default("WISHLIST"),
  listType: z.enum(["WISHLIST", "BUY_LIST"]).default("WISHLIST"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "DREAM"]).default("MEDIUM"),
  status: z.enum(["PENDING", "SAVING", "PURCHASED", "CANCELLED"]).default("PENDING"),
  targetDate: z.string().optional().nullable(),
  savedAmount: z.number().min(0).default(0),
  notes: z.string().max(2000).optional().nullable(),
  tags: z.array(z.string()).default([]),
  goalId: z.string().optional().nullable(),
});

export const itemUpdateSchema = itemCreateSchema.partial();

export const goalCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional().nullable(),
  targetAmount: z.number().positive("Target amount must be positive"),
  savedAmount: z.number().min(0).default(0),
  targetDate: z.string().min(1, "Target date is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  goalType: z
    .enum(["PURCHASE", "TRIP", "EMERGENCY_FUND", "INVESTMENT", "EXPERIENCE", "OTHER"])
    .default("PURCHASE"),
  status: z.enum(["ACTIVE", "COMPLETED", "PAUSED", "CANCELLED"]).default("ACTIVE"),
});

export const goalUpdateSchema = goalCreateSchema.partial();

export const expenseCreateSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().max(500).optional().nullable(),
  expenseDate: z.string().min(1, "Date is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required").max(100),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const settingsSchema = z.object({
  name: z.string().max(100).optional(),
  monthlyIncome: z.number().min(0).optional().nullable(),
  monthlySavings: z.number().min(0).optional().nullable(),
  monthlyExpenses: z.number().min(0).optional().nullable(),
  currency: z.string().default("INR"),
});

export type ItemCreateInput = z.infer<typeof itemCreateSchema>;
export type ItemUpdateInput = z.infer<typeof itemUpdateSchema>;
export type GoalCreateInput = z.infer<typeof goalCreateSchema>;
export type GoalUpdateInput = z.infer<typeof goalUpdateSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type ExpenseCreateInput = z.infer<typeof expenseCreateSchema>;
