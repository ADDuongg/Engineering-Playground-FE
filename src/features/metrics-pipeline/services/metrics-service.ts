import {
  getMetricHistoryQuerySchema,
  metricHistoryResponseSchema,
} from "@/features/metrics-pipeline/schemas/metrics-schema";
import type {
  GetMetricHistoryQuery,
  MetricHistoryResponse,
} from "@/features/metrics-pipeline/types/metrics";
import { apiRequest } from "@/shared/services/api-client";

function buildMetricHistoryQueryString(query: GetMetricHistoryQuery): string {
  const parsed = getMetricHistoryQuerySchema.parse(query);
  const params = new URLSearchParams({ sessionId: parsed.sessionId });

  if (parsed.labSlug) {
    params.set("labSlug", parsed.labSlug);
  }

  if (parsed.limit !== undefined) {
    params.set("limit", String(parsed.limit));
  }

  return params.toString();
}

export async function fetchMetricHistory(
  query: GetMetricHistoryQuery,
): Promise<MetricHistoryResponse> {
  const search = buildMetricHistoryQueryString(query);

  const data = await apiRequest<MetricHistoryResponse>({
    path: `/experiments/metrics/history?${search}`,
    method: "GET",
    auth: true,
  });

  return metricHistoryResponseSchema.parse(data);
}
