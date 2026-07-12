import { z } from "zod";

export const roleSchema = z.enum(["user", "admin"]);

export const adminUserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: roleSchema,
  createdAt: z.string(),
});
