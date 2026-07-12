import type { LabGuidedStepAction } from "@/shared/labs/lab-summary";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const GUIDED_STEP_ACTION_OPTIONS: SelectOption<LabGuidedStepAction>[] = [
  { value: "run_sql", label: "Run SQL" },
  { value: "run_explain", label: "Explain" },
  { value: "run_explain_analyze", label: "Explain analyze" },
  { value: "create_index_sql", label: "Create index SQL" },
  { value: "drop_index_sql", label: "Drop index SQL" },
  { value: "compare_metrics", label: "Compare metrics" },
  { value: "take_quiz", label: "Take quiz" },
  { value: "optional_benchmark", label: "Optional benchmark" },
];

export function getGuidedStepActionLabel(action: LabGuidedStepAction): string {
  return (
    GUIDED_STEP_ACTION_OPTIONS.find((option) => option.value === action)
      ?.label ?? action
  );
}
