import type { DatasetTier } from "@/features/dataset-loader/types/dataset";
import type { RuntimeAdapterType } from "@/features/tracks/types/track";

export type ExperimentSessionStatus =
  | "provisioning"
  | "ready"
  | "expired"
  | "failed";

export interface ExperimentSessionDataset {
  family: string;
  tier: DatasetTier;
  version: string;
}

export interface ProvisionExperimentSessionInput {
  clientSessionToken: string;
  trackSlug: string;
  labSlug: string;
  dataset: {
    family: string;
    tier: DatasetTier;
    version?: string;
  };
  context?: {
    requestId?: string;
  };
}

export interface ExperimentSession {
  sessionId: string;
  status: ExperimentSessionStatus;
  trackSlug: string;
  labSlug: string;
  runtimeAdapter: RuntimeAdapterType;
  schemaName?: string;
  dataset?: ExperimentSessionDataset;
  createdAt: string;
  lastActivityAt?: string;
  expiresAt?: string;
  reused?: boolean;
}

export interface TeardownExperimentSessionResult {
  sessionId: string;
  status: "expired";
  durationMs: number;
}

export type IsolationErrorReason =
  | "ISOLATION_UNSUPPORTED_TRACK"
  | "ISOLATION_PROVISION_FAILED";

export interface IsolationErrorDetails {
  reason?: IsolationErrorReason;
  trackSlug?: string;
  hint?: string;
}
