# Implementation Plan: Worker Queue Foundation (Frontend)

**Branch**: `012-worker-queue-foundation` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-worker-queue-foundation/spec.md`

## Summary

Add a `worker-queue` feature module that owns the shared `GET /jobs/:jobId` client (types, Zod schema, service, polling hook, error formatting). Migrate dataset-reset enqueue parsing to the async job acknowledgment shape and wire reset/benchmark status polling to the shared jobs API while leaving feature-owned enqueue routes in place.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 / Next.js 15

**Primary Dependencies**: TanStack Query, Zod, existing `apiRequest` client

**Storage**: N/A (API-backed)

**Testing**: Manual / existing project conventions (no new test harness required unless already present)

**Target Platform**: Web (browser)

**Project Type**: Frontend web application (feature-based)

**Performance Goals**: Status poll interval ~2s while non-terminal (match benchmark-runner)

**Constraints**: Follow feature folder conventions; no `shared/` → `features/` imports; reuse auth-aware `apiRequest`

**Scale/Scope**: One new feature module + light migrations in `dataset-reset` and `benchmark-runner`

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature-based architecture: PASS — new `src/features/worker-queue/`
- No inventing architecture: PASS — mirrors benchmark-runner / dataset-reset patterns
- Contract-driven API: PASS — `contracts/012-worker-queue-foundation/contract.md`
- Scope discipline: PASS — FE only; no BullMQ/worker code

## Project Structure

### Documentation (this feature)

```text
specs/012-worker-queue-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── jobs-api.md
├── checklists/requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/features/worker-queue/
├── constants/query-keys.ts
├── hooks/use-job-status.ts
├── schemas/job-schema.ts
├── services/job-service.ts
├── types/job.ts
└── utils/format-job-error.ts

# Migrations
src/features/dataset-loader/types/dataset.ts          # enqueue result shape
src/features/dataset-loader/schemas/dataset-schema.ts # Zod for enqueue result
src/features/dataset-reset/hooks/use-dataset-reset.ts # track jobId via shared status
src/features/benchmark-runner/hooks/use-benchmark-status.ts # poll shared jobs
src/features/benchmark-runner/services/benchmark-service.ts # optional: stop using legacy status path
```

## Complexity Tracking

No unjustified complexity. Shared status lives in one feature; consumers import hooks/services across features (already established pattern, e.g. dataset-reset → dataset-loader types).
