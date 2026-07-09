# Feature Specification: Benchmark Metrics (Frontend)

**Feature Branch**: `014-benchmark-metrics`

**Created**: 2026-07-09

**Status**: Implemented (frontend)

**Input**: Implement frontend client for Benchmark Metrics per `contracts/014-benchmark-metrics/contract.md` — embed metrics on benchmark job status, dedicated per-job metrics retrieval, and session-scoped benchmark metric history for before/after comparison. Labs must render from `MetricContract[]`, never raw k6 summary.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - See metrics after a completed benchmark (Priority: P1)

As a learner who finished a load test, I can see latency, throughput, and error-rate metrics for that run once collection succeeds, without inventing zeros while the job is still running.

**Why this priority**: Primary learning outcome of benchmarking is reading real collected metrics.

**Independent Test**: Given a completed `jobId` with `metricsStatus: ready`, the UI shows the required metric keys from `metrics[]`.

**Acceptance Scenarios**:

1. **Given** a benchmark job is `queued` or `running`, **When** status is shown, **Then** the UI does not invent success metrics (pending/omitted only).
2. **Given** a job is `completed` and collection succeeded, **When** status or dedicated metrics are loaded, **Then** `metricsStatus` is `ready` and required keys are displayed.
3. **Given** a job is `completed` but collection failed, **When** metrics are requested, **Then** the UI shows `unavailable` and does not present success-looking numbers.

---

### User Story 2 - Fetch dedicated metrics for one job (Priority: P1)

As a learner (or lab UI) reviewing a specific benchmark job, I can load metrics via the dedicated metrics endpoint even when I already know the `jobId`.

**Why this priority**: Contract provides a Platform-DB source of truth separate from lifecycle polling.

**Independent Test**: Client calls `GET /benchmarks/:jobId/metrics` and parses `metricsStatus` + `metrics[]` (empty when pending/unavailable).

**Acceptance Scenarios**:

1. **Given** a known owned `jobId`, **When** metrics are requested, **Then** the client receives job identity, profile, `metricsStatus`, and `metrics`.
2. **Given** metrics are still pending, **When** the endpoint returns 200 with empty `metrics`, **Then** the UI distinguishes pending collection from a missing job.
3. **Given** an unknown or foreign `jobId`, **When** metrics are requested, **Then** the user sees not-found or forbidden messaging.

---

### User Story 3 - Compare benchmark runs over a session (Priority: P2)

As a learner optimizing a query, I can view session-scoped benchmark metric history to compare before/after runs.

**Why this priority**: Before/after comparison is a core product goal; secondary to showing the latest run.

**Independent Test**: Given a `sessionId`, history returns snapshots with `runType: "benchmark"`, profile, dataset, and metrics.

**Acceptance Scenarios**:

1. **Given** a valid `sessionId` with prior benchmark runs, **When** history is loaded, **Then** snapshots include `jobId`, `runId`, profile, dataset, and metrics.
2. **Given** `labSlug` and/or `limit` are provided, **When** history is requested, **Then** the client forwards those filters.
3. **Given** `sessionId` is missing, **When** history is requested, **Then** the client surfaces a validation error.

---

### Edge Cases

- What happens when the job completes but `metricsStatus` is still `pending`? Keep polling dedicated metrics (or status embed) until `ready` or `unavailable`.
- What happens when status is `failed` without usable summary? Do not show success metrics.
- What happens when `metrics[]` is empty with `metricsStatus: ready`? Treat as unavailable/empty UI; do not invent values.
- What happens when anonymous ownership requires `sessionId`? Pass `sessionId` on dedicated metrics query when unauthenticated flows need it.
- Labs MUST never render charts from raw `k6Summary`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST extend benchmark job status typing to include optional `metricsStatus`, `metrics`, and `runId` per contract.
- **FR-002**: System MUST map embedded metrics fields from shared job `payloadSummary` (or dedicated status) without inventing zero metrics while pending.
- **FR-003**: System MUST provide a typed client for `GET /benchmarks/:jobId/metrics` with optional `sessionId` query.
- **FR-004**: System MUST provide a typed client for `GET /benchmarks/metrics/history` with `sessionId`, optional `labSlug`/`limit`.
- **FR-005**: System MUST validate metrics and history responses with Zod before use in hooks/UI.
- **FR-006**: System MUST expose TanStack Query hooks for per-job metrics and benchmark metric history.
- **FR-007**: System MUST poll per-job metrics while `metricsStatus` is `pending` after a completed job (or while job is still live and metrics pending).
- **FR-008**: System MUST format metrics API errors (`NOT_FOUND`, `FORBIDDEN`, `VALIDATION_ERROR`) into user-readable messages.
- **FR-009**: Labs/UI MUST render charts and metric cells from `MetricContract[]` only — never from raw k6 summary.
- **FR-010**: Metric run typing MUST allow `runType: "benchmark"` for history snapshots.
- **FR-011**: Required successful-collection keys (`latency_avg_ms`, `latency_p95_ms`, `latency_p99_ms`, `achieved_rps`, `throughput_rps`, `error_rate_pct`) MUST be displayable when present.
- **FR-012**: Re-collect/repair endpoints and live partial metrics during `running` are out of scope for MVP.

### Key Entities

- **BenchmarkMetricsByJob**: Per-job metrics payload (`jobId`, optional `runId`, lifecycle `status`, profile, `metricsStatus`, `metrics[]`).
- **BenchmarkMetricHistorySnapshot**: Historical run with `runId`, `jobId`, `runType: "benchmark"`, profile, dataset, metrics, `createdAt`.
- **MetricContract**: Shared metric shape (`key`, `label`, `unit`, `value`, `group`) reused from metrics pipeline.
- **MetricsStatus**: `pending` | `ready` | `unavailable` collection lifecycle distinct from job lifecycle.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After a successful benchmark, learners see collected metrics within one polling cycle of `metricsStatus: ready` without fabricated values during the run.
- **SC-002**: Learners can distinguish job failure vs metrics collection unavailable vs metrics still pending from UI copy alone.
- **SC-003**: Learners can load at least two historical benchmark snapshots for the same session to compare before/after.
- **SC-004**: 100% of displayed benchmark metric values in the lab originate from `MetricContract[]` responses (no raw k6 fields in UI).

## Assumptions

- Frontend-only scope; backend collection on `benchmark.finished` already (or will) persist snapshots.
- Shared job status (`GET /jobs/:jobId`) may embed metrics in `payloadSummary`; dedicated endpoints remain source of truth for history and explicit refresh.
- Existing `MetricContract` and formatting utilities in `metrics-pipeline` are reused.
- Auth-aware `apiRequest` is used; anonymous flows may pass `sessionId` when required.
- Fake/synthetic live chart data during `running` may remain as progress UX only if clearly not presented as collected metrics; collected metrics charts use `metrics[]` / history only.
