export type RateLimitOperation =
  | "sql_run"
  | "explain_run"
  | "dataset_reset"
  | "benchmark_enqueue";

export type RateLimitExceededReason = "RATE_LIMIT_EXCEEDED";

export type RateLimitStorageUnavailableReason =
  | "RATE_LIMIT_STORAGE_UNAVAILABLE";

export type RateLimitIdentityRequiredReason =
  | "RATE_LIMIT_IDENTITY_REQUIRED";

export interface RateLimitExceededDetails {
  reason: RateLimitExceededReason;
  operation: RateLimitOperation;
  operationLabel: string;
  retryAfterSeconds: number;
  hint: string;
}

export interface RateLimitStorageUnavailableDetails {
  reason: RateLimitStorageUnavailableReason;
}

export interface RateLimitIdentityRequiredDetails {
  reason: RateLimitIdentityRequiredReason;
}

export type RateLimitErrorDetails =
  | RateLimitExceededDetails
  | RateLimitStorageUnavailableDetails
  | RateLimitIdentityRequiredDetails;
