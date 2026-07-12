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
  sql: z.string().min(1, "SQL is required"),
  exampleParameters: z.array(z.unknown()),
  paramHints: z.array(z.string()),
  description: z.string(),
});

export const labGuidedStepPayloadSchema = z.object({
  recommendedQuery: guidedSqlSchema.optional(),
  sql: z.string().min(1).optional(),
});

export const labSummaryDatasetHintSchema = z.object({
  family: z.string().min(1, "Dataset family is required"),
  version: z.string().min(1, "Dataset version is required"),
  recommendedTier: z.array(z.string()).min(1, "At least one tier is required"),
});

export const adminLabGuidedStepViewSchema = z.object({
  id: z.string(),
  labSlug: z.string(),
  displayOrder: z.number(),
  title: z.string(),
  instruction: z.string(),
  action: labGuidedStepActionSchema,
  payload: labGuidedStepPayloadSchema.nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const adminLabGuidedStepListResponseSchema = z.union([
  z.object({
    steps: z.array(adminLabGuidedStepViewSchema),
  }),
  z.array(adminLabGuidedStepViewSchema).transform((steps) => ({ steps })),
]);

export const adminLabCurriculumViewSchema = z.object({
  labSlug: z.string(),
  learningGoal: z.string(),
  theory: z.string(),
  recommendedQuery: guidedSqlSchema,
  recommendedCreateIndexSql: z.string().nullable(),
  recommendedDropIndexSql: z.string().nullable(),
  dataset: labSummaryDatasetHintSchema,
  quizRequired: z.boolean(),
  optionalBenchmarkNote: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const curriculumFormSchema = z.object({
  learningGoal: z.string().min(1, "Learning goal is required"),
  theory: z.string().min(1, "Theory is required"),
  recommendedQuerySql: z.string().min(1, "Recommended SQL is required"),
  recommendedQueryDescription: z.string(),
  recommendedQueryExampleParameters: z.string(),
  recommendedQueryParamHints: z.string(),
  recommendedCreateIndexSql: z.string().optional(),
  recommendedDropIndexSql: z.string().optional(),
  datasetFamily: z.string().min(1, "Dataset family is required"),
  datasetVersion: z.string().min(1, "Dataset version is required"),
  datasetRecommendedTier: z.string().min(1, "Recommended tiers are required"),
  quizRequired: z.enum(["true", "false"]),
  optionalBenchmarkNote: z.string().optional(),
});

export const guidedStepFormSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(120),
    instruction: z.string().min(1, "Instruction is required"),
    action: labGuidedStepActionSchema,
    displayOrder: z.coerce.number().int().min(0),
    /** DDL sql for create_index_sql / drop_index_sql */
    payloadSql: z.string().optional(),
    /** SELECT/EXPLAIN recommended query fields */
    payloadRecommendedSql: z.string().optional(),
    payloadRecommendedDescription: z.string().optional(),
    payloadRecommendedExampleParameters: z.string().optional(),
    payloadRecommendedParamHints: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const needsRecommendedQuery =
      value.action === "run_sql" ||
      value.action === "run_explain" ||
      value.action === "run_explain_analyze";
    const needsDdlSql =
      value.action === "create_index_sql" || value.action === "drop_index_sql";

    if (needsRecommendedQuery && !value.payloadRecommendedSql?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Recommended query SQL is required for this action",
        path: ["payloadRecommendedSql"],
      });
    }

    if (needsDdlSql && !value.payloadSql?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "DDL SQL is required for this action",
        path: ["payloadSql"],
      });
    }
  });

export type CurriculumFormValues = z.infer<typeof curriculumFormSchema>;
export type GuidedStepFormValues = z.infer<typeof guidedStepFormSchema>;
