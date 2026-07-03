import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "redis-cache",
    title: "Redis Cache",
    description: "Cache hit/miss flow. When Redis helps vs hurts.",
    difficulty: "intermediate",
    duration: "35 min",
    category: "Caching",
    objective:
      "Compare query latency with cold cache, warm cache, and cache miss scenarios. Understand cache invalidation tradeoffs.",
    theory:
      "Redis stores frequently accessed data in memory. Cache-aside pattern: check cache first, query DB on miss, populate cache on hit.",
    theoryPoints: [
      "TTL controls staleness vs hit rate",
      "Cache stampede on popular key expiry",
      "Write-through vs write-behind patterns",
    ],
    exercises: [
      { id: "1", title: "Cold cache query", status: "done" },
      { id: "2", title: "Warm cache and re-query", status: "active" },
      { id: "3", title: "Invalidate and measure miss", status: "pending" },
    ],
    defaultQuery: `-- API layer checks Redis first\nGET user:profile:12345\n-- On miss: SELECT * FROM users WHERE id = 12345`,
    metrics: [
      { id: "latency", label: "Latency", value: "2 ms", variant: "good" },
      { id: "hit", label: "Cache Hit", value: "Yes" },
      { id: "ttl", label: "TTL Remaining", value: "284s" },
    ],
    currentStep: "experiment",
  }),
);
