import { metricContractSchema } from "@/features/metrics-pipeline/schemas/metrics-schema";
import { z } from "zod";

export const reactSandboxKeyStrategySchema = z.enum(["index", "stable"]);

export const reactSandboxRunOptionsSchema = z
  .object({
    memo: z.boolean().optional(),
    keyStrategy: reactSandboxKeyStrategySchema.optional(),
  })
  .strict();

export const reactSandboxInteractionSchema = z.object({
  type: z.string().min(1),
  payload: z.unknown().optional(),
});

/**
 * Client request body. `componentSource` is intentionally omitted from the
 * schema — if callers pass it, Zod `.strict()` on the object below rejects it
 * when validated, and the mapper never includes it.
 */
export const runReactExperimentInputSchema = z
  .object({
    action: z.string().min(1),
    fixtureId: z.string().min(1),
    labSlug: z.string().min(1),
    trackSlug: z.string().min(1).optional(),
    props: z.record(z.string(), z.unknown()).optional(),
    interactions: z.array(reactSandboxInteractionSchema).optional(),
    options: reactSandboxRunOptionsSchema.optional(),
  })
  .strict();

export const reactExperimentRunRawSchema = z.object({
  action: z.string(),
  scenarioId: z.string(),
  interactionCount: z.number(),
  notes: z.array(z.string()),
});

export const reactExperimentRunResultSchema = z.object({
  adapterType: z.literal("headless_react_sandbox"),
  metrics: z.array(metricContractSchema),
  raw: reactExperimentRunRawSchema,
  runId: z.string().optional(),
});
