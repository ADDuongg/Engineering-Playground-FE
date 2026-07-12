"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Users } from "lucide-react";
import { useIsAdmin } from "@/features/admin-authz/hooks/use-is-admin";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { useSidebarStore } from "@/shared/lib/stores/sidebar-store";

interface AdminSidebarLinkProps {
  onNavigate?: () => void;
}

export function AdminSidebarLink({ onNavigate }: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const isAdmin = useIsAdmin();
  const setMobileOpen = useSidebarStore((s) => s.setMobileOpen);

  if (!isAdmin) {
    return null;
  }

  const handleNavigate = () => {
    onNavigate?.();
    setMobileOpen(false);
  };

  const links = [
    {
      href: ROUTES.admin,
      label: "Console",
      icon: ShieldCheck,
      active: pathname === ROUTES.admin,
    },
    {
      href: ROUTES.adminUsers,
      label: "Users",
      icon: Users,
      active:
        pathname === ROUTES.adminUsers ||
        pathname.startsWith(`${ROUTES.adminUsers}/`),
    },
  ];

  return (
    <nav className="mb-5">
      <div className="mb-2 px-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        Admin
      </div>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={handleNavigate}
            className={cn(
              "mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
              link.active && "bg-accent/10 text-accent",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-70" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
