# Feature Specification: User Admin

**Feature Branch**: `024-user-admin`

**Created**: 2026-07-12

**Status**: Active

**Input**: Implement FE module for admin user directory and role changes per `contracts/024-user-admin/contract.md`

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse and search users (Priority: P1)

As an admin, I can open an admin Users page, see a paginated list of platform users, and search by email or display name so I can find accounts to manage.

**Why this priority**: Directory listing is the entry point for all admin user operations.

**Independent Test**: Sign in as admin, open `/admin/users`, see users from `GET /admin/users`, search with `q`, and page through results.

**Acceptance Scenarios**:

1. **Given** an admin session, **When** they open Users, **Then** they see a paginated list of `AdminUserView` rows (email, display name, role, dates).
2. **Given** the list is loaded, **When** they type a search query, **Then** the list refreshes with `q` applied (case-insensitive email OR displayName).
3. **Given** more users than the page limit, **When** they change page, **Then** results and pagination meta update.
4. **Given** a non-admin user, **When** they hit `/admin/users`, **Then** AdminGuard blocks them (401/403 handling unchanged).

---

### User Story 2 - Inspect a user (Priority: P1)

As an admin, I can open a user detail view by id to confirm identity and current role before changing it.

**Why this priority**: Required before safe role mutation; uses `GET /admin/users/:userId`.

**Independent Test**: From the list, open a user; detail shows fields from `AdminUserView` including `updatedBy`.

**Acceptance Scenarios**:

1. **Given** a valid user id, **When** the detail page loads, **Then** it shows email, displayName, role, createdAt, updatedAt, updatedBy.
2. **Given** an unknown id, **When** the detail loads, **Then** the UI shows a not-found state from `404 NOT_FOUND`.

---

### User Story 3 - Change user role (Priority: P1)

As an admin, I can promote a user to admin or demote an admin to user, with clear feedback when the platform would be left with zero admins.

**Why this priority**: Core mutation of this feature (`PATCH /admin/users/:userId`).

**Independent Test**: Change role on detail page; success updates view; last-admin demotion shows conflict message.

**Acceptance Scenarios**:

1. **Given** a user with role `user`, **When** admin sets role to `admin`, **Then** the UI shows updated role and refreshed `updatedBy`/`updatedAt`.
2. **Given** the requested role equals current, **When** admin submits, **Then** success with no misleading “changed” messaging (no-op allowed).
3. **Given** demoting would leave zero admins, **When** admin submits, **Then** UI shows `409 CONFLICT` message (e.g. cannot demote last admin) and role is unchanged.
4. **Given** role change succeeds, **When** list is revisited, **Then** list cache reflects the new role.

---

### Edge Cases

- Empty directory: `200` with `data: []`, `total: 0` — show empty state.
- Invalid pagination query: rely on server `VALIDATION_ERROR` messaging.
- Concurrent last-admin demotion: show conflict; keep current role.
- Role change does not force logout of the target user (per contract) — no FE session revoke for target.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Admins can list users via `GET /admin/users` with `page`, `limit`, optional `q`.
- **FR-002**: List UI MUST use server pagination meta (`page`, `limit`, `total`), not client-only slicing of a full dump.
- **FR-003**: Admins can load one user via `GET /admin/users/:userId`.
- **FR-004**: Admins can update role via `PATCH /admin/users/:userId` with body `{ role: "user" | "admin" }`.
- **FR-005**: UI MUST surface `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `VALIDATION_ERROR`, and `CONFLICT` with readable messages.
- **FR-006**: Feature lives under `src/features/user-admin/` and admin routes under `/admin/users*`, guarded by existing AdminGuard.
- **FR-007**: Learner `/auth/*` surfaces remain unchanged.

### Key Entities

- **AdminUserView**: id, email, displayName, role, updatedBy, createdAt, updatedAt
- **PaginationMeta**: page, limit, total
- **UpdateAdminUserRoleRequest**: role

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admin can find a user by email substring in under 10 seconds on a seeded dataset.
- **SC-002**: Role change success or last-admin conflict is visible without a full page reload.
- **SC-003**: Non-admins cannot reach user-admin UI (same gate as other admin pages).

## Clarifications

Resolved from contract (no open questions):

- No soft-disable / ban / delete / password reset / email rename in this feature.
- Sort order is fixed server-side (`createdAt` asc, then `id` asc).
- Default page size 20; max limit 100.
