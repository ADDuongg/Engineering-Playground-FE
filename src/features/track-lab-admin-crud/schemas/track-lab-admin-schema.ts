import { z } from "zod";

export const trackStatusSchema = z.enum(["active", "coming-soon"]);
export const labStatusSchema = z.enum(["active", "coming-soon"]);

export const runtimeAdapterTypeSchema = z.enum([
  "playground_postgresql",
  "playground_redis",
  "headless_react_sandbox",
  "simulation_engine",
]);

export const inputSurfaceTypeSchema = z.enum([
  "sql_editor",
  "command_panel",
  "component_sandbox",
  "config_form",
]);

export const metricCatalogIdSchema = z.enum([
  "database-metrics",
  "redis-metrics",
  "react-metrics",
]);

export const visualizationKitIdSchema = z.enum([
  "database-viz",
  "redis-viz",
  "react-viz",
]);

export const slugSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens only");

export const adminTrackViewSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  status: trackStatusSchema,
  displayOrder: z.number(),
  runtimeAdapterType: runtimeAdapterTypeSchema,
  inputSurfaceType: inputSurfaceTypeSchema,
  metricCatalogId: metricCatalogIdSchema,
  visualizationKitId: visualizationKitIdSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const adminTrackListResponseSchema = z.object({
  tracks: z.array(adminTrackViewSchema),
});

export const adminLabViewSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  trackSlug: z.string(),
  sequenceOrder: z.number(),
  status: labStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const adminLabListResponseSchema = z.object({
  labs: z.array(adminLabViewSchema),
});

export const createTrackFormSchema = z.object({
  slug: slugSchema,
  name: z.string().min(1, "Name is required").max(120),
  description: z.string().min(1, "Description is required").max(2000),
  status: trackStatusSchema,
  displayOrder: z.coerce.number().int().min(0),
  runtimeAdapterType: runtimeAdapterTypeSchema,
  inputSurfaceType: inputSurfaceTypeSchema,
  metricCatalogId: metricCatalogIdSchema,
  visualizationKitId: visualizationKitIdSchema,
});

export const updateTrackFormSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  status: trackStatusSchema,
  displayOrder: z.coerce.number().int().min(0),
  runtimeAdapterType: runtimeAdapterTypeSchema,
  inputSurfaceType: inputSurfaceTypeSchema,
  metricCatalogId: metricCatalogIdSchema,
  visualizationKitId: visualizationKitIdSchema,
});

export const createLabFormSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(2000).optional().nullable(),
  sequenceOrder: z.coerce.number().int().min(0),
  status: labStatusSchema,
});

export const updateLabFormSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional().nullable(),
  sequenceOrder: z.coerce.number().int().min(0),
  status: labStatusSchema,
});

export type CreateTrackFormValues = z.infer<typeof createTrackFormSchema>;
export type UpdateTrackFormValues = z.infer<typeof updateTrackFormSchema>;
export type CreateLabFormValues = z.infer<typeof createLabFormSchema>;
export type UpdateLabFormValues = z.infer<typeof updateLabFormSchema>;
