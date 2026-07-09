import { ApiRequestError } from "@/shared/types/api";

interface ValidationErrorDetails {
  message?: string[];
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

export function formatAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    if (error.code === "RATE_LIMITED") {
      return "Too many attempts. Please wait a moment and try again.";
    }

    const validationMessages = getValidationMessages(error.details);
    if (error.code === "VALIDATION_ERROR" && validationMessages) {
      return validationMessages.join(". ");
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
