import { ApiRequestError } from "@/shared/types/api";

export function formatMetricsErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "VALIDATION_ERROR") {
      return error.message || "Invalid metric history request.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Session not found.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Metric history could not be loaded.";
}
