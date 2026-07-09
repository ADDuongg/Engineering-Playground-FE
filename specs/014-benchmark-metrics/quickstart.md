# Quickstart: Benchmark Metrics (Frontend)

## Manual verification

1. Provision experiment session + prepare dataset on Benchmark page.
2. Start a benchmark; while `queued`/`running`, confirm no invented success metrics.
3. On `completed`, if metrics pending, confirm UI shows pending and polls until `ready` or `unavailable`.
4. On `ready`, confirm metric cells show latency / RPS / error rate from `MetricContract[]`.
5. Run a second benchmark; confirm history lists both snapshots with profiles.
6. Force unknown `jobId` (dev tools) → expect not-found messaging from dedicated metrics client.

## API surfaces used

- Status embed via shared job status → mapped in `mapJobStatusToBenchmark`
- `GET /benchmarks/:jobId/metrics?sessionId=`
- `GET /benchmarks/metrics/history?sessionId=&labSlug=&limit=`
