import { ApiRequestError } from "@/shared/types/api";

export function formatProgressErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to view or update your progress.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Track or lab was not found.";
    }

    if (error.code === "FORBIDDEN") {
      return (
        error.message ||
        "Pass the lab quiz before marking this lab complete."
      );
    }

    if (error.code === "VALIDATION_ERROR") {
      return (
        error.message ||
        "This lab cannot be marked complete because its track is not active."
      );
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Progress could not be loaded.";
}
