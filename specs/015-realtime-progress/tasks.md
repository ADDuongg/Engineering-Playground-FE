# Tasks: Realtime Progress (Frontend)

**Input**: Design documents from `/specs/015-realtime-progress/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Optional — not required for this feature unless already requested.

**Organization**: Tasks grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 / US2 / US3

## Phase 1: Setup

- [x] T001 Create `src/features/realtime-progress/` folder structure (`types`, `schemas`, `services`, `hooks`, `constants`, `utils`, `components`)

## Phase 2: Foundational

- [x] T002 [P] Define progress types in `src/features/realtime-progress/types/progress.ts`
- [x] T003 [P] Define Zod schemas in `src/features/realtime-progress/schemas/progress-schema.ts`
- [x] T004 [P] Add query/stream keys in `src/features/realtime-progress/constants/query-keys.ts`
- [x] T005 [P] Export `getApiAccessToken` (or equivalent) from `src/shared/services/api-client.ts` for SSE Authorization
- [x] T006 Implement SSE open + line parser in `src/features/realtime-progress/services/progress-service.ts`
- [x] T007 Implement error formatter in `src/features/realtime-progress/utils/format-progress-error.ts`

**Checkpoint**: Typed SSE client can connect and parse events

## Phase 3: User Story 1 — Watch live benchmark progress (P1) 🎯 MVP

**Goal**: Live phase/elapsed/RPS/partials from SSE without status polling for progress

- [x] T008 [US1] Implement `useBenchmarkProgress` hook (open on jobId, update snapshot, abort on unmount)
- [x] T009 [US1] Implement `BenchmarkProgressPanel` for provisional live UI
- [x] T010 [US1] Update `useBenchmarkRunner` to disable status polling while live and expose progress snapshot
- [x] T011 [US1] Wire benchmark page to show progress panel while active

**Checkpoint**: Active run shows live SSE-driven progress

## Phase 4: User Story 2 — Terminal handoff to finals (P1)

**Goal**: On terminal, close stream and load status/metrics finals

- [x] T012 [US2] On `terminal` in hook/runner: stop stream, fetch status once, enable metrics handoff (014)
- [x] T013 [US2] Ensure terminal SSE payload is never rendered as collected finals

**Checkpoint**: After terminal, metrics panel/history path works as before

## Phase 5: User Story 3 — Ownership and stream errors (P2)

**Goal**: Clear errors + cleanup

- [x] T014 [US3] Pass optional `sessionId` on progress URL; surface validation/forbidden/not-found
- [x] T015 [US3] Handle mid-stream `error` event and connection failures; abort cleans up

**Checkpoint**: Error paths show messages and leave no dangling stream

## Phase 6: Polish

- [x] T016 Mark tasks complete; ensure types compile (`tsc` / project check)
- [x] T017 Update spec status to Implemented (frontend)

## Dependencies

- T001 before T002–T007
- T002–T007 before US1 hooks/UI
- T008 before T010–T011
- US1 before US2 handoff wiring
- T005 before T006 (token for SSE)

## Parallel opportunities

- T002, T003, T004, T005 in parallel after T001
- T009 can proceed once types exist (mock snapshot)

## Implementation strategy

1. Foundational types + SSE service
2. Hook + panel (US1)
3. Runner/page wiring + stop status poll
4. Terminal handoff (US2)
5. Error/ownership polish (US3)
