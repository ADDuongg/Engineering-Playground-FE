# Quickstart: User Admin

1. Sign in as a user with `role: admin`.
2. Open `/admin` → **Users** (or `/admin/users`).
3. Search by email/name; paginate as needed.
4. Open a user → change role → Save.
5. Attempt demoting the last admin → expect conflict message; role unchanged.

Contract: `contracts/024-user-admin/contract.md`
