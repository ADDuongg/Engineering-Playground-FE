import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";
import type { SqlStatementKind } from "@/features/sql-sandbox/types/sandbox";

export type ExperimentErrorCode =
  | "VALIDATION_ERROR"
  | "SANDBOX_ERROR"
  | "TIMEOUT"
  | "EXECUTION_ERROR";

export type DatasetNotReadyReason = "DATASET_NOT_READY";

export type DatasetNotReadyStatus =
  | "not_started"
  | "preparing"
  | "resetting"
  | "failed";

export interface ExperimentDatasetIdentity {
  family: string;
  tier: DatasetTier;
  version?: string;
}

export interface ExperimentRunContext {
  trackSlug?: string;
  labSlug?: string;
}

export interface RunExperimentSqlInput {
  sql: string;
  parameters: unknown[];
  dataset: ExperimentDatasetIdentity;
  sessionId?: string;
  context?: ExperimentRunContext;
}

export interface ExperimentResultField {
  name: string;
  dataTypeId: number;
}

export interface ExperimentRunResult {
  rows: Record<string, unknown>[];
  rowCount: number;
  truncated: boolean;
  executionTimeMs: number;
  fields?: ExperimentResultField[];
  dataset: {
    family: string;
    tier: DatasetTier;
    version: string;
  };
  statementKind: SqlStatementKind;
  metrics: MetricContract[];
  runId: string;
}

export interface ExperimentSandboxErrorDetails {
  violationCode?: string;
  hint?: string;
  policyVersion?: string;
}

export interface ExperimentDatasetNotReadyDetails {
  reason: DatasetNotReadyReason;
  status: DatasetNotReadyStatus;
  hint: string;
}

export type ExperimentErrorDetails =
  | ExperimentSandboxErrorDetails
  | ExperimentDatasetNotReadyDetails;
