import {
  parseJsonArray,
  parseOptionalJsonObject,
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
import type { ReactScenarioPayload } from "@/shared/labs/lab-summary";

export function curriculumFormToCreateRequest(
  values: CurriculumFormValues,
): CreateLabCurriculumRequest {
  const recommendedSql = values.recommendedQuerySql?.trim() ?? "";
  const datasetFamily = values.datasetFamily?.trim() ?? "";

  return {
    learningGoal: values.learningGoal.trim(),
    theory: values.theory.trim(),
    recommendedQuery: recommendedSql
      ? {
          sql: recommendedSql,
          description: values.recommendedQueryDescription?.trim() ?? "",
          exampleParameters: parseJsonArray(
            values.recommendedQueryExampleParameters ?? "[]",
            "example parameters",
          ),
          paramHints: parseJsonArray(
            values.recommendedQueryParamHints ?? "[]",
            "param hints",
          ).map(String),
        }
      : null,
    recommendedCreateIndexSql: values.recommendedCreateIndexSql?.trim()
      ? values.recommendedCreateIndexSql.trim()
      : null,
    recommendedDropIndexSql: values.recommendedDropIndexSql?.trim()
      ? values.recommendedDropIndexSql.trim()
      : null,
    dataset: datasetFamily
      ? {
          family: datasetFamily,
          version: values.datasetVersion?.trim() || "1",
          recommendedTier: parseTierList(
            values.datasetRecommendedTier?.trim() || "small",
          ),
        }
      : null,
    config: parseOptionalJsonObject(values.configJson, "config"),
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

  if (
    values.action === "render_component" ||
    values.action === "update_props" ||
    values.action === "update_state" ||
    values.action === "remount" ||
    values.action === "toggle_memo" ||
    values.action === "compare_reconciliation" ||
    values.action === "inspect_hooks"
  ) {
    const raw = values.payloadReactScenarioJson?.trim() ?? "";
    if (!raw) {
      return null;
    }

    const reactScenario = parseOptionalJsonObject(
      raw,
      "react scenario",
    ) as ReactScenarioPayload | null;

    if (!reactScenario) {
      return null;
    }

    return labGuidedStepPayloadSchema.parse({ reactScenario });
  }

  return null;
}
