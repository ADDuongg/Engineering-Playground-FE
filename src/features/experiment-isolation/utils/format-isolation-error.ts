import type { IsolationErrorDetails } from "@/features/experiment-isolation/types/experiment-session";
import { ApiRequestError } from "@/shared/types/api";

export function getIsolationErrorDetails(
  error: unknown,
): IsolationErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as IsolationErrorDetails;
}

export function formatIsolationErrorMessage(error: unknown): string {
  if (error instanceof ApiRequestError) {
    const details = getIsolationErrorDetails(error);

    if (details?.reason === "ISOLATION_UNSUPPORTED_TRACK") {
      return (
        details.hint ??
        `This lab track (${details.trackSlug ?? "unknown"}) does not support isolated sessions.`
      );
    }

    if (details?.hint) {
      return details.hint;
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The experiment session could not be started.";
}
