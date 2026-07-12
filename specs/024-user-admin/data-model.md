# Data Model: User Admin (FE)

## AdminUserView

| Field | Type | Notes |
| ----- | ---- | ----- |
| id | string | UUID |
| email | string | |
| displayName | string | |
| role | `"user" \| "admin"` | |
| updatedBy | string \| null | Acting admin id when role last changed |
| createdAt | string | ISO-8601 |
| updatedAt | string | ISO-8601 |

## PaginationMeta

| Field | Type | Notes |
| ----- | ---- | ----- |
| page | number | ≥ 1 |
| limit | number | 1–100 |
| total | number | ≥ 0 |

## UpdateAdminUserRoleRequest

| Field | Type |
| ----- | ---- |
| role | `"user" \| "admin"` |

## AdminUserListQuery (client)

| Field | Default |
| ----- | ------- |
| page | 1 |
| limit | 20 |
| q | omitted when empty |
