import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import { experimentRunResultSchema } from "@/features/experiment-runner/schemas/experiment-schema";
import { z } from "zod";

export const sqlRunDatasetIdentitySchema = z.object({
  family: z.string().min(1),
  tier: datasetTierSchema,
  version: z.string().optional(),
});

export const enqueueSqlRunInputSchema = z.object({
  sql: z.string().min(1),
  parameters: z.array(z.unknown()).optional(),
  sessionId: z.string().min(1),
  dataset: sqlRunDatasetIdentitySchema,
  context: z
    .object({
      trackSlug: z.string().optional(),
      labSlug: z.string().optional(),
    })
    .optional(),
});

export const enqueueSqlRunResultSchema = z.object({
  jobId: z.string().min(1),
  jobType: z.literal("sql-execution"),
  status: z.literal("queued"),
  createdAt: z.string(),
});

export const sqlRunPayloadSummarySchema = z
  .object({
    statementKind: z.string().optional(),
    datasetFamily: z.string().optional(),
    datasetTier: z.string().optional(),
    executionResult: experimentRunResultSchema.optional(),
  })
  .partial();
