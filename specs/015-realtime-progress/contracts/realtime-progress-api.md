# Contract (frontend mirror): Realtime Progress

Source of truth: `contracts/015-realtime-progress/contract.md`

## GET /benchmarks/:jobId/progress

- **Content-Type**: `text/event-stream`
- **Auth**: Optional Bearer; `sessionId` query when unauthenticated
- **No JSON envelope**

### Query

```typescript
interface ObserveBenchmarkProgressQuery {
  sessionId?: string;
}
```

### Events

- `progress` → `BenchmarkProgressSnapshot`
- `terminal` → `BenchmarkProgressSnapshot` (`terminal: true`), then close
- `error` → `{ code, message }`, then close

### Client sequence

```text
POST /benchmarks → jobId
GET  /benchmarks/:jobId/progress (SSE) → progress… → terminal
GET  /benchmarks/:jobId and/or /metrics → finals
```
