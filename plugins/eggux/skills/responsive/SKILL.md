---
name: responsive
description: Make a component, block or helper resize correctly at every width it lives in. Defines its resize contract (which part fills, hugs or stays fixed, min and max widths, truncation, wrapping, stacking below a breakpoint), measures the stress test with check.js, fixes the breaks with standard recipes, re-checks until clean and writes the rules into the docs. Use inside new-component, update-component and tidy-component before review, when a stress test shows squeezed, clipped or overflowing text ("textul nu incape", "la latimi mici se strica", "/responsive"), or to audit a whole library page by page.
---

# Responsive

A component is done when it works at every width a designer will drop it into: the column
widths of the 1152 container (276, 368, 564, full), the mobile width (360 to 390) and the
narrowest container it lives in (sidebar 280, panel 400). Figma ignores sizes set inside an
instance, so the component itself must carry the behavior.

## When it runs
- `new-component` and `update-component`: after the stress test is built, before review.
- `tidy-component`: after the page layout, on the generated or real stress test.
- `review`: when a screen shows clipped, squeezed or overflowing text.
- Library audit: `check.js` page by page, then fix the worst components first.

## 1. Write the resize contract
For each auto-layout row and column in the component, decide and write down:

| Part | Choice |
|---|---|
| Main text column (title, name, description) | FILL, `minWidth` 120 to 160, text FILL + auto height, `maxLines` 1 or 2 with ellipsis for titles |
| Secondary text (meta, dates, helper) | FILL or HUG with `maxWidth`, `maxLines` 1 with ellipsis; drops to its own line when narrow |
| Values that must not break (amounts, ids, codes, dates) | HUG, never wrap; truncate in the middle for long ids, or move to a second line |
| Badges, chips, pills | HUG with `maxWidth`, label truncates with ellipsis |
| Controls (buttons, icon buttons, switches, checkboxes, menus) | HUG, fixed size, never shrink |
| Icons, avatars, thumbnails | Fixed size; images FILL with a ratio, min and max width |
| Groups of trailing items | Wrap (`layoutWrap = 'WRAP'` with row gap) or move under the main column below a breakpoint |

Some components have a real minimum (a calendar, a comparison table, a data grid toolbar, a
chart with a legend): set `minWidth` on every variant of the component instead of squeezing it.
The tidy script then tests it at `Min width (N)` and skips narrower cells, and the doc says where
it fits ("needs at least 320; in a 1/4 column use the compact variant").

Then pick the narrow behavior: shrink (truncate), wrap (trailing items drop to a new line) or
stack (a `Layout=stacked` or `Size=compact` variant for widths under about 400). Rows in tables
and lists usually truncate; cards wrap; headers and toolbars stack or hide secondary actions.

## 2. Measure
1. Make sure the stress test has the width cells: 276, 368, 564, full and the narrowest
   container, each with the long text case (see `references/stress-test.md`; the tidy script
   generates `Column 1/4 (276)`, `1/3 (368)`, `1/2 (564)` cells).
2. Run `check.js` (this folder) through `use_figma` with `PAGES` set to the component's page (or
   `ROOTS` set to the stress frame id). It reports per component:
   - `squeezed`: text with fewer than 6 characters per line (one-letter columns);
   - `runaway`: text over 6 lines with no line limit;
   - `overflow`: text running past the component;
   - `clipped`: text cut by a clipping parent;
   - `tall`: an instance more than 2.5 times the component's height at a narrower width.
3. Look at the screenshots too: the script finds geometry, not intent (a deliberate 3-line
   description is fine; a title on 3 lines usually is not).

## 3. Fix (recipes)
| Break | Fix in the main component |
|---|---|
| Squeezed text column | Text column FILL with `minWidth`; siblings that cannot shrink are HUG; give the long sibling (badge, id) a `maxWidth` and truncation; below the breakpoint wrap the trailing group or add `Layout=stacked` |
| Runaway text | `maxLines` (1 for titles and meta, 2 to 3 for descriptions) with `textTruncation = 'ENDING'`; full text goes in a tooltip or the detail view |
| Overflow past the component | A child with fixed width or `WIDTH_AND_HEIGHT` text inside a FILL parent: set text to FILL + auto height, or HUG with `maxWidth` and truncation |
| Clipped text | The clipping frame has a fixed height: let it hug, or truncate the text inside it |
| Tall instance | Usually squeezed text; fix that first. If the component must be tall at narrow widths, add the stacked variant and use it there |
| Fixed inner size | The part FILLs with min and max width, or a `Size` variant covers the narrow case |

Plugin API notes: set `layoutSizingHorizontal` after the node is in its auto-layout parent;
`minWidth` and `maxWidth` work on frames and text in auto layout; `textTruncation = 'ENDING'`
needs `maxLines` or a fixed height; `layoutWrap = 'WRAP'` needs `counterAxisSpacing`; changing
a variant's structure can reset instance overrides, so check a few instances in blocks and
screens after every fix.

## 4. Re-check and record
- Run `check.js` again until the component reports nothing (or only deliberate cases you can
  name), and screenshot the width cells.
- Write the contract into the component's doc entry (`skills/tidy-component/docs.json`, rules):
  "Below 400 the meta line moves under the title", "Title: 1 line with ellipsis", "Key: middle
  truncation, full key on copy".
- Code: map the contract to the code mapping row: `min-w-0` on the flex child that shrinks,
  `truncate` or `line-clamp-2`, `shrink-0` on icons and controls, `flex-wrap` on trailing
  groups, a container query (`@container`, `@max-sm:flex-col`) for the stacked layout.

## Library audit
Run `check.js` with 3 to 6 pages per call over the component pages (and block pages for blocks
in stress frames). Sort by count; fix the components that appear in blocks and screens first,
then the rest. Keep within the Figma call limits (about 10 per minute, 200 per day).
