# XENO v1.4.0 test plan

1. Confirm header says v1.4.0, login and chat still work.
2. Diagnostics > Full Diagnostics. Expect **44 PASS, 0 FAIL, 3 SKIP, 0 BLOCKED** when Groq is configured. Different results should be exported and investigated.
3. Tools > Engineering > circle_geometry, radius 2: area approximately 12.5663706144.
4. Tools > Finance > discount_price, 100 / 20% / 5%: final price 84.
5. Chat: 'Calculate a 3-4-5 right triangle using a tool and explain the result in plain English.' Expected hypotenuse 5, without tool-call JSON.
6. Confirm conversations, workspaces, and backup still function.

Diagnostics use read-only fixtures and do not modify personal data. The three skipped checks are live chat/typography, external integrations, and cloud background automation.
