import { ApiRequestError } from "@/shared/types/api";

export function formatAdminAuthzErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "FORBIDDEN") {
      return error.message || "Admin role required";
    }

    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to continue";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to verify admin access.";
}

export function isAdminForbiddenError(error: unknown): boolean {
  return error instanceof ApiRequestError && error.code === "FORBIDDEN";
}
