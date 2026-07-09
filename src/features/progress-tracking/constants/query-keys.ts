export const progressKeys = {
  all: ["progress-tracking"] as const,
  learningPath: (trackSlug: string) =>
    [...progressKeys.all, "learning-path", trackSlug] as const,
  track: (trackSlug: string) =>
    [...progressKeys.all, "track", trackSlug] as const,
};
