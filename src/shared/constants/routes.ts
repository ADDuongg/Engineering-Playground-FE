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
} as const;

export const APP_NAME = "Database Playground";
export const APP_SHORT_NAME = "QueryLab";
