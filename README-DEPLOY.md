# XENO 2.0.1 deployment and operational limits

**This is a development release, not a production-certified full replacement.** Keep your current Worker intact until a separate preview passes end-to-end tests.

## Setup
1. Install Node.js 20+ and Wrangler on a computer or cloud development environment.
2. Run `npm test` and `npm run check`.
3. Create a NEW Cloudflare Worker and D1 database; never point a preview to your production database.
4. Apply `schema.sql` to the NEW D1 database using Wrangler D1 execute.
5. Copy `wrangler-d1.example.jsonc` to `wrangler.jsonc` and replace the D1 database ID and Worker name with preview values.
6. Configure Cloudflare Access for the preview hostname. Set `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD` as Worker environment variables, `GROQ_API_KEY` as a secret; optionally `GEMINI_API_KEY` as a secret. Never put keys in the frontend.
7. Deploy the preview using `npx wrangler deploy`. Verify `/health`, login/logout, chat, calculations, memory, approvals, reminders, export, and iPhone PWA operation.
8. Back up original localStorage and cloud data before considering replacement. There is no automatic localStorage migration.

## Implemented
Groq tool-based chat, Gemini text chat, existing deterministic tools, diagnostics, mobile dashboard, D1 memory CRUD with lexical memory retrieval, task CRUD, approval record keeping, in-app reminders, and D1 JSON export.

## Not implemented / not independently validated
Live provider or Cloudflare tests; scheduled execution while offline; push notifications; third-party email/calendar/GitHub actions; autonomous external action execution; secure delegated OAuth integration; semantic embeddings and fine-tuning; robust file ingestion; complete historical data migration; disaster recovery. Approving a proposal DOES NOT execute it.

## Training XENO
Use retrieval-augmented generation (RAG) and explicit feedback before considering model fine-tuning. Save approved facts as memories, store documents in a private knowledge store, retrieve relevant records for each request, and log feedback with user consent. Do not put API secrets in training data. The current retrieval implementation is lexical and limited; it is not model training.
