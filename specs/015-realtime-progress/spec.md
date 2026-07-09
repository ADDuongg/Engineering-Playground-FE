# Feature Specification: Realtime Progress (Frontend)

**Feature Branch**: `015-realtime-progress`

**Created**: 2026-07-09

**Status**: Implemented (frontend)

**Input**: Implement frontend client for Realtime Progress per `contracts/015-realtime-progress/contract.md` — push-only SSE live progress for an in-flight benchmark job, then hand off to status/metrics for finals. Clients MUST NOT poll job status for in-run progress UX.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Watch live benchmark progress (Priority: P1)

As a learner running a load test, I can see live phase, elapsed time, current RPS, and provisional partial metrics while the job is queued/running, without inventing final collected metrics.

**Why this priority**: Primary value of this feature — replace status polling for in-run UX with a push stream.

**Independent Test**: Given an owned `jobId` that is non-terminal, connecting to progress shows updating snapshots until a terminal event.

**Acceptance Scenarios**:

1. **Given** a benchmark was enqueued and returned `jobId`, **When** the lab opens the progress stream, **Then** the UI shows phase/elapsed (and RPS/partials when present) from stream snapshots.
2. **Given** the stream emits `progress` events, **When** snapshots update, **Then** the UI refreshes live values without polling job status for progress.
3. **Given** partial metrics appear on a snapshot, **When** they are rendered, **Then** they are clearly provisional and not presented as final collected metrics.

---

### User Story 2 - Terminal handoff to finals (Priority: P1)

As a learner whose benchmark just finished, I see the stream close on a terminal event, then load status and/or dedicated metrics for final collected metrics.

**Why this priority**: Contract forbids finals on the terminal SSE payload; handoff is required for correct learning outcomes.

**Independent Test**: On `terminal` event, stream stops; UI fetches status/metrics and shows finals when ready (existing metrics module).

**Acceptance Scenarios**:

1. **Given** a job reaches completed/failed/cancelled, **When** `terminal` arrives, **Then** the client closes the stream and does not expect `metrics[]` on that event.
2. **Given** terminal was `completed`, **When** handoff runs, **Then** the UI uses status and/or `GET /benchmarks/:jobId/metrics` for finals (existing 014 behavior).
3. **Given** the job was already terminal before connect, **When** the stream opens, **Then** a `terminal` event (or equivalent close) occurs and the UI proceeds to finals/status.

---

### User Story 3 - Ownership and stream errors (Priority: P2)

As a learner (authenticated or anonymous with `sessionId`), I only observe progress for jobs I own, and I see clear errors when the stream cannot start or fails fatally.

**Why this priority**: Security/ownership parity with status; secondary to happy-path live UX.

**Independent Test**: Missing `sessionId` when required, foreign `jobId`, or stream `error` event surfaces readable messaging and cleans up the connection.

**Acceptance Scenarios**:

1. **Given** an unauthenticated flow without `sessionId`, **When** progress is requested, **Then** the client surfaces a validation error.
2. **Given** a foreign or unknown `jobId`, **When** connect fails with forbidden/not-found, **Then** the UI shows an appropriate message and does not leave a dangling stream.
3. **Given** a fatal mid-stream `error` event, **When** it arrives, **Then** the client closes the stream and shows the error.

---

### Edge Cases

- What happens when Redis has no snapshot yet but the job is non-terminal? Show status-seeded phase/elapsed only; do not invent RPS/partials.
- What happens when the user navigates away mid-run? Abort/close the stream and release resources.
- What happens when the connection drops before terminal? Surface a reconnectable/error state; do not silently resume status polling for progress UX.
- What happens when `terminal` arrives with `provisional: true` and no finals? Keep showing provisional until metrics handoff resolves.
- Labs MUST never treat `partialMetrics` as final `MetricContract` success metrics.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a typed SSE client for `GET /benchmarks/:jobId/progress` with optional `sessionId` query (required when unauthenticated).
- **FR-002**: System MUST parse SSE frames without a JSON envelope (`progress`, `terminal`, `error` event types).
- **FR-003**: System MUST validate `BenchmarkProgressSnapshot` (and error payloads) with Zod before use in hooks/UI.
- **FR-004**: System MUST expose a hook that opens the stream when a live `jobId` exists and closes it on terminal, unmount, or reset.
- **FR-005**: System MUST NOT poll `GET /benchmarks/:jobId` (or shared job status) for in-run progress UX while the progress stream is the active mechanism.
- **FR-006**: System MUST render live phase, elapsed, optional `currentRps`, and optional provisional `partialMetrics` during the run.
- **FR-007**: System MUST, on `terminal`, stop the stream and hand off to existing status/metrics flows for finals (no finals from SSE).
- **FR-008**: System MUST format progress errors (`NOT_FOUND`, `FORBIDDEN`, `VALIDATION_ERROR`, stream errors) into user-readable messages.
- **FR-009**: System MUST pass Bearer auth when available (same ownership model as status).
- **FR-010**: System MUST label provisional partial metrics so they are not confused with collected finals.

### Key Entities

- **BenchmarkProgressSnapshot**: Live job progress view — phase, elapsed, optional RPS/partials, always provisional, terminal flag.
- **PartialMetric**: Provisional metric row during the run (`provisional: true`).
- **ProgressStreamError**: Stream or pre-stream failure with code/message.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: During an active benchmark, learners see live progress updates without relying on status polling for that UX.
- **SC-002**: Within one interaction after the run ends, learners are guided to final metrics (or clear failed/unavailable state), not stuck on the live stream.
- **SC-003**: Provisional in-run values are visually distinct from post-run collected metrics in 100% of rendered states.
- **SC-004**: Unauthorized or missing-ownership attempts fail with a clear message and no lingering open stream.

## Assumptions

- Frontend-only scope; Redis publish path and worker cadence are backend concerns.
- Feature module name: `realtime-progress` under `src/features/`, integrated primarily into the benchmark lab page and `benchmark-runner` orchestration.
- Auth token access follows the existing API client session handlers; SSE may use `fetch` streaming (not bare `EventSource`) so Authorization headers can be sent.
- After terminal, existing `useBenchmarkStatus` / `useBenchmarkMetrics` remain the source for lifecycle + finals (status may still be fetched once for handoff, not polled for progress).
- Anonymous ownership uses the same `sessionId` already available from experiment isolation.
