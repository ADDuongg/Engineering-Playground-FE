export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  learning: "/learning",
  labs: "/labs",
  labDetail: (slug: string) => `/labs/${slug}`,
  labWorkspace: (slug: string) => `/labs/${slug}/workspace`,
  benchmark: "/benchmark",
  quiz: (labSlug = "index-playground") =>
    `/quiz?lab=${encodeURIComponent(labSlug)}`,
  achievements: "/achievements",
  bookmarks: "/bookmarks",
  profile: "/profile",
  settings: "/settings",
  admin: "/admin",
  adminTracks: "/admin/tracks",
  adminTrackNew: "/admin/tracks/new",
  adminTrackDetail: (slug: string) => `/admin/tracks/${encodeURIComponent(slug)}`,
  adminTrackLabNew: (trackSlug: string) =>
    `/admin/tracks/${encodeURIComponent(trackSlug)}/labs/new`,
  adminLabDetail: (labSlug: string) =>
    `/admin/labs/${encodeURIComponent(labSlug)}`,
  adminLabFlow: (labSlug: string) =>
    `/admin/labs/${encodeURIComponent(labSlug)}/flow`,
  adminLabQuiz: (labSlug: string) =>
    `/admin/labs/${encodeURIComponent(labSlug)}/quiz`,
  adminUsers: "/admin/users",
  adminUserDetail: (userId: string) =>
    `/admin/users/${encodeURIComponent(userId)}`,
} as const;

export const APP_NAME = "Database Playground";
export const APP_SHORT_NAME = "QueryLab";
