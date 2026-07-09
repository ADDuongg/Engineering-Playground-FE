import { ApiRequestError } from "@/shared/types/api";

export function formatQuizErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to take this quiz.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "No quiz was found for this lab.";
    }

    if (error.code === "FORBIDDEN") {
      return (
        error.message ||
        "This quiz is unavailable because the lab track is not active."
      );
    }

    if (error.code === "VALIDATION_ERROR") {
      return (
        error.message ||
        "Your answers could not be submitted. Check that every question is answered."
      );
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Quiz could not be loaded.";
}
