# XENO 3.4 — Multimodal Chat Expansion

## Added
- MP4 and MOV uploads to the existing private R2 File Vault (10 MB upload cap).
- User-triggered Gemini analysis of MP4/MOV, MP3/M4A/WAV, PDF, PNG/JPEG/WebP, Markdown/TXT (7 MB analysis cap). Video model compatibility and quality vary.
- Explicit chat commands such as `analyze file demo.mp4: Describe the sequence of events`, `transcribe interview.m4a`, `summarize report.pdf`, `review photo.jpeg: What needs repair?`. The file must first be uploaded and its name must match exactly.
- File analysis stays read-only: no automatic memory, project, or external actions.

## Deployment
1. Back up the working GitHub version and D1 database.
2. Upload the package contents to the existing GitHub repo, preserving directories.
3. Keep existing Cloudflare Access, D1 binding `DB`, R2 binding `FILES`, assets binding, and `GEMINI_API_KEY` secret.
4. No schema migration is required from 3.3.
5. Run `npm test` and `npm run check` locally or in CI; then test actual files in production.

## Limitations and safety
- Direct video analysis is limited to **7 MB** and may fail depending on Gemini model/format. Large video, frame extraction, audio extraction, accurate timecoded scene detection, and asynchronous chunked processing are **not implemented**.
- The 10 MB upload cap remains; the app does not process arbitrarily large files.
- AI-generated output is fallible. Check engineering dimensions, safety claims, and transcript details against originals.
- File bytes are transmitted to Gemini only when analysis is explicitly requested. File content is untrusted reference data.
- This is a development candidate, not a claim of production deployment or fully verified multimodal comprehension.
