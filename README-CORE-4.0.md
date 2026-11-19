# XENO 4.0 — Core Foundation Candidate

This is an incremental, locally tested core release, **not** a claim that XENO is finished or production-validated. All 3.8 features are retained.

## New authenticated endpoints
- `GET /api/core/diagnostics`: checks availability of required D1 tables, bindings and provider configuration (not live provider connectivity).
- `GET /api/core/projects/{projectId}/search?q=...`: bounded lexical project memory retrieval.
- `GET /api/core/projects/{projectId}/integrity`: reports same-title divergent memory conflicts and unverified records. Does not decide which is correct.
- `GET /api/core/projects/{projectId}/knowledge-pack`: reference-only, scoped export of confirmed/source-backed memories for later specialist use. **No automatic agent training or tool permissions.**

## Deployment
1. Back up Worker source and D1 database.
2. Deploy the complete folder to the existing Cloudflare Worker, preserving Access, DB, FILES and provider bindings.
3. No new D1 migration is required **if 3.8 migrations are already installed**. Otherwise apply missing prior migrations in order.
4. Confirm `/health` and `/api/core/diagnostics` behind Cloudflare Access.
5. Test search, integrity and knowledge-pack against a real project. Verify project separation and iPhone interface behavior.

## Known gaps
No semantic/vector search, automatic conflict resolution, full agent teaching, live web research, durable background orchestration, isolated code execution, verified production monitoring, or guarantees of perfect accuracy. The 3.8 Ecosystem UI remains; the new core endpoints are API-first and have no dedicated dashboard. Current project context retrieval is still recency-based; the search endpoint is an additional capability rather than a replacement.
