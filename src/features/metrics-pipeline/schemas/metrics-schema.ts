import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import { z } from "zod";

export const metricContractSchema = z.object({
  key: z.string(),
  label: z.string(),
  unit: z.string(),
  value: z.number(),
  group: z.string(),
});

export const metricRunTypeSchema = z.enum(["execution", "explain", "benchmark"]);

export const metricSnapshotSchema = z.object({
  runId: z.string(),
  runType: metricRunTypeSchema,
  createdAt: z.string(),
  metrics: z.array(metricContractSchema),
  dataset: z.object({
    family: z.string(),
    tier: z.union([datasetTierSchema, z.string()]),
    version: z.string(),
  }),
});

export const metricHistoryResponseSchema = z.object({
  snapshots: z.array(metricSnapshotSchema),
  retentionLimit: z.number(),
});

export const getMetricHistoryQuerySchema = z.object({
  sessionId: z.string().min(1),
  labSlug: z.string().optional(),
  limit: z.number().int().positive().optional(),
});
