# Quickstart: Progress Tracking (Frontend)

## Manual verification

1. Open `/learning` while logged out → select an active track → ordered labs load from learning-path (no personal percent).
2. Sign in → same track shows percent, completed count, and completed badges on labs.
3. Open a lab detail → click **Mark complete** → toast/success; return to learning path → lab shows completed; percent updates.
4. Mark the same lab complete again → success with idempotent behavior (no error).
5. Unknown track slug (if reachable) → not-found messaging.
6. Coming-soon / inactive track lab complete → forbidden/validation message.

## Dev notes

- API base: `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api/v1`).
- Progress and complete require Bearer JWT via `apiRequest`.
