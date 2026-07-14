# Feature Specification: React Sandbox Runtime (Frontend)

**Feature Branch**: `025-react-sandbox-runtime`

**Created**: 2026-07-13

**Status**: Implemented (frontend)

**Input**: Implement frontend client for Headless React Sandbox Runtime per `contracts/025-react-sandbox-runtime/contract.md` — authenticated `POST /experiments/react/run`, map guided-step React scenarios to run requests (never send `componentSource`), surface backend-owned `react-metrics` via existing Metrics Pipeline UI, and format contract error codes for learners.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run a React lab experiment (Priority: P1)

As an authenticated learner on a Frontend React lab, I run a guided React action (render, update props/state, remount, toggle memo, compare reconciliation, inspect hooks) against an allowlisted fixture and see backend-produced React metrics.

**Why this priority**: Core contract endpoint; without it React track labs cannot execute experiments.

**Independent Test**: Signed-in user calls run with `action`, `fixtureId`, and `labSlug`; response metrics are displayed; FE does not invent metric values.

**Acceptance Scenarios**:

1. **Given** a signed-in learner and a valid fixture allowlisted for the lab, **When** they run a React experiment, **Then** the client posts to `/experiments/react/run` with JWT and shows returned `metrics`.
2. **Given** a successful run, **When** metrics render, **Then** values come only from the API response (FE does not recompute `render_count`, `commit_duration_ms`, etc.).
3. **Given** `runId` is present, **When** the run completes, **Then** the client preserves it for optional metrics history linkage.

---

### User Story 2 - Map guided React scenarios safely (Priority: P1)

As a learner following a guided React step, the workspace builds the run request from `payload.reactScenario` and the step `action`, omitting any `componentSource` so the backend does not reject the request.

**Why this priority**: Contract forbids client-supplied component source; guided steps already store `reactScenario`.

**Independent Test**: Build input from a guided step with `scenarioId` / props / interactions / options; assert `componentSource` is never in the request body.

**Acceptance Scenarios**:

1. **Given** a guided step with `reactScenario.scenarioId`, **When** mapping to a run request, **Then** `fixtureId` equals that scenario id and `action` equals the step action.
2. **Given** `reactScenario` includes `componentSource`, **When** mapping, **Then** `componentSource` is stripped and never sent.
3. **Given** missing `scenarioId` / fixture id, **When** the learner tries to run, **Then** the client blocks the call with a clear validation message (does not hit the API with empty `fixtureId`).

---

### User Story 3 - Understand React sandbox failures (Priority: P2)

As a learner, when a React run fails (unauthorized, validation, unknown fixture, not allowlisted, timeout, execution fault), I see a readable message including backend hints when present.

**Why this priority**: React labs have distinct failure modes (fixture allowlist, timeout) vs SQL dataset readiness.

**Independent Test**: Feed each contract error shape into the formatter/alert; message includes hint for fixture-not-allowed and timeout.

**Acceptance Scenarios**:

1. **Given** fixture not allowlisted for the lab, **When** the API returns 403 with `FIXTURE_NOT_ALLOWED_FOR_LAB`, **Then** the UI shows the hint about using this lab’s scenarios.
2. **Given** a timeout (`REACT_SANDBOX_TIMEOUT`), **When** formatting the error, **Then** the message suggests simplifying interactions.
3. **Given** missing/invalid JWT, **When** the run fails with `UNAUTHORIZED`, **Then** the learner is prompted to sign in (existing auth client behavior).

---

### Edge Cases

- Anonymous user: endpoint requires JWT — do not call without auth; surface unauthorized clearly.
- Empty `action`, `fixtureId`, or `labSlug`: client-side Zod validation fails before network.
- Interaction / item caps exceeded: show `VALIDATION_ERROR` message from API.
- Unknown `fixtureId`: show `NOT_FOUND`.
- Unsupported action / fixture throw: show `EXECUTION_ERROR`.
- SQL experiment routes and Index Playground SQL flow remain unchanged.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST call `POST /experiments/react/run` with JWT via the shared API client.
- **FR-002**: System MUST validate request and response with Zod against the contract shapes.
- **FR-003**: System MUST expose a typed service + TanStack Query mutation hook for React runs.
- **FR-004**: System MUST map guided `reactScenario` + step `action` + `labSlug` / `trackSlug` into `RunReactExperimentDto` without sending `componentSource`.
- **FR-005**: System MUST display returned `MetricContract[]` through existing Metrics Pipeline components (no FE recomputation of react-metrics keys).
- **FR-006**: System MUST format errors for `UNAUTHORIZED`, `VALIDATION_ERROR`, `NOT_FOUND`, `FORBIDDEN` / `SANDBOX_ERROR`, `TIMEOUT`, and `EXECUTION_ERROR`, preferring API `details.hint` when present.
- **FR-007**: System MUST provide an error alert component for React sandbox failures analogous to experiment/explain runners.
- **FR-008**: System MUST NOT add admin fixture CRUD, new visualization contracts, or changes to SQL experiment routes.

### Key Entities

- **RunReactExperiment request**: action, fixtureId, labSlug, optional trackSlug/props/interactions/options.
- **ReactExperimentRunResult**: adapterType `headless_react_sandbox`, metrics, raw echo fields, optional runId.
- **React sandbox error details**: fixture-not-allowed and timeout detail shapes from the contract.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Authenticated learners can complete a React guided run and see at least one backend metric in under 10 seconds of UI interaction (excluding backend timeout).
- **SC-002**: 100% of client-built run payloads omit `componentSource`.
- **SC-003**: Each contract error code maps to a distinct, human-readable message path (hint when provided).
- **SC-004**: SQL Index Playground run/explain flows remain unchanged after this feature ships.

## Assumptions

- Backend `POST /experiments/react/run` is available behind the same API base URL and envelope as other experiment routes.
- Fixture registry and lab allowlists are backend-owned; FE only sends ids from guided steps / lab config.
- Metric display reuses `MetricsPanel` / `mapMetricsToLabMetrics`; react-specific variant heuristics can be minimal/none in v1.
- Full React lab workspace UI (dedicated lab plugin) may consume this module later; this feature delivers the runnable client module first.
- Default `trackSlug` is `frontend-react` when omitted (contract default).
