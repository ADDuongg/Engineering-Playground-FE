# Implementation Plan: Index Playground / Lab Summary (Frontend)

**Branch**: `019-index-playground` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-index-playground/spec.md`

## Summary

Add lab summary client (`GET /labs/:labSlug/summary`) with shared types under `src/shared/labs/`, and an `index-playground` feature module that renders guided steps, applies recommended SQL/DDL into the editor, and compares before/after Explain scan metrics. Wire into Index Playground workspace via `LabWorkspace` / `LabWorkspaceClient` without duplicating runners.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 / Next.js 15

**Primary Dependencies**: Zod, TanStack Query, existing explain-runner / sql-execution-queue / dataset / quiz modules

**Storage**: N/A (API-backed summary; local before/after snapshots in UI state)

**Testing**: Manual / existing project conventions

**Target Platform**: Web (browser)

**Project Type**: Frontend web application (feature-based)

**Performance Goals**: Single summary fetch per lab open; comparison from in-memory explain results

**Constraints**: Shared types in `src/shared/labs/`; scan comparison from Explain metrics only; reuse existing APIs

**Scale/Scope**: Shared types + `index-playground` feature + light lab-engine/workspace wiring for Index Playground

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature-based architecture: PASS — `src/features/index-playground/` + `src/shared/labs/`
- No inventing architecture: PASS — extends existing workspace
- Contract-driven API: PASS — `contracts/019-index-playground/contract.md`
- Scope discipline: PASS — no new runners; optional benchmark note only

## Project Structure

### Documentation (this feature)

```text
specs/019-index-playground/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── lab-summary-api.md
├── checklists/requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/shared/labs/
├── lab-summary.ts
└── index.ts

src/features/index-playground/
├── components/
│   ├── guided-steps-panel.tsx
│   └── scan-comparison-panel.tsx
├── constants/query-keys.ts
├── hooks/
│   ├── use-lab-summary.ts
│   └── use-scan-comparison.ts
├── schemas/lab-summary-schema.ts
├── services/lab-summary-service.ts
├── types/ (re-export shared or local UI types)
└── utils/
    ├── format-lab-summary-error.ts
    ├── extract-scan-metrics.ts
    └── map-summary-to-lab-content.ts

# Wiring
src/features/lab-engine/components/lab-workspace.tsx  # optional slots: guidedPanel, onApplySql
src/app/labs/[slug]/workspace/lab-workspace-client.tsx
src/features/labs/constants/query-keys.ts  # summary key or use index-playground keys
```

**Structure Decision**: Shared DTO types in `shared/labs` per contract; feature module owns fetch/UI/comparison; Index Playground workspace client activates guided UI when `lab.slug === "index-playground"`.

## Complexity Tracking

> No constitution violations requiring justification.
