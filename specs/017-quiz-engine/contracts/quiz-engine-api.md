# Contract (FE mirror): Quiz Engine API

Source of truth: `contracts/017-quiz-engine/contract.md`

## Endpoints

### GET `/quizzes/labs/:labSlug`

- Auth: JWT
- 200: `QuizDefinitionResponse` (no correct answers)
- 401 / 403 / 404 as contract

### POST `/quizzes/labs/:labSlug/submit`

- Auth: JWT
- Body: `SubmitQuizRequest`
- 200: `SubmitQuizResult`
- 400 validation / 401 / 403 / 404

### GET `/quizzes/labs/:labSlug/result`

- Auth: JWT
- 200: `QuizResultSummaryResponse`
- 401 / 403 / 404

## Related: Progress gating

`POST /progress/labs/:labSlug/complete` → `FORBIDDEN` when lab has quiz and user has no passing attempt.

## Envelope

Standard `{ success, data, meta, error }` via `apiRequest`.
