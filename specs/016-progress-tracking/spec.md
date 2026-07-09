# Feature Specification: Progress Tracking (Frontend)

**Feature Branch**: `016-progress-tracking`

**Created**: 2026-07-09

**Status**: Implemented (frontend)

**Input**: Implement frontend client for Progress Tracking per `contracts/016-progress-tracking/contract.md` — public track learning path catalog, authenticated track progress summary, and idempotent lab self-complete.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse a track learning path (Priority: P1)

As a learner (including anonymous visitors), I can open a track and see its ordered list of labs so I know what to study next.

**Why this priority**: Catalog is the foundation for progress UI and works without auth.

**Independent Test**: Given a known track slug, the learning path shows labs sorted by sequence; unknown slug surfaces not-found.

**Acceptance Scenarios**:

1. **Given** a valid track slug, **When** the learning path loads, **Then** labs appear in ascending `sequenceOrder` (then slug) with title and optional description.
2. **Given** a track with no seeded labs, **When** the path loads, **Then** an empty list is shown (not an error).
3. **Given** an unknown track slug, **When** the path is requested, **Then** a clear not-found message is shown.

---

### User Story 2 - See my progress on a track (Priority: P1)

As an authenticated learner, I can see how many labs I have completed on a track, which labs are done, and overall percent complete.

**Why this priority**: Core learning-path value; drives dashboard/learning UX.

**Independent Test**: Logged-in user on a known track sees totals, percent, completed slugs, and per-lab `completed` flags.

**Acceptance Scenarios**:

1. **Given** an authenticated user and a valid track, **When** progress loads, **Then** the UI shows `totalLabs`, `completedCount`, `percentComplete` (0–100), and each lab’s completion state.
2. **Given** a track with zero labs, **When** progress loads, **Then** `percentComplete` is 0 and lists are empty.
3. **Given** a missing or invalid session, **When** progress is requested, **Then** an unauthorized message is shown (or the UI prompts sign-in).
4. **Given** an unknown track slug, **When** progress is requested, **Then** a not-found message is shown.

---

### User Story 3 - Mark a lab complete (Priority: P1)

As an authenticated learner, I can mark a catalog lab complete; repeating the action is safe and does not change the recorded completion time incorrectly.

**Why this priority**: Persists learning progress; enables path advancement.

**Independent Test**: First complete returns `alreadyCompleted: false` and updates progress; second complete returns `alreadyCompleted: true` with the same `completedAt`.

**Acceptance Scenarios**:

1. **Given** an authenticated user and a known lab on an active track, **When** they mark complete, **Then** the UI confirms completion and refreshes track progress.
2. **Given** the lab was already completed, **When** they mark complete again, **Then** the UI treats it as success (idempotent) without error.
3. **Given** an unknown lab slug, **When** complete is attempted, **Then** a not-found message is shown.
4. **Given** a lab whose track is not startable (coming-soon / inactive), **When** complete is attempted, **Then** a forbidden/validation message is shown.

---

### Edge Cases

- What happens when the user is anonymous on the learning page? Show public learning path; hide or disable personal progress and complete actions until signed in.
- What happens when complete succeeds but progress refetch fails? Show complete success; surface progress refresh error without undoing the complete result.
- What happens when `percentComplete` and counts disagree visually? Always render API-provided fields; do not recompute percent on the client.
- No uncomplete / revoke in this feature.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch the public ordered learning path for a track slug.
- **FR-002**: System MUST fetch the authenticated progress summary for the current user on a track slug.
- **FR-003**: System MUST allow an authenticated user to mark a lab complete (idempotent POST).
- **FR-004**: System MUST validate all API payloads with Zod before use in hooks/UI.
- **FR-005**: System MUST format progress errors (`UNAUTHORIZED`, `NOT_FOUND`, `VALIDATION_ERROR`, `FORBIDDEN`) into user-readable messages.
- **FR-006**: System MUST invalidate/refetch track progress after a successful complete so the learning path reflects the new state.
- **FR-007**: System MUST NOT invent completion state client-side when the progress API has not returned data.
- **FR-008**: System MUST integrate the learning path and progress into the learning experience (replace static placeholder path where a track is selected).
- **FR-009**: System MUST expose a clear complete action for a lab when the user is authenticated (e.g. lab detail or path row).

### Key Entities

- **LabPathItem**: Ordered catalog lab on a track (slug, title, description, sequenceOrder).
- **TrackLearningPath**: Public path for a track (trackSlug + labs[]).
- **TrackProgressSummary**: Authenticated progress view (counts, percent, completed slugs, labs with completed flags).
- **CompleteLabResult**: Result of self-complete (labSlug, trackSlug, completedAt, alreadyCompleted).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Learners can view an ordered track path without signing in.
- **SC-002**: Signed-in learners see accurate completion percent and per-lab status for their track within one page load.
- **SC-003**: Marking a lab complete updates the visible path/progress without requiring a full page reload.
- **SC-004**: Repeating complete on the same lab never shows a failure solely due to prior completion.

## Assumptions

- Frontend-only scope; persistence, `lab.completed` event emission, and track seeding are backend concerns.
- Feature module name: `progress-tracking` under `src/features/`.
- Public path may live conceptually under `/tracks/...` but is owned by this module’s service (not mixed into generic tracks list/detail unless reused carefully).
- Auth uses existing JWT via `apiRequest` / `useAuth`.
- Primary UI integration: Learning page path; complete action on lab detail (and/or path row).
- Out of scope: admin CRUD, uncomplete, quiz gating, anonymous progress, Redis progress store.
