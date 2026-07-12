export type LabGuidedStepAction =
  | "run_sql"
  | "run_explain"
  | "run_explain_analyze"
  | "create_index_sql"
  | "drop_index_sql"
  | "compare_metrics"
  | "take_quiz"
  | "optional_benchmark";

/** Bound SQL for SELECT / EXPLAIN guided steps */
export interface GuidedSql {
  sql: string;
  /** Values for $1..$n — clients MUST send these (or overrides) when running/explaining */
  exampleParameters: unknown[];
  paramHints: string[];
  description: string;
}

/** @deprecated Prefer GuidedSql — same shape */
export type LabRecommendedQuery = GuidedSql;

/**
 * Per-step Apply content. Primary source for FE "Apply query" / create / drop buttons.
 */
export interface LabGuidedStepPayload {
  /** SELECT / EXPLAIN — use for run_sql, run_explain, run_explain_analyze */
  recommendedQuery?: GuidedSql;
  /** DDL — use for create_index_sql, drop_index_sql with parameters: [] */
  sql?: string;
}

export interface LabGuidedStep {
  order: number;
  title: string;
  instruction: string;
  action: LabGuidedStepAction;
  /** null when step has no Apply SQL (compare_metrics, take_quiz, …) */
  payload: LabGuidedStepPayload | null;
}

export interface LabSummaryDataset {
  family: string;
  version: string;
  recommendedTier: string[];
}

export interface LabSummaryResponse {
  labSlug: string;
  trackSlug: string;
  title: string;
  learningGoal: string;
  theory: string;
  guidedSteps: LabGuidedStep[];
  /**
   * Compatibility / fallback only.
   * Prefer guidedSteps[i].payload for Apply buttons.
   */
  recommendedQuery: GuidedSql;
  recommendedCreateIndexSql: string;
  recommendedDropIndexSql: string;
  quizRequired: boolean;
  dataset: LabSummaryDataset;
  optionalBenchmarkNote?: string | null;
}

export const INDEX_PLAYGROUND_SCAN_METRIC_KEYS = [
  "rows_scanned",
  "seq_scan_used",
  "index_scan_used",
  "planning_time_ms",
  "plan_execution_time_ms",
] as const;

export type IndexPlaygroundScanMetricKey =
  (typeof INDEX_PLAYGROUND_SCAN_METRIC_KEYS)[number];

export function resolveApplySql(step: LabGuidedStep): {
  sql: string;
  parameters: unknown[];
} | null {
  if (!step.payload) {
    return null;
  }

  switch (step.action) {
    case "run_sql":
    case "run_explain":
    case "run_explain_analyze": {
      const query = step.payload.recommendedQuery;
      if (!query?.sql) {
        return null;
      }
      return {
        sql: query.sql,
        parameters: query.exampleParameters ?? [],
      };
    }
    case "create_index_sql":
    case "drop_index_sql": {
      if (!step.payload.sql) {
        return null;
      }
      return { sql: step.payload.sql, parameters: [] };
    }
    default:
      return null;
  }
}
