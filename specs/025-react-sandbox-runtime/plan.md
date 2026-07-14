# Implementation Plan: React Sandbox Runtime (Frontend)

**Branch**: `025-react-sandbox-runtime` | **Date**: 2026-07-13 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/025-react-sandbox-runtime/spec.md`  
**Contract**: [contracts/025-react-sandbox-runtime/contract.md](../../contracts/025-react-sandbox-runtime/contract.md)

## Summary

Add a frontend `react-sandbox-runtime` feature that calls authenticated `POST /experiments/react/run`, maps guided React scenarios into safe request DTOs (never sending `componentSource`), validates responses with Zod, formats React-specific errors, and feeds backend `MetricContract[]` into the existing Metrics Pipeline UI. Mirror `experiment-runner` / `explain-runner` structure.

## Technical Context

**Language/Version**: TypeScript (Next.js 15, React 19)

**Primary Dependencies**: TanStack Query, Zod, existing `apiRequest`, Metrics Pipeline types/components, shared `resolveApplyReactScenario`

**Storage**: N/A (Platform API)

**Testing**: Typecheck (`tsc --noEmit`); manual React lab run against BE when available

**Target Platform**: Web (lab workspace consumers)

**Project Type**: Frontend feature module

**Performance Goals**: Standard mutation UX; respect backend timeout (~5s default)

**Constraints**: JWT required; must not send `componentSource`; must not recompute react-metrics; no SQL route changes

**Scale/Scope**: Client module (types, schema, service, hook, mapper, error UI) — not a full React lab plugin UI

## Constitution Check

- Feature-based folder under `src/features/react-sandbox-runtime/`
- Zod validate API payloads
- Reuse Metrics Pipeline for display
- Contract under `contracts/025-react-sandbox-runtime/` stays source of truth
- No sibling-feature imports beyond shared + metrics-pipeline types/utils already used by other runners

## Project Structure

### Documentation (this feature)

```text
specs/025-react-sandbox-runtime/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/react-sandbox-api.md
└── tasks.md
```

### Source Code

```text
src/features/react-sandbox-runtime/
├── components/
│   └── react-sandbox-error-alert.tsx
├── hooks/
│   └── use-run-react-experiment.ts
├── services/
│   └── react-sandbox-service.ts
├── schemas/
│   └── react-sandbox-schema.ts
├── types/
│   └── react-sandbox.ts
├── constants/
│   └── query-keys.ts
├── utils/
│   ├── format-react-sandbox-error.ts
│   └── map-react-scenario-to-run-input.ts
└── index.ts
```

## Complexity Tracking

| Decision | Rationale |
| -------- | --------- |
| Feature name `react-sandbox-runtime` | Matches contract feature id 025; parallels `experiment-runner` naming |
| Strip `componentSource` in mapper | Contract: presence → 400 VALIDATION_ERROR |
| Reuse `MetricsPanel` | Contract: no FE visualization beyond Metric Contract consumption |
| No dedicated lab workspace in this PR | Spec assumes consumer labs wire the hook later; deliver runnable client first |
