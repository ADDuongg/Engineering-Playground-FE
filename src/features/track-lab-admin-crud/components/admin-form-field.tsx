"use client";

import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/ui/label";

interface AdminFormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function AdminFormField({
  label,
  htmlFor,
  error,
  hint,
  children,
  className,
}: AdminFormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor}>{label}</Label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-danger">{error}</p> : null}
    </div>
  );
}

const selectClassName =
  "flex h-9 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

const textareaClassName =
  "flex min-h-24 w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50";

interface AdminSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
}

export function AdminSelect({ options, className, ...props }: AdminSelectProps) {
  return (
    <select className={cn(selectClassName, className)} {...props}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function AdminTextarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(textareaClassName, className)} {...props} />;
}

interface StatusBadgeProps {
  status: "active" | "coming-soon";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isActive = status === "active";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        isActive
          ? "bg-success/10 text-success"
          : "bg-muted text-muted-foreground",
      )}
    >
      {isActive ? "Active" : "Coming soon"}
    </span>
  );
}
