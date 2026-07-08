export const tracksKeys = {
  all: ["tracks"] as const,
  list: () => [...tracksKeys.all, "list"] as const,
  detail: (slug: string) => [...tracksKeys.all, "detail", slug] as const,
};
