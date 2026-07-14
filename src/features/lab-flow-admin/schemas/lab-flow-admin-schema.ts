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
  sql: z.string().min(1, "SQL is required"),
  exampleParameters: z.array(z.unknown()),
  paramHints: z.array(z.string()),
  description: z.string(),
});

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
  recommendedQuery: guidedSqlSchema.nullable(),
  recommendedCreateIndexSql: z.string().nullable(),
  recommendedDropIndexSql: z.string().nullable(),
  dataset: labSummaryDatasetHintSchema.nullable(),
  config: z.record(z.string(), z.unknown()).nullable(),
  quizRequired: z.boolean(),
  optionalBenchmarkNote: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** Curriculum form — SQL/dataset optional for non-SQL tracks (omit → null). */
export const curriculumFormSchema = z.object({
  learningGoal: z.string().min(1, "Learning goal is required"),
  theory: z.string().min(1, "Theory is required"),
  recommendedQuerySql: z.string().optional(),
  recommendedQueryDescription: z.string().optional(),
  recommendedQueryExampleParameters: z.string().optional(),
  recommendedQueryParamHints: z.string().optional(),
  recommendedCreateIndexSql: z.string().optional(),
  recommendedDropIndexSql: z.string().optional(),
  datasetFamily: z.string().optional(),
  datasetVersion: z.string().optional(),
  datasetRecommendedTier: z.string().optional(),
  configJson: z.string().optional(),
  quizRequired: z.enum(["true", "false"]),
  optionalBenchmarkNote: z.string().optional(),
});

const REACT_GUIDED_ACTIONS = new Set([
  "render_component",
  "update_props",
  "update_state",
  "remount",
  "toggle_memo",
  "compare_reconciliation",
  "inspect_hooks",
]);

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
    /** React scenario JSON for React-track actions */
    payloadReactScenarioJson: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    const needsRecommendedQuery =
      value.action === "run_sql" ||
      value.action === "run_explain" ||
      value.action === "run_explain_analyze";
    const needsDdlSql =
      value.action === "create_index_sql" || value.action === "drop_index_sql";
    const needsReactScenario = REACT_GUIDED_ACTIONS.has(value.action);

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

    if (needsReactScenario && !value.payloadReactScenarioJson?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "React scenario JSON is required for this action",
        path: ["payloadReactScenarioJson"],
      });
    }
  });

export type CurriculumFormValues = z.infer<typeof curriculumFormSchema>;
export type GuidedStepFormValues = z.infer<typeof guidedStepFormSchema>;
