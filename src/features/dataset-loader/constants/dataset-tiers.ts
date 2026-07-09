import type { DatasetTier } from "@/features/dataset-loader/types/dataset";

export const DATASET_TIER_OPTIONS: { value: DatasetTier; label: string }[] = [
  { value: "100k", label: "100K" },
  { value: "1m", label: "1M" },
  { value: "10m", label: "10M" },
];

export function formatDatasetTierLabel(tier: DatasetTier): string {
  return DATASET_TIER_OPTIONS.find((option) => option.value === tier)?.label ?? tier;
}
