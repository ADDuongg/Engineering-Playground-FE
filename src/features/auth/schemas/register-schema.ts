import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .max(100, "Display name must be at most 100 characters"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
