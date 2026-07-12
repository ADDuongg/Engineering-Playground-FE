# Implementation Plan: User Admin

**Branch**: `024-user-admin` | **Date**: 2026-07-12 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/024-user-admin/spec.md`  
**Contract**: [contracts/024-user-admin/contract.md](../../contracts/024-user-admin/contract.md)

## Summary

Add a frontend `user-admin` feature so platform admins can list/search users, open a user detail page, and change roles via `/api/v1/admin/users`. Reuse AdminGuard and admin shell patterns from `admin-authz` / track-lab admin. Extend the API client to return envelope `meta` for pagination.

## Technical Context

**Language/Version**: TypeScript (Next.js 15, React 19)

**Primary Dependencies**: TanStack Query, Zod, React Hook Form (role form), existing `apiRequest` / AdminGuard

**Storage**: N/A (Platform API)

**Testing**: Typecheck (`tsc --noEmit`); manual admin flows against BE

**Target Platform**: Web (dashboard admin routes)

**Project Type**: Frontend feature module

**Performance Goals**: Standard query staleTime ~60s; paginated list only

**Constraints**: Must not invent learner user-directory APIs; admin JWT + role only

**Scale/Scope**: List + detail + role PATCH; search + pagination

## Constitution Check

- Feature-based folder under `src/features/user-admin/`
- Thin App Router pages
- Zod validate API payloads
- No duplicate admin auth — reuse `AdminGuard`
- Contract stays source of truth under `contracts/024-user-admin/`

## Project Structure

### Documentation (this feature)

```text
specs/024-user-admin/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/user-admin-api.md   # pointer to root contract
└── tasks.md
```

### Source Code

```text
src/shared/types/api.ts                    # PaginationMeta on ApiMeta
src/shared/services/api-client.ts          # apiRequestWithMeta
src/features/user-admin/
├── components/
│   ├── admin-users-page.tsx
│   ├── admin-user-detail-page.tsx
│   └── role-form.tsx
├── hooks/
│   ├── use-admin-users.ts
│   ├── use-admin-user.ts
│   └── use-update-admin-user-role.ts
├── services/user-admin-service.ts
├── schemas/user-admin-schema.ts
├── types/user-admin.ts
├── constants/query-keys.ts
├── utils/format-user-admin-error.ts
└── index.ts
src/app/(dashboard)/admin/users/page.tsx
src/app/(dashboard)/admin/users/[userId]/page.tsx
src/shared/constants/routes.ts             # adminUsers routes
```

## Complexity Tracking

| Decision | Rationale |
| -------- | --------- |
| `apiRequestWithMeta` | List endpoint puts pagination in `meta`; existing `apiRequest` returns only `data` |
| Detail route vs modal | Matches other admin CRUD patterns; clearer CONFLICT handling |
