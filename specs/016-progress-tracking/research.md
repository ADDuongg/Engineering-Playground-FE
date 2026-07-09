# Research: Progress Tracking (Frontend)

**Feature**: 016-progress-tracking | **Date**: 2026-07-09

## Decisions

### 1. New feature module vs extending `tracks`

**Decision**: Create `src/features/progress-tracking/` for learning-path, progress summary, and complete APIs.

**Rationale**: Contract spans `/tracks/.../learning-path` and `/progress/...`. Progress/complete are auth-scoped learning state, distinct from track catalog metadata already in `tracks`.

**Alternatives considered**: Put learning-path on `tracks-service` and progress elsewhere — splits one contract across modules and complicates invalidation.

### 2. Public path vs authenticated progress on Learning page

**Decision**: Always fetch public learning path for the selected track. Fetch progress only when `useAuth().isAuthenticated`. Merge completion flags in UI from progress when available; otherwise show path without completion.

**Rationale**: Contract makes path public; progress requires JWT. Anonymous users still get ordered labs (SC-001).

**Alternatives considered**: Progress-only UI — rejects anonymous path browsing.

### 3. Percent / counts source of truth

**Decision**: Render `percentComplete`, `totalLabs`, and `completedCount` from the progress API as-is; do not recompute on the client.

**Rationale**: Spec edge case and FR-007; backend owns rounding (`0` when `totalLabs === 0`).

### 4. Complete → cache invalidation

**Decision**: On successful `completeLab`, invalidate `progressKeys.track(trackSlug)` (and optionally learning-path if needed). Prefer `trackSlug` from `CompleteLabResult`.

**Rationale**: FR-006; keeps Learning page and any other consumers in sync without full reload.

### 5. Complete CTA placement

**Decision**: Primary CTA on lab detail page (`CompleteLabButton`). Learning path rows show completed state and link to lab; optional inline complete is not required for MVP if detail CTA exists.

**Rationale**: Lab detail is the natural “I finished this” moment; path focuses on overview.

## Open questions resolved by defaults

- Track slug validation: reuse `assertValidTrackSlug` / track slug schema from `tracks` where applicable.
- Coming-soon tracks: existing Learning page empty state for track status remains; complete errors surface FORBIDDEN/VALIDATION from API.
- Domain event `lab.completed`: backend-only; FE does not subscribe.
