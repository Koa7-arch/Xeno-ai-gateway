# XENO 3.5 — Project Command Center

## What's included
- **Hybrid dashboard:** one master project overview, with isolated project-specific workspaces. Open `project-center.html` via the PROJECTS section.
- **Persistent project knowledge:** notes, decisions, specifications, research, revisions, and build logs stored in D1.
- **Nested project tasks:** parent-child relationships, phases, priority, task status, cycle detection, and an activity history.
- **Project files:** link and unlink existing private File Vault uploads; no duplication of R2 file bytes.
- **Project-specific AI:** the selected project's description, notes, task summaries and file names are included as explicitly labeled *untrusted reference data* in the existing `/chat` endpoint. No cross-project content is intentionally added by this explicit context mechanism, though legacy general memory/workspace retrieval still operates.
- **Project tools:** shared task/knowledge/file APIs for software, construction, work, learning and creative projects. No actual CAD engine, GitHub write integration, engineering certification, or automated external actions.

## Upgrade from 3.4
1. Back up your existing GitHub source and Cloudflare D1 database.
2. Run only the **XENO 3.5 additive migration** at the end of `schema.sql` in your existing D1 database. Do not delete earlier tables.
3. Upload the complete package to the same existing GitHub repo, preserving directories; your Worker should continue to deploy from GitHub.
4. Retain Cloudflare Access, `DB`, `FILES`, `GROQ_API_KEY`, and optionally `GEMINI_API_KEY`, plus the existing ASSETS binding.
5. Open the Project Command Center from PROJECTS. Create a project, note, nested task, and attach an existing file. Test project AI with a question referencing a saved decision.
6. Run `npm run check` and `npm test` before deployment; verify the new endpoints against the actual Cloudflare Worker after deploying.

## Security and limitations
- All new `/api/project-center` endpoints are behind the existing Cloudflare Access verification; write methods require same-origin requests.
- The UI uses `textContent` rather than rendering user notes as HTML.
- AI context is bounded to recent project notes/tasks, not a complete retrieval system. **The existing generic memory and workspace retrieval can still surface other records**; strict cross-project isolation is not implemented.
- No background agent, scheduled actions, push notifications, actual external integrations, or autonomous file editing.
- File Vault currently caps uploads at 10 MB, analysis at 7 MB.
- `project_task_tree` metadata is separate from legacy project items; preexisting tasks appear as top-level until assigned parents.
- AI collaborator answers are not persisted as project decisions automatically; save verified decisions in the Knowledge tab.
- This is a local-tested development build, not a live deployment or a verified production release.
