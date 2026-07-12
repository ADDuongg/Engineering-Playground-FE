export const adminTrackLabKeys = {
  all: ["admin-track-lab"] as const,
  tracks: () => [...adminTrackLabKeys.all, "tracks"] as const,
  track: (slug: string) => [...adminTrackLabKeys.tracks(), slug] as const,
  labs: (trackSlug: string) =>
    [...adminTrackLabKeys.all, "labs", trackSlug] as const,
  lab: (labSlug: string) => [...adminTrackLabKeys.all, "lab", labSlug] as const,
};
