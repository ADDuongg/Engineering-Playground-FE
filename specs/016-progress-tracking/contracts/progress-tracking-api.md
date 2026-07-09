# Contract (FE mirror): Progress Tracking API

Source of truth: `contracts/016-progress-tracking/contract.md`

## Endpoints

### GET `/tracks/:trackSlug/learning-path`

- Auth: public
- 200: `TrackLearningPathResponse`
- 404: `NOT_FOUND`

### GET `/progress/tracks/:trackSlug`

- Auth: JWT
- 200: `TrackProgressSummaryResponse`
- 401: `UNAUTHORIZED`
- 404: `NOT_FOUND`

### POST `/progress/labs/:labSlug/complete`

- Auth: JWT
- Body: none / empty object
- 200: `CompleteLabResult` (`alreadyCompleted` for idempotent retry)
- 401: `UNAUTHORIZED`
- 404: `NOT_FOUND`
- 400/403: `VALIDATION_ERROR` / `FORBIDDEN` when track not active

## Envelope

Standard `{ success, data, meta, error }` via `apiRequest`.
