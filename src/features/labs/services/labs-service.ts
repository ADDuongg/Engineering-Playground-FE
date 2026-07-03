import type { LabCatalogItem } from "@/shared/constants/labs-catalog";

/** @unimplemented — wire to API when backend is available */
export async function fetchLabs(): Promise<LabCatalogItem[]> {
  throw new Error("fetchLabs is not implemented");
}

/** @unimplemented — wire to API when backend is available */
export async function fetchLabBySlug(_slug: string): Promise<LabCatalogItem> {
  throw new Error("fetchLabBySlug is not implemented");
}
