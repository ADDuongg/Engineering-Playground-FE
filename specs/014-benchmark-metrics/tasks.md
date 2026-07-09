# Tasks: Benchmark Metrics (Frontend)

**Input**: Design documents from `/specs/014-benchmark-metrics/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Optional — not required for this feature unless already requested.

**Organization**: Tasks grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 / US2 / US3

## Phase 1: Setup

- [x] T001 Create `src/features/benchmark-metrics/` folder structure (`types`, `schemas`, `services`, `hooks`, `constants`, `utils`, `components`)

## Phase 2: Foundational

- [x] T002 [P] Define benchmark-metrics types in `src/features/benchmark-metrics/types/benchmark-metrics.ts`
- [x] T003 [P] Define Zod schemas in `src/features/benchmark-metrics/schemas/benchmark-metrics-schema.ts`
- [x] T004 [P] Add query keys in `src/features/benchmark-metrics/constants/query-keys.ts`
- [x] T005 [P] Extend `MetricRunType` with `"benchmark"` in metrics-pipeline types + schema
- [x] T006 Extend `BenchmarkJobStatusResult` + Zod schema with `metricsStatus` / `metrics` / `runId`
- [x] T007 Map embed fields from job `payloadSummary` in `mapJobStatusToBenchmark`
- [x] T008 Implement error formatter in `src/features/benchmark-metrics/utils/format-benchmark-metrics-error.ts`

**Checkpoint**: Types and status embed ready

## Phase 3: User Story 1 — See metrics after completed benchmark (P1) 🎯 MVP

**Goal**: Surface collected metrics (or pending/unavailable) after a run

- [x] T009 [US1] Implement `fetchBenchmarkMetricsByJob` in `benchmark-metrics-service.ts`
- [x] T010 [US1] Implement `useBenchmarkMetrics` polling hook while `metricsStatus === "pending"`
- [x] T011 [US1] Implement `BenchmarkMetricsPanel` component (ready / pending / unavailable)
- [x] T012 [US1] Wire benchmark page to show panel from status embed and/or dedicated metrics (no invented zeros)

**Checkpoint**: Completed run shows real metrics or clear pending/unavailable

## Phase 4: User Story 2 — Dedicated per-job metrics (P1)

**Goal**: Dedicated endpoint client usable independently

- [x] T013 [US2] Ensure service supports optional `sessionId` query and Zod parse
- [x] T014 [US2] Surface dedicated-endpoint errors via formatter in UI alert path

**Checkpoint**: Dedicated metrics fetch works with ownership query

## Phase 5: User Story 3 — Session history comparison (P2)

**Goal**: Before/after benchmark history

- [x] T015 [US3] Implement `fetchBenchmarkMetricHistory` service
- [x] T016 [US3] Implement `useBenchmarkMetricHistory` hook
- [x] T017 [US3] Implement `BenchmarkMetricsHistoryPanel` (profile + metrics)
- [x] T018 [US3] Wire benchmark page to invalidate/load benchmark history on completion

**Checkpoint**: Two runs appear in history for comparison

## Phase 6: Polish

- [x] T019 Remove/replace synthetic “collected metrics” presentation on benchmark page results
- [x] T020 Mark tasks complete; ensure types compile (`tsc` / project check)

## Dependencies

- T001 before T002–T008
- T002–T008 before US1 hooks/UI
- T009 before T010–T012
- US1 before US3 page wiring preferred (shared panel patterns)
- T005 before history schema that uses `runType: "benchmark"`

## Parallel opportunities

- T002, T003, T004, T005 in parallel after T001
- T015/T016 after foundational (independent of US1 UI)

## Implementation strategy

1. Foundational types + status embed
2. Dedicated metrics client + panel (US1/US2)
3. History client + panel (US3)
4. Wire benchmark page + polish
