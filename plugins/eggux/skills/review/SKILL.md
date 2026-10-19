---
name: review
description: Review screens, flows or a built UI against Nielsen's 10 usability heuristics, the EGG UX rules, the token system and the client's decisions and workflows. Use when the user asks for a UX review, audit, critique or feedback on a design, screenshot, Figma frame or implemented page, and as the final check after building UI.
---

# UX review

## Inputs
A Figma frame or file, screenshots, or a running page. Read the client's `eggux/` files when
they exist: the review checks the design against the actor's workflow, not in a vacuum.

## Checks, in order
1. **Workflow fit:** which actor and workflow step does this screen serve? Can the actor
   complete the step? Are there CTAs they are not permitted, or missing CTAs they need?
2. **Nielsen heuristics:** go through `references/heuristics.md` one by one.
3. **EGG UX rules:** `${CLAUDE_PLUGIN_ROOT}/skills/build-ui/ux-rules.md` and the patterns used.
4. **Decisions:** terminology from `eggux/decisions.md`; any "Don't use" term is a finding.
5. **Tokens (Figma or code):** raw hex, px or font values where a token exists; palette classes
   (`bg-blue-600`) instead of semantic ones; text not using a text style.
6. **Accessibility:** contrast, focus visibility, target size, labels, color-only meaning.

## Output
A table, most severe first:

| # | Severity | Where | Finding | Heuristic / rule | Fix |
|---|---|---|---|---|---|

Severity: **Critical** (blocks the task or excludes users), **Major** (causes errors or
significant friction), **Minor** (inconsistency, polish). End with the 1-3 changes that would
improve the screen most. Report only real findings; do not pad the list.
