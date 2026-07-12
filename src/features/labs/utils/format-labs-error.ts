import { ApiRequestError } from "@/shared/types/api";

export function formatLabsErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to continue";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Lab was not found";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Could not load labs. Please try again.";
}

export function isNotFoundError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.code === "NOT_FOUND";
}
