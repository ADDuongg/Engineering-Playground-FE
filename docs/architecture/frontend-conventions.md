# Frontend Conventions

**Version:** 2.0  
**Applies to:** All code in `src/`

---

## File Organization

Organize by **business capability**, never by file type at the top level.

```
features/workspace/
├── components/     # UI for this feature only
├── hooks/          # Feature-specific hooks
├── services/       # API calls for this feature
├── schemas/        # Zod validation schemas
├── types/          # TypeScript types
├── constants/      # Feature constants, query keys
└── utils/          # Feature utilities
```

---

## Components

### Server vs Client

- Default to Server Components
- Add `"use client"` only when needed (hooks, events, browser APIs)
- Keep client boundaries as low as possible in the tree

### Composition

```tsx
// Good — compose from shared primitives
<Card>
  <MetricGrid>
    <MetricCell label="Latency" value="48 ms" />
  </MetricGrid>
  <Button>Run Query</Button>
</Card>

// Bad — one-off styled div
<div className="bg-[#1a1a2e] p-[18px]">...</div>
```

### Naming

- Domain-prefixed: `LabCard`, `QueryEditor`, `BenchmarkChart`
- Never: `MyCard`, `CustomButton`, `Component1`

---

## Styling

- Use Tailwind utility classes with design tokens from `@theme`
- Use `cn()` from `@/shared/lib/utils` for conditional classes
- Use CVA for component variants (see `button.tsx`, `badge.tsx`)
- Never hardcode colors, spacing, radius, typography, or shadows

```tsx
// Correct
className="bg-surface-2 p-4 rounded-lg text-muted-foreground"

// Forbidden
className="bg-[#1a1a2e] p-[15px] rounded-[10px]"
```

---

## Forms

Every form uses React Hook Form + Zod:

```tsx
const schema = z.object({ email: z.string().email() });
const form = useForm({ resolver: zodResolver(schema) });
```

---

## Data Fetching

```tsx
// Query key factory
export const labsKeys = {
  all: ["labs"] as const,
  list: () => [...labsKeys.all, "list"] as const,
};

// Service (typed, unimplemented until API exists)
export async function fetchLabs(): Promise<LabCatalogItem[]> {
  throw new Error("fetchLabs is not implemented");
}

// Hook
export function useLabs() {
  return useQuery({
    queryKey: labsKeys.list(),
    queryFn: fetchLabs,
    enabled: false, // enable when API is ready
  });
}
```

Screens use static placeholder data until services are implemented.

---

## State

| State type | Tool | Example |
|-----------|------|---------|
| Server data | TanStack Query | Lab list, user progress |
| UI preferences | Zustand | Sidebar open, editor font size |
| Form input | React Hook Form | Login, settings |
| URL params | nuqs | Lab filters, search |

---

## Error Handling

- Use `notFound()` for missing resources (labs, pages)
- Use Sonner toasts for user-facing action feedback
- Service functions throw typed errors (implement when API is wired)

---

## Testing Conventions

(To be established)

- Unit tests: `*.test.ts` colocated with source
- Component tests: React Testing Library
- E2E: Playwright (planned)

---

## Git Conventions

- Feature branches: `feat/<feature-name>`
- Commit messages: conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`)
- One feature per PR when possible

---

## Adding a New Feature

1. Create `src/features/<name>/` with standard subfolders
2. Add route in `src/app/(dashboard)/<name>/page.tsx`
3. Add navigation entry in `shared/constants/navigation.ts` if needed
4. Add route constant in `shared/constants/routes.ts`
5. Create service stubs with typed signatures
6. Use static placeholder data for UI

## Adding a New Lab

1. Create `src/features/labs/<slug>/index.ts`
2. Call `registerLab(createLabDefinition({ ... }))`
3. Add catalog entry in `shared/constants/labs-catalog.ts`
4. Import in `features/labs/register-all.ts`
5. No changes to `lab-engine` or routing required
