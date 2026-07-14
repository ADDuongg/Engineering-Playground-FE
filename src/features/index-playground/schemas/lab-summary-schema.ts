import { z } from "zod";

export const labGuidedStepActionSchema = z.enum([
  // Database / SQL track
  "run_sql",
  "run_explain",
  "run_explain_analyze",
  "create_index_sql",
  "drop_index_sql",
  "optional_benchmark",
  // Frontend React track
  "render_component",
  "update_props",
  "update_state",
  "remount",
  "toggle_memo",
  "compare_reconciliation",
  "inspect_hooks",
  // Track-agnostic
  "compare_metrics",
  "take_quiz",
]);

export const guidedSqlSchema = z.object({
  sql: z.string(),
  exampleParameters: z.array(z.unknown()),
  paramHints: z.array(z.string()),
  description: z.string(),
});

export const labRecommendedQuerySchema = guidedSqlSchema;

export const reactScenarioPayloadSchema = z
  .object({
    scenarioId: z.string().optional(),
    componentSource: z.string().optional(),
    props: z.record(z.string(), z.unknown()).optional(),
    interactions: z.array(z.unknown()).optional(),
    options: z.record(z.string(), z.unknown()).optional(),
    description: z.string().optional(),
  })
  .passthrough();

export const labGuidedStepPayloadSchema = z
  .object({
    recommendedQuery: guidedSqlSchema.optional(),
    sql: z.string().min(1).optional(),
    reactScenario: reactScenarioPayloadSchema.optional(),
  })
  .passthrough();

export const labGuidedStepSchema = z.object({
  order: z.number(),
  title: z.string().min(1),
  instruction: z.string().min(1),
  action: labGuidedStepActionSchema,
  payload: labGuidedStepPayloadSchema.nullable(),
});

export const labSummaryDatasetSchema = z.object({
  family: z.string().min(1),
  version: z.string().min(1),
  recommendedTier: z.array(z.string()).min(1),
});

export const labSummaryResponseSchema = z.object({
  labSlug: z.string().min(1),
  trackSlug: z.string().min(1),
  title: z.string().min(1),
  learningGoal: z.string().min(1),
  theory: z.string().min(1),
  guidedSteps: z.array(labGuidedStepSchema),
  recommendedQuery: guidedSqlSchema,
  recommendedCreateIndexSql: z.string(),
  recommendedDropIndexSql: z.string(),
  quizRequired: z.boolean(),
  dataset: labSummaryDatasetSchema.nullable().optional(),
  config: z.record(z.string(), z.unknown()).nullable().optional(),
  optionalBenchmarkNote: z.string().nullable().optional(),
});
