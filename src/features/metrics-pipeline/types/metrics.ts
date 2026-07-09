import type { DatasetTier } from "@/features/dataset-loader/types/dataset";

export type MetricRunType = "execution" | "explain" | "benchmark";

export type MetricErrorCode = "VALIDATION_ERROR" | "NOT_FOUND";

export interface MetricContract {
  key: string;
  label: string;
  unit: string;
  value: number;
  group: string;
}

export interface MetricSnapshotDataset {
  family: string;
  tier: DatasetTier | string;
  version: string;
}

export interface MetricSnapshot {
  runId: string;
  runType: MetricRunType;
  createdAt: string;
  metrics: MetricContract[];
  dataset: MetricSnapshotDataset;
}

export interface GetMetricHistoryQuery {
  sessionId: string;
  labSlug?: string;
  limit?: number;
}

export interface MetricHistoryResponse {
  snapshots: MetricSnapshot[];
  retentionLimit: number;
}
