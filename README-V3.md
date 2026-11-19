# XENO 3.0 — audited incremental replacement candidate

This package is based on the XENO Version 2 deployment ZIP, not a rewrite from scratch. It is **not certified as a complete production replacement**. The release number is a development label, not evidence of feature completeness.

## New in 3.0
- Explicit conversational `Remember that ...`, `Save ...`, `Update ... to ...`, `Update my saved ... memory. ...`, and `Forget ...` intent recognition.
- D1-backed creation and targeted updating with read-back verification; duplicate exact memory detection.
- Ambiguous updates fail closed rather than modifying the wrong record. Deletion through conversation is not executed; the dashboard retains confirmation.
- Memory PATCH endpoint and mobile dashboard editing.
- New automated tests for memory actions and preserved existing regression tests.

## Important limitations
- This is **not model training**. Memory is saved as database records and retrieved lexically for chat. It does not fine-tune Groq/Gemini.
- Natural-language memory commands are intentionally conservative. Complex paraphrases and inferred user preferences are not automatically written. Explicit commands are supported; unsupported requests must not be described as saved.
- No offline scheduled background execution, email/calendar/GitHub OAuth action connectors, semantic document retrieval, push notification delivery, end-to-end autonomous agent, or comprehensive permission enforcement. Existing approvals are records, not execution authorization.
- No live Cloudflare, Groq, Gemini, iPhone, or production data migration test was performed here. No source was pushed to GitHub and no production deployment was performed.

## Safe upgrade from the deployed Version 2
1. Export a D1 backup via the application's Export control. Keep a copy of the deployed Version 2 source and your current Cloudflare Worker settings. Never put API secrets in GitHub.
2. Verify the deployed Worker D1 binding is **DB**, Cloudflare Access variables `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` remain configured, and `GROQ_API_KEY` is a secret. Optional `GEMINI_API_KEY` remains a secret.
3. **Do not run destructive SQL.** The current Version 2 `schema.sql` remains compatible with the Version 3 memory action changes; the existing four D1 tables are reused.
4. Upload **all** Version 3 source files preserving folder paths. Your GitHub-connected Cloudflare Worker must use `src/index.js` as its entrypoint and `public/` as static assets. Inspect the Cloudflare build settings; uploading only `src` and `tests` is not enough.
5. If you use `wrangler.jsonc` to deploy, copy the D1 binding configuration from your existing deployment before deploying. The included generic wrangler file does not contain your private database ID. Do not overwrite a working D1 binding configuration blindly.
6. Confirm Cloudflare Access login, `/health` reports `3.0.0-release-candidate`, and that the same existing database is still bound.
7. Test chat, existing tools, manual memory CRUD, `Remember that I prefer metric units`, and `Update metric units to I prefer SI units`. Check D1 rows in the Memory dashboard and restart the PWA to confirm persistence.
8. If critical behavior fails, restore the previous Worker deployment/source; do not drop D1 tables.

## Testing
Run `npm test` and `npm run check` in Node.js 20+; this tests local logic, not deployed services.

## Engineering next steps
A complete XENO platform still requires real scheduling/queue execution, a permission policy engine with scoped grants, audit events, secure integrations, file ingestion/RAG, long-running checkpointed orchestration, production migration tests, and observability. These are not claimed to be implemented here.


## XENO 3.1 Project and Life Hub (additive upgrade)

**New:** D1-backed project registry for digital/physical/work/personal/learning projects, linked milestones, personal life journal (work, finance, health, learning, relationship, event, idea, reflection), and routines with completion timestamps. Project and life records are searchable as reference context for chat. They are **not** automatically saved by the AI; users enter them in the dashboard.

**Upgrade required:** Run the **new CREATE TABLE and CREATE INDEX statements at the bottom of `schema.sql`** in the existing Cloudflare D1 Console, once, before opening the new Projects or Life tabs. `IF NOT EXISTS` is additive and leaves existing memories and tasks intact. Confirm D1 binding name `DB`. The database contains personal data: keep Cloudflare Access active and export backups.

**Deployment:** Upload the entire folder preserving `src/`, `public/`, root `index.js`, `wrangler.jsonc`, and root modules. Cloudflare Worker entrypoint is `src/index.js`. Check that the Worker build configuration uses this entrypoint and that assets are served from `public/`. Do not replace production without backup and real authentication/API smoke tests.

**Limitations:** Project/life records are user-entered and visible in the app; AI reads relevant records by keyword, but cannot create projects or write journal entries through chat. Routines are manual; no background notification, autonomous external actions, file ingestion, finance syncing, CAD, or third-party service access. Avoid storing passwords, bank credentials, or sensitive medical details in freeform journal entries. This is a useful expansion, not full autonomous JARVIS functionality.
