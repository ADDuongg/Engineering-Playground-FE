# Data Model: Index Playground / Lab Summary (Frontend)

## Entities

### LabGuidedStepAction

```typescript
type LabGuidedStepAction =
  | "run_sql"
  | "run_explain"
  | "run_explain_analyze"
  | "create_index_sql"
  | "drop_index_sql"
  | "compare_metrics"
  | "take_quiz"
  | "optional_benchmark";
```

### LabGuidedStep

| Field | Type | Notes |
|-------|------|-------|
| `order` | `number` | Sort ascending |
| `title` | `string` | |
| `instruction` | `string` | |
| `action` | `LabGuidedStepAction` | |

### LabRecommendedQuery

| Field | Type | Notes |
|-------|------|-------|
| `sql` | `string` | Keep `$1` placeholders — do not inline values |
| `exampleParameters` | `unknown[]` | Bound values for `$1..$n`; required non-empty for Index Playground |
| `paramHints` | `string[]` | |
| `description` | `string` | |

### LabSummaryResponse

| Field | Type | Notes |
|-------|------|-------|
| `labSlug` | `string` | |
| `trackSlug` | `string` | |
| `title` | `string` | |
| `learningGoal` | `string` | |
| `theory` | `string` | |
| `guidedSteps` | `LabGuidedStep[]` | |
| `recommendedQuery` | `LabRecommendedQuery` | |
| `recommendedCreateIndexSql` | `string` | |
| `recommendedDropIndexSql` | `string` | |
| `quizRequired` | `boolean` | |
| `dataset` | `{ family, version, recommendedTier }` | |
| `optionalBenchmarkNote` | `string \| null` optional | |

### ScanMetricKeys (comparison)

| key | Meaning |
|-----|---------|
| `rows_scanned` | Rows touched in plan summary |
| `seq_scan_used` | 1 if seq scan present |
| `index_scan_used` | 1 if index scan present |
| `planning_time_ms` / `plan_execution_time_ms` | When explain analyze |

### ScanComparisonSnapshot

| Field | Type | Notes |
|-------|------|-------|
| `label` | `"before" \| "after"` | |
| `runId` | `string` optional | |
| `metrics` | `Partial<Record<ScanMetricKey, number>>` | From Explain only |
| `capturedAt` | `string` | ISO client timestamp |

## Relationships

- One summary per lab slug (when registered on backend).
- Before/after snapshots are client-side teaching state derived from Explain results.
- Quiz / dataset / SQL / explain remain separate modules.
