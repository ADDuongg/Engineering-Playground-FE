"use client";

import { useEffect, useMemo, useState } from "react";
import {
  clampPage,
  getPageSliceBounds,
  getTotalPages,
  RESULT_PAGE_SIZE_OPTIONS,
  type ResultPageSize,
} from "@/features/sql-sandbox/utils/client-pagination";

interface UseClientPaginationOptions {
  totalItems: number;
  resetKey: string | number;
  initialPageSize?: ResultPageSize;
}

export function useClientPagination({
  totalItems,
  resetKey,
  initialPageSize = 100,
}: UseClientPaginationOptions) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<ResultPageSize>(initialPageSize);
  const [pageInput, setPageInput] = useState("1");

  const totalPages = useMemo(
    () => getTotalPages(totalItems, pageSize),
    [pageSize, totalItems],
  );

  const safePage = clampPage(page, totalPages);

  const { startIndex, endIndex } = useMemo(
    () => getPageSliceBounds(safePage, pageSize, totalItems),
    [pageSize, safePage, totalItems],
  );

  useEffect(() => {
    setPage(1);
    setPageInput("1");
  }, [resetKey, pageSize]);

  useEffect(() => {
    setPageInput(String(safePage));
  }, [safePage]);

  const goToPage = (nextPage: number) => {
    const clamped = clampPage(nextPage, totalPages);
    setPage(clamped);
    setPageInput(String(clamped));
  };

  const commitPageInput = () => {
    const parsed = Number.parseInt(pageInput, 10);

    if (Number.isNaN(parsed)) {
      setPageInput(String(safePage));
      return;
    }

    goToPage(parsed);
  };

  return {
    page: safePage,
    pageInput,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    pageSizeOptions: RESULT_PAGE_SIZE_OPTIONS,
    setPageInput,
    setPageSize,
    goToPage,
    goToFirst: () => goToPage(1),
    goToPrev: () => goToPage(safePage - 1),
    goToNext: () => goToPage(safePage + 1),
    goToLast: () => goToPage(totalPages),
    commitPageInput,
    canGoPrev: safePage > 1,
    canGoNext: safePage < totalPages,
  };
}
