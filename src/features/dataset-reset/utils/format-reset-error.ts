import { formatDatasetErrorMessage } from "@/features/dataset-loader/utils/format-dataset-error";
import { ApiRequestError } from "@/shared/types/api";

export function formatResetErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "QUEUE_UNAVAILABLE") {
      return error.message || "The reset queue is temporarily unavailable.";
    }

    if (error.code === "SESSION_UNAVAILABLE") {
      return error.message || "The experiment session is unavailable or expired.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Reset job not found.";
    }

    if (error.code === "FORBIDDEN") {
      return error.message || "You do not have access to this reset job.";
    }
  }

  if (error instanceof Error && !(error instanceof ApiRequestError)) {
    return error.message;
  }

  const message = formatDatasetErrorMessage(error);

  if (message === "The dataset could not be prepared.") {
    return "The dataset could not be reset.";
  }

  return message;
}
