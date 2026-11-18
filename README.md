# XENO v1.4.0 — Expanded Verified Tool Library

Full replacement for the existing Cloudflare Worker/GitHub deployment. Based on v1.3.1; preserves chat, Cloudflare Access authentication, existing browser storage, adaptive workspaces, and diagnostics.

## Included

- 40 direct deterministic tools (15 new) and 41 AI-callable tool schemas (includes approval-only `propose_task`).
- New tools: circle_geometry, triangle_geometry, pythagorean_hypotenuse, density_calculator, momentum_calculator, potential_energy, electrical_energy, simple_interest, discount_price, break_even_units, weighted_average, percentile_calculator, grade_average, study_schedule, body_mass_index.
- Direct tool forms and AI tool registry updated.
- New fixtures in full diagnostics; local full run: 44 passed, 0 failed, 3 skipped (provider configured).

## Install

1. Back up your XENO conversations and workspaces before replacing files.
2. Unzip, upload the contents into the **root** of the existing `Koa7-arch/Xeno-ai-gateway` GitHub repository, preserving paths including `public/`.
3. Commit and wait for Cloudflare deployment. Keep existing Cloudflare secrets and Access configuration; do not upload credentials.
4. Hard refresh/reopen the iPhone PWA; header should show v1.4.0.
5. Run Diagnostics > Full Diagnostics. Export and share the report.

## Limitations

This is a **tool-library expansion**, not the completion of the entire 207-item capability roadmap. Web search, file processing, background jobs, external accounts, voice, and multimodal understanding still require separate working implementations and sometimes external providers. A green deterministic test does not certify live AI orchestration or mobile rendering.

No new paid services are required for these tools. Existing Groq API usage remains subject to provider limits and charges, if any.
