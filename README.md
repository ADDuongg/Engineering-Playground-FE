# Database Playground

Interactive learning platform where developers understand databases through experimentation.

## Tech Stack

- **Framework:** Next.js 15, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State:** TanStack Query (server), Zustand (UI)
- **Forms:** React Hook Form + Zod
- **Editor:** Monaco Editor
- **Visualization:** React Flow, Recharts

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/          # Next.js App Router
├── features/     # Business features (feature-based architecture)
└── shared/       # Cross-feature infrastructure
```

## Documentation

- [Architecture](docs/architecture/architecture.md)
- [Frontend Conventions](docs/architecture/frontend-conventions.md)
- [AI Rules](docs/architecture/ai-rules.md)
- [Design System](docs/design/design-system.md)
- [Component Catalog](docs/design/component-catalog.md)
- [Product Principles](docs/design/project-principles.md)
- [PRD](docs/product/PRD.md)
- [Roadmap](docs/product/roadmap.md)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
