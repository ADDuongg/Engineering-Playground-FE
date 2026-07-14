# Quickstart: React Sandbox Runtime (Frontend)

## Prerequisites

- Authenticated session (JWT)
- Backend serving `POST /experiments/react/run`
- Lab with guided steps containing `payload.reactScenario.scenarioId`

## Manual check

1. Import `useRunReactExperiment` and `mapReactScenarioToRunInput` from `@/features/react-sandbox-runtime`.
2. Resolve scenario via `resolveApplyReactScenario(step)` from `@/shared/labs`.
3. Map to input with `labSlug` / optional `trackSlug`.
4. Call mutation; on success pass `result.metrics` to `MetricsPanel`.
5. On error render `ReactSandboxErrorAlert`.

## Smoke cases

- Happy path: allowlisted fixture → metrics array non-empty or empty-but-valid.
- Strip source: scenario with `componentSource` → request body has no such key.
- Not allowlisted: expect hint about lab’s guided steps.
- Timeout: expect simplify-interactions hint.
