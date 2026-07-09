# Tasks: Index Playground / Lab Summary (Frontend)

**Input**: Design documents from `/specs/019-index-playground/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Optional — not required for this feature unless already requested.

**Organization**: Tasks grouped by user story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: US1 / US2 / US3

## Phase 1: Setup

- [x] T001 Create `src/shared/labs/` and `src/features/index-playground/` folder structure

## Phase 2: Foundational

- [x] T002 [P] Define shared types in `src/shared/labs/lab-summary.ts` + `index.ts`
- [x] T003 [P] Define Zod schemas in `src/features/index-playground/schemas/lab-summary-schema.ts`
- [x] T004 [P] Add query keys in `src/features/index-playground/constants/query-keys.ts`
- [x] T005 [P] Implement error formatter in `src/features/index-playground/utils/format-lab-summary-error.ts`
- [x] T006 Implement `fetchLabSummary` in `src/features/index-playground/services/lab-summary-service.ts`
- [x] T007 [P] Implement `extractScanMetrics` util for Explain metric keys

**Checkpoint**: Typed summary client + scan extract helpers ready

## Phase 3: User Story 1 — Load lab summary (P1) 🎯 MVP

**Goal**: Fetch and render guided curriculum for Index Playground

- [x] T008 [US1] Implement `useLabSummary` hook
- [x] T009 [US1] Implement `GuidedStepsPanel` (steps + apply SQL actions)
- [x] T010 [US1] Extend `LabWorkspace` with optional `guidedSlot` + query apply support
- [x] T011 [US1] Wire Index Playground in `lab-workspace-client.tsx` to load summary and show guided panel

**Checkpoint**: Summary-driven steps visible; Apply fills editor

## Phase 4: User Story 2 — Before/after scan comparison (P1)

**Goal**: Compare Explain scan metrics around create-index

- [x] T012 [US2] Implement `useScanComparison` (capture before/after from explain metrics)
- [x] T013 [US2] Implement `ScanComparisonPanel`
- [x] T014 [US2] Wire capture on explain success + show comparison slot in Index Playground workspace

**Checkpoint**: Before/after scan metrics visible after guided explain runs

## Phase 5: User Story 3 — Complete learning loop (P2)

**Goal**: Quiz link + optional benchmark note

- [x] T015 [US3] Guided `take_quiz` / quizRequired → link to `ROUTES.quiz(labSlug)`
- [x] T016 [US3] Show `optionalBenchmarkNote` when present

**Checkpoint**: Quiz reachable from guided flow; note visible if API sends it

## Phase 6: Polish

- [x] T017 Prefer summary `recommendedTier[0]` for initial dataset tier when valid
- [x] T018 Mark tasks complete; ensure types compile (`tsc`)
- [x] T019 Update spec status to Implemented (frontend)

## Dependencies

- T001 before T002–T007
- T002–T007 before US1 hooks/UI
- T010 before T011
- US1 before US2 comparison wiring
- T012 before T013–T014

## Parallel opportunities

- T002–T005, T007 in parallel after T001
- T015–T016 can follow T009

## Implementation strategy

1. Shared types + summary service
2. Guided panel + workspace slots (US1)
3. Scan comparison (US2)
4. Quiz/note polish (US3)
5. Tier init + compile check
