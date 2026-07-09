import type {
  BenchmarkErrorDetails,
  BenchmarkJobStatusResult,
} from "@/features/benchmark-runner/types/benchmark";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

export function getBenchmarkErrorDetails(
  error: unknown,
): BenchmarkErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as BenchmarkErrorDetails;
}

export function isBenchmarkSandboxErrorDetails(
  details: BenchmarkErrorDetails | undefined,
): details is Required<Pick<BenchmarkErrorDetails, "violationCode">> &
  BenchmarkErrorDetails {
  return details !== undefined && "violationCode" in details;
}

export function formatBenchmarkErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ApiRequestError) {
    const details = getBenchmarkErrorDetails(error);

    if (error.code === "SESSION_UNAVAILABLE") {
      return error.message || "The experiment session is unavailable or expired.";
    }

    if (error.code === "QUEUE_UNAVAILABLE") {
      return error.message || "The benchmark queue is temporarily unavailable.";
    }

    if (error.code === "FORBIDDEN") {
      return error.message || "You do not have access to this benchmark job.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Benchmark job not found.";
    }

    if (error.code === "SANDBOX_ERROR" && details?.hint) {
      return `${error.message} ${details.hint}`;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The benchmark could not be started.";
}

export function formatBenchmarkStatusMessage(
  status: BenchmarkJobStatusResult,
): string | undefined {
  if (status.status === "failed") {
    return status.hint || status.failureReason;
  }

  if (status.status === "cancelled") {
    return status.hint || "This benchmark was cancelled.";
  }

  if (status.status === "completed" && status.metricsStatus === "unavailable") {
    // Prefer a short banner; detailed metricsHint is shown in the metrics panel.
    return "Benchmark finished, but metrics could not be collected.";
  }

  if (status.status === "completed" && status.metricsStatus === "pending") {
    return "Benchmark finished. Collecting metrics…";
  }

  return status.hint;
}
