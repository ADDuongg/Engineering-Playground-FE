# Database Playground — Architecture

**Version:** 2.0  
**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui

---

## Overview

Database Playground uses **Feature-Based Architecture**. Every business capability owns its code. Shared infrastructure lives in `shared/`. The App Router composes features into routes.

---

## Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Landing, auth — no dashboard shell
│   ├── (dashboard)/              # Dashboard shell (sidebar + topbar)
│   ├── labs/[slug]/workspace/    # Full-screen lab workspace
│   ├── layout.tsx
│   └── globals.css
├── features/                     # Business features
│   ├── auth/
│   ├── dashboard/
│   ├── learning/
│   ├── workspace/
│   ├── benchmark/
│   ├── quiz/
│   ├── achievements/
│   ├── bookmarks/
│   ├── profile/
│   ├── settings/
│   ├── lab-engine/               # Generic lab runtime
│   └── labs/                     # Individual lab plugins
│       ├── index-playground/
│       ├── explain-analyze/
│       └── ...
└── shared/                       # Cross-feature infrastructure
    ├── components/
    │   ├── ui/                   # shadcn primitives
    │   ├── layout/               # Shell layouts
    │   ├── common/               # Domain-agnostic composites
    │   ├── editor/               # Monaco wrapper
    │   ├── visualization/        # React Flow wrapper
    │   └── charts/               # Recharts wrapper
    ├── hooks/
    ├── providers/
    ├── services/
    ├── lib/
    ├── utils/
    ├── constants/
    ├── config/
    └── types/
```

Each feature follows:

```
features/<name>/
├── components/
├── hooks/
├── services/
├── schemas/
├── types/
├── constants/
└── utils/
```

---

## Feature Boundaries

| Feature | Responsibility |
|---------|---------------|
| `landing` | Public marketing page |
| `auth` | Login/register forms |
| `dashboard` | User home, progress overview |
| `learning` | Learning path progression |
| `labs` | Lab browser, lab detail pages |
| `lab-engine` | Generic workspace runtime (theory \| editor \| viz \| metrics) |
| `labs/*` | Individual lab definitions registered via `labRegistry` |
| `benchmark` | Load testing UI |
| `quiz` | Post-lab knowledge checks |
| `achievements` | Gamification badges |
| `bookmarks` | Saved queries |
| `profile` | User profile |
| `settings` | User preferences |

**Rule:** Adding a new lab module only requires a new folder under `features/labs/<slug>/` and a registration call. No changes to `lab-engine` or routing.

---

## Shared Layer

`shared/` contains code used by two or more features:

- UI primitives (shadcn + CVA)
- Layout shells (`DashboardShell`, `WorkspaceShell`, `PublicNav`)
- Providers (theme, TanStack Query, Sonner)
- Zustand UI stores (sidebar, workspace panels, editor prefs)
- Design tokens (via Tailwind `@theme` in `globals.css`)
- Route constants, navigation config, lab catalog metadata

**Rule:** `shared/` never imports from `features/`.

---

## Rendering Strategy

| Layer | Strategy |
|-------|----------|
| Static pages (landing, lab detail) | Server Components |
| Forms, editor, charts, workspace | Client Components (`"use client"`) |
| Monaco Editor | `next/dynamic` with `ssr: false` |
| React Flow | `next/dynamic` with `ssr: false` |
| Recharts | Client component, lazy-loaded via route splitting |

Default to Server Components. Add `"use client"` only when the component needs hooks, browser APIs, or event handlers.

---

## State Management

| Concern | Tool |
|---------|------|
| Remote/server data | TanStack Query |
| UI state (sidebar, panels, theme, editor prefs) | Zustand |
| Form state | React Hook Form |
| URL state (filters, tabs) | nuqs |

**Rules:**
- Never store server data in Zustand
- Services export typed function signatures (currently unimplemented — screens use static placeholder data)
- TanStack Query hooks have `enabled: false` until API is wired

---

## Data Fetching

```
Component → useXxxQuery() → service.fetchXxx() → API (future)
```

Service layer pattern:

```typescript
// features/dashboard/services/dashboard-service.ts
export async function fetchDashboardStats(): Promise<DashboardStats> {
  throw new Error("fetchDashboardStats is not implemented");
}
```

Screens render static placeholder data matching the original prototype. When the backend is ready, implement services and enable query hooks.

---

## Dependency Rules

```
app/           → features/, shared/
features/*     → shared/, lab-engine (labs only)
features/labs/* → lab-engine, shared/
shared/        → (nothing from features/)
```

Forbidden:
- Feature → sibling feature
- Shared → feature
- Deep cross-feature imports

---

## Naming Conventions

| Entity | Convention | Example |
|--------|-----------|---------|
| Feature folder | kebab-case | `lab-engine/` |
| Component file | kebab-case | `lab-workspace.tsx` |
| Component name | PascalCase, domain-prefixed | `LabWorkspace`, `MetricCell` |
| Hook | `use` + domain | `useDashboardStats` |
| Service | verb + noun | `fetchLabs` |
| Schema | noun + `Schema` | `loginSchema` |
| Store | `use` + domain + `Store` | `useWorkspaceStore` |
| Query keys | feature + scope | `dashboardKeys.stats()` |

---

## Import Rules

```typescript
// Correct
import { Button } from "@/shared/components/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { LabWorkspace } from "@/features/lab-engine/components/lab-workspace";

// Forbidden
import { DashboardPage } from "@/features/dashboard/components/dashboard-page"; // from another feature
import { fetchLabs } from "@/features/labs/services/labs-service"; // from shared/
```

Use `@/` path aliases defined in `tsconfig.json`.

---

## Component Hierarchy

```
AppProviders (root layout)
├── (public) layout — none
│   ├── LandingPage
│   └── LoginForm
├── (dashboard) layout — DashboardShell
│   ├── AppSidebar
│   ├── AppTopbar
│   └── Feature page content
└── labs/[slug]/workspace — WorkspaceShell
    ├── LabWorkspace
    │   ├── Theory panel (Tabs)
    │   ├── SqlEditor (Monaco)
    │   ├── Visualization panel
    │   └── MetricGrid
    └── LabEngine runtime
```

---

## Lab Plugin System

```typescript
// features/labs/index-playground/index.ts
registerLab(createLabDefinition({ slug: "index-playground", ... }));

// features/lab-engine/constants/lab-registry.ts
export const LAB_REGISTRY: Record<string, LabDefinition> = {};
```

Route `labs/[slug]/workspace` loads lab from registry and renders `LabWorkspace`.

---

## Route Map

| Route | Feature |
|-------|---------|
| `/` | landing |
| `/login` | auth |
| `/dashboard` | dashboard |
| `/learning` | learning |
| `/labs` | labs |
| `/labs/[slug]` | labs (detail) |
| `/labs/[slug]/workspace` | lab-engine + labs/* |
| `/benchmark` | benchmark |
| `/quiz` | quiz |
| `/achievements` | achievements |
| `/bookmarks` | bookmarks |
| `/profile` | profile |
| `/settings` | settings |
