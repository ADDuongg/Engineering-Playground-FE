import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import { z } from "zod";

export const jobTypeSchema = z.enum([
  "benchmark",
  "dataset-reset",
  "sql-execution",
]);

export const jobLifecycleStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const jobFailureReasonSchema = z.enum([
  "VALIDATION_ERROR",
  "SESSION_UNAVAILABLE",
  "TIMEOUT",
  "EXECUTION_ERROR",
  "STORAGE_ERROR",
  "QUEUE_UNAVAILABLE",
]);

export const getJobStatusResultSchema = z.object({
  jobId: z.string().min(1),
  jobType: jobTypeSchema,
  status: jobLifecycleStatusSchema,
  createdAt: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  attemptCount: z.number(),
  maxAttempts: z.number(),
  failureReason: jobFailureReasonSchema.optional(),
  failureMessage: z.string().optional(),
  payloadSummary: z.record(z.string(), z.unknown()).optional(),
});

export const enqueueDatasetResetResultSchema = z.object({
  jobId: z.string().min(1),
  jobType: z.literal("dataset-reset"),
  status: z.literal("queued"),
  createdAt: z.string(),
  family: z.string().min(1),
  version: z.string().min(1),
  tier: datasetTierSchema,
});
