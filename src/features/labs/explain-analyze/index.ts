import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "explain-analyze",
    title: "EXPLAIN ANALYZE",
    description: "Read real plans. Actual vs estimated rows, buffer hits, timing.",
    difficulty: "intermediate",
    duration: "35 min",
    category: "Planning",
    objective:
      "Run EXPLAIN ANALYZE on complex queries. Compare estimated vs actual row counts and identify misestimates.",
    theory:
      "EXPLAIN shows the planner's estimates. ANALYZE executes the query and shows actual timings and row counts.",
    theoryPoints: [
      "Buffers: shared hit/read show cache efficiency",
      "Planning time vs execution time",
      "Nested loop vs hash join selection",
    ],
    exercises: [
      { id: "1", title: "Run EXPLAIN without ANALYZE", status: "done" },
      { id: "2", title: "Add ANALYZE and compare rows", status: "active" },
      { id: "3", title: "Enable BUFFERS option", status: "pending" },
    ],
    defaultQuery: `EXPLAIN (ANALYZE, BUFFERS)\nSELECT u.*, o.total\nFROM users u\nJOIN orders o ON o.user_id = u.id\nWHERE u.status = 'active';`,
    metrics: [
      { id: "planning", label: "Planning Time", value: "0.8 ms" },
      { id: "execution", label: "Execution Time", value: "142 ms" },
      { id: "buffers", label: "Buffer Hits", value: "12,400" },
      { id: "rows", label: "Actual Rows", value: "8,200" },
    ],
    currentStep: "experiment",
  }),
);
