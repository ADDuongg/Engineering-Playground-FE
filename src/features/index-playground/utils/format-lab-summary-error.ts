import { ApiRequestError } from "@/shared/types/api";

export function formatLabSummaryErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to load this lab summary.";
    }

    if (error.code === "NOT_FOUND") {
      return (
        error.message ||
        "No curriculum is registered for this lab yet."
      );
    }

    if (error.code === "FORBIDDEN") {
      return (
        error.message ||
        "This lab summary is unavailable because the lab or track is not active."
      );
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Lab summary could not be loaded.";
}
