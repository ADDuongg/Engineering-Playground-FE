# Tasks: User Admin

**Input**: Design documents from `/specs/024-user-admin/`

**Prerequisites**: plan.md, spec.md, contracts/024-user-admin/contract.md

## Phase 1: Setup

- [x] T001 Create `src/features/user-admin/` folder skeleton (types, schemas, constants, services, hooks, components, utils, index)
- [x] T002 [P] Add `ROUTES.adminUsers` / `adminUserDetail` in `src/shared/constants/routes.ts`
- [x] T003 [P] Extend `ApiMeta` with optional `pagination` in `src/shared/types/api.ts` and add `apiRequestWithMeta` in `src/shared/services/api-client.ts`

## Phase 2: Foundational

- [x] T004 Define types + Zod schemas for AdminUserView, list query, pagination, update role request
- [x] T005 Implement `user-admin-service.ts` (list/get/patch) against contract
- [x] T006 Implement query keys + error formatter

## Phase 3: User Story 1 — Browse / search

- [x] T007 [US1] Hooks `useAdminUsers` with page/limit/q
- [x] T008 [US1] `AdminUsersPage` with search, pagination, loading/empty/error
- [x] T009 [US1] Route `src/app/(dashboard)/admin/users/page.tsx`
- [x] T010 [US1] Link from admin console + sidebar

## Phase 4: User Story 2 — Detail

- [x] T011 [US2] Hook `useAdminUser`
- [x] T012 [US2] `AdminUserDetailPage` with not-found handling
- [x] T013 [US2] Route `src/app/(dashboard)/admin/users/[userId]/page.tsx`

## Phase 5: User Story 3 — Role change

- [x] T014 [US3] `useUpdateAdminUserRole` mutation with list/detail cache invalidation
- [x] T015 [US3] Role form on detail page; surface CONFLICT/VALIDATION errors
- [x] T016 [US3] Export public API from `src/features/user-admin/index.ts`

## Phase 6: Polish

- [x] T017 Typecheck (`tsc --noEmit`)
- [x] T018 Spec/quickstart aligned with implementation
