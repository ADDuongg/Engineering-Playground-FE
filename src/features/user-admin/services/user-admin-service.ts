import {
  adminUserViewSchema,
  paginationMetaSchema,
} from "@/features/user-admin/schemas/user-admin-schema";
import type {
  AdminUserListQuery,
  AdminUserListResult,
  AdminUserView,
  UpdateAdminUserRoleRequest,
} from "@/features/user-admin/types/user-admin";
import { apiRequest, apiRequestWithMeta } from "@/shared/services/api-client";

function encodeUserId(userId: string): string {
  return encodeURIComponent(userId);
}

function buildListPath(query: AdminUserListQuery = {}): string {
  const params = new URLSearchParams();
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;

  params.set("page", String(page));
  params.set("limit", String(limit));

  const q = query.q?.trim();
  if (q) {
    params.set("q", q);
  }

  return `/admin/users?${params.toString()}`;
}

export async function fetchAdminUsers(
  query: AdminUserListQuery = {},
): Promise<AdminUserListResult> {
  const { data, meta } = await apiRequestWithMeta<AdminUserView[]>({
    path: buildListPath(query),
    method: "GET",
    auth: true,
  });

  const users = data.map((user) => adminUserViewSchema.parse(user));
  const pagination = paginationMetaSchema.parse(
    meta.pagination ?? {
      page: query.page ?? 1,
      limit: query.limit ?? 20,
      total: users.length,
    },
  );

  return { users, pagination };
}

export async function fetchAdminUserById(
  userId: string,
): Promise<AdminUserView> {
  const data = await apiRequest<AdminUserView>({
    path: `/admin/users/${encodeUserId(userId)}`,
    method: "GET",
    auth: true,
  });

  return adminUserViewSchema.parse(data);
}

export async function updateAdminUserRole(
  userId: string,
  body: UpdateAdminUserRoleRequest,
): Promise<AdminUserView> {
  const data = await apiRequest<AdminUserView>({
    path: `/admin/users/${encodeUserId(userId)}`,
    method: "PATCH",
    body,
    auth: true,
  });

  return adminUserViewSchema.parse(data);
}
