---
name: decision-log
description: Record, apply and verify client decisions in eggux/decisions.md - renamed labels, design changes (padding, spacing, radius, colors, sizes, density), component choices, behavior rules, terminology. Use when the user reports something the client or a manager decided ("cards should have 12 px padding instead of 24", "the Demo button is now Request Access"), when there are lines in the Inbox of decisions.md, when asked to apply decisions, or when asked whether the work follows the decisions.
---

# Decision log (rulebook)

Every decision goes into `eggux/decisions.md` first, then into Figma and code, then gets
verified. The reverse order is how projects drift. Format: `skills/init/templates/decisions.md`;
precedence: `references/project-files.md`.

## 1. Record
Read the whole file first. Take each request from the chat or from the Inbox, oldest first.

1. **Classify:** terminology | design (spacing, padding, radius, color, size, type, density) |
   component (which component or variant to use, structure) | behavior | content | process.
2. **Make it exact.** Name the element, the current value with its token and the new one:
   "Card padding 24 px (`spacing/6`) → 12 px (`spacing/3`)". Name the scope: everywhere, a
   component, some screens. If the target or scope is ambiguous, ask one question and record
   the decision as `proposed` until answered.
3. **Check conflicts:**
   - With earlier decisions: the new one replaces them; mark the old one
     `superseded by D-xxx` and write `Replaces: D-xxx` on the new one.
   - With `ux-rules.md` and accessibility (text under 4.5:1, controls under 3:1, targets under
     44 px on touch, text under 12 px, color as the only signal): record it, flag the risk in
     the entry and to the user, and apply only after the user confirms.
4. **Write the entry** at the top of Decisions with the next ID, keeping the date and time of
   the Inbox line (or now) and who asked:

```
### D-007 · 2026-10-21 09:15 · Cards use 12 px padding
- Type: design
- Decision: Card padding 24 px (spacing/6) → 12 px (spacing/3), header, content and footer.
- Scope: Card and everything built on it (Stat Card, blocks); all screens.
- Reason: denser dashboards. Source: Andrei (manager), 2026-10-21 09:15.
- Implementation: Density token density/card-padding → spacing/3 (Comfortable), bound in
  Card, Stat Card; code: var(--card-padding) = 12px.
- Verify: Card paddings bound to density/card-padding; no instance overrides; no p-6 / px-6 /
  py-6 in the Card component code.
- Status: approved
```

5. Remove the processed line from the Inbox and update `updated:` in the frontmatter.

## 2. Apply (right after recording, unless the user says to wait)
Work in the client's Figma file and codebase, never in the master library.
- **Terminology:** update the `Content` variable that holds the text (`action/*`, `status/*`,
  `references/content.md`) or the component, so instances follow; in code, the copy source (i18n or copy file). List hardcoded strings.
- **Design:** change it once at the source, never instance by instance.
  - One component: create a Components token `<component>/<property>` aliased to the new value
    (`tokens.md` § Components) and bind every place of that component that used the old token
    (Card: paddingTop/Bottom on Card, paddingLeft/Right on Header, Content, Footer).
  - Everywhere (all corners, the primary color, density): re-alias the Semantic token or switch
    the mode; run `/eggux:audit-tokens` after color changes.
  - Code: the CSS variable in the theme file, or the classes in the shadcn component file
    (`components/ui/card.tsx`), not in every screen.
- **Component or behavior:** update the component or block in the client file and the code
  component; list screens that need a manual change.
- Set `Status: applied <date>` and list what changed (node names, files) in the chat.

## 3. Verify
Run it when asked ("does the work follow the decisions?"), after `/eggux:build-ui`, and as part of
`/eggux:review`. For every decision with status approved, applied or verified (skip superseded):
- **Terminology:** search the Figma file texts and the code for each "Don't use" term.
- **Design:** read the component in Figma and check the bindings named in Verify; scan the
  pages for instances that override them (`scan-components.js`, plus a check of the property
  values against the token); in code, grep for the old classes or values in the scope.
- **Component, behavior, content:** check the screens or flows in the scope.

Report:

| ID | Decision | Checked | Result | Details |
|---|---|---|---|---|

Result is OK or the number of violations with where they are. Mark `verified <date>` when all
checks pass; otherwise keep `applied` and fix or list the violations.

## Reading decisions
Before building or reviewing anything, read the whole file. A "Don't use" term, a superseded
value or any violation of an applied decision in new work is a defect. The plugin's SessionStart
hook reminds Claude when the project has a decisions file and lists new Inbox lines.
