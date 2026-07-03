import Link from "next/link";
import { Database } from "lucide-react";
import { APP_SHORT_NAME } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const markSize = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <Link
      href="/"
      className={cn("flex items-center gap-3 font-semibold tracking-tight", className)}
    >
      <div
        className={cn(
          "grid place-items-center rounded-sm bg-primary text-primary-foreground",
          markSize,
        )}
      >
        <Database size={iconSize} />
      </div>
      <span className={size === "sm" ? "text-base" : "text-lg"}>
        {APP_SHORT_NAME}
      </span>
    </Link>
  );
}
