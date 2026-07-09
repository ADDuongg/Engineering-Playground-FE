import { datasetTierSchema } from "@/features/dataset-loader/schemas/dataset-schema";
import { z } from "zod";

export const experimentSessionStatusSchema = z.enum([
  "provisioning",
  "ready",
  "expired",
  "failed",
]);

export const provisionExperimentSessionInputSchema = z.object({
  clientSessionToken: z.string().min(1),
  trackSlug: z.string().min(1),
  labSlug: z.string().min(1),
  dataset: z.object({
    family: z.string().min(1),
    tier: datasetTierSchema,
    version: z.string().optional(),
  }),
  context: z
    .object({
      requestId: z.string().optional(),
    })
    .optional(),
});

export const experimentSessionSchema = z.object({
  sessionId: z.string().min(1),
  status: experimentSessionStatusSchema,
  trackSlug: z.string(),
  labSlug: z.string(),
  runtimeAdapter: z.enum([
    "playground_postgresql",
    "playground_redis",
    "headless_react_sandbox",
    "simulation_engine",
  ]),
  schemaName: z.string().optional(),
  dataset: z
    .object({
      family: z.string(),
      tier: datasetTierSchema,
      version: z.string(),
    })
    .optional(),
  createdAt: z.string(),
  lastActivityAt: z.string().optional(),
  expiresAt: z.string().optional(),
  reused: z.boolean().optional(),
});

export const teardownExperimentSessionResultSchema = z.object({
  sessionId: z.string(),
  status: z.literal("expired"),
  durationMs: z.number(),
});
