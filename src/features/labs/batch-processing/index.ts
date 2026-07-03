import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "batch-processing",
    title: "Batch Processing",
    description: "Row-by-row vs batch INSERT. Measure write amplification.",
    difficulty: "advanced",
    duration: "40 min",
    category: "Performance",
    objective:
      "Insert 10,000 rows one at a time vs in batches of 500. Compare transaction overhead and WAL volume.",
    theory:
      "Batching reduces round-trips and transaction overhead. COPY is fastest for bulk loads; multi-row INSERT is a good middle ground.",
    exercises: [
      { id: "1", title: "Single-row INSERT loop", status: "done" },
      { id: "2", title: "Batch INSERT 500 rows", status: "active" },
      { id: "3", title: "Compare WAL and duration", status: "pending" },
    ],
    defaultQuery: `INSERT INTO events (user_id, action, created_at)\nVALUES\n  (1, 'click', NOW()),\n  (2, 'view', NOW()),\n  -- ... 498 more rows`,
    metrics: [
      { id: "duration", label: "Duration", value: "1.2s", variant: "good" },
      { id: "rows", label: "Rows Inserted", value: "10,000" },
      { id: "wal", label: "WAL Size", value: "4.2 MB" },
    ],
    currentStep: "experiment",
  }),
);
