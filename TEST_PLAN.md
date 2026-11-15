# XENO v1.2 Acceptance Test Plan

1. Verify Cloudflare deployment and `/health`; note that the backend version may remain older than the frontend because the gateway has not been upgraded.
2. Open Chat; confirm composer is visible, type a message and receive a response.
3. Run Finance → Overtime Pay with 60h and $15/hr; expect $1,050 gross at 40h threshold and 1.5x.
4. Run Finance → Savings Projection with $3,000 start, $500 per period, 12 periods; expect $9,000.
5. Run every direct tool and check a readable result, invalid-input handling, and no raw JSON by default.
6. Create two workspaces; switch focus; verify goals persist after refresh.
7. Create a local reminder and verify it triggers only on app open.
8. Export and import unified data and conversation backups separately.
9. Open Capabilities; search, filter, verify counts and statuses.
10. Copy and send the acceptance prompt; check tool traces and honesty about unavailable capabilities.
11. Confirm external integrations, background pushes, and file/media analysis are not falsely advertised as live.
12. Verify phone layout and navigation, including the chat composer after returning from Capabilities.

**Release gate:** This package is not fully verified until these checks pass on the deployed iPhone instance.
