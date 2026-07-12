import { AppSidebar } from "./app-sidebar";

interface DashboardShellProps {
  children: React.ReactNode;
  sidebarExtraNav?: React.ReactNode;
}

export function DashboardShell({
  children,
  sidebarExtraNav,
}: DashboardShellProps) {
  return (
    <div className="flex min-h-dvh">
      <AppSidebar extraNav={sidebarExtraNav} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
