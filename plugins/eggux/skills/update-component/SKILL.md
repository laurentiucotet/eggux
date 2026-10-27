---
name: update-component
description: After someone edits a component by hand in Figma, find what changed, play it back, polish it (tokens, all variants, properties, layout), check conflicts with decisions and UX rules, see which instances it affects, re-run the stress test, review, and after approval update the doc, snapshot and records. Use when the user says they changed, edited, tweaked or redesigned a component, block or preset ("I changed the card, polish it", "check what I did to the button", "/update-component"), or shares a link to a component they edited.
---

# Update component

From a manual edit to a polished, tested, documented component. The person's change is the
intent: polish it and test it, never undo it silently.
Statuses: edited → in review → approved → ready for dev.

Read first:
- `${CLAUDE_PLUGIN_ROOT}/references/figma-library.md`, `figma-api-notes.md`, `tokens.md`,
  `stress-test.md`
- `${CLAUDE_PLUGIN_ROOT}/skills/build-ui/ux-rules.md`
- the component doc: `eggux/components/<name>.md` (client) or
  `${CLAUDE_PLUGIN_ROOT}/skills/build-ui/components/<name>.md` (library), when it exists
- the client's `eggux/decisions.md`
- the Figma `figma-use` skill

## 1. Find the component
- From the link (node id), or from the current selection (`figma.currentPage.selection`) when
  there is no link. Go up to the component set. Ask for the link only when both are missing.
- Client file or master library (`BufvaVkSh9vMWPye117Ucd`): this decides where the records go.

## 2. Find what changed
Run `snapshot.js` (next to this file) with `ROOT` set to the component set. Compare against the
first baseline that exists:
1. The saved snapshot: `eggux/components/<name>.snapshot.json` (client) or
   `skills/build-ui/components/<name>.snapshot.json` (library). Paste its `flat` as `BASELINE`;
   for large sets, compare a few variants at a time with `ONLY`.
2. Client file without a snapshot: the same component in the master library. Snapshot both and
   compare; ignore brand values (the Semantic variable names are the same, their values differ).
3. Neither: the component doc and what the person says they changed. Say that no exact diff
   was possible, and save a snapshot at the end so the next update has one.

Also look for signs of hand editing the diff may not name:
- raw values (`scan-components.js`), text without a style;
- a change made in one variant only. Compare sibling variants: a value that differs in one
  `State` or `Size` where the others agree is usually an edit not carried over;
- detached copies of components (frames named like components), hidden layers bound to no
  property, absolute positioning, fixed sizes where the rest hugs;
- renamed or removed properties and variants. These break overrides in every instance.

## 3. Play it back
Group the changes: layout and spacing, color, type, structure (layers added or removed),
properties and variants, content and description. For each group, say the intent you read
("cards are denser: padding 24 → 12 in every size"). Ask at most 3 questions, only where the
intent is unclear: should other sizes follow, is the new color for every state, is the removed
property still used. Use AskUserQuestion with options when available.

## 4. Polish
Apply directly what is mechanical and follows the intent, then list it:
- Bind raw values to the token with the same value (Components, then Semantic, spacing,
  radius). No exact token: propose the nearest one, or a new `Components` token as in
  new-component; do not pick silently.
- Carry the change to the sibling variants where the intent clearly covers them (all states of
  the edited size). Ask before changing other sizes or variants.
- Text on text styles; text bound to TEXT properties; on/off parts bound to BOOLEAN properties;
  content areas as native slots (clipsContent off).
- Auto layout: hug where the rest hugs, fill inside cards and blocks, no stray absolute
  positioning; focus variants keep `clipsContent` on for the ring.
- Layer names that describe the part; delete hidden layers bound to nothing.
- Update the component description when the rules changed.

Propose instead of applying anything that is a design choice: another color, size or
structure than the person made.

## 5. Check conflicts
- `decisions.md`: a change that contradicts a decision is flagged with both options: update the
  decision (`/eggux:decision-log`) or bring the component back in line. A change that sets a
  rule for the product (card padding 12 instead of 24) becomes a proposed decision.
- `ux-rules.md` and accessibility: contrast in all four color modes when colors changed (run
  `/eggux:audit-tokens`), touch targets of 44 px on mobile, visible focus, text that still
  carries meaning without color.
- Breaking changes: a renamed or removed property, variant or slot resets overrides in its
  instances. Prefer keeping the old name. If it must go, list every affected instance.

## 6. Impact
- `getInstancesAsync()` on each variant: count the instances and group them by page and top
  frame (blocks, examples, other components, client screens).
- Screenshot the 2-3 places most affected: narrow containers, long content, overrides.
- Fix breaks caused by the change in blocks and examples; list breaks in client screens for
  the person to confirm.

## 7. Stress test
- `Stress test / <Component>` exists: its instances updated already; screenshot it and look.
- It does not: build it from `references/stress-test.md`.
- Focus on what the change touches: less padding → longest text, narrowest width; a new part →
  the case where its data is missing; a new color → Dark and Corporate.
- Every break becomes a content rule in the component (truncation, "+N", min or max width) and
  in the doc. Repeat until every case passes.

## 8. Check
1. `scan-components.js` on the set: zero raw values, unstyled text, clipping slots, empty
   icons or broken slots.
2. Light, Dark, Corporate Light and Compact in a temporary frame; remove it after.
3. Screenshot the set, the example and the stress test.
4. Widths: run `/eggux:responsive` (`check.js` on the stress frame) and fix what it reports.

## 9. Review (status: in review)
Show, short:
- what you found changed (the diff in plain words, grouped as in step 3);
- the polish you applied, and what you propose but did not apply;
- conflicts and breaking changes, with the choice to make;
- the impact (instances, places that changed) and the stress test result;
- screenshots: the set after, the stress test, one affected place.
Iterate on feedback; every change re-runs steps 4 to 8 for what it touches.

## 10. After approval (status: approved → ready for dev)

| Where | Client component | Master library component |
|---|---|---|
| Figma | Component description; stress test frame updated | Same, in the master file |
| Doc | `eggux/components/<name>.md`: the changed sections, a Changelog line (date, what changed, why) | `skills/build-ui/components/<name>.md`, same |
| Snapshot | `snapshot.js` output (`flat`) saved to `eggux/components/<name>.snapshot.json`, replacing the old one | `skills/build-ui/components/<name>.snapshot.json` |
| Records | A decision in `eggux/decisions.md` when the change sets a rule or changes the product's look | `CHANGELOG.md`, `figma-library.md` row when properties or variants changed, `code-mapping.md` when props changed, regenerate `references/components/` (`scripts/component-docs.*`), version bump, `claude plugin validate .`, commit |
| Code (when the project has one) | Props and styles updated; renamed or removed props listed as breaking; stories for the stress cases | Code mapping only |

- Update the component's entry in `skills/tidy-component/docs.json` (rules, anatomy) and re-run
  `component-page.js` for its page through `jobs.py`: it rebuilds the Docs frame from the new
  properties and keeps the row in order.
- Mark the section Ready for dev again (Dev Mode); if the API refuses, tell the person.
- A client change that would help every project: propose it for the master library.
- New Plugin API trap learned: one line in `references/figma-api-notes.md`.

End with the status, the changes found, the polish applied, decisions proposed, the impact,
the stress test result, and where the doc and snapshot are.
