# Data Model: Realtime Progress (Frontend)

## Entities

### BenchmarkProgressPhase

```typescript
type BenchmarkProgressPhase =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";
```

### ElapsedBasis

```typescript
type ElapsedBasis = "queue" | "execution";
```

### PartialMetric

| Field | Type | Notes |
|-------|------|-------|
| `key` | `string` | |
| `label` | `string` | |
| `unit` | `string` | |
| `value` | `number` | |
| `group` | `string` | |
| `provisional` | `true` | Always true on wire |

### BenchmarkProgressSnapshot

| Field | Type | Notes |
|-------|------|-------|
| `jobId` | `string` | |
| `phase` | `BenchmarkProgressPhase` | |
| `elapsedMs` | `number` | |
| `elapsedBasis` | `ElapsedBasis` | |
| `currentRps` | `number \| null` optional | Omit/null when seeded without RPS |
| `partialMetrics` | `PartialMetric[]` optional | Provisional only |
| `provisional` | `true` | Always true |
| `terminal` | `boolean` | |
| `profile` | `{ rps, durationSeconds }` optional | |
| `updatedAt` | `string` | ISO timestamp |
| `hint` | `string` optional | |

### ProgressStreamErrorPayload

| Field | Type | Notes |
|-------|------|-------|
| `code` | `string` | e.g. `NOT_FOUND`, `FORBIDDEN`, `VALIDATION_ERROR` |
| `message` | `string` | |

### SSE event types

| event | data |
|-------|------|
| `progress` | `BenchmarkProgressSnapshot` |
| `terminal` | `BenchmarkProgressSnapshot` with `terminal: true` |
| `error` | `ProgressStreamErrorPayload` |

## Relationships

- One progress stream per `jobId` observer.
- Snapshot does **not** include final `MetricContract[]`; finals come from status/metrics (014) after terminal.
