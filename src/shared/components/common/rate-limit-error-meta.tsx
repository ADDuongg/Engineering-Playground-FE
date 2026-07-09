import {
  formatRetryAfterLabel,
  isRateLimitExceededDetails,
  isRateLimitStorageUnavailableDetails,
} from "@/shared/utils/format-rate-limit-error";
import type { RateLimitErrorDetails } from "@/shared/types/rate-limit";
import { Badge } from "@/shared/components/ui/badge";

interface RateLimitErrorMetaProps {
  details: RateLimitErrorDetails | undefined;
}

export function RateLimitErrorMeta({ details }: RateLimitErrorMetaProps) {
  if (isRateLimitExceededDetails(details)) {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Badge variant="muted">{details.operationLabel}</Badge>
          <Badge variant="muted">
            {formatRetryAfterLabel(details.retryAfterSeconds)}
          </Badge>
        </div>
        {details.hint && (
          <p className="text-muted-foreground">{details.hint}</p>
        )}
      </div>
    );
  }

  if (isRateLimitStorageUnavailableDetails(details)) {
    return (
      <Badge variant="muted">Service temporarily unavailable</Badge>
    );
  }

  return null;
}
