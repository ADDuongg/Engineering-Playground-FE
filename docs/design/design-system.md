# Database Playground Design System

**Version:** 2.0  
**Stack:** Tailwind CSS v4 · shadcn/ui · CVA  
**Source of truth:** `src/app/globals.css` (`@theme` block)

---

## Design Philosophy

Database Playground is a professional developer tool. The interface should feel like Linear, Vercel, GitHub, or VS Code — quiet, precise, and information-dense.

### Principles

1. **Developer-first** — monospace for code/metrics, tabular numerals, keyboard shortcuts
2. **Quiet interface** — UI recedes; the experiment is the hero
3. **Minimal** — one primary action per context, no decorative elements in workspace
4. **Premium** — sub-pixel antialiasing, tight letter-spacing, 1px OKLCH borders
5. **Measurable** — every optimization exposes metrics

---

## Color Tokens

All colors use OKLCH. Defined in `globals.css` `@theme`:

| Token | Usage |
|-------|-------|
| `background` | Page background |
| `foreground` | Primary text |
| `surface` | Cards, sidebar |
| `surface-2` | Elevated surfaces, inputs |
| `surface-3` | Hover states, elevated panels |
| `muted` / `muted-foreground` | Secondary text, labels |
| `border` / `border-subtle` | Borders and dividers |
| `accent` / `primary` | Primary actions, links |
| `success` | Positive metrics, completed states |
| `warning` | Intermediate difficulty, cautions |
| `danger` | Errors, negative metrics |
| `editor-bg` | Monaco editor background |

### Syntax highlighting

| Class | Color role |
|-------|-----------|
| `.syntax-keyword` | SQL keywords |
| `.syntax-string` | String literals |
| `.syntax-fn` | Functions |
| `.syntax-comment` | Comments |
| `.syntax-num` | Numbers |

---

## Typography

| Token | Size | Usage |
|-------|------|-------|
| `text-xs` | 11px | Badges, metadata |
| `text-sm` | 13px | Body secondary, table cells |
| `text-base` | 14px | Body default |
| `text-lg` | 16px | Section headers |
| `text-xl` | 20px | Page subtitles |
| `text-2xl` | 24px | Stat values |
| `text-3xl` | 32px | Section titles |
| `text-4xl` | 40px | Hero subtitles |
| `text-5xl` | 56px | Hero titles |

### Font families

- `--font-display` — headings
- `--font-body` — body text
- `--font-mono` — code, metrics, badges

Use `.font-mono-tabular` for numeric values (tabular nums).

---

## Spacing

| Token | Value |
|-------|-------|
| `spacing-1` | 4px |
| `spacing-2` | 8px |
| `spacing-3` | 12px |
| `spacing-4` | 16px |
| `spacing-5` | 20px |
| `spacing-6` | 24px |
| `spacing-8` | 32px |
| `spacing-10` | 40px |
| `spacing-12` | 48px |
| `spacing-16` | 64px |

---

## Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Small elements, badges |
| `radius-md` | 8px | Buttons, inputs |
| `radius-lg` | 12px | Cards, panels |
| `rounded-full` | 999px | Pills, avatars |

---

## Shadows

| Token | Value |
|-------|-------|
| `shadow-1` | `0 1px 2px oklch(0% 0 0 / 0.24)` |

Use borders over shadows. Shadows are rare.

---

## Motion

| Animation | Duration | Usage |
|-----------|----------|-------|
| Button press | instant | `active:translate-y-px` |
| Hover transition | 100–150ms | Color, border changes |
| Count-up | 300ms | Metric value updates |
| Shimmer | 1.2s | Skeleton loading |
| Panel slide | 300ms | Drawer open/close |

Respect `prefers-reduced-motion: reduce`.

---

## Layout

### Dashboard shell

```
┌──────────┬────────────────────────────┐
│ Sidebar  │ Topbar                     │
│ 240px    ├────────────────────────────┤
│          │ Content                    │
└──────────┴────────────────────────────┘
```

### Workspace shell

```
┌──────────────────────────────────────────────┐
│ Topbar (48px)                                │
├──────────┬──────────────────┬────────────────┤
│ Theory   │ Editor           │ Visualization  │
│ 280px    │ 1fr              │ 360px          │
├──────────┴──────────────────┴────────────────┤
│ Metrics (max 200px)                          │
└──────────────────────────────────────────────┘
```

### Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| `> 1280px` (xl) | Full three-panel workspace |
| `≤ 1280px` | Workspace side panels hidden |
| `≤ 768px` (md) | Dashboard sidebar hidden |

Desktop first. Workspace requires `≥ 768px` for full experience.

---

## Components

Built on shadcn/ui with CVA variants. See [component-catalog.md](./component-catalog.md).

### Button variants

`default` · `secondary` · `ghost` · `success` · `danger` · `outline` · `link`

### Badge variants

`default` · `accent` · `success` · `warning` · `danger` · `muted`

### Domain components

- `MetricCell` / `MetricGrid` — experiment metrics
- `SqlEditor` — Monaco-based SQL editor
- `BenchmarkChart` — Recharts line chart
- `FlowCanvas` — React Flow visualization
- `WorkspaceShell` — three-panel lab layout

---

## Accessibility

- WCAG AA contrast minimum
- `--foreground` on `--background` for body text
- `--muted-foreground` only for non-essential labels
- Focus ring: `focus-visible:ring-2 focus-visible:ring-ring`
- Icon-only buttons require `aria-label`
- Tables: `<th scope="col">` on headers
- Dynamic metrics: `aria-live="polite"`

---

## Responsive Rules

- Desktop first — design for wide screens, adapt down
- Never hide critical workspace functionality without a toggle
- `min-w-0` on flex/grid children with scrollable content
- Landing pages responsive earlier; workspace prioritizes `≥ 768px`

---

## Dark Mode

Dark mode is the default and only theme for v1. Forced via `next-themes` with `forcedTheme="dark"`.

Light mode is planned for a future release.
