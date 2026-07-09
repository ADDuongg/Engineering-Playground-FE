# Implementation Plan: Quiz Engine (Frontend)

**Branch**: `017-quiz-engine` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-quiz-engine/spec.md`

## Summary

Add a `quiz-engine` feature module for:

- `GET /quizzes/labs/:labSlug`
- `POST /quizzes/labs/:labSlug/submit`
- `GET /quizzes/labs/:labSlug/result`

Replace the static quiz page with an API-driven single-select flow (collect answers → one submit). On pass, invalidate progress + quiz result. Update Progress complete error copy for quiz-gated `FORBIDDEN`. Wire lab workspace “Complete lab” to the quiz for that lab.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 / Next.js 15

**Primary Dependencies**: Zod, TanStack Query, `apiRequest`, `useAuth`, `progress-tracking` query invalidation

**Storage**: N/A (API-backed)

**Testing**: Manual / existing project conventions

**Target Platform**: Web (browser)

**Project Type**: Frontend web application (feature-based)

**Performance Goals**: Standard query caching; no client-side answer key

**Constraints**: Feature folder conventions; JWT-only; 100% pass is server-side; no correct answers in definition

**Scale/Scope**: New `quiz-engine` module + rewrite quiz page + light progress error + lab workspace link

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature-based architecture: PASS — new `src/features/quiz-engine/`
- No inventing architecture: PASS — mirrors other feature modules
- Contract-driven API: PASS — `contracts/017-quiz-engine/contract.md`
- Scope discipline: PASS — FE only; events/admin out of scope

## Project Structure

### Documentation (this feature)

```text
specs/017-quiz-engine/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── quiz-engine-api.md
├── checklists/requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/features/quiz-engine/
├── components/
│   ├── quiz-runner.tsx
│   └── quiz-result-card.tsx
├── constants/query-keys.ts
├── hooks/
│   ├── use-quiz-definition.ts
│   ├── use-quiz-result.ts
│   └── use-submit-quiz.ts
├── schemas/quiz-schema.ts
├── services/quiz-service.ts
├── types/quiz.ts
└── utils/format-quiz-error.ts

# Wiring
src/features/quiz/components/quiz-page.tsx
src/shared/constants/routes.ts
src/features/lab-engine/components/lab-workspace.tsx
src/features/progress-tracking/utils/format-progress-error.ts
```

**Structure Decision**: API/hooks/UI runner live in `quiz-engine`; existing `quiz` page remains the route entry and composes the runner with `lab` search param.

## Complexity Tracking

> No constitution violations requiring justification.
