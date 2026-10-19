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
4. **Decisions:** every entry in `eggux/decisions.md` that is approved, applied or verified and
   whose scope covers the screen: terminology ("Don't use" terms), design values (the decided
   token, no overrides), component and behavior choices. Each violation is a finding that cites
   the decision ID. Unprocessed Inbox lines are listed as "not yet decided", not as findings.
5. **Tokens (Figma or code):** raw hex, px or font values where a token exists; palette classes
   (`bg-blue-600`) instead of semantic ones; text not using a text style. When the theme itself
   is in question, run `/eggux:audit-tokens`.
6. **Accessibility:** contrast, focus visibility, target size, labels, color-only meaning.
   Charts: legend for 2+ series, table view, no dual axis (`components/charts.md`).
7. **Responsive and density:** the screen at the widths the actor uses (`patterns/mobile.md`);
   Density Compact never on touch screens.
8. **Library use (Figma):** detached instances where a slot or property would do; plain Inputs
   where a Field Preset exists (email, phone, card, address); layouts rebuilt by hand where a
   Block or Page Shell exists (`build-ui/index.md` maps screens to shells and blocks); library
   default copy ("Acme", "Website redesign") left in a client design. `scan-components.js`
   from `/eggux:audit-tokens` finds raw values and broken slots.

## Output
A table, most severe first:

| # | Severity | Where | Finding | Heuristic / rule | Fix |
|---|---|---|---|---|---|

Severity: **Critical** (blocks the task or excludes users), **Major** (causes errors or
significant friction), **Minor** (inconsistency, polish). End with the 1-3 changes that would
improve the screen most. Report only real findings; do not pad the list.
