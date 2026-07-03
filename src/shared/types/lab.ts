export type Difficulty = "beginner" | "intermediate" | "advanced" | "expert";

export type LabStep =
  | "objective"
  | "theory"
  | "experiment"
  | "viz"
  | "quiz";

export interface LabMetric {
  id: string;
  label: string;
  value: string;
  variant?: "default" | "good" | "bad";
}

export interface LabExercise {
  id: string;
  title: string;
  status: "pending" | "active" | "done";
}

export interface LabDefinition {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  category: string;
  objective: string;
  theory: string;
  theoryPoints?: string[];
  tips?: string;
  exercises: LabExercise[];
  defaultQuery: string;
  metrics: LabMetric[];
  currentStep: LabStep;
}
