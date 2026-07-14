export type LabGuidedStepAction =
  // Database / SQL track
  | "run_sql"
  | "run_explain"
  | "run_explain_analyze"
  | "create_index_sql"
  | "drop_index_sql"
  | "optional_benchmark"
  // Frontend React track (headless React sandbox runtime)
  | "render_component"
  | "update_props"
  | "update_state"
  | "remount"
  | "toggle_memo"
  | "compare_reconciliation"
  | "inspect_hooks"
  // Track-agnostic
  | "compare_metrics"
  | "take_quiz";

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
 * Per-step React scenario (headless React sandbox). Executable content for
 * React guided steps lives here — never in curriculum SQL/dataset columns.
 */
export interface ReactScenarioPayload {
  scenarioId?: string;
  componentSource?: string;
  props?: Record<string, unknown>;
  interactions?: unknown[];
  options?: {
    memo?: boolean;
    keyStrategy?: "index" | "stable";
    [key: string]: unknown;
  };
  description?: string;
}

/**
 * Per-step Apply content. Primary source for FE "Apply query" / create / drop buttons.
 */
export interface LabGuidedStepPayload {
  /** SELECT / EXPLAIN — use for run_sql, run_explain, run_explain_analyze */
  recommendedQuery?: GuidedSql;
  /** DDL — use for create_index_sql, drop_index_sql with parameters: [] */
  sql?: string;
  /** React scenario (render_component, inspect_hooks, compare_reconciliation, …) */
  reactScenario?: ReactScenarioPayload;
  [key: string]: unknown;
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
   * Database/SQL-only — may be empty placeholder for non-SQL tracks.
   */
  recommendedQuery: GuidedSql;
  recommendedCreateIndexSql: string;
  recommendedDropIndexSql: string;
  quizRequired: boolean;
  /** Database/SQL-only; omitted/null for tracks without a playground dataset (e.g. React). */
  dataset?: LabSummaryDataset | null;
  /** Optional per-track lab-level metadata. */
  config?: Record<string, unknown> | null;
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

export function resolveApplyReactScenario(
  step: LabGuidedStep,
): ReactScenarioPayload | null {
  if (!step.payload?.reactScenario) {
    return null;
  }

  switch (step.action) {
    case "render_component":
    case "update_props":
    case "update_state":
    case "remount":
    case "toggle_memo":
    case "compare_reconciliation":
    case "inspect_hooks":
      return step.payload.reactScenario;
    default:
      return null;
  }
}
