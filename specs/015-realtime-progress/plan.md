# Implementation Plan: Realtime Progress (Frontend)

**Branch**: `015-realtime-progress` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/015-realtime-progress/spec.md`

## Summary

Add a `realtime-progress` feature module that opens a push-only SSE stream to `GET /benchmarks/:jobId/progress`, parses `progress` / `terminal` / `error` events (no JSON envelope), and drives in-run benchmark UX. On terminal, close the stream and hand off to existing status/metrics modules for finals. Stop polling job status for in-run progress while the stream is active.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 / Next.js 15

**Primary Dependencies**: Zod, existing API base URL + auth token handlers, `benchmark-runner` / `benchmark-metrics` for enqueue + finals handoff

**Storage**: N/A (API-backed SSE)

**Testing**: Manual / existing project conventions

**Target Platform**: Web (browser)

**Project Type**: Frontend web application (feature-based)

**Performance Goals**: Render stream updates as they arrive (~1 Hz upstream); abort on unmount

**Constraints**: Feature folder conventions; no envelope on SSE; no finals from terminal event; Authorization header requires `fetch` streaming (not bare `EventSource`)

**Scale/Scope**: One new feature module + light orchestration changes in `benchmark-runner` and benchmark page

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature-based architecture: PASS — new `src/features/realtime-progress/`
- No inventing architecture: PASS — mirrors other feature modules; SSE is contract-mandated
- Contract-driven API: PASS — `contracts/015-realtime-progress/contract.md`
- Scope discipline: PASS — FE only; Redis/worker publish out of scope

## Project Structure

### Documentation (this feature)

```text
specs/015-realtime-progress/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── realtime-progress-api.md
├── checklists/requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/features/realtime-progress/
├── components/
│   └── benchmark-progress-panel.tsx
├── constants/query-keys.ts
├── hooks/
│   └── use-benchmark-progress.ts
├── schemas/progress-schema.ts
├── services/progress-service.ts
├── types/progress.ts
└── utils/format-progress-error.ts

# Orchestration / wiring
src/features/benchmark-runner/hooks/use-benchmark-runner.ts
src/features/benchmark/components/benchmark-page.tsx
src/shared/services/api-client.ts  # optional: export token getter for SSE
```

**Structure Decision**: New `realtime-progress` feature module; integrate via `useBenchmarkRunner` (disable status polling while live; open SSE) and benchmark page progress panel.

## Complexity Tracking

> No constitution violations requiring justification.
