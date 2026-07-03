import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "index-playground",
    title: "Index Playground",
    description:
      "B-tree lookups vs sequential scan on 1M rows. Create indexes, compare plans.",
    difficulty: "beginner",
    duration: "25 min",
    category: "Indexes",
    objective:
      "Run a lookup on 1M rows without an index. Watch the planner choose Seq Scan, count rows examined, then add a B-tree index and compare.",
    theory:
      "PostgreSQL default index type. O(log n) lookups vs O(n) sequential scan. Selectivity matters — low-cardinality columns may still seq scan.",
    theoryPoints: [
      "Index-only scan when visibility map allows",
      "Write amplification on INSERT/UPDATE",
      "Composite index column order",
    ],
    tips: "EXPLAIN (ANALYZE, BUFFERS) shows actual row counts — not just estimates.",
    exercises: [
      { id: "1", title: "Run query without index", status: "done" },
      { id: "2", title: "Create index on email", status: "active" },
      { id: "3", title: "Re-run and compare metrics", status: "pending" },
      { id: "4", title: "Try composite (email, status)", status: "pending" },
    ],
    defaultQuery: `SELECT * FROM users\nWHERE email = 'abc@gmail.com';`,
    metrics: [
      { id: "time", label: "Execution Time", value: "2,430 ms", variant: "bad" },
      { id: "scanned", label: "Rows Scanned", value: "1,000,000" },
      { id: "returned", label: "Rows Returned", value: "1" },
      { id: "index", label: "Index Used", value: "No" },
    ],
    currentStep: "experiment",
  }),
);
