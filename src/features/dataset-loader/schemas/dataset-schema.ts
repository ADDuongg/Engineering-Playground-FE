import { z } from "zod";

export const datasetTierSchema = z.enum(["100k", "1m", "10m"]);

export const datasetPreparationStateSchema = z.enum([
  "not_started",
  "preparing",
  "resetting",
  "ready",
  "failed",
]);

export const datasetIdentitySchema = z.object({
  family: z.string().min(1),
  tier: datasetTierSchema,
  version: z.string().optional(),
});

export const prepareDatasetInputSchema = datasetIdentitySchema.extend({
  sessionId: z.string().optional(),
  context: z
    .object({
      requestId: z.string().optional(),
      labSlug: z.string().optional(),
      userId: z.string().optional(),
    })
    .optional(),
});

export const prepareDatasetResultSchema = z.object({
  family: z.string(),
  version: z.string(),
  tier: datasetTierSchema,
  status: z.enum(["ready", "preparing"]),
  durationMs: z.number().optional(),
  startedAt: z.string().optional(),
});

export const datasetPreparationErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  hint: z.string().optional(),
});

export const datasetPreparationStatusSchema = z.object({
  family: z.string(),
  version: z.string(),
  tier: datasetTierSchema,
  status: datasetPreparationStateSchema,
  startedAt: z.string().optional(),
  completedAt: z.string().nullable().optional(),
  durationMs: z.number().nullable().optional(),
  error: datasetPreparationErrorSchema.nullable().optional(),
});

export const datasetTableMetadataSchema = z.object({
  name: z.string(),
  label: z.string(),
  description: z.string(),
  targetRowCount: z.number(),
  actualRowCount: z.number().nullable(),
});

export const datasetMetadataSchema = z.object({
  family: z.string(),
  familyLabel: z.string(),
  version: z.string(),
  tier: datasetTierSchema,
  status: datasetPreparationStateSchema,
  tables: z.array(datasetTableMetadataSchema),
});

export const resetDatasetInputSchema = datasetIdentitySchema.extend({
  sessionId: z.string().optional(),
  context: z
    .object({
      requestId: z.string().optional(),
      labSlug: z.string().optional(),
      userId: z.string().optional(),
    })
    .optional(),
});

export const resetDatasetResultSchema = z.object({
  jobId: z.string().min(1),
  jobType: z.literal("dataset-reset"),
  status: z.literal("queued"),
  createdAt: z.string(),
  family: z.string(),
  version: z.string(),
  tier: datasetTierSchema,
});
