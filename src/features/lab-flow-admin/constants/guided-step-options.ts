import type { LabGuidedStepAction } from "@/shared/labs/lab-summary";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

export const GUIDED_STEP_ACTION_OPTIONS: SelectOption<LabGuidedStepAction>[] = [
  // Database / SQL
  { value: "run_sql", label: "Run SQL" },
  { value: "run_explain", label: "Explain" },
  { value: "run_explain_analyze", label: "Explain analyze" },
  { value: "create_index_sql", label: "Create index SQL" },
  { value: "drop_index_sql", label: "Drop index SQL" },
  { value: "optional_benchmark", label: "Optional benchmark" },
  // Frontend React
  { value: "render_component", label: "Render component" },
  { value: "update_props", label: "Update props" },
  { value: "update_state", label: "Update state" },
  { value: "remount", label: "Remount" },
  { value: "toggle_memo", label: "Toggle memo" },
  { value: "compare_reconciliation", label: "Compare reconciliation" },
  { value: "inspect_hooks", label: "Inspect hooks" },
  // Track-agnostic
  { value: "compare_metrics", label: "Compare metrics" },
  { value: "take_quiz", label: "Take quiz" },
];

export function getGuidedStepActionLabel(action: LabGuidedStepAction): string {
  return (
    GUIDED_STEP_ACTION_OPTIONS.find((option) => option.value === action)
      ?.label ?? action
  );
}
