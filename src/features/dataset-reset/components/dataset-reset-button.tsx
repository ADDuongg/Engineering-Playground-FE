import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/lib/utils";

interface DatasetResetButtonProps {
  onReset: () => void;
  disabled?: boolean;
  isResetting?: boolean;
  className?: string;
}

export function DatasetResetButton({
  onReset,
  disabled = false,
  isResetting = false,
  className,
}: DatasetResetButtonProps) {
  const handleClick = () => {
    const confirmed = window.confirm(
      "Reset dataset to its original state? All experiment changes will be removed.",
    );

    if (confirmed) {
      onReset();
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleClick}
      disabled={disabled || isResetting}
      className={cn("shrink-0", className)}
    >
      {isResetting ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <RotateCcw className="h-3.5 w-3.5" />
      )}
      {isResetting ? "Resetting…" : "Reset data"}
    </Button>
  );
}
