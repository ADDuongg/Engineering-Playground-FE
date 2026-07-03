import { cn } from "@/shared/lib/utils";

interface MetricCellProps {
  label: string;
  value: string;
  variant?: "default" | "good" | "bad";
  className?: string;
}

export function MetricCell({
  label,
  value,
  variant = "default",
  className,
}: MetricCellProps) {
  return (
    <div
      className={cn(
        "rounded-md border border-border-subtle bg-surface-2 p-3",
        className,
      )}
    >
      <div className="mb-1 text-xs text-muted-foreground">{label}</div>
      <div
        className={cn(
          "font-mono-tabular text-lg font-medium",
          variant === "good" && "text-success",
          variant === "bad" && "text-danger",
        )}
      >
        {value}
      </div>
    </div>
  );
}

interface MetricGridProps {
  children: React.ReactNode;
  className?: string;
}

export function MetricGrid({ children, className }: MetricGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {children}
    </div>
  );
}
