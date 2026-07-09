import type {
  ExplainDatasetNotReadyDetails,
  ExplainErrorDetails,
  ExplainSandboxErrorDetails,
  ExplainSessionNotReadyDetails,
} from "@/features/explain-runner/types/explain";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

export function getExplainErrorDetails(
  error: unknown,
): ExplainErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as ExplainErrorDetails;
}

export function isDatasetNotReadyError(
  details: ExplainErrorDetails | undefined,
): details is ExplainDatasetNotReadyDetails {
  return (
    details !== undefined &&
    "reason" in details &&
    details.reason === "DATASET_NOT_READY"
  );
}

export function isSessionNotReadyError(
  details: ExplainErrorDetails | undefined,
): details is ExplainSessionNotReadyDetails {
  return (
    details !== undefined &&
    "reason" in details &&
    details.reason === "SESSION_NOT_READY"
  );
}

export function isSandboxErrorDetails(
  details: ExplainErrorDetails | undefined,
): details is ExplainSandboxErrorDetails {
  return details !== undefined && "violationCode" in details;
}

const DATASET_STATUS_LABELS: Record<
  ExplainDatasetNotReadyDetails["status"],
  string
> = {
  not_started: "not started",
  preparing: "preparing",
  resetting: "resetting",
  failed: "failed",
};

export function formatExplainErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ApiRequestError) {
    const details = getExplainErrorDetails(error);

    if (isDatasetNotReadyError(details)) {
      const statusLabel = DATASET_STATUS_LABELS[details.status];
      return (
        details.hint ||
        `Dataset is ${statusLabel}. Prepare it before running EXPLAIN.`
      );
    }

    if (isSessionNotReadyError(details)) {
      return details.hint || "The experiment session is not ready.";
    }

    if (isSandboxErrorDetails(details) && details.hint) {
      return `${error.message} ${details.hint}`;
    }

    if (error.code === "TIMEOUT") {
      return error.message || "EXPLAIN exceeded the execution time limit.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The execution plan could not be generated.";
}
