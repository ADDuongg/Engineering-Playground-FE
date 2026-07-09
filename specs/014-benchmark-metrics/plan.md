# Implementation Plan: Benchmark Metrics (Frontend)

**Branch**: `014-benchmark-metrics` | **Date**: 2026-07-09 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/014-benchmark-metrics/spec.md`

## Summary

Add a `benchmark-metrics` feature module for dedicated per-job metrics and session-scoped benchmark history. Extend `benchmark-runner` status mapping to surface embedded `metricsStatus` / `metrics` / `runId`. Extend `metrics-pipeline` `MetricRunType` to include `"benchmark"`. Wire the benchmark page to render collected `MetricContract[]` (and history) instead of inventing success metrics from raw k6 or placeholders.

## Technical Context

**Language/Version**: TypeScript 5.x / React 19 / Next.js 15

**Primary Dependencies**: TanStack Query, Zod, existing `apiRequest` client, existing `MetricContract` from metrics-pipeline

**Storage**: N/A (API-backed)

**Testing**: Manual / existing project conventions

**Target Platform**: Web (browser)

**Project Type**: Frontend web application (feature-based)

**Performance Goals**: Poll dedicated metrics ~2s while `metricsStatus === "pending"`

**Constraints**: Feature folder conventions; reuse metrics-pipeline types/formatters; never expose raw k6 summary in UI

**Scale/Scope**: One new feature module + light extensions to `benchmark-runner` and `metrics-pipeline` + benchmark page wiring

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Feature-based architecture: PASS — new `src/features/benchmark-metrics/`
- No inventing architecture: PASS — mirrors metrics-pipeline / benchmark-runner
- Contract-driven API: PASS — `contracts/014-benchmark-metrics/contract.md`
- Scope discipline: PASS — FE only; no collection listener / re-collect API

## Project Structure

### Documentation (this feature)

```text
specs/014-benchmark-metrics/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── benchmark-metrics-api.md
├── checklists/requirements.md
├── spec.md
└── tasks.md
```

### Source Code (repository root)

```text
src/features/benchmark-metrics/
├── components/
│   ├── benchmark-metrics-panel.tsx
│   └── benchmark-metrics-history-panel.tsx
├── constants/query-keys.ts
├── hooks/
│   ├── use-benchmark-metrics.ts
│   └── use-benchmark-metric-history.ts
├── schemas/benchmark-metrics-schema.ts
├── services/benchmark-metrics-service.ts
├── types/benchmark-metrics.ts
└── utils/format-benchmark-metrics-error.ts

# Extensions
src/features/benchmark-runner/types/benchmark.ts
src/features/benchmark-runner/schemas/benchmark-schema.ts
src/features/benchmark-runner/services/benchmark-service.ts
src/features/metrics-pipeline/types/metrics.ts
src/features/metrics-pipeline/schemas/metrics-schema.ts
src/features/benchmark/components/benchmark-page.tsx
```

## Complexity Tracking

No unjustified complexity. Dedicated endpoints live in `benchmark-metrics`; shared `MetricContract` stays in `metrics-pipeline`; status embed stays in `benchmark-runner`.
