import {
  enqueueBenchmarkResultSchema,
} from "@/features/benchmark-runner/schemas/benchmark-schema";
import type {
  BenchmarkJobStatusResult,
  BenchmarkMetricsStatus,
  EnqueueBenchmarkInput,
  EnqueueBenchmarkResult,
} from "@/features/benchmark-runner/types/benchmark";
import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";
import { fetchJobStatus } from "@/features/worker-queue/services/job-service";
import type { GetJobStatusResult } from "@/features/worker-queue/types/job";
import { apiRequest } from "@/shared/services/api-client";

function readProfileNumber(
  summary: Record<string, unknown> | undefined,
  key: string,
): number | undefined {
  const value = summary?.[key];
  return typeof value === "number" ? value : undefined;
}

function readMetricsStatus(
  summary: Record<string, unknown> | undefined,
): BenchmarkMetricsStatus | undefined {
  const value = summary?.metricsStatus;
  if (value === "pending" || value === "ready" || value === "unavailable") {
    return value;
  }
  return undefined;
}

function readMetrics(
  summary: Record<string, unknown> | undefined,
): MetricContract[] | undefined {
  const value = summary?.metrics;
  if (!Array.isArray(value)) {
    return undefined;
  }

  const metrics = value.filter((item): item is MetricContract => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const metric = item as Record<string, unknown>;
    return (
      typeof metric.key === "string" &&
      typeof metric.label === "string" &&
      typeof metric.unit === "string" &&
      typeof metric.value === "number" &&
      typeof metric.group === "string"
    );
  });

  return metrics.length > 0 ? metrics : undefined;
}

export function mapJobStatusToBenchmark(
  job: GetJobStatusResult,
  fallbackProfile?: { rps: number; durationSeconds: number },
): BenchmarkJobStatusResult {
  const summary = job.payloadSummary;
  const nestedProfile =
    summary?.profile && typeof summary.profile === "object"
      ? (summary.profile as Record<string, unknown>)
      : undefined;

  const rps =
    readProfileNumber(nestedProfile, "rps") ??
    readProfileNumber(summary, "rps") ??
    fallbackProfile?.rps ??
    0;

  const durationSeconds =
    readProfileNumber(nestedProfile, "durationSeconds") ??
    readProfileNumber(summary, "durationSeconds") ??
    fallbackProfile?.durationSeconds ??
    0;

  const metricsStatus = readMetricsStatus(summary);
  const metrics =
    metricsStatus === "ready" ? readMetrics(summary) : undefined;
  const runId =
    typeof summary?.runId === "string" ? summary.runId : undefined;
  const metricsHint =
    typeof summary?.metricsHint === "string"
      ? summary.metricsHint
      : typeof summary?.hint === "string"
        ? summary.hint
        : undefined;

  return {
    jobId: job.jobId,
    status: job.status,
    profile: { rps, durationSeconds },
    createdAt: job.createdAt,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    failureReason: job.failureReason,
    hint: metricsHint ?? job.failureMessage,
    metricsStatus,
    metrics,
    runId,
  };
}

export async function enqueueBenchmark(
  input: EnqueueBenchmarkInput,
): Promise<EnqueueBenchmarkResult> {
  const data = await apiRequest<EnqueueBenchmarkResult>({
    path: "/benchmarks",
    method: "POST",
    body: input,
    auth: true,
  });

  return enqueueBenchmarkResultSchema.parse(data);
}

export async function fetchBenchmarkStatus(
  jobId: string,
): Promise<BenchmarkJobStatusResult> {
  const job = await fetchJobStatus(jobId);
  return mapJobStatusToBenchmark(job);
}
