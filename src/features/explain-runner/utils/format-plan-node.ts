import type { ExplainPlanNode } from "@/features/explain-runner/types/explain";

export type PlanNodeVariant = "good" | "bad" | "neutral";
export type PlanNodeIcon =
  | "scan"
  | "index"
  | "join"
  | "sort"
  | "filter"
  | "aggregate"
  | "other";

export interface PlanNodePresentation {
  title: string;
  description: string;
  variant: PlanNodeVariant;
  icon: PlanNodeIcon;
}

interface NodePattern {
  match: (nodeType: string) => boolean;
  presentation: PlanNodePresentation;
}

const NODE_PATTERNS: NodePattern[] = [
  {
    match: (t) => t.includes("seq scan"),
    presentation: {
      title: "Full table scan",
      description: "Reads every row in the table. Slow on large tables without an index.",
      variant: "bad",
      icon: "scan",
    },
  },
  {
    match: (t) => t.includes("index only scan"),
    presentation: {
      title: "Index-only read",
      description: "Answers the query using only the index — very efficient.",
      variant: "good",
      icon: "index",
    },
  },
  {
    match: (t) => t.includes("index scan"),
    presentation: {
      title: "Index lookup",
      description: "Uses an index to find matching rows quickly.",
      variant: "good",
      icon: "index",
    },
  },
  {
    match: (t) => t.includes("bitmap"),
    presentation: {
      title: "Bitmap scan",
      description: "Builds a bitmap of matching rows, then reads them from the table.",
      variant: "neutral",
      icon: "scan",
    },
  },
  {
    match: (t) => t.includes("hash join"),
    presentation: {
      title: "Hash join",
      description: "Joins two tables by building a hash table from one side.",
      variant: "neutral",
      icon: "join",
    },
  },
  {
    match: (t) => t.includes("nested loop"),
    presentation: {
      title: "Nested loop join",
      description: "Joins tables by looping through rows — fine for small sets.",
      variant: "neutral",
      icon: "join",
    },
  },
  {
    match: (t) => t.includes("merge join"),
    presentation: {
      title: "Merge join",
      description: "Joins pre-sorted inputs by merging them together.",
      variant: "neutral",
      icon: "join",
    },
  },
  {
    match: (t) => t.includes("sort"),
    presentation: {
      title: "Sort",
      description: "Sorts rows before the next step can run.",
      variant: "neutral",
      icon: "sort",
    },
  },
  {
    match: (t) => t.includes("aggregate"),
    presentation: {
      title: "Aggregate",
      description: "Groups or summarizes rows (COUNT, SUM, GROUP BY, etc.).",
      variant: "neutral",
      icon: "aggregate",
    },
  },
];

const DEFAULT_PRESENTATION: PlanNodePresentation = {
  title: "Query step",
  description: "A step in how the database executes your query.",
  variant: "neutral",
  icon: "other",
};

export function getPlanNodePresentation(node: ExplainPlanNode): PlanNodePresentation {
  const normalized = node.nodeType.toLowerCase();
  const matched = NODE_PATTERNS.find((pattern) => pattern.match(normalized));
  return matched?.presentation ?? {
    ...DEFAULT_PRESENTATION,
    title: node.nodeType,
  };
}

export function usesIndex(node: ExplainPlanNode): boolean {
  const type = node.nodeType.toLowerCase();
  if (type.includes("index")) {
    return true;
  }

  return node.children?.some(usesIndex) ?? false;
}

export function isFullTableScan(node: ExplainPlanNode): boolean {
  const type = node.nodeType.toLowerCase();
  if (type.includes("seq scan")) {
    return true;
  }

  return node.children?.some(isFullTableScan) ?? false;
}

export function buildPlanSummary(node: ExplainPlanNode): string {
  const table = node.relationName ? `the \`${node.relationName}\` table` : "the data";
  const rows = node.planRows ?? node.actualRows;

  if (isFullTableScan(node)) {
    const rowHint = rows ? ` (~${rows.toLocaleString()} rows estimated)` : "";
    return `This query scans all rows in ${table}${rowHint} instead of using an index.`;
  }

  if (usesIndex(node)) {
    const indexName = node.indexName ? ` (\`${node.indexName}\`)` : "";
    return `This query uses an index${indexName} to find rows efficiently.`;
  }

  if (node.relationName) {
    return `This query reads from ${table}.`;
  }

  return "This is how the database plans to run your query.";
}

export function formatPlanStatLabel(
  key: "rows" | "cost" | "time",
  node: ExplainPlanNode,
): string | undefined {
  if (key === "rows") {
    const rows = node.actualRows ?? node.planRows;
    if (rows === undefined) return undefined;
    const prefix = node.actualRows !== undefined ? "Rows read" : "Rows estimated";
    return `${prefix}: ${rows.toLocaleString()}`;
  }

  if (key === "cost") {
    if (node.totalCost === undefined) return undefined;
    return `Planner cost: ${node.totalCost.toFixed(0)}`;
  }

  if (key === "time") {
    if (node.actualTotalTime === undefined) return undefined;
    return `Time: ${node.actualTotalTime.toFixed(2)} ms`;
  }

  return undefined;
}
