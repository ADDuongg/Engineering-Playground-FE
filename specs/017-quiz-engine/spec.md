# Feature Specification: Quiz Engine (Frontend)

**Feature Branch**: `017-quiz-engine`

**Created**: 2026-07-09

**Status**: Implemented (frontend)

**Input**: Implement frontend client for Quiz Engine per `contracts/017-quiz-engine/contract.md` — authenticated quiz definition (no answers), submit/grade (100% pass), best-result summary, and progress self-complete gated by passing quiz when a quiz exists.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Take a lab quiz (Priority: P1)

As an authenticated learner finishing a lab, I can load the quiz for that lab, answer each single-select question, and submit for grading without ever seeing correct answers in the definition payload.

**Why this priority**: Core learning reinforcement loop.

**Independent Test**: Given a lab with a quiz, load definition, answer all questions, submit once; see score and pass/fail.

**Acceptance Scenarios**:

1. **Given** a signed-in user and a lab with a quiz, **When** the quiz page opens, **Then** questions and options render in sequence order without correct-answer hints.
2. **Given** all questions answered, **When** the user finishes, **Then** answers are submitted in one request and the result (percent, passed, incorrect ids) is shown.
3. **Given** incomplete answers, **When** submit is attempted, **Then** the client prevents submit or surfaces a validation error.
4. **Given** unknown lab / no quiz / inactive track, **When** definition loads, **Then** a clear error is shown.

---

### User Story 2 - See best quiz result (Priority: P2)

As an authenticated learner, I can see whether I have not attempted, failed, or passed a lab quiz and my best score when available.

**Why this priority**: Supports retry UX and lab completion gating messaging.

**Independent Test**: After attempts, result summary reflects status and best score; before any attempt, `not_attempted`.

**Acceptance Scenarios**:

1. **Given** no attempts, **When** result loads, **Then** status is `not_attempted` and score fields are absent.
2. **Given** prior failed attempts only, **When** result loads, **Then** status is `failed` with best score fields.
3. **Given** a passing attempt, **When** result loads, **Then** status is `passed`.

---

### User Story 3 - Pass quiz completes lab; gated self-complete (Priority: P1)

As an authenticated learner, passing the quiz records lab completion; marking complete without a passing attempt fails when the lab has a quiz.

**Why this priority**: Contract change to Progress gating; closes the lab learning loop.

**Independent Test**: Pass quiz → progress shows lab completed; Mark complete without pass → FORBIDDEN with quiz message.

**Acceptance Scenarios**:

1. **Given** a passing submit, **When** result returns `passed` / `labCompleted`, **Then** track progress is refreshed and the lab shows completed.
2. **Given** a failing submit, **When** result returns `passed: false`, **Then** lab is not marked complete and the user can retry.
3. **Given** a lab with a quiz and no passing attempt, **When** Mark complete is used, **Then** a forbidden message indicates the quiz must be passed first.

---

### Edge Cases

- Anonymous user on quiz route: prompt sign-in (quizzes are JWT-only).
- Retry after fail: allow reloading definition and submitting again; show previous best via result.
- `alreadyLabCompleted` on pass: treat as success; do not error.
- Labs without a quiz: Mark complete remains available (016 behavior); quiz page shows not-found for that lab.
- Client must never trust or display `isCorrect` (not present on public options).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch authenticated quiz definition for a lab slug (no correct answers).
- **FR-002**: System MUST submit all answers in one request and display graded result (counts, percent, passed, incorrect question ids).
- **FR-003**: System MUST fetch the current user’s best quiz result summary for a lab.
- **FR-004**: System MUST validate payloads with Zod before use in hooks/UI.
- **FR-005**: System MUST format quiz errors (`UNAUTHORIZED`, `NOT_FOUND`, `FORBIDDEN`, `VALIDATION_ERROR`) into user-readable messages.
- **FR-006**: System MUST invalidate track progress (and quiz result) after a successful submit that passes / completes the lab.
- **FR-007**: System MUST replace the static placeholder quiz UI with API-driven flow for a selected lab.
- **FR-008**: System MUST update Progress complete error handling for quiz-gated `FORBIDDEN`.
- **FR-009**: System MUST NOT grade answers client-side against a local answer key.

### Key Entities

- **QuizDefinition**: Lab quiz for rendering (title, questions, options without correctness).
- **QuizQuestion / QuizOption**: Single-select public question and options.
- **SubmitQuizRequest / SubmitQuizResult**: Answer payload and graded outcome.
- **QuizResultSummary**: Best attempt status for the current user.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Signed-in learners can complete a lab quiz end-to-end without a page reload for grading.
- **SC-002**: Passing a quiz updates lab completion visibility on the learning path within one navigation/refetch.
- **SC-003**: Learners who fail can see which questions were wrong (by id mapping) and retry.
- **SC-004**: Attempting Mark complete before passing a required quiz shows a clear quiz-required message.

## Assumptions

- Frontend-only scope; attempt persistence, 100% pass rule, and domain events are backend concerns.
- Feature module name: `quiz-engine` under `src/features/`; existing `/quiz` route and `quiz` page are the primary UI surface, parameterized by lab slug.
- Default lab for the global quiz nav link: `index-playground` (or query `?lab=`).
- Auth via existing JWT / `apiRequest`.
- Out of scope: admin CRUD, multi-select, anonymous quizzes, attempt limits.
