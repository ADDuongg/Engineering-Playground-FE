# Data Model: Worker Queue Foundation (Frontend)

## JobStatus (shared)

| Field | Type | Notes |
|-------|------|-------|
| jobId | string (UUID) | Primary key from enqueue |
| jobType | `"benchmark" \| "dataset-reset"` | Discriminator |
| status | `"queued" \| "running" \| "completed" \| "failed" \| "cancelled"` | Lifecycle |
| createdAt | string (ISO) | Required |
| startedAt | string? | When worker started |
| completedAt | string? | Terminal timestamp |
| attemptCount | number | Attempts so far |
| maxAttempts | number | Retry ceiling |
| failureReason | enum? | Contract failure codes |
| failureMessage | string? | Human-readable failure |
| payloadSummary | Record<string, unknown>? | Optional safe summary |

## EnqueueDatasetResetResult

| Field | Type | Notes |
|-------|------|-------|
| jobId | string | For shared status polling |
| jobType | `"dataset-reset"` | Literal |
| status | `"queued"` | Literal |
| createdAt | string | ISO |
| family | string | Dataset identity |
| version | string | Dataset identity |
| tier | `"100k" \| "1m" \| "10m"` | Dataset identity |

## Relationships

- Benchmark enqueue (existing) → produces `jobId` → JobStatus
- Dataset reset enqueue → produces EnqueueDatasetResetResult → JobStatus
- Session teardown (backend) may mark JobStatus `cancelled`

## Terminal statuses

`completed`, `failed`, `cancelled` — stop polling.
