# Research: Benchmark Metrics (Frontend)

**Feature**: 014-benchmark-metrics | **Date**: 2026-07-09

## Decisions

### 1. New feature module vs extending metrics-pipeline only

**Decision**: Create `src/features/benchmark-metrics/` for benchmark-specific endpoints and UI, reuse `MetricContract` / formatters from `metrics-pipeline`.

**Rationale**: Contract spans BenchmarkRunner (status embed) and MetricsPipeline (collection/history). Frontend already splits `benchmark-runner` from `metrics-pipeline`. Dedicated `/benchmarks/.../metrics` paths belong with benchmark metrics, not generic experiment history.

**Alternatives considered**: Put everything under `metrics-pipeline` — rejected because base paths and ownership differ (`/benchmarks` vs `/experiments`).

### 2. Status embed source

**Decision**: Map `metricsStatus`, `metrics`, `runId` from shared job `payloadSummary` in `mapJobStatusToBenchmark`, and optionally prefer dedicated `GET /benchmarks/:jobId/metrics` when the lab needs authoritative refresh after completion.

**Rationale**: Contract extends `GET /benchmarks/:jobId` status; current FE polls `GET /jobs/:jobId` and maps summary. Backend is expected to put the same embed fields on `payloadSummary`.

**Alternatives considered**: Always call dedicated metrics endpoint only — still needed for US2, but status embed avoids an extra request during polling when summary already has metrics.

### 3. Polling strategy for pending metrics

**Decision**: After job reaches `completed`, if `metricsStatus` is `pending` or missing, poll `GET /benchmarks/:jobId/metrics` every ~2s until `ready` or `unavailable`.

**Rationale**: Collection is async after `benchmark.finished`; job lifecycle can complete before metrics are ready. Contract returns 200 with empty metrics for pending/unavailable (not 404).

### 4. History endpoint ownership

**Decision**: `GET /benchmarks/metrics/history` lives in `benchmark-metrics` service; extend `MetricRunType` with `"benchmark"` so shared history UI components can render snapshots.

**Rationale**: Contract defines a separate history path from `/experiments/metrics/history`.

### 5. Live chart during running

**Decision**: Do not present synthetic RPS series as collected metrics. Prefer empty/waiting state or status-only progress while running; after `ready`, render from `metrics[]` / history.

**Rationale**: Contract rule: labs MUST render charts from `metrics[]`, never raw k6; inventing zeros/fake series as “results” violates SC-004.

## Open questions resolved by defaults

- Anonymous `sessionId` on dedicated metrics: pass when caller provides it (same as status ownership).
- No re-collect API in MVP.
