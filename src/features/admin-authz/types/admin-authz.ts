export type Role = "user" | "admin";

export interface AdminUserProfile {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: string;
}
