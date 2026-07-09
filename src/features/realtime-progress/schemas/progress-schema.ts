import { z } from "zod";

export const benchmarkProgressPhaseSchema = z.enum([
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
]);

export const elapsedBasisSchema = z.enum(["queue", "execution"]);

export const partialMetricSchema = z.object({
  key: z.string(),
  label: z.string(),
  unit: z.string(),
  value: z.number(),
  group: z.string(),
  provisional: z.literal(true),
});

export const benchmarkProgressSnapshotSchema = z.object({
  jobId: z.string(),
  phase: benchmarkProgressPhaseSchema,
  elapsedMs: z.number(),
  elapsedBasis: elapsedBasisSchema,
  currentRps: z.number().nullable().optional(),
  partialMetrics: z.array(partialMetricSchema).optional(),
  provisional: z.literal(true),
  terminal: z.boolean(),
  profile: z
    .object({
      rps: z.number(),
      durationSeconds: z.number(),
    })
    .optional(),
  updatedAt: z.string(),
  hint: z.string().optional(),
});

export const progressStreamErrorPayloadSchema = z.object({
  code: z.string(),
  message: z.string(),
});

export const observeBenchmarkProgressQuerySchema = z.object({
  sessionId: z.string().min(1).optional(),
});
