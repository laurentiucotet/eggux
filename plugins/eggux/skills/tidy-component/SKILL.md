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
Fill `CONFIG.docs` in `component-page.js` (next to this file). Write it from the description,
the guide and the code mapping, short and concrete:
- `summary`: one or two sentences, what it is for;
- `use` / `avoid`: 3-5 lines each; every "avoid" names what to use instead;
- `anatomy`: numbered parts in reading order (empty = the components it is built from);
- `rules`: content and behavior rules, the stress test findings included;
- `a11y`: keyboard, focus, screen reader, contrast;
- `code`: the code mapping line; `guides`: repo paths.
Variants, properties, slots, tokens and styles are read from the component; do not write them.
Set `status` (Draft, In review, Ready, Ready for dev) and `helpers`.

## 6. Lay out
Run `component-page.js` with `use_figma`. It creates or reuses the four sections, rebuilds the
Docs frame, moves the set, helpers, stress tests and examples in, sizes the sections and places
them in a row (120 apart; a new row goes 240 below the rest). Running it again only refreshes.
Sections left empty by the move (the old `Stress tests` section) are removed. Empty Stress test
or Examples sections get a note saying what is missing: fill it, do not leave the note.

## 7. Check
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
