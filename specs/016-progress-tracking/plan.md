# Implementation Plan: Progress Tracking (Frontend)

**Branch**: `016-progress-tracking` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/016-progress-tracking/spec.md`

## Summary

Add a `progress-tracking` feature module that calls:

- `GET /tracks/:trackSlug/learning-path` (public)
- `GET /progress/tracks/:trackSlug` (JWT)
- `POST /progress/labs/:labSlug/complete` (JWT, idempotent)

Wire the Learning page to show the real ordered path and authenticated progress, and expose a Mark complete action on lab detail that invalidates progress queries.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 / Next.js 15

**Primary Dependencies**: Zod, TanStack Query, existing `apiRequest` + auth store, `tracks` feature for track selection/status

**Storage**: N/A (API-backed)

**Testing**: Manual / existing project conventions

**Target Platform**: Web (browser)

**Project Type**: Frontend web application (feature-based)

**Performance Goals**: Standard query caching; invalidate progress on complete

**Constraints**: Feature folder conventions; envelope JSON via `apiRequest`; no client-side percent recomputation; no uncomplete

**Scale/Scope**: One new feature module + Learning page + lab detail complete CTA

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature-based architecture: PASS — new `src/features/progress-tracking/`
- No inventing architecture: PASS — mirrors other feature modules
- Contract-driven API: PASS — `contracts/016-progress-tracking/contract.md`
- Scope discipline: PASS — FE only; domain events/backend out of scope

## Project Structure

### Documentation (this feature)

```text
specs/016-progress-tracking/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── progress-tracking-api.md
├── checklists/requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/features/progress-tracking/
├── components/
│   ├── track-learning-path.tsx
│   └── complete-lab-button.tsx
├── constants/query-keys.ts
├── hooks/
│   ├── use-track-learning-path.ts
│   ├── use-track-progress.ts
│   └── use-complete-lab.ts
├── schemas/progress-schema.ts
├── services/progress-service.ts
├── types/progress.ts
└── utils/format-progress-error.ts

# Wiring
src/features/learning/components/learning-page.tsx
src/features/labs/components/lab-detail-page.tsx
```

**Structure Decision**: New `progress-tracking` module owns path/progress/complete APIs. Existing `tracks` module remains for track list/detail metadata only.

## Complexity Tracking

> No constitution violations requiring justification.
