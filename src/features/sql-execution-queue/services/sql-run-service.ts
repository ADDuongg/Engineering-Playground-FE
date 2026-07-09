import {
  enqueueSqlRunResultSchema,
  sqlRunPayloadSummarySchema,
} from "@/features/sql-execution-queue/schemas/sql-run-schema";
import type {
  EnqueueSqlRunInput,
  EnqueueSqlRunResult,
  SqlRunStatusResult,
} from "@/features/sql-execution-queue/types/sql-run";
import { fetchJobStatus } from "@/features/worker-queue/services/job-service";
import type { GetJobStatusResult } from "@/features/worker-queue/types/job";
import { apiRequest } from "@/shared/services/api-client";

export function mapJobStatusToSqlRun(
  job: GetJobStatusResult,
): SqlRunStatusResult {
  const parsedSummary = sqlRunPayloadSummarySchema.safeParse(
    job.payloadSummary ?? {},
  );
  const summary = parsedSummary.success ? parsedSummary.data : {};

  return {
    jobId: job.jobId,
    jobType: "sql-execution",
    status: job.status,
    createdAt: job.createdAt,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    attemptCount: job.attemptCount,
    maxAttempts: job.maxAttempts,
    failureReason: job.failureReason,
    failureMessage: job.failureMessage,
    statementKind: summary.statementKind,
    datasetFamily: summary.datasetFamily,
    datasetTier: summary.datasetTier,
    executionResult: summary.executionResult,
  };
}

export async function enqueueSqlRun(
  input: EnqueueSqlRunInput,
): Promise<EnqueueSqlRunResult> {
  const data = await apiRequest<EnqueueSqlRunResult>({
    path: "/experiments/sql/runs",
    method: "POST",
    body: input,
    auth: true,
  });

  return enqueueSqlRunResultSchema.parse(data);
}

export async function fetchSqlRunStatus(
  jobId: string,
): Promise<SqlRunStatusResult> {
  const job = await fetchJobStatus(jobId);
  return mapJobStatusToSqlRun(job);
}
