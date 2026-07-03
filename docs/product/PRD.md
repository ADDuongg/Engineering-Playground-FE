# Product Requirements Document (PRD)

# Database Playground

Version: 1.0

Status: Draft

Owner: Nguyen Van Duong

---

# 1. Vision

Database Playground is an interactive learning platform that helps developers understand how databases actually work through real-world experiments instead of passive tutorials.

Users should be able to:

- Execute SQL
- Visualize execution plans
- Compare performance before and after optimization
- Benchmark APIs under load
- Observe the effects of indexes, transactions, caching, and concurrency
- Learn production-level database concepts without installing PostgreSQL or Redis locally

The platform should prioritize experimentation over theory.

---

# 2. Problem Statement

Learning databases is difficult because most resources only explain concepts.

Developers rarely see:

- Why OFFSET becomes slower
- What EXPLAIN ANALYZE actually means
- When Redis helps
- Why indexes matter
- What deadlocks look like
- How transaction isolation behaves
- What happens under concurrent requests

Setting up PostgreSQL, Redis, Docker, datasets, and benchmarking tools is also a barrier for beginners.

This platform removes all setup complexity.

---

# 3. Target Users

Primary

- Backend Developers
- Fullstack Developers
- Computer Science Students

Secondary

- Frontend Developers interested in performance
- Interview preparation
- Technical educators

---

# 4. Product Goals

Users should understand:

✓ Indexes

✓ Query Optimization

✓ Execution Plans

✓ Transactions

✓ Isolation Levels

✓ Deadlocks

✓ Cursor Pagination

✓ Offset Pagination

✓ Redis Cache

✓ Batch Processing

✓ Load Testing

✓ PostgreSQL internals

through visual experiments.

---

# 5. Non Goals

This platform is NOT

- SQL Certification
- LeetCode SQL clone
- PostgreSQL documentation
- Database administration tool

---

# 6. Core Principles

Everything should be visual.

Everything should be interactive.

Users should learn by experimenting.

No installation required.

Every optimization must have measurable impact.

---

# 7. User Journey

User opens website

↓

Chooses a Lab

↓

Reads learning objective

↓

Runs experiment

↓

Observes metrics

↓

Changes configuration

↓

Runs again

↓

Compares results

↓

Completes quiz

↓

Moves to next lab

---

# 8. MVP Scope

## Lab 1

Index Playground

---

## Lab 2

EXPLAIN ANALYZE

---

## Lab 3

OFFSET vs Cursor

---

## Lab 4

Transactions

---

## Lab 5

Isolation Levels

---

## Lab 6

Redis Cache

---

## Lab 7

Batch Processing

---

## Lab 8

Load Testing

---

# 9. Learning Philosophy

Each lab contains

Explanation

↓

Experiment

↓

Visualization

↓

Benchmark

↓

Summary

↓

Quiz

---

# 10. User Interface

Every lab has

Left Panel

- Theory

Middle Panel

- SQL Editor

Right Panel

- Visualization

Bottom Panel

- Metrics

---

# 11. Metrics Display

Execution Time

Latency

Rows Scanned

Rows Returned

Index Used

Execution Plan

CPU Time

Memory

Network

Cache Hit

Transactions

Deadlocks

RPS

P95

P99

Throughput

---

# 12. Example User Experience

User opens Index Lab

Runs

SELECT \* FROM users
WHERE email='abc@gmail.com'

Result

Execution Time

2430 ms

Rows Scanned

1,000,000

Index

No

Full Table Scan

User clicks

Create Index

Runs again

Execution Time

3 ms

Rows Scanned

1

Index Scan

Difference is visualized.

---

# 13. Benchmark System

Users can benchmark

100 RPS

300 RPS

500 RPS

1000 RPS

5000 RPS

Benchmark duration

10s

30s

60s

Metrics

Latency

P95

P99

RPS

Throughput

Error Rate

---

# 14. Dataset

Users never upload data.

Platform provides datasets.

Examples

Users

Orders

Products

Logs

Payments

Large datasets

100K

1M

10M

---

# 15. Difficulty Levels

Beginner

Intermediate

Advanced

Expert

---

# 16. Progress Tracking

Completed Labs

Quiz Score

Achievements

Learning Path

Bookmarks

---

# 17. Future Labs

MongoDB

Redis

Kafka

RabbitMQ

ElasticSearch

Docker

Linux Performance

Browser Rendering

React Rendering

---

# 18. Success Metrics

Average session >15 minutes

Lab completion >60%

Users finish first lab <10 minutes

Return rate >30%

---

# 19. Technical Constraints

Everything runs inside Docker.

Each experiment is isolated.

Datasets are reset automatically.

Maximum execution time per query.

Sandbox execution only.

No arbitrary shell execution.

---

# 20. Security

SQL Sandbox

Resource Limiting

Container Isolation

Rate Limiting

Authentication

Audit Logs

---

# 21. Accessibility

Keyboard shortcuts

Dark mode

Responsive

High contrast

Screen reader friendly

---

# 22. Future Premium Features

Custom datasets

Private labs

Save experiments

AI Tutor

Company interview tracks

Leaderboard

Certificates

---

# 23. Out of Scope

Database hosting

Production monitoring

Cloud management

Admin dashboards

---

# 24. Product Vision (Long Term)

Become the interactive platform where developers truly understand database performance through experimentation rather than memorization.
