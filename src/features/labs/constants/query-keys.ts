export const labsKeys = {
  all: ["labs"] as const,
  list: () => [...labsKeys.all, "list"] as const,
  detail: (slug: string) => [...labsKeys.all, "detail", slug] as const,
};
