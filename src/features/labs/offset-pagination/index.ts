import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

const paginationLab = (slug: string, title: string, query: string) =>
  createLabDefinition({
    slug,
    title,
    description:
      slug === "offset-pagination"
        ? "Why OFFSET degrades at depth. Visualize page scan cost."
        : "Keyset pagination with stable performance at any depth.",
    difficulty: "intermediate",
    duration: "30 min",
    category: "Pagination",
    objective:
      slug === "offset-pagination"
        ? "Paginate deep into a large table with OFFSET. Observe how scan cost grows linearly with page depth."
        : "Use cursor-based pagination for stable latency regardless of page depth.",
    theory:
      slug === "offset-pagination"
        ? "OFFSET forces the database to scan and discard rows. At page 10,000, that's millions of wasted reads."
        : "Cursor pagination uses an indexed WHERE clause on the last seen value. Cost stays O(log n) per page.",
    exercises: [
      { id: "1", title: "Fetch page 1", status: "done" },
      { id: "2", title: "Jump to page 5000", status: "active" },
      { id: "3", title: "Compare execution plans", status: "pending" },
    ],
    defaultQuery: query,
    metrics: [
      { id: "time", label: "Execution Time", value: slug === "offset-pagination" ? "890 ms" : "4 ms", variant: slug === "offset-pagination" ? "bad" : "good" },
      { id: "scanned", label: "Rows Scanned", value: slug === "offset-pagination" ? "500,000" : "20" },
      { id: "page", label: "Page Depth", value: "5,000" },
    ],
    currentStep: "experiment",
  });

registerLab(
  paginationLab(
    "offset-pagination",
    "OFFSET Pagination",
    `SELECT * FROM orders\nORDER BY created_at DESC\nLIMIT 20 OFFSET 100000;`,
  ),
);
