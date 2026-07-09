"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { getUserInitials } from "@/features/auth/utils/get-user-initials";

export function AuthAvatarMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, isHydrated } = useAuth();
  const logoutMutation = useLogout();

  const initials = getUserInitials(user?.displayName, user?.email);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);

    try {
      await logoutMutation.mutateAsync();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  if (!isHydrated) {
    return (
      <Avatar className="h-8 w-8">
        <AvatarFallback className="animate-pulse bg-surface-2" />
      </Avatar>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full p-0"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
      >
        <Avatar className="h-8 w-8">
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute end-0 top-[calc(100%+0.5rem)] z-50 min-w-48 rounded-lg border border-border bg-surface p-1 shadow-lg"
        >
          {isAuthenticated && user ? (
            <>
              <div className="border-b border-border px-3 py-2">
                <p className="truncate text-sm font-medium">{user.displayName}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <Link
                href={ROUTES.profile}
                role="menuitem"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                )}
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile
              </Link>
              <button
                type="button"
                role="menuitem"
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                disabled={logoutMutation.isPending}
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                {logoutMutation.isPending ? "Signing out…" : "Sign out"}
              </button>
            </>
          ) : (
            <Link
              href={ROUTES.login}
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
