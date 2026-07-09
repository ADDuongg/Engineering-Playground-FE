# Quickstart: Realtime Progress (Frontend)

## Manual verification

1. Open the load-testing benchmark lab with a ready experiment session + dataset.
2. Start a benchmark (e.g. 100 RPS / 10s).
3. Confirm the results pane shows **live** phase/elapsed (and RPS/partials if published) via SSE — Network tab: `GET .../benchmarks/:jobId/progress` as `text/event-stream`.
4. Confirm job status is **not** polled every 2s for progress while the stream is open.
5. On completion, stream closes after `terminal`; finals appear via metrics panel (014) when `metricsStatus` is ready.
6. Navigate away mid-run: stream aborts (no lingering request).
7. (Optional) Call progress without ownership → forbidden/not-found messaging.

## Dev notes

- API base: `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api/v1`).
- SSE uses `fetch` with Bearer when logged in; pass `sessionId` for anonymous ownership.
