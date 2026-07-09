import type {
  ExperimentDatasetNotReadyDetails,
  ExperimentErrorDetails,
  ExperimentSandboxErrorDetails,
} from "@/features/experiment-runner/types/experiment";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

export function getExperimentErrorDetails(
  error: unknown,
): ExperimentErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as ExperimentErrorDetails;
}

export function isDatasetNotReadyError(
  details: ExperimentErrorDetails | undefined,
): details is ExperimentDatasetNotReadyDetails {
  return details !== undefined && "reason" in details && details.reason === "DATASET_NOT_READY";
}

export function isSandboxErrorDetails(
  details: ExperimentErrorDetails | undefined,
): details is ExperimentSandboxErrorDetails {
  return details !== undefined && "violationCode" in details;
}

const DATASET_STATUS_LABELS: Record<
  ExperimentDatasetNotReadyDetails["status"],
  string
> = {
  not_started: "not started",
  preparing: "preparing",
  resetting: "resetting",
  failed: "failed",
};

export function formatExperimentErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ApiRequestError) {
    const details = getExperimentErrorDetails(error);

    if (isDatasetNotReadyError(details)) {
      const statusLabel = DATASET_STATUS_LABELS[details.status];
      return details.hint || `Dataset is ${statusLabel}. Prepare it before running SQL.`;
    }

    if (isSandboxErrorDetails(details) && details.hint) {
      return `${error.message} ${details.hint}`;
    }

    if (error.code === "TIMEOUT") {
      return error.message || "The query exceeded the execution time limit.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The experiment query could not be executed.";
}
