# XENO 3.8 — Ecosystem Orchestration Engine

## Scope
Seven named specialists (FORGE, PATHFINDER, LEDGER, VAULT, ASCEND, WORKSHOP, LOREKEEPER) with XENO coordinating their reports. Project-specific, on-demand, read-only, bounded sequential model calls. Supports automatic routing or selecting one specialist. Backend accepts up to three manually selected specialists. Saves reports and synthesis to D1. No autonomous actions, web browsing, financial operations, CAD execution, or cross-project access are enabled.

## Upgrade
1. Back up D1 and existing Worker source.
2. Run only the `XENO 3.8 additive ecosystem migration` SQL at the end of `schema.sql` on your existing D1 database.
3. Deploy this entire source package to the existing Worker; keep the DB, FILES, Access, and provider bindings.
4. Reload the Project Command Center and open the Ecosystem tab.
5. Run a small project-specific assignment and inspect the stored result.

## API
- `GET /api/ecosystem/specialists`
- `GET /api/ecosystem/runs?projectId=<uuid>`
- `POST /api/ecosystem/runs` with `{"projectId":"<uuid>","request":"...","specialists":["FORGE","PATHFINDER"],"provider":"groq"}`. Omit `specialists` for automatic routing.

## Limits and cautions
Runs make up to four sequential provider requests (three specialists and one synthesis). Worker request CPU/wall-clock and provider latency can cause timeouts; future version should use queued jobs. Provider failures yield partial results when possible. All outputs are untrusted advisory drafts, not verified calculations or live research. No new external action permissions are granted. Existing profile and history context are not a strict security boundary; do not treat project selection as tenant isolation. Run locally with `npm run check && npm test` before deployment.
