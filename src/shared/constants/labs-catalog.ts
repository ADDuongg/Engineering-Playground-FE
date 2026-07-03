import type { Difficulty } from "@/shared/types/lab";

export interface LabCatalogItem {
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration: string;
  category: string;
  status?: "not-started" | "in-progress" | "completed";
  progress?: number;
}

export const LABS_CATALOG: LabCatalogItem[] = [
  {
    slug: "index-playground",
    title: "Index Playground",
    description:
      "B-tree lookups vs sequential scan on 1M rows. Create indexes, compare plans.",
    difficulty: "beginner",
    duration: "25 min",
    category: "Indexes",
    status: "in-progress",
    progress: 45,
  },
  {
    slug: "explain-analyze",
    title: "EXPLAIN ANALYZE",
    description:
      "Read real plans. Actual vs estimated rows, buffer hits, timing.",
    difficulty: "intermediate",
    duration: "35 min",
    category: "Planning",
    status: "not-started",
  },
  {
    slug: "offset-pagination",
    title: "OFFSET Pagination",
    description: "Why OFFSET degrades at depth. Visualize page scan cost.",
    difficulty: "intermediate",
    duration: "30 min",
    category: "Pagination",
    status: "completed",
  },
  {
    slug: "cursor-pagination",
    title: "Cursor Pagination",
    description: "Keyset pagination with stable performance at any depth.",
    difficulty: "intermediate",
    duration: "30 min",
    category: "Pagination",
    status: "not-started",
  },
  {
    slug: "transactions",
    title: "Transactions",
    description: "COMMIT, ROLLBACK, visibility. Transaction timeline viz.",
    difficulty: "intermediate",
    duration: "40 min",
    category: "ACID",
    status: "not-started",
  },
  {
    slug: "isolation-level",
    title: "Isolation Levels",
    description:
      "Phantom reads, serializable. Side-by-side isolation comparison.",
    difficulty: "advanced",
    duration: "45 min",
    category: "Concurrency",
    status: "not-started",
  },
  {
    slug: "redis-cache",
    title: "Redis Cache",
    description: "Cache hit/miss flow. When Redis helps vs hurts.",
    difficulty: "intermediate",
    duration: "35 min",
    category: "Caching",
    status: "not-started",
  },
  {
    slug: "batch-processing",
    title: "Batch Processing",
    description: "Row-by-row vs batch INSERT. Measure write amplification.",
    difficulty: "advanced",
    duration: "40 min",
    category: "Performance",
    status: "not-started",
  },
  {
    slug: "load-testing",
    title: "Load Testing",
    description: "Benchmark APIs at 100–5000 RPS. P95, P99, throughput.",
    difficulty: "advanced",
    duration: "50 min",
    category: "Performance",
    status: "not-started",
  },
];

export function getLabCatalogItem(slug: string): LabCatalogItem | undefined {
  return LABS_CATALOG.find((lab) => lab.slug === slug);
}
