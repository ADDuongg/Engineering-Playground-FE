import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "isolation-level",
    title: "Isolation Levels",
    description:
      "Phantom reads, serializable. Side-by-side isolation comparison.",
    difficulty: "advanced",
    duration: "45 min",
    category: "Concurrency",
    objective:
      "Run the same concurrent scenario under READ COMMITTED, REPEATABLE READ, and SERIALIZABLE. Observe phantom reads and serialization failures.",
    theory:
      "Isolation levels trade consistency for concurrency. Higher isolation prevents more anomalies but increases lock contention.",
    theoryPoints: [
      "READ COMMITTED: default, sees committed data only",
      "REPEATABLE READ: consistent snapshot for transaction",
      "SERIALIZABLE: full isolation, may raise serialization errors",
    ],
    exercises: [
      { id: "1", title: "READ COMMITTED baseline", status: "done" },
      { id: "2", title: "Trigger phantom read", status: "active" },
      { id: "3", title: "Retry under SERIALIZABLE", status: "pending" },
    ],
    defaultQuery: `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nBEGIN;\nSELECT COUNT(*) FROM orders WHERE status = 'pending';`,
    metrics: [
      { id: "level", label: "Isolation", value: "REPEATABLE READ" },
      { id: "phantoms", label: "Phantom Reads", value: "1", variant: "bad" },
      { id: "deadlocks", label: "Deadlocks", value: "0" },
    ],
    currentStep: "experiment",
  }),
);
