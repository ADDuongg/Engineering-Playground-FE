import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "load-testing",
    title: "Load Testing",
    description: "Benchmark APIs at 100–5000 RPS. P95, P99, throughput.",
    difficulty: "advanced",
    duration: "50 min",
    category: "Performance",
    objective:
      "Run load tests at increasing RPS. Observe latency percentiles, error rates, and throughput saturation points.",
    theory:
      "Load testing reveals system bottlenecks under realistic traffic. P95/P99 matter more than average latency for user experience.",
    exercises: [
      { id: "1", title: "Baseline at 100 RPS", status: "done" },
      { id: "2", title: "Ramp to 1000 RPS", status: "active" },
      { id: "3", title: "Find saturation point", status: "pending" },
    ],
    defaultQuery: `-- Load test targets this endpoint\nGET /api/users/:id/profile`,
    metrics: [
      { id: "rps", label: "RPS", value: "300" },
      { id: "p95", label: "P95 Latency", value: "48 ms" },
      { id: "p99", label: "P99 Latency", value: "120 ms" },
      { id: "errors", label: "Error Rate", value: "0.1%" },
    ],
    currentStep: "experiment",
  }),
);
