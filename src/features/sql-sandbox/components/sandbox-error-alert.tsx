import { AlertCircle } from "lucide-react";
import {
  formatSandboxErrorMessage,
  getSandboxErrorDetails,
} from "@/features/sql-sandbox/utils/format-sandbox-error";
import { RateLimitErrorMeta } from "@/shared/components/common/rate-limit-error-meta";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { getRateLimitErrorDetails } from "@/shared/utils/format-rate-limit-error";

interface SandboxErrorAlertProps {
  error: unknown;
  className?: string;
}

export function SandboxErrorAlert({ error, className }: SandboxErrorAlertProps) {
  const details = getSandboxErrorDetails(error);
  const rateLimitDetails = getRateLimitErrorDetails(error);
  const message = formatSandboxErrorMessage(error);

  return (
    <div
      className={cn(
        "rounded-md border border-danger/40 bg-danger/5 p-4 text-sm",
        className,
      )}
      role="alert"
    >
      <div className="mb-2 flex items-start gap-2">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
        <div className="min-w-0 flex-1 space-y-2">
          <p className="font-medium text-foreground">{message}</p>
          <RateLimitErrorMeta details={rateLimitDetails} />
          {details?.violationCode && (
            <Badge variant="muted">{details.violationCode}</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
