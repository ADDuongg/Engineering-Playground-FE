import { z } from "zod";

export const roleSchema = z.enum(["user", "admin"]);

export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  role: roleSchema,
  createdAt: z.string(),
});

export const authTokensSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  expiresIn: z.number().positive(),
  tokenType: z.literal("Bearer"),
});

export const authResponseSchema = z.object({
  user: userProfileSchema,
  tokens: authTokensSchema,
});
