import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import type { ResultPageSize } from "@/features/sql-sandbox/utils/client-pagination";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface ResultsTablePaginationProps {
  totalItems: number;
  startIndex: number;
  endIndex: number;
  page: number;
  pageInput: string;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: readonly ResultPageSize[];
  canGoPrev: boolean;
  canGoNext: boolean;
  onPageInputChange: (value: string) => void;
  onPageInputCommit: () => void;
  onPageSizeChange: (pageSize: ResultPageSize) => void;
  onGoToFirst: () => void;
  onGoToPrev: () => void;
  onGoToNext: () => void;
  onGoToLast: () => void;
  className?: string;
}

export function ResultsTablePagination({
  totalItems,
  startIndex,
  endIndex,
  page,
  pageInput,
  totalPages,
  pageSize,
  pageSizeOptions,
  canGoPrev,
  canGoNext,
  onPageInputChange,
  onPageInputCommit,
  onPageSizeChange,
  onGoToFirst,
  onGoToPrev,
  onGoToNext,
  onGoToLast,
  className,
}: ResultsTablePaginationProps) {
  const rangeLabel =
    totalItems === 0
      ? "0 rows"
      : `Rows ${(startIndex + 1).toLocaleString()}–${endIndex.toLocaleString()} of ${totalItems.toLocaleString()}`;

  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-2 border-t border-border pt-2 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-xs text-muted-foreground">{rangeLabel}</p>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          Rows per page
          <select
            value={pageSize}
            onChange={(event) =>
              onPageSizeChange(Number(event.target.value) as ResultPageSize)
            }
            className="rounded-sm border border-border bg-surface-2 px-2 py-1 text-xs text-foreground"
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onGoToFirst}
            disabled={!canGoPrev}
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onGoToPrev}
            disabled={!canGoPrev}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1 px-1 text-xs text-muted-foreground">
            <span>Page</span>
            <input
              value={pageInput}
              onChange={(event) => onPageInputChange(event.target.value)}
              onBlur={onPageInputCommit}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onPageInputCommit();
                }
              }}
              inputMode="numeric"
              aria-label="Current page"
              className="w-16 rounded-sm border border-border bg-surface-2 px-2 py-1 text-center font-mono text-xs text-foreground"
            />
            <span>of {totalPages.toLocaleString()}</span>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onGoToNext}
            disabled={!canGoNext}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onGoToLast}
            disabled={!canGoNext}
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>

        <span className="hidden font-mono text-[10px] text-muted-foreground lg:inline">
          Viewing page {page.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
