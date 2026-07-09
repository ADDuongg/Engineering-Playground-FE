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

export const labGuidedStepSchema = z.object({
  order: z.number(),
  title: z.string().min(1),
  instruction: z.string().min(1),
  action: labGuidedStepActionSchema,
});

export const labRecommendedQuerySchema = z.object({
  sql: z.string().min(1),
  exampleParameters: z.array(z.unknown()).min(1),
  paramHints: z.array(z.string()),
  description: z.string(),
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
  recommendedQuery: labRecommendedQuerySchema,
  recommendedCreateIndexSql: z.string().min(1),
  recommendedDropIndexSql: z.string().min(1),
  quizRequired: z.boolean(),
  dataset: labSummaryDatasetSchema,
  optionalBenchmarkNote: z.string().nullable().optional(),
});
