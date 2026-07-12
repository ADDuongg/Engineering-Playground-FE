# Research: User Admin

## Decision 1 — API client meta support

**Decision**: Add `apiRequestWithMeta<T>()` returning `{ data, meta }` without changing `apiRequest` callers.

**Rationale**: `GET /admin/users` returns pagination only in `meta.pagination`.

**Alternatives**: Parse full envelope inside the feature service with a one-off fetch — rejected to keep auth refresh behavior centralized.

## Decision 2 — Feature ownership

**Decision**: New feature `user-admin`, not extend `admin-authz`.

**Rationale**: `admin-authz` owns session probe (`/admin/me`) and guards. User directory is a separate capability with its own contract (024).

## Decision 3 — Search UX

**Decision**: Debounced search input (~300ms) that resets to page 1 when `q` changes.

**Rationale**: Matches substring `q` semantics; avoids flooding list requests.
