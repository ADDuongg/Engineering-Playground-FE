# Contract mirror: Benchmark Metrics API

See canonical contract: [`contracts/014-benchmark-metrics/contract.md`](../../../contracts/014-benchmark-metrics/contract.md)

## Endpoints (FE clients)

| Method | Path | Client |
|--------|------|--------|
| GET | `/benchmarks/:jobId/metrics` | `fetchBenchmarkMetricsByJob` |
| GET | `/benchmarks/metrics/history` | `fetchBenchmarkMetricHistory` |

Status embed fields are consumed via shared job status mapping in `benchmark-runner`.
