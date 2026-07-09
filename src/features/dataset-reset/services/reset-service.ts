import {
  datasetPreparationStatusSchema,
  resetDatasetResultSchema,
} from "@/features/dataset-loader/schemas/dataset-schema";
import type {
  DatasetIdentity,
  DatasetPreparationStatus,
  ResetDatasetInput,
  ResetDatasetResult,
} from "@/features/dataset-loader/types/dataset";
import { apiRequest } from "@/shared/services/api-client";

function buildDatasetQueryString(
  identity: DatasetIdentity,
  sessionId?: string,
): string {
  const params = new URLSearchParams({
    family: identity.family,
    tier: identity.tier,
  });

  if (identity.version) {
    params.set("version", identity.version);
  }

  if (sessionId) {
    params.set("sessionId", sessionId);
  }

  return params.toString();
}

export async function resetDataset(
  input: ResetDatasetInput,
): Promise<ResetDatasetResult> {
  const data = await apiRequest<ResetDatasetResult>({
    path: "/datasets/reset",
    method: "POST",
    body: input,
    auth: true,
  });

  return resetDatasetResultSchema.parse(data);
}

export async function fetchResetStatus(
  identity: DatasetIdentity,
): Promise<DatasetPreparationStatus> {
  const query = buildDatasetQueryString(identity);

  const data = await apiRequest<DatasetPreparationStatus>({
    path: `/datasets/reset/status?${query}`,
    method: "GET",
    auth: true,
  });

  return datasetPreparationStatusSchema.parse(data);
}
