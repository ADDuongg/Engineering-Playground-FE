import type { MetricContract } from "@/features/metrics-pipeline/types/metrics";

export type ReactSandboxAdapterType = "headless_react_sandbox";

export type ReactSandboxErrorCode =
  | "UNAUTHORIZED"
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "FORBIDDEN"
  | "SANDBOX_ERROR"
  | "TIMEOUT"
  | "EXECUTION_ERROR";

export type ReactSandboxKeyStrategy = "index" | "stable";

export interface ReactSandboxRunOptions {
  memo?: boolean;
  keyStrategy?: ReactSandboxKeyStrategy;
}

export interface ReactSandboxInteraction {
  type: string;
  payload?: unknown;
}

export interface RunReactExperimentInput {
  action: string;
  fixtureId: string;
  labSlug: string;
  trackSlug?: string;
  props?: Record<string, unknown>;
  interactions?: ReactSandboxInteraction[];
  options?: ReactSandboxRunOptions;
}

export interface ReactExperimentRunRaw {
  action: string;
  scenarioId: string;
  interactionCount: number;
  notes: string[];
}

export interface ReactExperimentRunResult {
  adapterType: ReactSandboxAdapterType;
  metrics: MetricContract[];
  raw: ReactExperimentRunRaw;
  runId?: string;
}

export type FixtureNotAllowedReason = "FIXTURE_NOT_ALLOWED_FOR_LAB";

export type ReactSandboxTimeoutReason = "REACT_SANDBOX_TIMEOUT";

export interface FixtureNotAllowedDetails {
  reason: FixtureNotAllowedReason;
  labSlug: string;
  fixtureId: string;
  hint: string;
}

export interface ReactSandboxTimeoutDetails {
  reason: ReactSandboxTimeoutReason;
  timeoutMs: number;
  hint: string;
}

export type ReactSandboxErrorDetails =
  | FixtureNotAllowedDetails
  | ReactSandboxTimeoutDetails
  | { hint?: string; reason?: string; [key: string]: unknown };
