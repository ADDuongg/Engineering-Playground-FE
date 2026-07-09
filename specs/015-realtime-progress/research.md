# Research: Realtime Progress (Frontend)

**Feature**: 015-realtime-progress | **Date**: 2026-07-09

## Decisions

### 1. New feature module vs extending benchmark-runner only

**Decision**: Create `src/features/realtime-progress/` for SSE client, schemas, hook, and progress UI; wire from `benchmark-runner` / benchmark page.

**Rationale**: Contract is a distinct transport (SSE, no envelope) from JSON-enveloped enqueue/status/metrics. Keeps streaming concerns isolated.

**Alternatives considered**: Put SSE inside `benchmark-runner/services` — workable but mixes envelope JSON clients with stream parsing.

### 2. `fetch` streaming vs `EventSource`

**Decision**: Use `fetch` + `ReadableStream` (or incremental body reader) with `Accept: text/event-stream` and optional `Authorization: Bearer`.

**Rationale**: Native `EventSource` cannot set custom headers; contract auth matches status (optional Bearer). Existing `apiRequest` always parses JSON envelopes and is unsuitable for SSE.

**Alternatives considered**: Cookie-only EventSource — rejected; app uses Bearer tokens via `initApiClient` handlers.

### 3. Stop status polling for in-run progress

**Decision**: While a live `jobId` is observed via SSE, disable `useBenchmarkStatus` `refetchInterval` (or disable the query until terminal). On `terminal`, fetch status once and/or enable metrics polling (014).

**Rationale**: Contract: clients MUST NOT poll status for progress UX. Lifecycle/finals still need a post-terminal status/metrics read.

**Alternatives considered**: Keep 2s status polling alongside SSE — rejected by FR-005 / contract rule 1.

### 4. SSE parse strategy

**Decision**: Minimal line-based SSE parser: accumulate `event:` / `data:` fields; on blank line dispatch; JSON.parse + Zod validate snapshot/error payloads.

**Rationale**: No SSE library in the stack; payload cadence is ~1 Hz; keep dependency surface small.

### 5. Provisional UI vs finals

**Decision**: Progress panel shows phase/elapsed/RPS/`partialMetrics` with explicit provisional labeling. Never map `partialMetrics` into `BenchmarkMetricsPanel` as collected metrics. After terminal, reuse 014 panels.

**Rationale**: Aligns with 014 research (no synthetic collected metrics) and contract rule 5 (no finals on terminal).

## Open questions resolved by defaults

- Reconnect on drop: show error; manual retry by re-opening stream for same `jobId` if still non-terminal (no silent status-poll fallback for progress).
- `sessionId` query: pass when provided (anonymous ownership), same as other benchmark endpoints.
