# XENO 2.0 — Full Replacement Candidate

This package **reuses the v1.4.1 production source** for the complete deterministic tool registry, capability map and diagnostics, while replacing the frontend with the JARVIS-style mobile Command Center and adding an AI provider abstraction, large-input staging, and optional D1-backed memories and tasks.

## Deployment safety
**Do not overwrite production until preview testing succeeds.** Create a separate Cloudflare Worker, set `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD`, and protect **both preview and production URLs** with Cloudflare Access. Set `GROQ_API_KEY` as a secret; optionally `GEMINI_API_KEY`. Copy `wrangler.jsonc` and use Wrangler to deploy to a preview Worker. For D1 memory/tasks, create a new private D1 database, run `schema.sql` migrations, then use `wrangler-d1.example.jsonc` as a template and replace its placeholder database ID. Never commit secrets.

## Existing-data migration
The original PWA stores profile, chat and other data locally. This package does **not** automatically migrate that local data. Export/backup the original browser storage and any cloud data before replacement. The new UI stores chat in a new `xeno-v2-chat` localStorage key and keeps D1 memory/task data separately.

## Features and limitations
- Existing 40+ AI tool schemas and direct deterministic tools preserved from v1.4.1, along with capability map and diagnostics.
- Groq structured tool calls and Gemini text generation supported. Gemini tool calling not implemented.
- Large input requests are staged via summaries (up to eight chunks); this is not durable background orchestration and can omit details. Do not use it for irreversible actions.
- D1 memory/task CRUD is manual; background scheduling and external account actions are **not** implemented.
- Cloudflare Access JWT verification and same-origin write checks included; production authentication, D1, AI calls and deploy have **not** been tested live.
- Frontend is a redesign, not a drop-in restoration of the old navigation or all legacy browser features.
- `/capabilities/verified` runs deterministic diagnostics, not live AI tests.

## Local tests
`npm test` and `npm run check` with Node.js 20+.

## API endpoints
`/health`, `/chat`, `/tools/catalog`, `/tools/run`, `/diagnostics/run`, `/capabilities/verified`, `/api/memories`, `/api/tasks`.
