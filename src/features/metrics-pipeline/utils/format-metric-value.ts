const BOOLEAN_UNITS = new Set(["boolean", "yes_no", "flag"]);

export function formatMetricValue(value: number, unit: string): string {
  if (BOOLEAN_UNITS.has(unit)) {
    return value > 0 ? "Yes" : "No";
  }

  const formatted = value.toLocaleString(undefined, {
    maximumFractionDigits: unit === "ms" ? 2 : 0,
  });

  if (!unit || unit === "count" || unit === "rows") {
    return formatted;
  }

  return `${formatted} ${unit}`;
}
