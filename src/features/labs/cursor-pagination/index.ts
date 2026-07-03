import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "cursor-pagination",
    title: "Cursor Pagination",
    description: "Keyset pagination with stable performance at any depth.",
    difficulty: "intermediate",
    duration: "30 min",
    category: "Pagination",
    objective:
      "Use cursor-based pagination for stable latency regardless of page depth.",
    theory:
      "Cursor pagination uses an indexed WHERE clause on the last seen value. Cost stays O(log n) per page.",
    exercises: [
      { id: "1", title: "Fetch first page", status: "done" },
      { id: "2", title: "Use cursor for page 5000", status: "active" },
      { id: "3", title: "Compare with OFFSET", status: "pending" },
    ],
    defaultQuery: `SELECT * FROM orders\nWHERE created_at < '2024-06-01'\nORDER BY created_at DESC\nLIMIT 20;`,
    metrics: [
      { id: "time", label: "Execution Time", value: "4 ms", variant: "good" },
      { id: "scanned", label: "Rows Scanned", value: "20" },
      { id: "page", label: "Page Depth", value: "5,000" },
    ],
    currentStep: "experiment",
  }),
);
