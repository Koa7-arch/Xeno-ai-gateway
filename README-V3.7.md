# XENO 3.7 — Intelligence & Reliability

## Upgrade from 3.6
1. Back up your D1 database and your current GitHub code.
2. In D1 console run ONLY the four statements under `XENO 3.7 additive intelligence and reliability migration` at the end of `schema.sql`. Do not drop existing tables.
3. Upload this source package to your existing GitHub repo; preserve Cloudflare Access, DB, FILES and AI provider configuration.
4. Run `npm run check` and `npm test` in a Node 20+ environment.
5. Test project-specific memory and context boundaries on the live Worker before relying on them.

## Project memory API
- `GET /api/intelligence/projects/{projectId}/memories`
- `POST /api/intelligence/projects/{projectId}/memories` with `{title,content,kind,confidence}`
- `PATCH /api/intelligence/projects/{projectId}/memories/{id}` with any updated fields, or `{archived:true}`
- `GET /api/intelligence/audit?projectId={projectId}`

Project memory kinds: fact, decision, assumption, preference, requirement. Confidence: unverified, user-confirmed, source-backed. Labels are supplied by users, **not** independently validated.

## Security behavior
- With `projectId`, chat retrieves selected-project notes, tasks, R&D and project memories, **not** the older global memory search, global life-record search, or auto-selected global text files.
- Without `projectId`, the original global context behavior is preserved.
- Caller-provided chat history, profile, and workspace data are still included; do not interpret this as cryptographic isolation.
- New project memories are stored with explicit project IDs; writes are checked by reading back.
- New audit records contain action metadata, not complete message or memory contents. Audit logging is best-effort; it is not tamper-proof.
- Project memories are currently edited via API, not a dedicated dashboard panel or natural-language write commands.
- No web research, autonomous execution, CAD, code sandbox, or background scheduler is claimed.
