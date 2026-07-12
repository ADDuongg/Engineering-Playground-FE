import {
  parseJsonArray,
  parseTierList,
} from "@/features/lab-flow-admin/utils/parse-form-json";
import type {
  CreateLabCurriculumRequest,
  LabGuidedStepPayload,
  UpdateLabCurriculumRequest,
} from "@/features/lab-flow-admin/types/lab-flow-admin";
import type {
  CurriculumFormValues,
  GuidedStepFormValues,
} from "@/features/lab-flow-admin/schemas/lab-flow-admin-schema";
import { labGuidedStepPayloadSchema } from "@/features/lab-flow-admin/schemas/lab-flow-admin-schema";

export function curriculumFormToCreateRequest(
  values: CurriculumFormValues,
): CreateLabCurriculumRequest {
  return {
    learningGoal: values.learningGoal.trim(),
    theory: values.theory.trim(),
    recommendedQuery: {
      sql: values.recommendedQuerySql.trim(),
      description: values.recommendedQueryDescription.trim(),
      exampleParameters: parseJsonArray(
        values.recommendedQueryExampleParameters,
        "example parameters",
      ),
      paramHints: parseJsonArray(
        values.recommendedQueryParamHints,
        "param hints",
      ).map(String),
    },
    recommendedCreateIndexSql: values.recommendedCreateIndexSql?.trim()
      ? values.recommendedCreateIndexSql.trim()
      : null,
    recommendedDropIndexSql: values.recommendedDropIndexSql?.trim()
      ? values.recommendedDropIndexSql.trim()
      : null,
    dataset: {
      family: values.datasetFamily.trim(),
      version: values.datasetVersion.trim(),
      recommendedTier: parseTierList(values.datasetRecommendedTier),
    },
    quizRequired: values.quizRequired === "true",
    optionalBenchmarkNote: values.optionalBenchmarkNote?.trim()
      ? values.optionalBenchmarkNote.trim()
      : null,
  };
}

export function curriculumFormToUpdateRequest(
  values: CurriculumFormValues,
): UpdateLabCurriculumRequest {
  return curriculumFormToCreateRequest(values);
}

/**
 * Build admin step payload from structured form fields.
 * Prefer editing step payload for Apply content (curriculum SQL is fallback only).
 */
export function guidedStepFormToPayload(
  values: GuidedStepFormValues,
): LabGuidedStepPayload | null {
  if (
    values.action === "run_sql" ||
    values.action === "run_explain" ||
    values.action === "run_explain_analyze"
  ) {
    const sql = values.payloadRecommendedSql?.trim() ?? "";
    if (!sql) {
      return null;
    }

    const payload: LabGuidedStepPayload = {
      recommendedQuery: {
        sql,
        description: values.payloadRecommendedDescription?.trim() ?? "",
        exampleParameters: parseJsonArray(
          values.payloadRecommendedExampleParameters ?? "[]",
          "example parameters",
        ),
        paramHints: parseJsonArray(
          values.payloadRecommendedParamHints ?? "[]",
          "param hints",
        ).map(String),
      },
    };

    return labGuidedStepPayloadSchema.parse(payload);
  }

  if (
    values.action === "create_index_sql" ||
    values.action === "drop_index_sql"
  ) {
    const sql = values.payloadSql?.trim() ?? "";
    if (!sql) {
      return null;
    }

    return labGuidedStepPayloadSchema.parse({ sql });
  }

  return null;
}
