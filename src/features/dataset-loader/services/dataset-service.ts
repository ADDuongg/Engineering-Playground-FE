import {
  datasetMetadataSchema,
  datasetPreparationStatusSchema,
  prepareDatasetResultSchema,
} from "@/features/dataset-loader/schemas/dataset-schema";
import type {
  DatasetIdentity,
  DatasetMetadata,
  DatasetPreparationStatus,
  PrepareDatasetInput,
  PrepareDatasetResult,
} from "@/features/dataset-loader/types/dataset";
import { apiRequest } from "@/shared/services/api-client";

interface DatasetQueryOptions {
  identity: DatasetIdentity;
  sessionId?: string;
}

function buildDatasetQueryString({
  identity,
  sessionId,
}: DatasetQueryOptions): string {
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

export async function prepareDataset(
  input: PrepareDatasetInput,
): Promise<PrepareDatasetResult> {
  const data = await apiRequest<PrepareDatasetResult>({
    path: "/datasets/prepare",
    method: "POST",
    body: input,
    auth: true,
  });

  return prepareDatasetResultSchema.parse(data);
}

export async function fetchDatasetStatus(
  identity: DatasetIdentity,
  sessionId?: string,
): Promise<DatasetPreparationStatus> {
  const query = buildDatasetQueryString({ identity, sessionId });

  const data = await apiRequest<DatasetPreparationStatus>({
    path: `/datasets/prepare/status?${query}`,
    method: "GET",
    auth: true,
  });

  return datasetPreparationStatusSchema.parse(data);
}

export async function fetchDatasetMetadata(
  identity: DatasetIdentity,
  sessionId?: string,
): Promise<DatasetMetadata> {
  const query = buildDatasetQueryString({ identity, sessionId });

  const data = await apiRequest<DatasetMetadata>({
    path: `/datasets/metadata?${query}`,
    method: "GET",
    auth: true,
  });

  return datasetMetadataSchema.parse(data);
}
