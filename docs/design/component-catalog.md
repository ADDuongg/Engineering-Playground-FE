# Component Catalog

**Version:** 2.0  
**Location:** `src/shared/components/`

---

## UI Primitives (`shared/components/ui/`)

Built on shadcn/ui + Radix + CVA.

| Component | File | Variants / Notes |
|-----------|------|-----------------|
| `Button` | `button.tsx` | `default`, `secondary`, `ghost`, `success`, `danger`, `outline`, `link` · sizes: `sm`, `default`, `lg`, `icon` |
| `Badge` | `badge.tsx` | `default`, `accent`, `success`, `warning`, `danger`, `muted` |
| `Card` | `card.tsx` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` |
| `Input` | `input.tsx` | Standard text input with focus ring |
| `Label` | `label.tsx` | Form labels (Radix) |
| `Tabs` | `tabs.tsx` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` |
| `Progress` | `progress.tsx` | Horizontal progress bar |
| `Avatar` | `avatar.tsx` | `Avatar`, `AvatarImage`, `AvatarFallback` |
| `Skeleton` | `skeleton.tsx` | Loading shimmer placeholder |
| `Separator` | `separator.tsx` | Horizontal/vertical divider |

### Usage

```tsx
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/shared/components/ui/card";
```

---

## Common Components (`shared/components/common/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Logo` | `logo.tsx` | App logo with Database icon |
| `PageHeader` | `page-header.tsx` | Page title + description + action slot |
| `MetricCell` | `metric-cell.tsx` | Single metric display (label + value) |
| `MetricGrid` | `metric-cell.tsx` | Responsive grid of metrics |
| `EmptyState` | `empty-state.tsx` | Empty content placeholder |

### MetricCell

```tsx
<MetricCell label="Execution Time" value="2,430 ms" variant="bad" />
```

Variants: `default` · `good` · `bad`

---

## Layout Components (`shared/components/layout/`)

| Component | File | Purpose |
|-----------|------|---------|
| `AppSidebar` | `app-sidebar.tsx` | Dashboard navigation sidebar (240px) |
| `AppTopbar` | `app-topbar.tsx` | Page header bar (48px) |
| `PublicNav` | `public-nav.tsx` | Landing page sticky nav |
| `DashboardShell` | `dashboard-shell.tsx` | Sidebar + main content wrapper |
| `WorkspaceShell` | `workspace-shell.tsx` | Three-panel lab layout |

---

## Editor (`shared/components/editor/`)

| Component | File | Purpose |
|-----------|------|---------|
| `SqlEditor` | `sql-editor.tsx` | Monaco Editor wrapper for SQL |

Features:
- Reads font size / tab size / word wrap from `useEditorStore`
- Dynamic import (no SSR)
- `vs-dark` theme

---

## Visualization (`shared/components/visualization/`)

| Component | File | Purpose |
|-----------|------|---------|
| `FlowCanvas` | `flow-canvas.tsx` | React Flow canvas for execution plans |

---

## Charts (`shared/components/charts/`)

| Component | File | Purpose |
|-----------|------|---------|
| `BenchmarkChart` | `benchmark-chart.tsx` | Recharts line chart for load testing |

---

## Feature Components

Feature-specific components live in `features/<name>/components/`:

| Feature | Key Components |
|---------|---------------|
| `landing` | `LandingPage` |
| `auth` | `LoginForm` |
| `dashboard` | `DashboardPage` |
| `learning` | `LearningPage` |
| `labs` | `LabsPage`, `LabDetailPage` |
| `lab-engine` | `LabWorkspace` |
| `benchmark` | `BenchmarkPage` |
| `quiz` | `QuizPage` |
| `achievements` | `AchievementsPage` |
| `bookmarks` | `BookmarksPage` |
| `profile` | `ProfilePage` |
| `settings` | `SettingsPage` |

---

## Providers (`shared/providers/`)

| Provider | Purpose |
|----------|---------|
| `ThemeProvider` | Dark mode (forced) via next-themes |
| `QueryProvider` | TanStack Query client |
| `ToastProvider` | Sonner toast notifications |
| `AppProviders` | Composes all providers |

---

## Stores (`shared/lib/stores/`)

| Store | State |
|-------|-------|
| `useSidebarStore` | Sidebar open/closed |
| `useWorkspaceStore` | Panel visibility, widths |
| `useEditorStore` | Font size, tab size, word wrap |

---

## Adding a New Component

1. Check this catalog and `shared/components/` first
2. If reusable across features → add to `shared/`
3. If feature-specific → add to `features/<name>/components/`
4. Use CVA for variants, `cn()` for conditional classes
5. Update this catalog
