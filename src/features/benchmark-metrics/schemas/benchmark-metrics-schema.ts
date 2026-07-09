import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import { metricContractSchema } from "@/features/metrics-pipeline/schemas/metrics-schema";
import { z } from "zod";

export const benchmarkMetricsStatusSchema = z.enum([
  "pending",
  "ready",
  "unavailable",
]);

export const benchmarkMetricsProfileSchema = z.object({
  rps: z.number(),
  durationSeconds: z.number(),
});

export const getBenchmarkMetricsQuerySchema = z.object({
  sessionId: z.string().min(1).optional(),
});

export const benchmarkMetricsByJobResponseSchema = z.object({
  jobId: z.string(),
  runId: z.string().optional(),
  status: z.string(),
  profile: benchmarkMetricsProfileSchema,
  metricsStatus: benchmarkMetricsStatusSchema,
  metrics: z.array(metricContractSchema),
  createdAt: z.string().optional(),
  hint: z.string().optional(),
});

export const getBenchmarkMetricHistoryQuerySchema = z.object({
  sessionId: z.string().min(1),
  labSlug: z.string().optional(),
  limit: z.number().int().positive().optional(),
});

export const benchmarkMetricHistorySnapshotSchema = z.object({
  runId: z.string(),
  jobId: z.string(),
  runType: z.literal("benchmark"),
  createdAt: z.string(),
  profile: benchmarkMetricsProfileSchema,
  metrics: z.array(metricContractSchema),
  dataset: z.object({
    family: z.string(),
    tier: z.union([datasetTierSchema, z.string()]),
    version: z.string(),
  }),
});

export const benchmarkMetricHistoryResponseSchema = z.object({
  snapshots: z.array(benchmarkMetricHistorySnapshotSchema),
  retentionLimit: z.number(),
});
