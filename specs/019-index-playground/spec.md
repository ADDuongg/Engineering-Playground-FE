# Feature Specification: Index Playground / Lab Summary (Frontend)

**Feature Branch**: `019-index-playground`

**Created**: 2026-07-09

**Status**: Implemented (frontend)

**Input**: Implement frontend for Index Playground lab summary and guided learning loop per `contracts/019-index-playground/contract.md` — fetch authenticated lab summary (curriculum + guided SQL/DDL), drive Index Playground steps via existing Experiment/Explain/Dataset/Quiz APIs, and compare scan metrics from Explain (`rows_scanned`, `seq_scan_used`, `index_scan_used`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Load lab summary for Index Playground (Priority: P1)

As an authenticated learner opening Index Playground, I see curriculum (goal, theory, guided steps) and recommended SQL/DDL from the API instead of hard-coded lab content alone.

**Why this priority**: Contract’s new endpoint; removes FE hard-coding of Index Playground teaching content.

**Independent Test**: Signed-in user on `index-playground` workspace loads summary; UI shows guided steps and recommended query/index SQL.

**Acceptance Scenarios**:

1. **Given** a signed-in user opens Index Playground, **When** summary loads, **Then** title, learning goal, theory, and ordered guided steps are shown.
2. **Given** summary includes recommended query and create/drop index SQL, **When** the learner uses apply actions, **Then** the SQL editor is filled with that SQL.
3. **Given** unknown lab / no summary / inactive track, **When** summary fails, **Then** a clear error is shown and the workspace can still fall back to registered lab definition content.

---

### User Story 2 - Guided before/after index comparison (Priority: P1)

As a learner following guided steps, I run explain before creating an index, create the index, run explain again, and compare scan-type metrics from Explain (not plain SQL run metrics).

**Why this priority**: Core Index Playground teaching loop.

**Independent Test**: Capture explain metrics before and after create-index; UI shows `rows_scanned` / `seq_scan_used` / `index_scan_used` comparison.

**Acceptance Scenarios**:

1. **Given** dataset/session ready, **When** the learner runs the recommended query with explain, **Then** scan metrics from Explain are available for the “before” snapshot.
2. **Given** a before snapshot exists, **When** the learner applies create-index SQL and re-explains, **Then** an “after” snapshot is captured and compared side-by-side.
3. **Given** only a plain SQL run (no explain scan keys), **When** comparing, **Then** the UI does not invent scan metrics from SQL execution alone.

---

### User Story 3 - Complete the learning loop (Priority: P2)

As a learner, I can follow guided actions through run SQL, explain, create/drop index, compare metrics, and take the quiz (required when `quizRequired` is true).

**Why this priority**: Closes the loop with existing Quiz Engine; optional benchmark is mention-only.

**Independent Test**: Guided step `take_quiz` links to quiz for the lab; optional benchmark note shown if present.

**Acceptance Scenarios**:

1. **Given** `quizRequired: true`, **When** the learner reaches the quiz step, **Then** they can navigate to the lab quiz.
2. **Given** `optionalBenchmarkNote` is present, **When** viewing summary, **Then** the note is visible without requiring a new benchmark API.
3. **Given** drop-index SQL, **When** applied and run, **Then** the learner can reset the experiment path.

---

### Edge Cases

- Anonymous / unauthenticated: summary requires JWT — prompt sign-in or keep static registry content.
- Summary loads after editor already edited: do not overwrite user SQL unless they click Apply.
- Tier from summary `recommendedTier`: prefer first recommended tier when initializing dataset if compatible.
- Labs other than index-playground: summary hook available; guided comparison UI is Index Playground–focused.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch `GET /labs/:labSlug/summary` with JWT and validate with Zod.
- **FR-002**: System MUST place public summary types under `src/shared/labs/` per contract.
- **FR-003**: System MUST render guided steps from summary for Index Playground workspace.
- **FR-004**: System MUST allow applying recommended query / create-index / drop-index SQL into the editor.
- **FR-005**: System MUST capture and display before/after Explain scan metrics (`rows_scanned`, `seq_scan_used`, `index_scan_used`) for comparison.
- **FR-006**: System MUST NOT treat plain SQL execution metrics as the primary scan comparison surface.
- **FR-007**: System MUST format summary errors (`UNAUTHORIZED`, `NOT_FOUND`, `FORBIDDEN`) into user-readable messages.
- **FR-008**: System MUST link quiz step to existing Quiz Engine route when `quizRequired` is true.
- **FR-009**: System MUST reuse existing Dataset / Isolation / SQL / Explain / Metrics / Quiz modules (no duplicate runners).

### Key Entities

- **LabSummary**: Curriculum + guided SQL/DDL for a lab.
- **LabGuidedStep**: Ordered instructional step with an action kind.
- **ScanComparisonSnapshot**: Explain-derived scan metrics for before or after index.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can complete the Index Playground guided path using API summary content without relying solely on hard-coded exercises.
- **SC-002**: Before/after scan comparison is visible after two explain runs around create-index.
- **SC-003**: Quiz entry from the lab remains one click away when quiz is required.
- **SC-004**: Missing summary fails gracefully without breaking the workspace shell.

## Assumptions

- Frontend-only; summary content seeding is backend.
- Feature module: `index-playground` under `src/features/` plus shared types in `src/shared/labs/`.
- Existing `LabWorkspace` / `LabWorkspaceClient` are extended with slots/hooks rather than replaced.
- Optional benchmark remains P2 mention only.
- Default track remains `database-sql`.
