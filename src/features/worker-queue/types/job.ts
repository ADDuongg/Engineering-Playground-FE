import type { DatasetTier } from "@/features/dataset-loader/types/dataset";

export type JobType = "benchmark" | "dataset-reset" | "sql-execution";

export type JobLifecycleStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type JobFailureReason =
  | "VALIDATION_ERROR"
  | "SESSION_UNAVAILABLE"
  | "TIMEOUT"
  | "EXECUTION_ERROR"
  | "STORAGE_ERROR"
  | "QUEUE_UNAVAILABLE";

export type JobErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "SESSION_UNAVAILABLE"
  | "RATE_LIMITED"
  | "QUEUE_UNAVAILABLE";

export interface GetJobStatusResult {
  jobId: string;
  jobType: JobType;
  status: JobLifecycleStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  attemptCount: number;
  maxAttempts: number;
  failureReason?: JobFailureReason;
  failureMessage?: string;
  payloadSummary?: Record<string, unknown>;
}

export interface EnqueueDatasetResetResult {
  jobId: string;
  jobType: "dataset-reset";
  status: "queued";
  createdAt: string;
  family: string;
  version: string;
  tier: DatasetTier;
}
