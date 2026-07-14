# Data Model: React Sandbox Runtime (Frontend)

## Entities

### RunReactExperimentInput

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| action | string | yes | Guided step action (e.g. `render_component`) |
| fixtureId | string | yes | Built-in fixture id (from `scenarioId`) |
| labSlug | string | yes | Allowlist key |
| trackSlug | string | no | Default `frontend-react` on backend |
| props | Record | no | Scenario props |
| interactions | Array | no | Interaction script |
| options | `{ memo?, keyStrategy? }` | no | Memo / key strategy |

**Invariant**: Must never include `componentSource`.

### ReactExperimentRunResult

| Field | Type | Notes |
| ----- | ---- | ----- |
| adapterType | `"headless_react_sandbox"` | Fixed |
| metrics | MetricContract[] | keys ⊆ react-metrics |
| raw.action | string | Echo |
| raw.scenarioId | string | Echo fixtureId |
| raw.interactionCount | number | |
| raw.notes | string[] | |
| runId | string? | If metrics pipeline persistence attached |

### Error detail shapes

- `FIXTURE_NOT_ALLOWED_FOR_LAB`: `{ reason, labSlug, fixtureId, hint }`
- `REACT_SANDBOX_TIMEOUT`: `{ reason, timeoutMs, hint }`

## Relationships

- Guided step `payload.reactScenario` → RunReactExperimentInput (via mapper)
- Run result `metrics` → Metrics Pipeline display
- Optional `runId` → Metrics history (existing module)
