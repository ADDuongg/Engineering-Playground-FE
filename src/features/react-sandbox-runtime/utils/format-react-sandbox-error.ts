import type {
  FixtureNotAllowedDetails,
  ReactSandboxErrorDetails,
  ReactSandboxTimeoutDetails,
} from "@/features/react-sandbox-runtime/types/react-sandbox";
import { ReactSandboxMappingError } from "@/features/react-sandbox-runtime/utils/map-react-scenario-to-run-input";
import { ApiRequestError } from "@/shared/types/api";
import { formatRateLimitErrorMessage } from "@/shared/utils/format-rate-limit-error";

export function getReactSandboxErrorDetails(
  error: unknown,
): ReactSandboxErrorDetails | undefined {
  if (!(error instanceof ApiRequestError)) {
    return undefined;
  }

  if (!error.details || typeof error.details !== "object") {
    return undefined;
  }

  return error.details as ReactSandboxErrorDetails;
}

export function isFixtureNotAllowedError(
  details: ReactSandboxErrorDetails | undefined,
): details is FixtureNotAllowedDetails {
  return (
    details !== undefined &&
    "reason" in details &&
    details.reason === "FIXTURE_NOT_ALLOWED_FOR_LAB"
  );
}

export function isReactSandboxTimeoutDetails(
  details: ReactSandboxErrorDetails | undefined,
): details is ReactSandboxTimeoutDetails {
  return (
    details !== undefined &&
    "reason" in details &&
    details.reason === "REACT_SANDBOX_TIMEOUT"
  );
}

export function formatReactSandboxErrorMessage(error: unknown): string {
  const rateLimitMessage = formatRateLimitErrorMessage(error);
  if (rateLimitMessage) {
    return rateLimitMessage;
  }

  if (error instanceof ReactSandboxMappingError) {
    return error.message;
  }

  if (error instanceof ApiRequestError) {
    const details = getReactSandboxErrorDetails(error);

    if (isFixtureNotAllowedError(details)) {
      return (
        details.hint ||
        `Fixture "${details.fixtureId}" is not allowed for lab "${details.labSlug}". Use a scenario from this lab's guided steps.`
      );
    }

    if (isReactSandboxTimeoutDetails(details) || error.code === "TIMEOUT") {
      return (
        (details && "hint" in details && typeof details.hint === "string"
          ? details.hint
          : undefined) ||
        error.message ||
        "The React sandbox run exceeded the time limit. Simplify interactions or component work and try again."
      );
    }

    if (
      details &&
      "hint" in details &&
      typeof details.hint === "string" &&
      details.hint
    ) {
      return `${error.message} ${details.hint}`;
    }

    if (error.code === "UNAUTHORIZED") {
      return error.message || "Sign in to run React sandbox experiments.";
    }

    if (error.code === "NOT_FOUND") {
      return error.message || "Unknown React fixture. Check the guided scenario id.";
    }

    if (error.code === "FORBIDDEN" || error.code === "SANDBOX_ERROR") {
      return error.message || "This React fixture is not allowed for this lab.";
    }

    if (error.code === "VALIDATION_ERROR") {
      return error.message || "Invalid React experiment request.";
    }

    if (error.code === "EXECUTION_ERROR") {
      return error.message || "The React sandbox could not complete this action.";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "The React sandbox experiment could not be executed.";
}
