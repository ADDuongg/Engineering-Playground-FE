import {
  Award,
  Bookmark,
  BookOpen,
  Database,
  Gauge,
  LayoutDashboard,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export const DASHBOARD_NAV: NavSection[] = [
  {
    label: "Learn",
    items: [
      { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
      { label: "Learning path", href: ROUTES.learning, icon: BookOpen },
      { label: "Lab browser", href: ROUTES.labs, icon: Database },
      { label: "Bookmarks", href: ROUTES.bookmarks, icon: Bookmark },
    ],
  },
  {
    label: "Progress",
    items: [
      { label: "Achievements", href: ROUTES.achievements, icon: Award },
      { label: "Profile", href: ROUTES.profile, icon: User },
    ],
  },
];

export const BOTTOM_NAV: NavItem[] = [
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];

export const WORKSPACE_NAV: NavItem[] = [
  { label: "Benchmark", href: ROUTES.benchmark, icon: Gauge },
];
