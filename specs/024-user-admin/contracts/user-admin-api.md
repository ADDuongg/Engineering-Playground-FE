# User Admin API (FE reference)

Canonical contract: [contracts/024-user-admin/contract.md](../../../contracts/024-user-admin/contract.md)

| Method | Path | Notes |
| ------ | ---- | ----- |
| GET | `/admin/users` | Query: page, limit, q — data is `AdminUserView[]`, meta.pagination |
| GET | `/admin/users/:userId` | `AdminUserView` |
| PATCH | `/admin/users/:userId` | Body `{ role }` → `AdminUserView` |
