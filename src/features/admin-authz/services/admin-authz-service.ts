import { adminUserProfileSchema } from "@/features/admin-authz/schemas/admin-authz-schema";
import type { AdminUserProfile } from "@/features/admin-authz/types/admin-authz";
import { apiRequest } from "@/shared/services/api-client";

export async function getAdminMe(): Promise<AdminUserProfile> {
  const data = await apiRequest<AdminUserProfile>({
    path: "/admin/me",
    method: "GET",
    auth: true,
  });

  return adminUserProfileSchema.parse(data);
}
