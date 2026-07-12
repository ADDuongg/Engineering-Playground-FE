export const labFlowAdminKeys = {
  all: ["lab-flow-admin"] as const,
  curriculum: (labSlug: string) =>
    [...labFlowAdminKeys.all, "curriculum", labSlug] as const,
  steps: (labSlug: string) =>
    [...labFlowAdminKeys.all, "steps", labSlug] as const,
  step: (labSlug: string, stepId: string) =>
    [...labFlowAdminKeys.steps(labSlug), stepId] as const,
};
