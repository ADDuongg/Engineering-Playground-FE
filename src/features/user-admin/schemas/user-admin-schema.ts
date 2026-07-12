import { z } from "zod";

export const adminUserRoleSchema = z.enum(["user", "admin"]);

export const adminUserViewSchema = z.object({
  id: z.string().min(1),
  email: z.string().min(1),
  displayName: z.string().min(1),
  role: adminUserRoleSchema,
  updatedBy: z.string().nullable(),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export const paginationMetaSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().nonnegative(),
});

export const updateAdminUserRoleRequestSchema = z.object({
  role: adminUserRoleSchema,
});

export const adminUserListQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
});
