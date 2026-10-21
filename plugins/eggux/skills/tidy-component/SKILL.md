---
name: tidy-component
description: Clean up a component and lay out its page in the standard structure, one row per component, left to right - Docs (generated doc frame), Component (the set and its helpers), Stress test, Examples (the component in real screens). Polishes the component first (tokens, clip, names, description), builds what is missing (stress test, contextual examples), then runs the layout script. Use when the user asks to clean up, tidy, organize or document a component or a component page ("fa cleanup pe componenta", "pune pagina in structura", "/tidy-component"), shares a link to a component page that is messy, or at the end of new-component and update-component.
---

# Tidy component

Every component page reads the same way, left to right, one row per component:

| Section | Holds | Built by |
|---|---|---|
| `<Name> / Docs` | `Docs / <Name>`: summary, when to use and not, anatomy, variants, properties, slots, content and behavior rules, accessibility, tokens and styles, code and guides | `component-page.js` from the component and `CONFIG.docs` |
| `<Name> / Component` | The component set, then its helper components (parts only it uses) | moved in by the script |
| `<Name> / Stress test` | `Stress test / <Name>` frames | `references/stress-test.md`, then moved in |
| `<Name> / Examples` | `Example / …` frames: the component in real screens, 2 per row | built here, then moved in |

Rows stack top to bottom, in A-Z order of the main components unless the page has an obvious
reading order (Menu before Menubar). A page with one component has one row.

Read first:
- `${CLAUDE_PLUGIN_ROOT}/references/figma-library.md`, `figma-api-notes.md`, `stress-test.md`
- the component's guide in `${CLAUDE_PLUGIN_ROOT}/skills/build-ui/` and its row in
  `references/code-mapping.md`, `references/components/<page>.md`
- the Figma `figma-use` skill

## 1. Find the component
From the link (node id) or the current selection; go up to the component set. List the other
components on the page and decide which are helpers of this one (used only inside it, like
`Menubar Trigger` for `Menubar`) and which get their own row.

## 2. Clean up
Run `skills/audit-tokens/scan-components.js` on the set and fix what it finds, as in
update-component step 4:
- raw colors, spacing and radius bound to tokens; text on text styles;
- clip content off except where cropping is the point (focus ring, image crop, scroll area,
  viewer); clipping slots off;
- layer names that say what the part is; no hidden layers bound to nothing;
- text bound to TEXT properties, on/off parts to BOOLEAN properties, content areas as slots;
- the description: when to use, content rules from the stress test, one line on code. Write it
  whole; never append to `node.description` (it reads back escaped).
Never change the design itself here; propose design changes and wait.

## 3. Stress test
`Stress test / <Name>` exists and uses the current variants: keep it and screenshot it. It does
not exist or misses cases: build it from `references/stress-test.md`. Every break becomes a rule
in the component and in `CONFIG.docs.rules`.

## 4. Contextual examples
2 to 4 frames named `Example / <what it shows>` that put the component where it lives:
- inside a page shell or block (`Page Shell / App`, `/ Marketing`, `/ Mobile`, blocks), at its
  real position and size (a banner at the bottom of the viewport, a card in a corner, a dialog
  over a dimmed page with `dialog/overlay`, a field inside a form);
- desktop 1440 × 900 and, when the component is used on phones, mobile 390 × 844;
- viewport frames clip on purpose (they are screens); the component inside keeps its own rules;
- realistic, domain-neutral content (Acme, invoices, EUR); open states where the component has
  them.
Keep existing examples that still use the component; remove ones that show an old variant.

## 5. Docs content
The Docs frame is built from `docs.json` (next to this file, keyed by main component name) and
from the component itself. Add or edit the entry before running:
- `summary`: one or two sentences, what it is for;
- `use` / `avoid`: 3-5 lines each; every "avoid" names what to use instead;
- `anatomy`: parts in reading order, no numbers (empty = the components it is built from);
- `rules`: content and behavior rules, the stress test findings included;
- `a11y`: keyboard, focus, screen reader, contrast;
- `code`: the code mapping line; `guides`: plugin-relative paths of the guides.
Variants, properties, slots, parts (helpers), tokens and styles are read from the component; do
not write them. `rows.json` holds each page's rows: `main`, `helpers` (parts shown in the same
row and documented under Parts) and `block` (id of the smallest block or shell that uses the
component, for a generated example). Add a row when a component is added to a page.

## 6. Lay out
`python3 skills/tidy-component/jobs.py "<Page>" ["<Page>" ...]` prints `component-page.js` with
the pages filled in; run it with `use_figma`. Keep a call under ~45 KB and ~14 rows. For many
pages, store the script body in a hidden text node once and run it with
`new AsyncFunction('figma', 'JOBS', node.characters)`, sending only JOBS per call; delete the node
after. The script:
- creates or reuses the four sections per row and stacks the rows in `rows.json` order;
- rebuilds the Docs frame; moves the main component and its helpers in (labels next to a
  component move with it, in a "<Name> with labels" frame);
- assigns every existing `Stress test /`, `Example /`, `Examples /` and `Template /` frame to the
  row whose components it uses most (top-level instances; ties go to the row with fewer
  frames); force one with `examples` in `rows.json`;
- generates a basic stress test where none exists (default, long and short text, options on and
  off, narrow, each variant, Dark), marked "Generated cases"; generated frames are rebuilt on
  every run, so replace them with real cases when you review;
- generates "Example / in <block>" from `block` where no example exists;
- removes sections left empty and leaves a note in any Stress test or Examples section that is
  still empty: fill it, do not leave the note.
Components without a block or example get a hand-built one: the App or Marketing page shell
with the component in its Page slot (Page Header titled for the context), over `dialog/overlay`
for dialogs, in the corner for toasts, at its real anchor for menus and popovers.

## 7. Check
0. The result's `overflow` list is empty. The script sets stress test and example frames whose
   content runs past their edge back to hug, then re-checks every section; a name in `overflow`
   is a frame that still clips its content or a section smaller than what it holds. Fix it
   before the screenshots: a frame built with `resize()` stays FIXED on both axes.
   Example screens that clip on purpose (a 1440 × 900 viewport named `Example /`) and GRID
   frames are left as they are.
1. Screenshot the Docs frame (scale 0.5) and each section; read the doc for wrong or vague
   lines and for leftovers from another domain.
2. Run the scan again on the set: zero findings except intended clipping.
3. Dark: a temporary frame with explicit Dark modes and one instance per variant; remove it.
4. `component-docs.js` still finds the component and lists the stress test and examples (it
   searches the whole page).

## 8. Records
- Master library: regenerate `references/components/` for the page
  (`scripts/component-docs.*`); update the guide when the docs content added rules; `CHANGELOG.md`
  for the release.
- Client file: `eggux/components/<name>.md` gets the same rules; a decision when a rule is a
  product choice.

End with what was cleaned, what was built (stress test, examples), screenshots of the row, and
anything proposed but not applied.
