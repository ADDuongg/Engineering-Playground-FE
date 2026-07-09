import {
  benchmarkMetricHistoryResponseSchema,
  benchmarkMetricsByJobResponseSchema,
  getBenchmarkMetricHistoryQuerySchema,
  getBenchmarkMetricsQuerySchema,
} from "@/features/benchmark-metrics/schemas/benchmark-metrics-schema";
import type {
  BenchmarkMetricHistoryResponse,
  BenchmarkMetricsByJobResponse,
  GetBenchmarkMetricHistoryQuery,
  GetBenchmarkMetricsQuery,
} from "@/features/benchmark-metrics/types/benchmark-metrics";
import { apiRequest } from "@/shared/services/api-client";

function buildMetricsByJobQueryString(
  query?: GetBenchmarkMetricsQuery,
): string {
  if (!query) {
    return "";
  }

  const parsed = getBenchmarkMetricsQuerySchema.parse(query);
  if (!parsed.sessionId) {
    return "";
  }

  return `?${new URLSearchParams({ sessionId: parsed.sessionId }).toString()}`;
}

function buildMetricHistoryQueryString(
  query: GetBenchmarkMetricHistoryQuery,
): string {
  const parsed = getBenchmarkMetricHistoryQuerySchema.parse(query);
  const params = new URLSearchParams({ sessionId: parsed.sessionId });

  if (parsed.labSlug) {
    params.set("labSlug", parsed.labSlug);
  }

  if (parsed.limit !== undefined) {
    params.set("limit", String(parsed.limit));
  }

  return params.toString();
}

export async function fetchBenchmarkMetricsByJob(
  jobId: string,
  query?: GetBenchmarkMetricsQuery,
): Promise<BenchmarkMetricsByJobResponse> {
  const search = buildMetricsByJobQueryString(query);

  const data = await apiRequest<BenchmarkMetricsByJobResponse>({
    path: `/benchmarks/${encodeURIComponent(jobId)}/metrics${search}`,
    method: "GET",
    auth: true,
  });

  return benchmarkMetricsByJobResponseSchema.parse(data);
}

export async function fetchBenchmarkMetricHistory(
  query: GetBenchmarkMetricHistoryQuery,
): Promise<BenchmarkMetricHistoryResponse> {
  const search = buildMetricHistoryQueryString(query);

  const data = await apiRequest<BenchmarkMetricHistoryResponse>({
    path: `/benchmarks/metrics/history?${search}`,
    method: "GET",
    auth: true,
  });

  return benchmarkMetricHistoryResponseSchema.parse(data);
}
