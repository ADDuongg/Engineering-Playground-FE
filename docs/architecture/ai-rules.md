# Database Playground — AI Code Generation Rules

**Version:** 2.0  
**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind v4 · shadcn/ui  
**Companion:** [design-system.md](../design/design-system.md) · [architecture.md](./architecture.md)

This document is the pre-flight checklist for all AI-generated code. Read it **before** writing any component, page, or feature.

---

## Mandatory Stack

All generated code must use:

- **Feature-Based Architecture** — code lives in `features/<name>/`
- **Next.js App Router** — routes in `app/`, Server Components by default
- **shadcn/ui** — UI primitives from `@/shared/components/ui/`
- **Tailwind CSS v4** — design tokens from `@theme` in `globals.css`
- **React Hook Form + Zod** — all forms
- **TanStack Query** — all remote data (services currently unimplemented)
- **Zustand** — UI state only (sidebar, workspace panels, editor prefs)
- **CVA + cn()** — component variants

---

## Before Writing Any Code

1. Read [design-system.md](../design/design-system.md)
2. Read [architecture.md](./architecture.md)
3. Identify which **feature** owns this code
4. Check if a **shared component** already exists
5. Never create duplicate components

---

## File Placement Rules

| Code type | Location |
|-----------|----------|
| Business logic + UI for one capability | `features/<name>/` |
| Reusable across features | `shared/` |
| Route entry point | `app/` (thin — imports from features) |
| Lab definition | `features/labs/<slug>/` |
| Lab runtime | `features/lab-engine/` |

**Never** put feature-specific code in `shared/`.  
**Never** organize by file type at the top level.

---

## Component Rules

### Always reuse

- `Button`, `Badge`, `Card`, `Input`, `Tabs`, `Progress`, `Avatar` from `shared/components/ui/`
- `MetricCell`, `MetricGrid`, `PageHeader`, `EmptyState`, `Logo` from `shared/components/common/`
- `DashboardShell`, `WorkspaceShell`, `PublicNav` from `shared/components/layout/`
- `SqlEditor` from `shared/components/editor/`
- `BenchmarkChart` from `shared/components/charts/`

### Never create

- `Button2`, `CustomCard`, `DarkInput`, `NewPanel`
- Inline styles that replicate existing components
- New color/spacing values outside design tokens

---

## Styling Rules

```tsx
// Correct
className="bg-surface p-4 rounded-lg text-muted-foreground"
className={cn("text-sm", isActive && "text-accent")}

// Forbidden
style={{ background: "#0d1117", padding: "18px" }}
className="bg-[#1a1a2e] p-[15px]"
```

All values come from Tailwind tokens defined in `src/app/globals.css`.

---

## Layout Dimensions (fixed)

| Element | Value |
|---------|-------|
| Sidebar width | `240px` (`--sidebar-width`) |
| Topbar height | `48px` (`--topbar-height`) |
| Workspace left panel | `280px` (`--workspace-left-width`) |
| Workspace right panel | `360px` (`--workspace-right-width`) |
| Metrics panel max height | `200px` (`--metrics-panel-max-height`) |

Never change these proportions on desktop.

---

## Forms

Every form must use React Hook Form + Zod:

```tsx
const schema = z.object({ email: z.string().email() });
type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
});
```

---

## Data Fetching

```tsx
// Service — typed, throws until API exists
export async function fetchXxx(): Promise<Xxx> {
  throw new Error("fetchXxx is not implemented");
}

// Hook — disabled until API ready
export function useXxx() {
  return useQuery({
    queryKey: xxxKeys.all(),
    queryFn: fetchXxx,
    enabled: false,
  });
}
```

Use static placeholder data in components until services are wired.

---

## State Rules

| Store in Zustand | Store in TanStack Query |
|-----------------|------------------------|
| Sidebar open/closed | Lab list |
| Workspace panel visibility | User progress |
| Editor font size | Quiz results |
| Theme preference | Bookmarks |

---

## Adding a New Lab

1. Create `features/labs/<slug>/index.ts`
2. Call `registerLab(createLabDefinition({ ... }))`
3. Add to `shared/constants/labs-catalog.ts`
4. Import in `features/labs/register-all.ts`

Do **not** modify `lab-engine` or routing.

---

## Naming

| Good | Bad |
|------|-----|
| `ExperimentCard` | `MyCard` |
| `QueryEditor` | `Editor` |
| `LabWorkspace` | `Workspace` |
| `BenchmarkChart` | `Chart` |

---

## Accessibility

- Keyboard support on all interactive elements
- `aria-label` on icon-only buttons
- Focus ring via `focus-visible:ring-2 focus-visible:ring-ring`
- Semantic HTML (`main`, `nav`, `aside`, `section`)
- `aria-live="polite"` on dynamic metrics

---

## Motion

- Allowed: button press feedback, metric count-up, panel transitions, toast entry
- Forbidden: bounce, parallax, decorative loops, autoplay on workspace load
- Respect `prefers-reduced-motion`

---

## Checklist

Before submitting generated code:

- [ ] Code is in the correct `features/<name>/` folder
- [ ] Reused shared components (no duplicates)
- [ ] All styles use Tailwind design tokens
- [ ] Forms use RHF + Zod
- [ ] No server data in Zustand
- [ ] Client boundary is as low as possible
- [ ] Domain-descriptive component names
- [ ] Layout dimensions unchanged
- [ ] Accessibility requirements met
