# Contract (FE mirror): Lab Summary API

Source of truth: `contracts/019-index-playground/contract.md`

## Endpoint

### GET `/labs/:labSlug/summary`

- Auth: JWT
- 200: `LabSummaryResponse`
- 401 `UNAUTHORIZED` / 403 `FORBIDDEN` / 404 `NOT_FOUND`

## Reused (no new endpoints)

- Dataset prepare/status/reset
- Experiment isolation
- SQL execution queue / experiment runner
- Explain runner (scan metrics)
- Metrics history
- Quiz engine
- Benchmark (optional note only)

## FE usage — binding guided query parameters

**Do not** inline the email into SQL. Keep `$1` and send bound parameters.

When calling Experiment Runner or Explain Runner with `recommendedQuery.sql`:

- `sql` → `recommendedQuery.sql` (unchanged)
- `parameters` → `recommendedQuery.exampleParameters` (or same-length override)

`CREATE INDEX` / `DROP INDEX` use `parameters: []`.

## Shared types

`src/shared/labs/lab-summary.ts` (includes `exampleParameters` on `recommendedQuery`)

