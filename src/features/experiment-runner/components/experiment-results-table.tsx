import { SandboxResultsTable } from "@/features/sql-sandbox/components/sandbox-results-table";
import type { ExperimentRunResult } from "@/features/experiment-runner/types/experiment";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface ExperimentResultsTableProps {
  result: ExperimentRunResult;
  className?: string;
}

export function ExperimentResultsTable({
  result,
  className,
}: ExperimentResultsTableProps) {
  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-2", className)}>
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <Badge variant="muted">{result.statementKind}</Badge>
        <span className="text-xs text-muted-foreground">
          {result.dataset.family} · {result.dataset.tier} · {result.dataset.version}
        </span>
      </div>
      <SandboxResultsTable result={result} className="min-h-0 flex-1" />
    </div>
  );
}
