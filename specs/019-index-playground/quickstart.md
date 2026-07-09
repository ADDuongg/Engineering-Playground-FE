# Quickstart: Index Playground / Lab Summary (Frontend)

## Manual verification

1. Sign in → open Index Playground workspace.
2. Network: `GET /labs/index-playground/summary` returns guided steps + recommended SQL.
3. Guided panel: Apply recommended query (keeps `$1`) → Run sends `exampleParameters` → Execution tab shows plan; Metrics include scan keys when Explain returns them.
4. Capture **before** → Apply create-index SQL → Run (`parameters: []`) → Apply query again → Run → Capture **after** → comparison shows seq vs index.
5. Take quiz step → `/quiz?lab=index-playground`.
6. Sign out / summary 404 → workspace still loads from registry; soft error on guided panel.

## Dev notes

- API base: `NEXT_PUBLIC_API_URL`.
- Scan comparison keys: `rows_scanned`, `seq_scan_used`, `index_scan_used`.
