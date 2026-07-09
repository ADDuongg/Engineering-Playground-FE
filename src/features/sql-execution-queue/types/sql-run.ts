import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import type { ExperimentRunResult } from "@/features/experiment-runner/types/experiment";
import type {
  JobFailureReason,
  JobLifecycleStatus,
} from "@/features/worker-queue/types/job";

export type SqlRunErrorCode =
  | "VALIDATION_ERROR"
  | "SESSION_UNAVAILABLE"
  | "DATASET_NOT_READY"
  | "SQL_RUN_INFLIGHT_LIMIT"
  | "RATE_LIMITED"
  | "QUEUE_UNAVAILABLE"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "UNAUTHORIZED";

export interface SqlRunDatasetIdentity {
  family: string;
  tier: DatasetTier;
  version?: string;
}

export interface SqlRunContext {
  trackSlug?: string;
  labSlug?: string;
}

export interface EnqueueSqlRunInput {
  sql: string;
  parameters?: unknown[];
  sessionId: string;
  dataset: SqlRunDatasetIdentity;
  context?: SqlRunContext;
}

export interface EnqueueSqlRunResult {
  jobId: string;
  jobType: "sql-execution";
  status: "queued";
  createdAt: string;
}

export interface SqlRunStatusResult {
  jobId: string;
  jobType: "sql-execution";
  status: JobLifecycleStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  attemptCount: number;
  maxAttempts: number;
  failureReason?: JobFailureReason;
  failureMessage?: string;
  statementKind?: string;
  datasetFamily?: string;
  datasetTier?: string;
  executionResult?: ExperimentRunResult;
}

export interface SqlRunSandboxErrorDetails {
  violationCode?: string;
  hint?: string;
  policyVersion?: string;
}

export interface SqlRunDatasetNotReadyDetails {
  reason: "DATASET_NOT_READY";
  status: "not_started" | "preparing" | "resetting" | "failed";
  hint: string;
}

export type SqlRunErrorDetails =
  | SqlRunSandboxErrorDetails
  | SqlRunDatasetNotReadyDetails;
