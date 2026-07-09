# Research: Index Playground / Lab Summary (Frontend)

**Feature**: 019-index-playground | **Date**: 2026-07-09

## Decisions

### 1. Shared types location

**Decision**: Put `LabSummaryResponse` / `LabGuidedStep` in `src/shared/labs/lab-summary.ts` and export from `src/shared/labs/index.ts`.

**Rationale**: Contract explicitly requires shared public summary types.

### 2. Feature module vs only extending `features/labs`

**Decision**: New `src/features/index-playground/` for summary service, guided UI, and scan comparison. Keep `features/labs/index-playground/index.ts` as registry plugin (static fallback).

**Rationale**: Matches numbered contract modules; registry remains thin.

### 3. Editor apply without fighting user edits

**Decision**: Expose `onApplySql(sql)` from workspace; guided panel buttons set editor value. Do not auto-overwrite `defaultQuery` after mount when summary arrives unless editor still equals previous default.

**Rationale**: Spec edge case — preserve user edits.

### 4. Before/after scan comparison source

**Decision**: Prefer `runExplainSql.data.metrics` keys `rows_scanned`, `seq_scan_used`, `index_scan_used` (and timing keys when present). Store explicit before/after snapshots via “Save as before/after” or auto-save on explain success when guided mode is active (before create-index vs after).

**Rationale**: Contract: Explain is primary scan comparison surface; SQL runs may omit scan keys.

**Implementation default**: Auto-capture: first successful explain → before; after user runs create-index SQL successfully, next explain → after. Also provide manual “Capture before” / “Capture after” buttons for clarity.

### 5. LabWorkspace changes

**Decision**: Add optional props: `guidedSlot`, `comparisonSlot`, `onQueryChange` / controlled query apply callback. Minimal surface so other labs unchanged.

**Rationale**: Avoid Index-specific logic inside generic engine; slots keep boundaries clean.

### 6. Dataset tier from summary

**Decision**: If summary `dataset.recommendedTier[0]` is a valid `DatasetTier` and lab opens fresh, prefer it for initial tier state.

**Rationale**: Aligns prepare with summary hints.

## Open questions resolved by defaults

- Fallback when summary 404: keep registry `LabDefinition` content; hide guided panel or show soft error.
- `paramHints`: show as helper text under recommended query; parameters array still `[]` until param UI exists (same as current workspace).
- Optional benchmark: render note text only; no enqueue.
