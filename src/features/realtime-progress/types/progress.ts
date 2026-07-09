export type BenchmarkProgressPhase =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type ElapsedBasis = "queue" | "execution";

export interface PartialMetric {
  key: string;
  label: string;
  unit: string;
  value: number;
  group: string;
  provisional: true;
}

export interface BenchmarkProgressSnapshot {
  jobId: string;
  phase: BenchmarkProgressPhase;
  elapsedMs: number;
  elapsedBasis: ElapsedBasis;
  currentRps?: number | null;
  partialMetrics?: PartialMetric[];
  provisional: true;
  terminal: boolean;
  profile?: {
    rps: number;
    durationSeconds: number;
  };
  updatedAt: string;
  hint?: string;
}

export interface ProgressStreamErrorPayload {
  code: string;
  message: string;
}

export type ProgressSseEventType = "progress" | "terminal" | "error";

export interface ObserveBenchmarkProgressQuery {
  sessionId?: string;
}

export type ProgressSseEvent =
  | { type: "progress"; data: BenchmarkProgressSnapshot }
  | { type: "terminal"; data: BenchmarkProgressSnapshot }
  | { type: "error"; data: ProgressStreamErrorPayload };
