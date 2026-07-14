import { AlertCircle } from "lucide-react";
import {
  formatReactSandboxErrorMessage,
  getReactSandboxErrorDetails,
  isFixtureNotAllowedError,
  isReactSandboxTimeoutDetails,
} from "@/features/react-sandbox-runtime/utils/format-react-sandbox-error";
import { RateLimitErrorMeta } from "@/shared/components/common/rate-limit-error-meta";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/lib/utils";
import { getRateLimitErrorDetails } from "@/shared/utils/format-rate-limit-error";

interface ReactSandboxErrorAlertProps {
  error: unknown;
  className?: string;
}

export function ReactSandboxErrorAlert({
  error,
  className,
}: ReactSandboxErrorAlertProps) {
  const details = getReactSandboxErrorDetails(error);
  const rateLimitDetails = getRateLimitErrorDetails(error);
  const message = formatReactSandboxErrorMessage(error);

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
          {isFixtureNotAllowedError(details) && (
            <div className="flex flex-wrap gap-2">
              <Badge variant="muted">{details.reason}</Badge>
              <Badge variant="muted">{details.fixtureId}</Badge>
            </div>
          )}
          {isReactSandboxTimeoutDetails(details) && (
            <Badge variant="muted">{details.timeoutMs} ms</Badge>
          )}
        </div>
      </div>
    </div>
  );
}
