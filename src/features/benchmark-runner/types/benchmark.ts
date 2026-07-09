import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";

export type BenchmarkRps = 100 | 500 | 1000 | 5000;

export type BenchmarkDurationSeconds = 10 | 30 | 60;

export type BenchmarkJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type BenchmarkMetricsStatus = "pending" | "ready" | "unavailable";

export type BenchmarkErrorCode =
  | "VALIDATION_ERROR"
  | "SESSION_UNAVAILABLE"
  | "SANDBOX_ERROR"
  | "RATE_LIMITED"
  | "QUEUE_UNAVAILABLE"
  | "NOT_FOUND"
  | "FORBIDDEN";

export interface BenchmarkProfile {
  rps: BenchmarkRps;
  durationSeconds: BenchmarkDurationSeconds;
}

export interface BenchmarkTargetDataset {
  family: string;
  tier: DatasetTier;
  version?: string;
}

export interface BenchmarkTarget {
  sql: string;
  parameters?: unknown[];
  dataset: BenchmarkTargetDataset;
}

export interface BenchmarkRunContext {
  trackSlug?: string;
  labSlug?: string;
}

export interface EnqueueBenchmarkInput {
  sessionId: string;
  profile: BenchmarkProfile;
  target: BenchmarkTarget;
  context?: BenchmarkRunContext;
}

export interface EnqueueBenchmarkResult {
  jobId: string;
  status: "queued";
  profile: {
    rps: number;
    durationSeconds: number;
  };
  createdAt: string;
}

export interface BenchmarkJobStatusResult {
  jobId: string;
  status: BenchmarkJobStatus;
  profile: {
    rps: number;
    durationSeconds: number;
  };
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  failureReason?: string;
  hint?: string;
  metricsStatus?: BenchmarkMetricsStatus;
  metrics?: MetricContract[];
  runId?: string;
}

export interface BenchmarkSandboxErrorDetails {
  violationCode?: string;
  hint?: string;
  policyVersion?: string;
}

export type BenchmarkErrorDetails = BenchmarkSandboxErrorDetails;
