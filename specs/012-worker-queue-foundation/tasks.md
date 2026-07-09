# Tasks: Worker Queue Foundation (Frontend)

**Input**: Design documents from `/specs/012-worker-queue-foundation/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Optional — not required for this feature unless already requested.

**Organization**: Tasks grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 / US2 / US3

## Phase 1: Setup

- [x] T001 Create `src/features/worker-queue/` folder structure (`types`, `schemas`, `services`, `hooks`, `constants`, `utils`)

## Phase 2: Foundational

- [x] T002 [P] Define job types in `src/features/worker-queue/types/job.ts`
- [x] T003 [P] Define Zod schemas in `src/features/worker-queue/schemas/job-schema.ts`
- [x] T004 [P] Add query keys in `src/features/worker-queue/constants/query-keys.ts`
- [x] T005 Implement `fetchJobStatus` in `src/features/worker-queue/services/job-service.ts`
- [x] T006 Implement `format-job-error` utils in `src/features/worker-queue/utils/format-job-error.ts`

**Checkpoint**: Shared client primitives ready

## Phase 3: User Story 1 — Poll shared job status (P1) 🎯 MVP

**Goal**: Poll `GET /jobs/:jobId` until terminal

- [x] T007 [US1] Implement `useJobStatus` polling hook in `src/features/worker-queue/hooks/use-job-status.ts`

**Checkpoint**: Shared status hook usable independently

## Phase 4: User Story 2 — Dataset reset enqueue migration (P1)

**Goal**: Accept async enqueue shape and track via shared job status

- [x] T008 [US2] Update `ResetDatasetResult` type in `src/features/dataset-loader/types/dataset.ts`
- [x] T009 [US2] Update `resetDatasetResultSchema` in `src/features/dataset-loader/schemas/dataset-schema.ts`
- [x] T010 [US2] Update `useDatasetReset` to store `jobId`, poll `useJobStatus`, invalidate dataset queries on completed
- [x] T011 [US2] Update reset error formatting for `QUEUE_UNAVAILABLE` / enqueue errors if needed in `src/features/dataset-reset/utils/format-reset-error.ts`

**Checkpoint**: Reset flow works with jobId + shared polling

## Phase 5: User Story 3 — Benchmark prefers shared status (P2)

**Goal**: Benchmark status uses `/jobs/:jobId`

- [x] T012 [US3] Point `fetchBenchmarkStatus` / `useBenchmarkStatus` at shared job service (adapt mapping for UI fields)
- [x] T013 [US3] Adjust `useBenchmarkRunner` / formatters if shared status fields differ (`failureMessage`, no `hint`/`profile`)

**Checkpoint**: Benchmark polls shared jobs API

## Phase 6: Polish

- [x] T014 Verify no leftover references requiring sync reset `ready`/`resetting` enqueue result
- [x] T015 Mark tasks complete; ensure types compile

## Dependencies

- US1 (T007) before US2 polling wiring (T010) and US3 (T012)
- T002–T006 before T007

## Parallel opportunities

- T002, T003, T004 in parallel after T001
- T008/T009 in parallel after foundational
- T012 after T007

## Implementation strategy

1. Ship US1 MVP (shared status client + hook)
2. Migrate dataset reset (US2)
3. Migrate benchmark status (US3)
4. Polish / typecheck
