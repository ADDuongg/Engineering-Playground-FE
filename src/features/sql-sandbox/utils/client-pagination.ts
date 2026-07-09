export const RESULT_PAGE_SIZE_OPTIONS = [50, 100, 200, 500] as const;

export type ResultPageSize = (typeof RESULT_PAGE_SIZE_OPTIONS)[number];

export function getTotalPages(totalItems: number, pageSize: number): number {
  if (totalItems <= 0) {
    return 1;
  }

  return Math.ceil(totalItems / pageSize);
}

export function clampPage(page: number, totalPages: number): number {
  if (totalPages <= 0) {
    return 1;
  }

  return Math.min(Math.max(page, 1), totalPages);
}

export function getPageSliceBounds(
  page: number,
  pageSize: number,
  totalItems: number,
): { startIndex: number; endIndex: number } {
  if (totalItems <= 0) {
    return { startIndex: 0, endIndex: 0 };
  }

  const totalPages = getTotalPages(totalItems, pageSize);
  const safePage = clampPage(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return { startIndex, endIndex };
}
