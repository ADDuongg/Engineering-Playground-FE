import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import { metricContractSchema } from "@/features/metrics-pipeline/schemas/metrics-schema";
import { z } from "zod";

export const benchmarkRpsSchema = z.union([
  z.literal(100),
  z.literal(500),
  z.literal(1000),
  z.literal(5000),
]);

export const benchmarkDurationSecondsSchema = z.union([
  z.literal(10),
  z.literal(30),
  z.literal(60),
]);

export const benchmarkProfileSchema = z.object({
  rps: benchmarkRpsSchema,
  durationSeconds: benchmarkDurationSecondsSchema,
});

export const benchmarkTargetDatasetSchema = z.object({
  family: z.string().min(1),
  tier: datasetTierSchema,
  version: z.string().optional(),
});

export const benchmarkTargetSchema = z.object({
  sql: z.string().min(1),
  parameters: z.array(z.unknown()).optional(),
  dataset: benchmarkTargetDatasetSchema,
});

export const enqueueBenchmarkInputSchema = z.object({
  sessionId: z.string().min(1),
  profile: benchmarkProfileSchema,
  target: benchmarkTargetSchema,
  context: z
    .object({
      trackSlug: z.string().optional(),
      labSlug: z.string().optional(),
    })
    .optional(),
});

export const enqueueBenchmarkResultSchema = z.object({
  jobId: z.string(),
  status: z.literal("queued"),
  profile: z.object({
    rps: z.number(),
    durationSeconds: z.number(),
  }),
  createdAt: z.string(),
});

export const benchmarkJobStatusSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const benchmarkMetricsStatusSchema = z.enum([
  "pending",
  "ready",
  "unavailable",
]);

export const benchmarkJobStatusResultSchema = z.object({
  jobId: z.string(),
  status: benchmarkJobStatusSchema,
  profile: z.object({
    rps: z.number(),
    durationSeconds: z.number(),
  }),
  createdAt: z.string(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  failureReason: z.string().optional(),
  hint: z.string().optional(),
  metricsStatus: benchmarkMetricsStatusSchema.optional(),
  metrics: z.array(metricContractSchema).optional(),
  runId: z.string().optional(),
});
