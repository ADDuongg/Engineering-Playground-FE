export type DatasetTier = "100k" | "1m" | "10m";

export type DatasetPreparationState =
  | "not_started"
  | "preparing"
  | "resetting"
  | "ready"
  | "failed";

export interface DatasetIdentity {
  family: string;
  tier: DatasetTier;
  version?: string;
}

export interface PrepareDatasetInput extends DatasetIdentity {
  sessionId?: string;
  context?: {
    requestId?: string;
    labSlug?: string;
    userId?: string;
  };
}

export interface PrepareDatasetResult {
  family: string;
  version: string;
  tier: DatasetTier;
  status: "ready" | "preparing";
  durationMs?: number;
  startedAt?: string;
}

export interface DatasetPreparationError {
  code: string;
  message: string;
  hint?: string;
}

export interface DatasetPreparationStatus extends DatasetIdentity {
  version: string;
  status: DatasetPreparationState;
  startedAt?: string;
  completedAt?: string | null;
  durationMs?: number | null;
  error?: DatasetPreparationError | null;
}

export interface DatasetTableMetadata {
  name: string;
  label: string;
  description: string;
  targetRowCount: number;
  actualRowCount: number | null;
}

export interface DatasetMetadata extends DatasetIdentity {
  version: string;
  familyLabel: string;
  status: DatasetPreparationState;
  tables: DatasetTableMetadata[];
}

export type DatasetErrorCode =
  | "SEED_EXECUTION_FAILED"
  | "MANIFEST_NOT_FOUND"
  | "UNKNOWN_TIER"
  | "RESET_EXECUTION_FAILED"
  | "RESET_LOCK_CONFLICT";

export interface DatasetErrorDetails {
  code?: DatasetErrorCode;
  hint?: string;
}

export interface ResetDatasetInput extends DatasetIdentity {
  sessionId?: string;
  context?: {
    requestId?: string;
    labSlug?: string;
    userId?: string;
  };
}

export interface ResetDatasetResult {
  jobId: string;
  jobType: "dataset-reset";
  status: "queued";
  createdAt: string;
  family: string;
  version: string;
  tier: DatasetTier;
}
