import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";

export type BenchmarkMetricsStatus = "pending" | "ready" | "unavailable";

export type BenchmarkMetricsErrorCode =
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "VALIDATION_ERROR";

export interface BenchmarkMetricsProfile {
  rps: number;
  durationSeconds: number;
}

export interface GetBenchmarkMetricsQuery {
  sessionId?: string;
}

export interface BenchmarkMetricsByJobResponse {
  jobId: string;
  runId?: string;
  status: string;
  profile: BenchmarkMetricsProfile;
  metricsStatus: BenchmarkMetricsStatus;
  metrics: MetricContract[];
  createdAt?: string;
  hint?: string;
}

export interface GetBenchmarkMetricHistoryQuery {
  sessionId: string;
  labSlug?: string;
  limit?: number;
}

export interface BenchmarkMetricHistoryDataset {
  family: string;
  tier: DatasetTier | string;
  version: string;
}

export interface BenchmarkMetricHistorySnapshot {
  runId: string;
  jobId: string;
  runType: "benchmark";
  createdAt: string;
  profile: BenchmarkMetricsProfile;
  metrics: MetricContract[];
  dataset: BenchmarkMetricHistoryDataset;
}

export interface BenchmarkMetricHistoryResponse {
  snapshots: BenchmarkMetricHistorySnapshot[];
  retentionLimit: number;
}
