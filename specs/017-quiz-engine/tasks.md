# Tasks: Quiz Engine (Frontend)

**Input**: Design documents from `/specs/017-quiz-engine/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Optional — not required for this feature unless already requested.

**Organization**: Tasks grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 / US2 / US3

## Phase 1: Setup

- [x] T001 Create `src/features/quiz-engine/` folder structure (`types`, `schemas`, `services`, `hooks`, `constants`, `utils`, `components`)

## Phase 2: Foundational

- [x] T002 [P] Define quiz types in `src/features/quiz-engine/types/quiz.ts`
- [x] T003 [P] Define Zod schemas in `src/features/quiz-engine/schemas/quiz-schema.ts`
- [x] T004 [P] Add query keys in `src/features/quiz-engine/constants/query-keys.ts`
- [x] T005 [P] Implement error formatter in `src/features/quiz-engine/utils/format-quiz-error.ts`
- [x] T006 Implement API service in `src/features/quiz-engine/services/quiz-service.ts` (definition, submit, result)

**Checkpoint**: Typed clients can call all three endpoints

## Phase 3: User Story 1 — Take a lab quiz (P1) 🎯 MVP

**Goal**: Load definition, answer, submit, show graded result

- [x] T007 [US1] Implement `useQuizDefinition` and `useSubmitQuiz` hooks
- [x] T008 [US1] Implement `QuizRunner` + `QuizResultCard` (step UI, no client grading)
- [x] T009 [US1] Rewrite `quiz-page.tsx` to use quiz-engine with `?lab=` (default `index-playground`); auth gate
- [x] T010 [US1] Update `ROUTES.quiz` + lab workspace Complete lab link to pass lab slug

**Checkpoint**: End-to-end take quiz for a lab with seeded quiz

## Phase 4: User Story 2 — Best quiz result (P2)

**Goal**: Show prior best / status

- [x] T011 [US2] Implement `useQuizResult` hook
- [x] T012 [US2] Show result summary banner (not_attempted / failed / passed) on quiz page

**Checkpoint**: Returning users see prior status before/after attempts

## Phase 5: User Story 3 — Pass completes lab + gated complete (P1)

**Goal**: Invalidate progress on pass; FORBIDDEN messaging for Mark complete

- [x] T013 [US3] On submit success: invalidate quiz result + progress track when passed/labCompleted
- [x] T014 [US3] Update `formatProgressErrorMessage` for quiz-gated FORBIDDEN (prefer API message)

**Checkpoint**: Pass updates learning path; Mark complete before pass shows quiz message

## Phase 6: Polish

- [x] T015 Mark tasks complete; ensure types compile (`tsc` / project check)
- [x] T016 Update spec status to Implemented (frontend)

## Dependencies

- T001 before T002–T006
- T002–T006 before US hooks/UI
- T007 before T008–T009
- T010 can parallel T009 once ROUTES shape known
- US1 before US2 banner polish
- T013 after T007 submit hook

## Parallel opportunities

- T002–T005 in parallel after T001
- T011 can start once T006 exists
- T014 independent of quiz UI once progress util exists

## Implementation strategy

1. Foundational types + service
2. Hooks + QuizRunner (US1)
3. Route/workspace wiring
4. Result summary (US2)
5. Progress invalidation + gated complete copy (US3)
6. Compile check + mark done
