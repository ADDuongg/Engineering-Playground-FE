export const userAdminKeys = {
  all: ["user-admin"] as const,
  lists: () => [...userAdminKeys.all, "list"] as const,
  list: (query: { page: number; limit: number; q: string }) =>
    [...userAdminKeys.lists(), query] as const,
  details: () => [...userAdminKeys.all, "detail"] as const,
  detail: (userId: string) => [...userAdminKeys.details(), userId] as const,
};
