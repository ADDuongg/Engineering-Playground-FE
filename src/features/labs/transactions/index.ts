import { registerLab } from "@/features/lab-engine/constants/lab-registry";
import { createLabDefinition } from "@/features/lab-engine/utils/create-lab";

registerLab(
  createLabDefinition({
    slug: "transactions",
    title: "Transactions",
    description: "COMMIT, ROLLBACK, visibility. Transaction timeline viz.",
    difficulty: "intermediate",
    duration: "40 min",
    category: "ACID",
    objective:
      "Run concurrent transactions. Observe COMMIT/ROLLBACK behavior and row visibility across sessions.",
    theory:
      "ACID guarantees ensure data integrity. MVCC allows readers to see consistent snapshots without blocking writers.",
    theoryPoints: [
      "BEGIN starts a transaction block",
      "ROLLBACK discards all changes in the block",
      "SAVEPOINT allows partial rollback",
    ],
    exercises: [
      { id: "1", title: "Start transaction and update row", status: "done" },
      { id: "2", title: "Observe uncommitted visibility", status: "active" },
      { id: "3", title: "COMMIT and verify", status: "pending" },
    ],
    defaultQuery: `BEGIN;\nUPDATE accounts SET balance = balance - 100\nWHERE id = 1;\n-- Observe visibility before COMMIT`,
    metrics: [
      { id: "active", label: "Active Txns", value: "2" },
      { id: "locks", label: "Row Locks", value: "1" },
      { id: "duration", label: "Txn Duration", value: "340 ms" },
    ],
    currentStep: "experiment",
  }),
);
