import type { DatasetErrorDetails } from "@/features/dataset-loader/types/dataset";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

export function getDatasetErrorDetails(
  error: unknown,
): DatasetErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as DatasetErrorDetails;
}

export function formatDatasetErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ApiRequestError) {
    const details = getDatasetErrorDetails(error);
    if (details?.hint) {
      return `${error.message} ${details.hint}`;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The dataset could not be prepared.";
}

export function formatRowCount(count: number): string {
  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return `${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  }

  if (count >= 1_000) {
    const thousands = count / 1_000;
    return `${thousands % 1 === 0 ? thousands.toFixed(0) : thousands.toFixed(1)}K`;
  }

  return count.toLocaleString();
}
