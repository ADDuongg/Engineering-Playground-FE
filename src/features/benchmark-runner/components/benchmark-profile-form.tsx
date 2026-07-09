"use client";

import type {
  BenchmarkDurationSeconds,
  BenchmarkRps,
} from "@/features/benchmark-runner/types/benchmark";
import { cn } from "@/shared/lib/utils";

const RPS_OPTIONS: BenchmarkRps[] = [100, 500, 1000, 5000];
const DURATION_OPTIONS: BenchmarkDurationSeconds[] = [10, 30, 60];

interface BenchmarkProfileFormProps {
  rps: BenchmarkRps;
  durationSeconds: BenchmarkDurationSeconds;
  onRpsChange: (rps: BenchmarkRps) => void;
  onDurationChange: (durationSeconds: BenchmarkDurationSeconds) => void;
  disabled?: boolean;
  className?: string;
}

export function BenchmarkProfileForm({
  rps,
  durationSeconds,
  onRpsChange,
  onDurationChange,
  disabled = false,
  className,
}: BenchmarkProfileFormProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <label className="mb-2 block text-sm font-medium">Target RPS</label>
        <div className="grid grid-cols-2 gap-2">
          {RPS_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onRpsChange(option)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm transition-colors",
                rps === option
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {option.toLocaleString()} RPS
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Duration</label>
        <div className="grid grid-cols-3 gap-2">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onDurationChange(option)}
              className={cn(
                "rounded-md border px-3 py-2 text-sm transition-colors",
                durationSeconds === option
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {option}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
