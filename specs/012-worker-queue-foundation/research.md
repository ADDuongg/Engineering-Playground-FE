# Research: Worker Queue Foundation (Frontend)

## Decision 1: Feature module name

**Decision**: `src/features/worker-queue/`

**Rationale**: Matches contract module intent (`WorkerQueueModule`) and existing kebab-case feature folders.

**Alternatives considered**: `jobs/` (too generic), put under `shared/services` (violates feature ownership of domain API).

## Decision 2: Polling strategy

**Decision**: Reuse benchmark-runner pattern — TanStack Query `refetchInterval` of 2000ms while status is `queued` or `running`.

**Rationale**: Consistent UX; already proven in this codebase.

## Decision 3: Dataset reset migration

**Decision**: Replace sync/async dual `ResetDatasetResult` (`ready` | `resetting`) with contract enqueue shape always returning `jobId` + `status: "queued"`. Update `useDatasetReset` to poll shared job status by `jobId`, and continue invalidating dataset status/metadata queries on terminal success.

**Rationale**: Contract deprecates sync completion in the same request.

**Alternatives considered**: Support both old and new shapes via union — rejected for MVP clarity; backend contract is the migration source of truth.

## Decision 4: Benchmark status migration

**Decision**: `useBenchmarkStatus` / `fetchBenchmarkStatus` call `GET /jobs/:jobId` via worker-queue service. Map shared `GetJobStatusResult` into UI-friendly fields; keep benchmark-specific profile display from enqueue result / payloadSummary when available.

**Rationale**: Contract prefers shared status; enqueue shape unchanged.

**Note**: Shared status does not include `profile` / `hint` fields from the old benchmark status DTO. FE should:
- Keep profile from enqueue result in runner state, and/or
- Read optional `payloadSummary` from shared status when present
- Use `failureMessage` / `failureReason` instead of `hint`

## Decision 5: Out of scope

- BullMQ, Redis, JobStore, cancel-session-jobs HTTP
- Admin dead-letter UI
- Observability event emission from FE
