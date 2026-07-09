# Contract mirror: Jobs API (Frontend)

Source of truth: `contracts/012-worker-queue-foundation/contract.md`

## GET /jobs/:jobId

Authenticated. Returns `GetJobStatusResult`.

Errors: `NOT_FOUND` 404, `FORBIDDEN` 403, `UNAUTHORIZED` 401.

## Enqueue dataset reset (feature-owned)

`POST /datasets/reset` → `202` `EnqueueDatasetResetResult`.

## Enqueue benchmark (feature-owned)

`POST /benchmarks` — unchanged success shape; status via shared jobs.
