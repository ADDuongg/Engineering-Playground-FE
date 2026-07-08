import { z } from "zod";

export const trackStatusSchema = z.enum(["active", "coming-soon"]);

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

export const trackSummarySchema = z.object({
  slug: z.string(),
  name: z.string(),
  description: z.string(),
  status: trackStatusSchema,
  displayOrder: z.number(),
});

export const trackListResponseSchema = z.object({
  tracks: z.array(trackSummarySchema),
});

export const trackDetailSchema = trackSummarySchema.extend({
  runtimeAdapterType: runtimeAdapterTypeSchema,
  inputSurfaceType: inputSurfaceTypeSchema,
  metricCatalogId: z.string(),
  visualizationKitId: z.string(),
  isLabStartable: z.boolean(),
});

export const trackSlugSchema = z
  .string()
  .min(3)
  .max(64)
  .regex(/^[a-z0-9-]+$/);
