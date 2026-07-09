# Data Model: Benchmark Metrics (Frontend)

## Entities

### MetricsStatus

```typescript
type MetricsStatus = "pending" | "ready" | "unavailable";
```

Distinct from job lifecycle status.

### MetricContract (shared)

Reused from metrics-pipeline:

```typescript
interface MetricContract {
  key: string;
  label: string;
  unit: string;
  value: number;
  group: string;
}
```

Required keys when collection succeeds:

- `latency_avg_ms`
- `latency_p95_ms`
- `latency_p99_ms`
- `achieved_rps`
- `throughput_rps`
- `error_rate_pct`

### BenchmarkJobStatusResult (extended)

Existing benchmark status plus:

| Field | Type | Notes |
|-------|------|-------|
| `metricsStatus` | `MetricsStatus?` | Omitted/pending while queued/running |
| `metrics` | `MetricContract[]?` | Only when `metricsStatus === "ready"` |
| `runId` | `string?` | Snapshot id when collected |

### BenchmarkMetricsByJobResponse

| Field | Type | Notes |
|-------|------|-------|
| `jobId` | `string` | |
| `runId` | `string?` | |
| `status` | `string` | Job lifecycle string |
| `profile` | `{ rps, durationSeconds }` | |
| `metricsStatus` | `MetricsStatus` | Always present on dedicated endpoint |
| `metrics` | `MetricContract[]` | Empty when pending/unavailable |
| `createdAt` | `string?` | |
| `hint` | `string?` | |

### BenchmarkMetricHistorySnapshot

| Field | Type | Notes |
|-------|------|-------|
| `runId` | `string` | |
| `jobId` | `string` | |
| `runType` | `"benchmark"` | |
| `createdAt` | `string` | |
| `profile` | `{ rps, durationSeconds }` | |
| `metrics` | `MetricContract[]` | |
| `dataset` | `{ family, tier, version }` | |

### BenchmarkMetricHistoryResponse

| Field | Type |
|-------|------|
| `snapshots` | `BenchmarkMetricHistorySnapshot[]` |
| `retentionLimit` | `number` |

## Relationships

- One benchmark job → zero or one metrics snapshot (`runId`)
- One session → many benchmark snapshots (history)
- Job lifecycle completion does not imply `metricsStatus: ready`
