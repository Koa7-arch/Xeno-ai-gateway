# XENO 3.3 — File Understanding (first integration)

Adds authenticated, user-initiated file analysis through Gemini multimodal API. Use the File Vault **Analyze** button after uploading a file. This is a development release, not a claim of complete file understanding.

## Supported analysis
- PDF documents (including scanned pages where the provider can interpret them)
- PNG, JPEG, WebP pictures
- MP3, M4A, WAV, WebM recordings (provider compatibility may vary)
- Markdown and plain text
- Ask specific questions, request summaries, and extract details from supported files. Responses appear in the File Vault panel and are not automatically saved.

## Limitations
- Existing DOCX files are still storage-only. They are **not** analyzed by this release.
- No guaranteed page-perfect extraction, reliable transcription, image editing, generated image files, or citations with independently verified page coordinates.
- File uploads are capped at 10 MB, direct analysis at 7 MB, and provider-specific limits may be lower. Large PDFs and long recordings need chunked processing in a future release.
- Requires a configured `GEMINI_API_KEY` secret, an enabled model with multimodal input, existing `DB` D1 and `FILES` R2 bindings. Gemini availability, pricing, free-tier quotas, and permitted data processing depend on the provider and account.
- Files are sent to the Gemini provider when you press Analyze; don't submit sensitive documents unless you accept the provider's data terms.
- No automatic memory or project changes. Uploaded file contents are treated as untrusted data.

## Deployment
Keep existing Cloudflare Access, `DB`, `FILES`, `ASSETS`, and AI secrets. No schema changes required from 3.2. Upload complete directory structure to the existing repository and deploy only after backing up the working release. Test with a non-sensitive sample PDF/image/audio and compare results against the original file. Roll back if chat or vault regresses.

## Verification
Run `npm test` and `npm run check`. Live Gemini, Cloudflare, iPhone, and real-file tests remain necessary.
