# Feature Specification: Worker Queue Foundation (Frontend)

**Feature Branch**: `012-worker-queue-foundation`

**Created**: 2026-07-09

**Status**: Implemented (frontend)

**Input**: Implement frontend client for Worker Queue Foundation per `contracts/012-worker-queue-foundation/contract.md` — shared job status polling (`GET /jobs/:jobId`), migrate dataset reset enqueue response to async job shape, and prefer shared job status for benchmark/reset flows.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Poll shared job status (Priority: P1)

As a learner who started a long-running job (benchmark or dataset reset), I can poll a single shared job status endpoint by `jobId` and see lifecycle progress until the job finishes, fails, or is cancelled.

**Why this priority**: Shared status is the core deliverable of this contract; feature modules depend on it for async UX.

**Independent Test**: Given a known `jobId`, the client fetches status, polls while `queued`/`running`, and stops when terminal.

**Acceptance Scenarios**:

1. **Given** a valid `jobId` owned by the current user, **When** status is requested, **Then** the client receives job type, status, timestamps, and attempt metadata.
2. **Given** a job still `queued` or `running`, **When** the status hook is active, **Then** the client polls periodically until a terminal status.
3. **Given** a missing or foreign `jobId`, **When** status is requested, **Then** the user sees a clear not-found or forbidden message.

---

### User Story 2 - Dataset reset returns a queue job (Priority: P1)

As a learner resetting a dataset, I receive an immediate enqueue acknowledgment with `jobId` instead of waiting for synchronous completion, then track progress via shared job status (and/or dataset readiness).

**Why this priority**: Contract deprecates sync reset completion; FE must accept the new `202` enqueue shape.

**Independent Test**: Reset mutation parses the new enqueue result and exposes `jobId` for polling.

**Acceptance Scenarios**:

1. **Given** a successful reset enqueue, **When** the response arrives, **Then** it includes `jobId`, `jobType: "dataset-reset"`, `status: "queued"`, dataset identity, and `createdAt`.
2. **Given** queue unavailable or rate limited, **When** reset is requested, **Then** the user sees the corresponding error message.
3. **Given** enqueue succeeded, **When** the lab shell tracks progress, **Then** it can poll `GET /jobs/:jobId` until terminal and refresh dataset readiness.

---

### User Story 3 - Benchmark prefers shared job status (Priority: P2)

As a learner running a benchmark, status polling uses the shared jobs API while enqueue remains on the benchmark feature route.

**Why this priority**: Contract migrates status from `GET /benchmarks/:jobId` to `GET /jobs/:jobId` without changing enqueue success shape.

**Independent Test**: Benchmark runner polls shared job status by `jobId` after enqueue.

**Acceptance Scenarios**:

1. **Given** a benchmark was enqueued, **When** status is polled, **Then** the client calls `GET /jobs/:jobId` (not the legacy benchmark status path).
2. **Given** shared status returns lifecycle fields, **When** the UI renders progress, **Then** queued/running/completed/failed/cancelled behave as before for the learner.

---

### Edge Cases

- What happens when `jobId` is undefined? Status query stays disabled.
- How does the system handle `QUEUE_UNAVAILABLE` on enqueue? Surface a retryable error; do not start polling.
- What happens when a job is `cancelled` (e.g. session teardown)? Treat as terminal; stop polling; show cancelled state.
- What happens when old reset sync shape (`ready`/`resetting` without `jobId`) still appears during migration? Prefer new shape; tolerate transitional parsing only if explicitly supported in implementation tasks.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a typed client for `GET /jobs/:jobId` returning shared job status fields from the contract.
- **FR-002**: System MUST validate job status responses with Zod before use in hooks/UI.
- **FR-003**: System MUST expose a TanStack Query status hook that polls while status is `queued` or `running`.
- **FR-004**: System MUST format job status and job API errors into user-readable messages (including `NOT_FOUND`, `FORBIDDEN`, `UNAUTHORIZED`, and failure reasons).
- **FR-005**: Dataset reset enqueue MUST parse the async enqueue result (`jobId`, `jobType`, `status: "queued"`, identity, `createdAt`).
- **FR-006**: Dataset reset flow MUST be able to track progress via shared job status after enqueue.
- **FR-007**: Benchmark status polling MUST prefer the shared jobs endpoint over `GET /benchmarks/:jobId`.
- **FR-008**: Feature modules retain their own enqueue routes; this feature owns only the shared status surface and migration wiring.
- **FR-009**: Cancel-session-jobs is backend-internal; frontend MUST NOT invent an HTTP cancel API. Session teardown already exists elsewhere.

### Key Entities

- **Job**: Identified by `jobId`; typed as `benchmark` or `dataset-reset`; lifecycle status; optional failure reason/message; optional payload summary.
- **Enqueue acknowledgment**: Immediate response after queue accept for dataset reset (and existing benchmark enqueue).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: After enqueue, learners see job progress updates within a few seconds without refreshing the page.
- **SC-002**: 100% of supported job types (`benchmark`, `dataset-reset`) can be polled through one shared status client.
- **SC-003**: Dataset reset no longer depends solely on the deprecated reset-status route for job lifecycle once a `jobId` is available.
- **SC-004**: Benchmark enqueue UX remains unchanged for the learner while status source migrates to shared jobs.

## Assumptions

- This repository is the frontend (`sql-play-fe`); BullMQ workers, JobStore, and cancel-session internals are backend concerns and out of scope for FE implementation.
- Auth is already wired; job status and enqueue calls use authenticated `apiRequest`.
- Observability events (`job_enqueued`, etc.) are backend-only; FE does not emit them.
- Legacy `GET /datasets/reset/status` and `GET /benchmarks/:jobId` may remain temporarily for compatibility but preferred path is `GET /jobs/:jobId`.
- Contract file `contracts/012-worker-queue-foundation/contract.md` is the API source of truth.
