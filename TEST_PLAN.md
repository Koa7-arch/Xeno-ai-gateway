# XENO v1.3.1 Acceptance Test

1. Verify the header reads v1.3.1 and normal chat input still works.
2. Open Diagnostics from navigation. Run Quick Check, Full Diagnostics, and Regression Check.
3. Confirm results have pass/fail/skip/blocked counts and expandable individual checks.
4. Export a JSON report. It should contain only fixture results, tool IDs, timestamps, version, and nonsecret status notes.
5. Copy Summary and paste into chat if file upload is inconvenient.
6. Confirm tools, conversations, workspaces, and profiles still appear as before.
7. If diagnostics cannot run, send the exact visible error and deployed version.

Expected local baseline (with Groq secret configured): Quick 7 pass; Full/Regression 29 pass and 3 skip. Provider configuration absent changes one pass to blocked. Actual deployment results may differ. The skip count includes live AI chat, external integrations, and background automations.
