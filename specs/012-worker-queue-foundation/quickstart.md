# Quickstart: Worker Queue Foundation (Frontend)

## Shared job status

```ts
import { useJobStatus } from "@/features/worker-queue/hooks/use-job-status";

const { data, error, isLoading } = useJobStatus(jobId);
// polls while queued/running
```

## Dataset reset (async enqueue)

1. Call reset mutation → receive `{ jobId, status: "queued", ... }`
2. Poll `useJobStatus(jobId)` until terminal
3. On `completed`, invalidate dataset status/metadata queries

## Benchmark

1. Enqueue via existing `POST /benchmarks`
2. Poll shared `useJobStatus(jobId)` (or benchmark hook that wraps it)
3. Render lifecycle; keep profile from enqueue result

## Manual verification

1. Enqueue benchmark → Network tab shows `GET /jobs/:jobId` polling
2. Enqueue dataset reset → response includes `jobId`; polling uses `/jobs/:jobId`
3. Force 404/403 → user-facing error messages render
