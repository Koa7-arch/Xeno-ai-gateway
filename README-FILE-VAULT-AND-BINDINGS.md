# XENO 4.0 — File Vault Navigation and Worker Bindings

## Interface update
File Vault is now a dedicated **FILES** tab in the bottom navigation, instead of appearing beneath the app. Upload, create, analyze, list, download, and delete continue using existing `/api/files` routes. File list refreshes when the tab is opened. No database migration for this interface change.

## Cloudflare Worker bindings (required)

| Type | Binding variable | Resource | Purpose |
|---|---|---|---|
| D1 database | `DB` | Your **existing** XENO D1 database | All app records, project memory, file metadata, activity, agents |
| R2 bucket | `FILES` | Your **existing** XENO R2 bucket (example: `xeno-files`) | Actual uploaded and generated file content |
| Static assets | `ASSETS` | `./public` | Frontend assets; configured in `wrangler.jsonc` |

You do **not** need a D1 database for each subsystem. The `schema.sql` file contains multiple tables in the single `DB` database.

## Environment variables / secrets
- `ACCESS_TEAM_DOMAIN` (text): Cloudflare Access team domain
- `ACCESS_AUD` (text): Access application audience
- `GROQ_API_KEY` (secret): required for Groq calls
- `GEMINI_API_KEY` (secret): required for Gemini capabilities

## Example Wrangler configuration
Use actual IDs and names from your existing Cloudflare account; do not create duplicate resources.

```jsonc
{
  "name": "xeno-v3",
  "main": "src/index.js",
  "compatibility_date": "2026-11-01",
  "assets": { "directory": "./public", "binding": "ASSETS", "run_worker_first": true },
  "d1_databases": [{ "binding": "DB", "database_name": "YOUR_EXISTING_D1_NAME", "database_id": "YOUR_EXISTING_D1_ID" }],
  "r2_buckets": [{ "binding": "FILES", "bucket_name": "YOUR_EXISTING_R2_BUCKET" }]
}
```

## iPhone / Cloudflare deployment
1. Back up the current Worker code and D1 database.
2. In Cloudflare, open **Workers & Pages** → your XENO Worker → **Settings** → **Bindings**.
3. Verify the **D1** binding is named exactly `DB` and points to your current XENO database.
4. Verify the **R2 bucket** binding is named exactly `FILES` and points to your current bucket.
5. Preserve `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, and AI API secrets in Worker settings.
6. Deploy this updated complete source through your existing GitHub/Cloudflare workflow.
7. Reload XENO on iPhone, select **FILES**, and test list/upload/download/analyze.

**Note:** `wrangler.jsonc` in the original release does not contain the D1/R2 binding declarations. This release includes `wrangler.bindings.example.jsonc` for reference. Ensure your actual deployment configuration retains bindings; dashboard settings can be overwritten by deployment configuration.
