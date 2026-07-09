export const indexPlaygroundKeys = {
  all: ["index-playground"] as const,
  summary: (labSlug: string) =>
    [...indexPlaygroundKeys.all, "summary", labSlug] as const,
};
