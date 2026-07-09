import type { DatasetIdentity } from "@/features/dataset-loader/types/dataset";

export interface DatasetQueryScope {
  identity: DatasetIdentity;
  sessionId?: string;
}

function scopeKey(sessionId?: string): string {
  return sessionId ?? "global";
}

export const datasetKeys = {
  all: ["dataset-loader"] as const,
  status: (scope: DatasetQueryScope) =>
    [
      ...datasetKeys.all,
      "status",
      scope.identity,
      scopeKey(scope.sessionId),
    ] as const,
  metadata: (scope: DatasetQueryScope) =>
    [
      ...datasetKeys.all,
      "metadata",
      scope.identity,
      scopeKey(scope.sessionId),
    ] as const,
  prepare: (sessionId?: string) =>
    [...datasetKeys.all, "prepare", scopeKey(sessionId)] as const,
};
