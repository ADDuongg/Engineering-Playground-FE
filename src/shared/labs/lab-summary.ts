export type LabGuidedStepAction =
  | "run_sql"
  | "run_explain"
  | "run_explain_analyze"
  | "create_index_sql"
  | "drop_index_sql"
  | "compare_metrics"
  | "take_quiz"
  | "optional_benchmark";

export interface LabGuidedStep {
  order: number;
  title: string;
  instruction: string;
  action: LabGuidedStepAction;
}

export interface LabRecommendedQuery {
  sql: string;
  /** Values for $1..$n — clients MUST send these (or overrides) when running/explaining the guided query */
  exampleParameters: unknown[];
  paramHints: string[];
  description: string;
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
  recommendedQuery: LabRecommendedQuery;
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
