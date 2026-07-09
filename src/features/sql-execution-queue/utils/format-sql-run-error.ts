import type {
  SqlRunDatasetNotReadyDetails,
  SqlRunErrorDetails,
  SqlRunSandboxErrorDetails,
  SqlRunStatusResult,
} from "@/features/sql-execution-queue/types/sql-run";
import type { JobLifecycleStatus } from "@/features/worker-queue/types/job";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

const STATUS_LABELS: Record<JobLifecycleStatus, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  cancelled: "Cancelled",
};

const DATASET_STATUS_LABELS: Record<
  SqlRunDatasetNotReadyDetails["status"],
  string
> = {
  not_started: "not started",
  preparing: "preparing",
  resetting: "resetting",
  failed: "failed",
};

const POLLING_STATUSES: JobLifecycleStatus[] = ["queued", "running"];

export function formatSqlRunStatusLabel(status: JobLifecycleStatus): string {
  return STATUS_LABELS[status];
}

export function isSqlRunPollingStatus(status: JobLifecycleStatus): boolean {
  return POLLING_STATUSES.includes(status);
}

export function isSqlRunTerminalStatus(status: JobLifecycleStatus): boolean {
  return (
    status === "completed" || status === "failed" || status === "cancelled"
  );
}

export function getSqlRunErrorDetails(
  error: unknown,
): SqlRunErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as SqlRunErrorDetails;
}

export function isSqlRunDatasetNotReadyDetails(
  details: SqlRunErrorDetails | undefined,
): details is SqlRunDatasetNotReadyDetails {
  return (
    details !== undefined &&
    "reason" in details &&
    details.reason === "DATASET_NOT_READY"
  );
}

export function isSqlRunSandboxErrorDetails(
  details: SqlRunErrorDetails | undefined,
): details is SqlRunSandboxErrorDetails {
  return details !== undefined && "violationCode" in details;
}

export function formatSqlRunErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ApiRequestError) {
    const details = getSqlRunErrorDetails(error);

    if (isSqlRunDatasetNotReadyDetails(details)) {
      const statusLabel = DATASET_STATUS_LABELS[details.status];
      return (
        details.hint || `Dataset is ${statusLabel}. Prepare it before running SQL.`
      );
    }

    if (isSqlRunSandboxErrorDetails(details) && details.hint) {
      return `${error.message} ${details.hint}`;
    }

    if (error.code === "SESSION_UNAVAILABLE") {
      return error.message || "The experiment session is unavailable or expired.";
    }

    if (error.code === "SQL_RUN_INFLIGHT_LIMIT") {
      return (
        error.message ||
        "This session already has an SQL run in progress. Wait for it to finish."
      );
    }

    if (error.code === "QUEUE_UNAVAILABLE") {
      return error.message || "The SQL run queue is temporarily unavailable.";
    }

    if (error.code === "FORBIDDEN") {
      return error.message || "You do not have access to this SQL run.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "SQL run job not found.";
    }

    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to run SQL.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The SQL run could not be started.";
}

export function formatSqlRunStatusMessage(
  status: SqlRunStatusResult,
): string | undefined {
  if (status.status === "failed") {
    return status.failureMessage || status.failureReason;
  }

  if (status.status === "cancelled") {
    return status.failureMessage || "This SQL run was cancelled.";
  }

  return status.failureMessage;
}
