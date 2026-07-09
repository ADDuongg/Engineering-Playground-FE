import { ApiRequestError } from "@/shared/types/api";

export function formatLabSummaryErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to load this lab summary.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "No lab summary is registered for this lab.";
    }

    if (error.code === "FORBIDDEN") {
      return (
        error.message ||
        "This lab summary is unavailable because the track is not active."
      );
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Lab summary could not be loaded.";
}
