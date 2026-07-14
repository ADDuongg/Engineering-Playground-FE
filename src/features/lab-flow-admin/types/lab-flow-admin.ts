import type {
  GuidedSql,
  LabGuidedStepAction,
  LabGuidedStepPayload,
  ReactScenarioPayload,
} from "@/shared/labs/lab-summary";

export type {
  GuidedSql,
  LabGuidedStepAction,
  LabGuidedStepPayload,
  ReactScenarioPayload,
};

export interface LabSummaryDatasetHint {
  family: string;
  version: string;
  recommendedTier: string[];
}

export interface AdminLabGuidedStepView {
  id: string;
  labSlug: string;
  displayOrder: number;
  title: string;
  instruction: string;
  action: LabGuidedStepAction;
  /** Same payload shapes as learner LabGuidedStepPayload */
  payload: LabGuidedStepPayload | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLabGuidedStepListResponse {
  steps: AdminLabGuidedStepView[];
}

export interface CreateLabGuidedStepRequest {
  title: string;
  instruction: string;
  action: LabGuidedStepAction;
  displayOrder: number;
  payload?: LabGuidedStepPayload | null;
}

export interface UpdateLabGuidedStepRequest {
  title?: string;
  instruction?: string;
  action?: LabGuidedStepAction;
  displayOrder?: number;
  /** null clears payload; omit leaves unchanged */
  payload?: LabGuidedStepPayload | null;
}

export interface ReorderLabGuidedStepsRequest {
  stepIds: string[];
}

export interface AdminLabCurriculumView {
  labSlug: string;
  learningGoal: string;
  theory: string;
  /** Database/SQL-only; null for non-SQL tracks. */
  recommendedQuery: GuidedSql | null;
  recommendedCreateIndexSql: string | null;
  recommendedDropIndexSql: string | null;
  /** Database/SQL-only; null for tracks without a playground dataset. */
  dataset: LabSummaryDatasetHint | null;
  /** Optional per-track lab-level metadata. */
  config: Record<string, unknown> | null;
  quizRequired: boolean;
  optionalBenchmarkNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLabCurriculumRequest {
  learningGoal: string;
  theory: string;
  /** Database/SQL-only; omit for non-SQL tracks. */
  recommendedQuery?: GuidedSql | null;
  recommendedCreateIndexSql?: string | null;
  recommendedDropIndexSql?: string | null;
  /** Database/SQL-only; omit for tracks without a playground dataset. */
  dataset?: LabSummaryDatasetHint | null;
  /** Optional per-track lab-level metadata. */
  config?: Record<string, unknown> | null;
  quizRequired: boolean;
  optionalBenchmarkNote?: string | null;
}

export interface UpdateLabCurriculumRequest {
  learningGoal?: string;
  theory?: string;
  recommendedQuery?: GuidedSql | null;
  recommendedCreateIndexSql?: string | null;
  recommendedDropIndexSql?: string | null;
  dataset?: LabSummaryDatasetHint | null;
  config?: Record<string, unknown> | null;
  quizRequired?: boolean;
  optionalBenchmarkNote?: string | null;
}
