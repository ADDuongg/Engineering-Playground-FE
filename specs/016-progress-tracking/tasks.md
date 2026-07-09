# Tasks: Progress Tracking (Frontend)

**Input**: Design documents from `/specs/016-progress-tracking/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Optional — not required for this feature unless already requested.

**Organization**: Tasks grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 / US2 / US3

## Phase 1: Setup

- [x] T001 Create `src/features/progress-tracking/` folder structure (`types`, `schemas`, `services`, `hooks`, `constants`, `utils`, `components`)

## Phase 2: Foundational

- [x] T002 [P] Define progress types in `src/features/progress-tracking/types/progress.ts`
- [x] T003 [P] Define Zod schemas in `src/features/progress-tracking/schemas/progress-schema.ts`
- [x] T004 [P] Add query keys in `src/features/progress-tracking/constants/query-keys.ts`
- [x] T005 [P] Implement error formatter in `src/features/progress-tracking/utils/format-progress-error.ts`
- [x] T006 Implement API service in `src/features/progress-tracking/services/progress-service.ts` (learning-path, track progress, complete)

**Checkpoint**: Typed clients can call all three endpoints

## Phase 3: User Story 1 — Browse track learning path (P1) 🎯 MVP

**Goal**: Public ordered labs for a track

- [x] T007 [US1] Implement `useTrackLearningPath` hook
- [x] T008 [US1] Implement `TrackLearningPath` UI (ordered list; empty + error states)
- [x] T009 [US1] Wire Learning page to use learning-path instead of static `PATH_STEPS` / catalog grid for the selected track

**Checkpoint**: Anonymous user sees real ordered path for selected track

## Phase 4: User Story 2 — See track progress (P1)

**Goal**: Authenticated summary + per-lab completed

- [x] T010 [US2] Implement `useTrackProgress` hook (enabled when authenticated)
- [x] T011 [US2] Extend Learning path UI with percent, counts, and completed badges from progress

**Checkpoint**: Signed-in user sees accurate progress on Learning page

## Phase 5: User Story 3 — Mark lab complete (P1)

**Goal**: Idempotent complete + invalidate progress

- [x] T012 [US3] Implement `useCompleteLab` mutation (invalidate track progress on success)
- [x] T013 [US3] Implement `CompleteLabButton` with success/error messaging
- [x] T014 [US3] Wire complete CTA on lab detail page

**Checkpoint**: Complete updates path progress without full reload; retry is idempotent

## Phase 6: Polish

- [x] T015 Mark tasks complete; ensure types compile (`tsc` / project check)
- [x] T016 Update spec status to Implemented (frontend)

## Dependencies

- T001 before T002–T006
- T002–T006 before US hooks/UI
- T007 before T008–T009
- US1 before US2 progress overlay
- T010 before T011
- T012 before T013–T014
- Complete invalidation depends on T004 query keys

## Parallel opportunities

- T002, T003, T004, T005 in parallel after T001
- T007 and T010 can proceed once service exists
- T008 can use mocked path data while T007 lands

## Implementation strategy

1. Foundational types + service
2. Learning path hook + Learning page (US1)
3. Progress hook + badges/percent (US2)
4. Complete mutation + lab detail CTA (US3)
5. Compile check + mark done
