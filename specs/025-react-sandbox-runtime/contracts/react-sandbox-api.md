# Contract pointer: React Sandbox Runtime API

Canonical contract: [contracts/025-react-sandbox-runtime/contract.md](../../contracts/025-react-sandbox-runtime/contract.md)

## Frontend surface

| Method | Path | Auth | Purpose |
| ------ | ---- | ---- | ------- |
| POST | `/experiments/react/run` | JWT required | Run allowlisted headless React fixture; return react-metrics |

## Request / response

See root contract for `RunReactExperimentDto` and `ReactExperimentRunResult`.

## Error codes consumed by FE

`UNAUTHORIZED` · `VALIDATION_ERROR` · `NOT_FOUND` · `FORBIDDEN` / `SANDBOX_ERROR` · `TIMEOUT` · `EXECUTION_ERROR`
