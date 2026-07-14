# Tasks: React Sandbox Runtime (Frontend)

**Input**: Design documents from `/specs/025-react-sandbox-runtime/`

**Prerequisites**: plan.md, spec.md, contracts/025-react-sandbox-runtime/contract.md

## Phase 1: Setup

- [x] T001 Create `src/features/react-sandbox-runtime/` folder skeleton (types, schemas, constants, services, hooks, components, utils, index)

## Phase 2: Foundational

- [x] T002 [P] Define types for run input, result, and error details in `types/react-sandbox.ts`
- [x] T003 [P] Define Zod schemas in `schemas/react-sandbox-schema.ts` (reject/omit `componentSource` on input)
- [x] T004 [P] Add query/mutation keys in `constants/query-keys.ts`

## Phase 3: User Story 1 — Run React experiment (P1)

- [x] T005 [US1] Implement `runReactExperiment` service → `POST /experiments/react/run` with JWT + Zod parse
- [x] T006 [US1] Implement `useRunReactExperiment` mutation hook
- [x] T007 [US1] Export public API from `index.ts` (service, hook, types)

## Phase 4: User Story 2 — Map guided scenarios safely (P1)

- [x] T008 [US2] Implement `mapReactScenarioToRunInput` (scenarioId→fixtureId, strip componentSource, validate required fields)
- [x] T009 [US2] Export mapper from `index.ts`

## Phase 5: User Story 3 — Error UX (P2)

- [x] T010 [US3] Implement `format-react-sandbox-error.ts` (fixture-not-allowed, timeout, generic codes)
- [x] T011 [US3] Implement `ReactSandboxErrorAlert` component
- [x] T012 [US3] Export formatter + alert from `index.ts`

## Phase 6: Polish

- [x] T013 Typecheck (`tsc --noEmit`)
- [x] T014 Align quickstart with final exports
