# Data Model: Progress Tracking (Frontend)

## Entities

### LabPathItem

| Field | Type | Notes |
|-------|------|-------|
| `slug` | `string` | Lab slug |
| `title` | `string` | |
| `description` | `string \| null` optional | |
| `sequenceOrder` | `number` | Sort key |

### TrackLearningPathResponse

| Field | Type | Notes |
|-------|------|-------|
| `trackSlug` | `string` | |
| `labs` | `LabPathItem[]` | Sorted by sequenceOrder, then slug |

### TrackProgressLabItem

Extends `LabPathItem` with:

| Field | Type | Notes |
|-------|------|-------|
| `completed` | `boolean` | Per-user |

### TrackProgressSummaryResponse

| Field | Type | Notes |
|-------|------|-------|
| `trackSlug` | `string` | |
| `totalLabs` | `number` | |
| `completedCount` | `number` | |
| `percentComplete` | `number` | Integer 0–100; 0 if totalLabs === 0 |
| `completedLabSlugs` | `string[]` | |
| `labs` | `TrackProgressLabItem[]` | |

### CompleteLabResult

| Field | Type | Notes |
|-------|------|-------|
| `labSlug` | `string` | |
| `trackSlug` | `string` | |
| `completedAt` | `string` | ISO timestamptz |
| `alreadyCompleted` | `boolean` | true on idempotent retry |

## Relationships

- One learning path per track slug (public catalog).
- One progress summary per (user, track).
- Completing a lab updates that user’s progress for the lab’s track.
- No uncomplete relationship in this feature.
