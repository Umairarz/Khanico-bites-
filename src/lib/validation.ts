import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const adminLoginSchema = loginSchema;

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Enter your full name").max(100),
  customerPhone: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number")
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, "Phone number contains invalid characters"),
  deliveryLine1: z.string().trim().min(5, "Enter your delivery address").max(300),
  deliveryCity: z.string().trim().min(2, "Enter your city").max(100),
  orderNotes: z.string().trim().max(500).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().min(1).max(50),
      })
    )
    .min(1, "Your cart is empty"),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(150),
  description: z.string().trim().min(5).max(2000),
  price: z.number().positive("Price must be greater than 0"),
  imageUrl: z.string().trim().url("Enter a valid image URL"),
  categoryId: z.string().min(1, "Select a category"),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PREPARING",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `KB-${y}${m}${d}-${rand}`;
}
