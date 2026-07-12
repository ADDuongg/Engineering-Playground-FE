export type AdminUserRole = "user" | "admin";

export interface AdminUserView {
  id: string;
  email: string;
  displayName: string;
  role: AdminUserRole;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAdminUserRoleRequest {
  role: AdminUserRole;
}

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  q?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
}

export interface AdminUserListResult {
  users: AdminUserView[];
  pagination: PaginationMeta;
}
