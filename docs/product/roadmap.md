# Database Playground — Roadmap

**Last updated:** July 2026

---

## Phase 1: Foundation (Complete)

- [x] Next.js 15 + React 19 + TypeScript scaffold
- [x] Tailwind CSS v4 + shadcn/ui design system
- [x] Feature-based architecture
- [x] App Router with route groups
- [x] Lab plugin registry system
- [x] Migrate all 15 prototype screens
- [x] Documentation rewrite

---

## Phase 2: Backend Integration

- [ ] Define OpenAPI contract with backend team
- [ ] Implement auth service (GitHub OAuth + email)
- [ ] Wire TanStack Query hooks to real API
- [ ] SQL execution sandbox API
- [ ] User progress tracking API
- [ ] Bookmark persistence

---

## Phase 3: Lab Content

- [ ] Polish Index Playground (reference lab)
- [ ] Complete EXPLAIN ANALYZE visualizations
- [ ] OFFSET vs Cursor interactive animations
- [ ] Transaction timeline visualization
- [ ] Isolation level comparison tool
- [ ] Redis cache hit/miss flow
- [ ] Batch processing benchmarks
- [ ] Load testing with live charts

---

## Phase 4: Platform Features

- [ ] Real-time collaboration (shared workspace)
- [ ] AI tutor integration
- [ ] Custom datasets (Pro tier)
- [ ] Saved experiments
- [ ] Interview preparation tracks
- [ ] Certificates
- [ ] Leaderboard

---

## Phase 5: New Learning Modules

| Module | Priority | Status |
|--------|----------|--------|
| PostgreSQL Internals | High | Planned |
| MongoDB | Medium | Planned |
| Redis (advanced) | Medium | Planned |
| Kafka | Medium | Planned |
| RabbitMQ | Low | Planned |
| Docker | Low | Planned |
| Linux Performance | Low | Planned |
| Browser Rendering | Low | Planned |
| React Rendering | Low | Planned |

Each new module follows the lab plugin pattern: self-contained under `features/labs/<slug>/`, registered via `labRegistry`.

---

## Phase 6: Quality & Scale

- [ ] E2E test suite (Playwright)
- [ ] Component test coverage
- [ ] Performance monitoring (Web Vitals)
- [ ] Light mode theme
- [ ] Internationalization (i18n)
- [ ] Mobile workspace adaptations

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Average session duration | > 15 minutes |
| Lab completion rate | > 60% |
| First lab completion time | < 10 minutes |
| Return rate (7-day) | > 30% |
