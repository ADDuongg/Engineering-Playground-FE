import type { SandboxErrorDetails } from "@/features/sql-sandbox/types/sandbox";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

export function getSandboxErrorDetails(
  error: unknown,
): SandboxErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as SandboxErrorDetails;
}

export function formatSandboxErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ApiRequestError) {
    const details = getSandboxErrorDetails(error);
    if (details?.hint) {
      return `${error.message} ${details.hint}`;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The query could not be executed.";
}
