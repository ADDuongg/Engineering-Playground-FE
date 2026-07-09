import type {
  GetJobStatusResult,
  JobLifecycleStatus,
} from "@/features/worker-queue/types/job";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

const POLLING_STATUSES: JobLifecycleStatus[] = ["queued", "running"];

export function isJobPollingStatus(status: JobLifecycleStatus): boolean {
  return POLLING_STATUSES.includes(status);
}

export function isJobTerminalStatus(status: JobLifecycleStatus): boolean {
  return (
    status === "completed" || status === "failed" || status === "cancelled"
  );
}

export function formatJobErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ApiRequestError) {
    if (error.code === "NOT_FOUND") {
      return error.message || "Job not found.";
    }

    if (error.code === "FORBIDDEN") {
      return error.message || "You do not have access to this job.";
    }

    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to view job status.";
    }

    if (error.code === "QUEUE_UNAVAILABLE") {
      return error.message || "The job queue is temporarily unavailable.";
    }

    if (error.code === "SESSION_UNAVAILABLE") {
      return error.message || "The experiment session is unavailable or expired.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The job status could not be loaded.";
}

export function formatJobStatusMessage(
  status: GetJobStatusResult,
): string | undefined {
  if (status.status === "failed") {
    return status.failureMessage || status.failureReason;
  }

  if (status.status === "cancelled") {
    return status.failureMessage || "This job was cancelled.";
  }

  return status.failureMessage;
}
