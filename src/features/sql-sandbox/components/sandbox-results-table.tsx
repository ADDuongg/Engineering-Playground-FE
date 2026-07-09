"use client";

import { useMemo } from "react";
import { ResultsTablePagination } from "@/features/sql-sandbox/components/results-table-pagination";
import { useClientPagination } from "@/features/sql-sandbox/hooks/use-client-pagination";
import type { SandboxExecuteResult } from "@/features/sql-sandbox/types/sandbox";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";

interface SandboxResultsTableProps {
  result: SandboxExecuteResult;
  className?: string;
}

function formatCellValue(value: unknown): string {
  if (value === null) return "NULL";
  if (value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function SandboxResultsTable({
  result,
  className,
}: SandboxResultsTableProps) {
  const totalItems = result.rows.length;
  const pagination = useClientPagination({
    totalItems,
    resetKey: `${result.rowCount}:${result.executionTimeMs}:${totalItems}`,
  });

  const columns = useMemo(
    () =>
      result.fields?.map((field) => field.name) ??
      (result.rows[0] ? Object.keys(result.rows[0]) : []),
    [result.fields, result.rows],
  );

  const displayedRows = useMemo(
    () => result.rows.slice(pagination.startIndex, pagination.endIndex),
    [pagination.endIndex, pagination.startIndex, result.rows],
  );

  const hasRowCountMismatch = result.rowCount !== totalItems;

  if (columns.length === 0) {
    return (
      <div
        className={cn(
          "rounded-md border border-border bg-surface-2 p-4 text-sm text-muted-foreground",
          className,
        )}
      >
        Query completed with no rows returned.
      </div>
    );
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col gap-2", className)}>
      <div className="flex shrink-0 flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span>
          {totalItems.toLocaleString()} row{totalItems === 1 ? "" : "s"}
        </span>
        <span>·</span>
        <span>{result.executionTimeMs.toLocaleString()} ms</span>
        {hasRowCountMismatch && (
          <>
            <span>·</span>
            <Badge variant="muted">
              rowCount {result.rowCount.toLocaleString()}
            </Badge>
          </>
        )}
        {result.truncated && (
          <>
            <span>·</span>
            <Badge variant="muted">Truncated flag set</Badge>
          </>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-auto rounded-md border border-border">
        <table className="w-full min-w-max text-left text-sm">
          <thead className="sticky top-0 z-10 bg-surface-2">
            <tr>
              <th className="border-b border-border px-3 py-2 font-mono text-xs uppercase tracking-wide text-muted-foreground">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="border-b border-border px-3 py-2 font-mono text-xs uppercase tracking-wide text-muted-foreground"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRows.map((row, rowIndex) => {
              const absoluteRowNumber = pagination.startIndex + rowIndex + 1;

              return (
                <tr key={absoluteRowNumber} className="border-b border-border/60">
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                    {absoluteRowNumber.toLocaleString()}
                  </td>
                  {columns.map((column) => (
                    <td
                      key={`${absoluteRowNumber}-${column}`}
                      className="max-w-[240px] truncate px-3 py-2 font-mono text-xs"
                      title={formatCellValue(row[column])}
                    >
                      {formatCellValue(row[column])}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ResultsTablePagination
        totalItems={totalItems}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        page={pagination.page}
        pageInput={pagination.pageInput}
        totalPages={pagination.totalPages}
        pageSize={pagination.pageSize}
        pageSizeOptions={pagination.pageSizeOptions}
        canGoPrev={pagination.canGoPrev}
        canGoNext={pagination.canGoNext}
        onPageInputChange={pagination.setPageInput}
        onPageInputCommit={pagination.commitPageInput}
        onPageSizeChange={pagination.setPageSize}
        onGoToFirst={pagination.goToFirst}
        onGoToPrev={pagination.goToPrev}
        onGoToNext={pagination.goToNext}
        onGoToLast={pagination.goToLast}
      />
    </div>
  );
}
