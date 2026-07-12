import { ApiRequestError } from "@/shared/types/api";

interface ValidationErrorDetails {
  message?: string[];
  field?: string;
}

function getValidationMessages(details: unknown): string[] | undefined {
  if (!details || typeof details !== "object") {
    return undefined;
  }

  const messages = (details as ValidationErrorDetails).message;
  if (!Array.isArray(messages) || messages.length === 0) {
    return undefined;
  }

  return messages.filter((message): message is string => typeof message === "string");
}

export function formatAdminCrudErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "FORBIDDEN") {
      return error.message || "Admin role required";
    }

    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to continue";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Track or lab was not found";
    }

    if (error.code === "CONFLICT") {
      return error.message || "Slug already exists";
    }

    const validationMessages = getValidationMessages(error.details);
    if (error.code === "VALIDATION_ERROR" && validationMessages) {
      return validationMessages.join(". ");
    }

    if (error.code === "VALIDATION_ERROR") {
      return error.message || "Validation failed";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed. Please try again.";
}
