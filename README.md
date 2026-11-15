# XENO v0.9.1 — Category Tool UI Fix (Full Replacement)

Fixes v0.9 tools being relegated to a JSON tester. The AI tools now appear as runnable input forms inside Organization, Work & Field, Finance, Learning, Projects, Health & Fitness, and Creative. Integrations remains explicitly unconnected.

## Install
1. Back up XENO conversations. Do not clear browser/PWA data.
2. Replace repository files with all files in this ZIP, preserving paths.
3. Commit and allow Cloudflare to deploy.
4. Close/reopen the iPhone PWA and confirm version 0.9.1.
5. Go to Tools, tap Finance, expand Overtime Pay, run 60 hours at $15, threshold 40, multiplier 1.5. Expected grossPay: 1050.

The forms call the existing authenticated /tools/run endpoint. No external service connections or autonomous actions are added. Task proposals still require approval. Existing tools and profile/local conversations are preserved. Some tools appear in multiple relevant categories; they are the same backend operation.
