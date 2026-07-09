import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";

export type ExplainMode = "explain" | "explain_analyze";

export type ExplainStatementKind = "explain" | "explain_analyze";

export type ExplainErrorCode =
  | "VALIDATION_ERROR"
  | "SANDBOX_ERROR"
  | "TIMEOUT"
  | "EXECUTION_ERROR";

export type DatasetNotReadyReason = "DATASET_NOT_READY";

export type SessionNotReadyReason = "SESSION_NOT_READY";

export type DatasetNotReadyStatus =
  | "not_started"
  | "preparing"
  | "resetting"
  | "failed";

export interface ExplainPlanNode {
  nodeType: string;
  relationName?: string;
  alias?: string;
  startupCost?: number;
  totalCost?: number;
  planRows?: number;
  planWidth?: number;
  actualStartupTime?: number;
  actualTotalTime?: number;
  actualRows?: number;
  actualLoops?: number;
  filter?: string;
  indexName?: string;
  indexCond?: string;
  joinType?: string;
  hashCond?: string;
  mergeCond?: string;
  sortKey?: string[];
  groupKey?: string[];
  output?: string[];
  children?: ExplainPlanNode[];
}

export interface ExplainDatasetIdentity {
  family: string;
  tier: DatasetTier;
  version?: string;
}

export interface ExplainRunContext {
  trackSlug?: string;
  labSlug?: string;
}

export interface RunExplainInput {
  sql: string;
  parameters: unknown[];
  explainMode: ExplainMode;
  dataset: ExplainDatasetIdentity;
  sessionId?: string;
  context?: ExplainRunContext;
}

export interface ExplainRunResult {
  plan: ExplainPlanNode;
  planningTimeMs?: number;
  executionTimeMs: number;
  explainMode: ExplainMode;
  statementKind: ExplainStatementKind;
  dataset: {
    family: string;
    tier: DatasetTier;
    version: string;
  };
  truncated?: boolean;
  rawPlanText?: string;
  metrics: MetricContract[];
  runId: string;
}

export interface ExplainSandboxErrorDetails {
  violationCode?: string;
  hint?: string;
  policyVersion?: string;
}

export interface ExplainDatasetNotReadyDetails {
  reason: DatasetNotReadyReason;
  status: DatasetNotReadyStatus;
  hint: string;
}

export interface ExplainSessionNotReadyDetails {
  reason: SessionNotReadyReason;
  hint: string;
}

export type ExplainErrorDetails =
  | ExplainSandboxErrorDetails
  | ExplainDatasetNotReadyDetails
  | ExplainSessionNotReadyDetails;
