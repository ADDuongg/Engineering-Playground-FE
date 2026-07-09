import type { DatasetIdentity } from "@/features/dataset-loader/types/dataset";

function scopeKey(sessionId?: string): string {
  return sessionId ?? "global";
}

export const datasetResetKeys = {
  all: ["dataset-reset"] as const,
  status: (identity: DatasetIdentity, sessionId?: string) =>
    [...datasetResetKeys.all, "status", identity, scopeKey(sessionId)] as const,
  reset: (sessionId?: string) =>
    [...datasetResetKeys.all, "reset", scopeKey(sessionId)] as const,
};
