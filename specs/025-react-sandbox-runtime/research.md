# Research: React Sandbox Runtime (Frontend)

**Date**: 2026-07-13

## Decision 1: Mirror experiment-runner / explain-runner

**Choice**: Feature folder with types → schemas → service → mutation hook → error formatter/alert.

**Rationale**: Same envelope, auth, and metrics consumption pattern as SQL runners.

**Alternatives considered**: Extend `experiment-runner` with a React path — rejected to keep SQL and React adapters isolated.

## Decision 2: Guided scenario mapping lives in this feature

**Choice**: `mapReactScenarioToRunInput({ action, labSlug, trackSlug, scenario })` strips `componentSource`, maps `scenarioId` → `fixtureId`, passes props/interactions/options.

**Rationale**: Shared `resolveApplyReactScenario` only extracts payload; run DTO rules belong to the React sandbox client.

## Decision 3: Metrics display

**Choice**: Return `metrics` from the mutation; consumers pass them to existing `MetricsPanel`. Optionally extend `inferMetricVariant` later for react keys — out of scope for v1.

**Rationale**: Contract forbids FE recomputation; existing panel already renders any `MetricContract[]`.

## Decision 4: Error details

**Choice**: Typed details for `FIXTURE_NOT_ALLOWED_FOR_LAB` and `REACT_SANDBOX_TIMEOUT`; fall back to `ApiRequestError.message` + hint.

**Rationale**: Matches contract examples; mirrors dataset-not-ready handling in SQL runners.
