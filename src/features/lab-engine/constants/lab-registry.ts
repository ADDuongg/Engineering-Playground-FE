import { type LabDefinition } from "@/shared/types/lab";

export const LAB_REGISTRY: Record<string, LabDefinition> = {};

export function registerLab(lab: LabDefinition): void {
  LAB_REGISTRY[lab.slug] = lab;
}

export function getLab(slug: string): LabDefinition | undefined {
  return LAB_REGISTRY[slug];
}

export function getAllLabs(): LabDefinition[] {
  return Object.values(LAB_REGISTRY);
}
