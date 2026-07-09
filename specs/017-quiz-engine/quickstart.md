# Quickstart: Quiz Engine (Frontend)

## Manual verification

1. Sign in → open a lab workspace → **Complete lab** / Done → lands on `/quiz?lab=<slug>`.
2. Confirm Network: `GET /quizzes/labs/:labSlug` returns questions without `isCorrect`.
3. Answer all questions → Finish → `POST .../submit` → see percent / pass-fail / incorrect highlights.
4. On pass: Learning path shows lab completed; `GET .../result` shows `passed`.
5. On fail: retry; result status `failed` until a pass.
6. Lab detail **Mark complete** before passing quiz → FORBIDDEN toast about quiz.
7. Logged out on `/quiz` → sign-in CTA.

## Dev notes

- API base: `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api/v1`).
- Default lab when `?lab=` missing: `index-playground`.
