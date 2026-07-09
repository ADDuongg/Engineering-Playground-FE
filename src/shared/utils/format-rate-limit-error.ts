import type {
  RateLimitErrorDetails,
  RateLimitExceededDetails,
  RateLimitStorageUnavailableDetails,
} from "@/shared/types/rate-limit";
import { ApiRequestError } from "@/shared/types/api";

export function getRateLimitErrorDetails(
  error: unknown,
): RateLimitErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  const details = error.details as RateLimitErrorDetails;
  if (!("reason" in details) || typeof details.reason !== "string") {
    return undefined;
  }

  return details;
}

export function isRateLimitExceededDetails(
  details: RateLimitErrorDetails | undefined,
): details is RateLimitExceededDetails {
  return details?.reason === "RATE_LIMIT_EXCEEDED";
}

export function isRateLimitStorageUnavailableDetails(
  details: RateLimitErrorDetails | undefined,
): details is RateLimitStorageUnavailableDetails {
  return details?.reason === "RATE_LIMIT_STORAGE_UNAVAILABLE";
}

export function formatRetryAfterLabel(seconds: number): string {
  if (seconds <= 1) {
    return "Try again in 1 second";
  }

  return `Try again in ${seconds} seconds`;
}

export function formatRateLimitErrorMessage(error: unknown): string | null {
  if (!(error instanceof ApiRequestError)) {
    return null;
  }

  const details = getRateLimitErrorDetails(error);

  if (error.code === "RATE_LIMITED" && isRateLimitExceededDetails(details)) {
    return error.message || formatRetryAfterLabel(details.retryAfterSeconds);
  }

  if (
    error.code === "INTERNAL_ERROR" &&
    isRateLimitStorageUnavailableDetails(details)
  ) {
    return (
      error.message ||
      "Rate limiting is temporarily unavailable. Try again shortly."
    );
  }

  if (details?.reason === "RATE_LIMIT_IDENTITY_REQUIRED") {
    return error.message;
  }

  return null;
}
