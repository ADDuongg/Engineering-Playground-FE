# Research: Quiz Engine (Frontend)

**Feature**: 017-quiz-engine | **Date**: 2026-07-09

## Decisions

### 1. New `quiz-engine` module vs only editing `features/quiz`

**Decision**: Create `src/features/quiz-engine/` for contract client + runner UI; keep `features/quiz/components/quiz-page.tsx` as the route shell (lab slug resolution + auth gate).

**Rationale**: Matches numbered contract modules (`progress-tracking`, `benchmark-metrics`). Existing `quiz` folder is a placeholder screen, not an API module.

**Alternatives considered**: Put services under `features/quiz/` — workable but inconsistent with 012–016 naming.

### 2. Answer collection UX vs one-shot form

**Decision**: Keep step-through question UI; accumulate `{ questionId, optionId }` locally; call submit once on Finish.

**Rationale**: Contract is a single submit of all answers; step UI matches current placeholder UX and reduces cognitive load.

**Alternatives considered**: All questions on one page — deferred; not required by contract.

### 3. Lab slug routing

**Decision**: `ROUTES.quiz(labSlug)` → `/quiz?lab=<slug>`; default `index-playground` when missing. Lab workspace “Complete lab” links with the current lab slug.

**Rationale**: Minimal route churn; App Router page can read `searchParams`. Avoids nested route refactor this sprint.

### 4. Pass → progress invalidation

**Decision**: On successful submit, always invalidate `quizKeys.result(labSlug)`. If `passed` or `labCompleted`, also invalidate `progressKeys.track(trackSlug)`.

**Rationale**: Passing ensures Progress completion server-side; FE must refresh learning path.

### 5. Progress gated complete messaging

**Decision**: Update `formatProgressErrorMessage` so `FORBIDDEN` prefers API message (quiz must be passed) over the generic “track not active” copy.

**Rationale**: Contract adds quiz-gated FORBIDDEN; API message SHOULD explain quiz requirement.

### 6. No client-side grading

**Decision**: Remove hardcoded `correct` indices from the placeholder; never compute pass locally.

**Rationale**: FR-009 / security of answer key.

## Open questions resolved by defaults

- Incorrect question highlighting: map `incorrectQuestionIds` to prompts from the loaded definition after submit.
- Retry: reset local answers and allow another submit; show best result banner from result query.
- Auth: if not authenticated, show sign-in CTA (same pattern as CompleteLabButton).
