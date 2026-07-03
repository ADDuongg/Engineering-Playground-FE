# Database Playground – Product Principles

## Vision

Database Playground is not a SQL editor.

It is an interactive learning platform where developers understand how databases work through experimentation.

The product should make invisible database behavior visible.

Every interaction should teach something.

---

## Core Principles

### 1. Learn by Experimenting

Users should never passively consume information.

Every concept should be accompanied by an experiment.

Reading should always be followed by doing.

### 2. Visualize Everything

Whenever possible, replace text with visualization.

Examples: query execution flow, index traversal, B-Tree operations, transaction timeline, lock waiting, deadlock graph, cache hit/miss, query comparison, execution plan tree.

If something happens inside the database, the user should be able to see it.

### 3. Every Optimization Must Be Measurable

The UI should always answer: Is it faster? Why is it faster? How much faster?

Every optimization should expose measurable metrics: execution time, rows scanned, CPU, memory, cache hit, latency, P95, P99, throughput.

### 4. Encourage Curiosity

The interface should invite experimentation. Users should naturally ask: "What happens if I…"

### 5. The Workspace Is the Product

The Experiment Workspace is the heart of the application. All supporting pages should guide users toward the workspace.

### 6. Theory Supports Practice

Theory should explain experiments. Theory is never the final destination. Reading should immediately lead into interaction.

### 7. Every Screen Must Teach Something

Before creating any new page, ask: What is happening? Why is it happening? What changed? What can the user learn? What action should the user take next?

### 8. Progressive Learning

Guide users from simple concepts to advanced: SQL Basics → Indexes → Query Optimization → EXPLAIN ANALYZE → Transactions → Isolation Levels → Redis Cache → Batch Processing → Load Testing → PostgreSQL Internals.

Future modules: MongoDB, Kafka, Docker, Linux Performance, Browser Rendering, React Rendering.

### 9. Immediate Feedback

Every user action should produce immediate feedback. Avoid actions that appear to do nothing.

### 10. Consistency Over Creativity

Reuse layouts, components, and interaction models. A user should feel like every page was created by the same design team.

---

## Product Personality

The product should feel: intelligent, calm, precise, technical, professional, curious, trustworthy.

Avoid: playful gamification, excessive decoration, marketing-style layouts, visual noise.

---

## UX Philosophy

Learning should follow this sequence:

**Objective → Theory → Experiment → Visualization → Metrics → Comparison → Summary → Quiz → Next Challenge**

Every learning experience should follow this flow whenever possible.

---

## AI Instruction

Whenever generating a new screen, component, or interaction:

- Prioritize learning over configuration
- Prioritize experimentation over documentation
- Prioritize visualization over explanation
- Prioritize measurable outcomes over descriptive text
- Reuse existing UI patterns instead of inventing new ones
- Every page should move the user one step closer to understanding database performance
