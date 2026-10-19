---
name: decision-log
description: Record a project decision or terminology change (for example "the Demo button is now called Request Access") in the client's decisions.md and propagate it to existing designs and code. Use whenever the user reports something decided in a meeting, a renamed label, a changed rule, or asks to apply decisions to screens.
---

# Decision log (rulebook)

Every content or behavior decision goes into `eggux/decisions.md` first, then into designs and
code. The reverse order is how projects drift.

## Record
1. Classify it:
   - **Terminology:** a word or label to use or avoid → Terminology table (Use / Don't use / Context).
   - **Rule:** a behavior or design decision → Decision log entry.
2. Add a dated entry, newest first: date, decision, reason, source (meeting, person, ticket).
   If it reverses an earlier entry, reference it ("replaces 2026-09-02").
3. Keep entries one or two lines.

## Propagate (when the user asks, or right after recording)
1. **Figma:** search the client file for old text. Prefer updating the component or the String
   variable that holds it, so instances follow. Report each changed node.
2. **Code:** search the codebase for the old string and update the copy source (i18n or copy
   file). If strings are hardcoded in components, list them and suggest moving them to a copy file.
3. Report what changed, and anything you could not update automatically.

## Reading decisions
Before building or reviewing any screen, read the Terminology table and recent decisions.
Using a "Don't use" term in new work is a defect.
