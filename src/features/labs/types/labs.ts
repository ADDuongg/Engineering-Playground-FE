import type { LabStatus } from "@/features/progress-tracking/types/progress";

export interface LabListItem {
  slug: string;
  title: string;
  description?: string | null;
  sequenceOrder: number;
  status: LabStatus;
  trackSlug: string;
  trackName: string;
}

export interface LabListResponse {
  labs: LabListItem[];
}
