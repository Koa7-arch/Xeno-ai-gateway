# XENO 3.2 — Workspace Actions + File Vault

This is an additive source release based on XENO 3.1, not a verified production-ready full assistant. No production deployment has been made.

## New working features
- Explicit chat commands to create projects, project tasks, life journal entries, and routines. These execute deterministic D1 writes and return the result. These commands do not infer vague requests and do not provide arbitrary AI tool execution.
- Private File Vault with upload/download/delete for PDF, Markdown, TXT, DOCX, JPEG, PNG, WebP, MP3, M4A, WAV and WebM files (10 MB per file). Stored in R2, indexed in D1. Recordings are uploaded and downloadable; transcription is **not** included.
- Generate basic Markdown, TXT, PDF, and Word DOCX files from text typed into the dashboard. PDF generator is single-page ASCII-oriented and truncates lengthy documents; DOCX is plain paragraphs, without advanced styling. Existing PDFs/DOCX are stored but not parsed by the AI.
- Chat can include contents of explicitly named TXT/MD files (up to 25 KB), with limits. Image understanding, OCR, PDF extraction, DOCX extraction, audio transcription, image generation and full document editing are **not** implemented.

## Cloudflare deployment
1. Keep a backup of the current working source and D1 data. Do not expose your secrets.
2. Apply `schema.sql` to the existing D1 database (only the new `files` table is needed for this upgrade; existing statements use IF NOT EXISTS).
3. In Cloudflare create an R2 bucket named `xeno-files`, if available for your account. **R2 availability and billing setup vary; verify pricing before enabling.** If you do not enable R2, the existing chat, memory and project features still work, but `/api/files` reports a configuration error.
4. Bind the bucket to the Worker as `FILES` (case-sensitive); keep existing `DB`, `ASSETS`, `ACCESS_TEAM_DOMAIN`, `ACCESS_AUD`, `GROQ_API_KEY` and any Gemini configuration. `wrangler-r2.example.jsonc` is a template; substitute your existing database ID, and don't blindly replace your production config.
5. Upload the complete package with folder structure intact. Ensure your GitHub-to-Cloudflare build entry is `src/index.js` and static assets directory is `public`.
6. Check `/health`, Memory, Projects, File Vault, upload/download and chat. Test on iPhone before relying on the release.

## Examples of supported chat commands
- `create physical project named Ranch House`
- `create digital project named XENO`
- `add task Draft floor plan to project Ranch House`
- `log work entry: Completed a safety inspection today`
- `create routine Review project progress every Sunday`

## Important safety and limits
- Cloudflare Access and same-origin checks remain required. No external actions or autonomous scheduling are introduced.
- R2 file objects are accessible only via authenticated Worker routes, not public bucket URLs. The app is intended for a single trusted user; it does not implement per-user database tenancy or independent role-based access.
- Browser file downloads may require Safari permissions. Audio files are stored, not processed or transcribed. The assistant does not automatically ingest or interpret images, PDFs, Word docs, or recordings.
- Uploaded file content is untrusted and must never be treated as executable instructions.
- No production deployment or live provider validation was performed by this package build.
