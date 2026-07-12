import { z } from "zod";

export const labGuidedStepActionSchema = z.enum([
  "run_sql",
  "run_explain",
  "run_explain_analyze",
  "create_index_sql",
  "drop_index_sql",
  "compare_metrics",
  "take_quiz",
  "optional_benchmark",
]);

export const guidedSqlSchema = z.object({
  sql: z.string().min(1),
  exampleParameters: z.array(z.unknown()),
  paramHints: z.array(z.string()),
  description: z.string(),
});

export const labRecommendedQuerySchema = guidedSqlSchema;

export const labGuidedStepPayloadSchema = z.object({
  recommendedQuery: guidedSqlSchema.optional(),
  sql: z.string().min(1).optional(),
});

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
  recommendedCreateIndexSql: z.string().min(1),
  recommendedDropIndexSql: z.string().min(1),
  quizRequired: z.boolean(),
  dataset: labSummaryDatasetSchema,
  optionalBenchmarkNote: z.string().nullable().optional(),
});
