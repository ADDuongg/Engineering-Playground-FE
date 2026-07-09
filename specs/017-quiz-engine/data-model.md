# Data Model: Quiz Engine (Frontend)

## Entities

### QuizOptionPublic

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | uuid |
| `label` | `string` | |
| `sequenceOrder` | `number` | |

### QuizQuestionPublic

| Field | Type | Notes |
|-------|------|-------|
| `id` | `string` | uuid |
| `prompt` | `string` | |
| `sequenceOrder` | `number` | |
| `questionType` | `"single_select"` | only type in v1 |
| `options` | `QuizOptionPublic[]` | no `isCorrect` |

### QuizDefinitionResponse

| Field | Type | Notes |
|-------|------|-------|
| `labSlug` | `string` | |
| `trackSlug` | `string` | |
| `title` | `string \| null` | |
| `questions` | `QuizQuestionPublic[]` | |

### SubmitQuizAnswer

| Field | Type |
|-------|------|
| `questionId` | `string` |
| `optionId` | `string` |

### SubmitQuizRequest

| Field | Type |
|-------|------|
| `answers` | `SubmitQuizAnswer[]` |

### SubmitQuizResult

| Field | Type | Notes |
|-------|------|-------|
| `labSlug` | `string` | |
| `trackSlug` | `string` | |
| `correctCount` | `number` | |
| `totalQuestions` | `number` | |
| `percentCorrect` | `number` | 0–100 |
| `passed` | `boolean` | 100% required server-side |
| `attemptedAt` | `string` | ISO |
| `incorrectQuestionIds` | `string[]` | |
| `labCompleted` | `boolean` | |
| `alreadyLabCompleted` | `boolean` | |

### QuizResultSummaryResponse

| Field | Type | Notes |
|-------|------|-------|
| `labSlug` | `string` | |
| `status` | `"not_attempted" \| "failed" \| "passed"` | |
| `attemptCount` | `number` | |
| `correctCount` | `number` optional | omitted when not_attempted |
| `totalQuestions` | `number` optional | |
| `percentCorrect` | `number` optional | |
| `bestAttemptedAt` | `string` optional | ISO |

## Relationships

- One quiz definition per lab (when seeded).
- Many attempts per user/lab; result summary exposes best/status.
- Passing attempt triggers Progress lab completion (backend); FE invalidates progress cache.
