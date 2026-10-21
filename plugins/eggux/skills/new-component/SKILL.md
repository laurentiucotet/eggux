---
name: new-component
description: Create a new component, field preset, block or page shell from a screenshot or a description, reusing what exists in EGG UI, with a proposal, a stress test (min, typical, max content, counts, missing data, states, themes, widths), review and approval, then the docs and records that stay. Use when the user shares a screenshot or describes a component to build ("a product card with tags", "make this", "new component"), or asks to extend an existing component, block or page template in the library or a client file.
---

# New component

From a screenshot or a description to an approved, stress-tested, documented component.
Statuses: proposed → in review → approved → ready for dev.

Read first:
- `${CLAUDE_PLUGIN_ROOT}/references/figma-library.md` (what exists, conventions, slots, layers)
- `${CLAUDE_PLUGIN_ROOT}/references/figma-api-notes.md` (Plugin API pitfalls)
- `${CLAUDE_PLUGIN_ROOT}/references/tokens.md` and `${CLAUDE_PLUGIN_ROOT}/references/stress-test.md`
- the client's `eggux/decisions.md`, `objects.md` (the attributes the component shows) and
  `brand.md` when working for a client
- the Figma `figma-use` and `figma-generate-library` skills

Where: the client's file and repo by default. The master library (`BufvaVkSh9vMWPye117Ucd`) and
the plugin repo only when the user asks to change the library, or when promoting a client
component used in 2+ projects.

## 1. Read the input
- Screenshot: list the parts (anatomy), the content in each part, sizes and hierarchy, what
  looks interactive. Description: the same, from the words.
- Mark what you see versus what you assume. Ask at most 3 questions, only about behavior you
  cannot infer (what happens on click, what is optional, the realistic maximum of a list).
  Use AskUserQuestion with options when available.
- Never copy a screenshot's look literally: rebuild it with the library's tokens and parts.

## 2. Map to what exists
For every part, name the existing component, preset or token that covers it (tags → `Badge`,
photo → `Image Placeholder`, price → text style + `Badge` for sale). Then decide:
- a new variant, property or slot on an existing component (preferred), or
- a new component (no business meaning), a Field Preset or a Block (composed, seen in 2+
  projects), or a Page Shell.

| Layer | When | Page |
|---|---|---|
| Component | A reusable UI part with no business meaning (Breadcrumb, Accordion) | its own page |
| Field Preset | A field with a purpose seen in 2+ projects (IBAN, CNP) | Form Presets |
| Block | A composed section seen in 2+ projects (hero, pricing, sign in) | its category page under BLOCKS (AI, App, Commerce, Content, Enterprise, Forms, Hero, Navigation, Results, Sections), inside the `Blocks` section, in its family sub-section |
| Page Shell | A full page frame with a replaceable content slot | Page Shells |

Check `figma-library.md` and search the file first: extend an existing component (new variant,
slot or property) before creating a new one.


## 3. Propose (status: proposed)
Before building, show in the chat, short:
- anatomy and the existing parts reused;
- variants and properties with shadcn names (`Variant`, `Size`, `State`), slots;
- states (default, hover, focus, disabled, selected, loading, error, empty as relevant);
- content rules you propose (title up to 2 lines then ellipsis, up to 3 tags then "+N", price
  never wraps), behavior, accessibility (role, label, keyboard);
- the stress cases you will test.
Build only after the user agrees or says to go ahead.

## 4. Build
- Map variants and props to shadcn names and values (`Variant=outline`, `Size=sm`).
- Bind every fill, stroke, padding, gap, radius, size and text style to a token. If a value
  has no token, create a `Components` token aliased to Semantic (with `opacity/*` if needed),
  with scopes and WEB code syntax, and document it in `tokens.md`.
- States: default, hover, focus (2 px gap + 4 px ring, `clipsContent` on), disabled
  (`opacity/50`), plus error or selected when they exist.
- Content that varies per use is a native slot (clipsContent off, sensible default content).
- Clip content off on every frame you create (`createFrame()` turns it on); only focus
  variants, image crops and scroll areas clip.
- On/off looks (elevation, divider, compact header) are variant properties with the values
  `false` / `true`, which Figma shows as a toggle; layer visibility uses BOOLEAN properties.
  Fixed variation is a boolean or TEXT property.
- Layers 2-4 are built only from instances of layer 1, never redrawn. Copy the look of an
  existing variant (Input, Select, Button) instead of rebinding tokens by hand.
- Sizes: after the last `resize()`, set hug back (`primaryAxisSizingMode = 'AUTO'`) on anything
  that should hug; blocks let their inner Card FILL so they stretch; proportional fills use
  constraints `SCALE`, not a fixed child width.
- Default content is domain-neutral ("Acme", projects, customers, invoices) and realistic;
  domain-specific content belongs in examples.
- Missing icon: draw it as one `Vector` in Lucide geometry (24 grid, 2 px stroke), clone an
  existing icon component for the frame, and add it to the Icons frame.
- New pages go in A-Z order inside their section (COMPONENTS or BLOCKS), names without prefix.
- A component goes on the page of what it is for the designer looking for it (a field that
  selects → Select), not of the parts it is built from (Popover, Command).
- Lay variants out in a grid on a dashed `background/default` frame; write the component
  description (when to use, rules).
- Block pages use Figma sections: `Blocks` holds one sub-section per family (CTA, Testimonials,
  Contact, Blog…), `Examples` holds every `Example / …` and `Template / …` frame. Put a new
  block in its family (create the family if it is new), re-flow the family in rows and resize the
  sections; never leave a block loose on the page.
- Add at least one example frame named `Example / <what it shows>` with props and slots filled
  with realistic content (open states, the component inside a block or shell).
- Component pages follow the row layout of `skills/tidy-component`: `<Name> / Docs`,
  `/ Component`, `/ Stress test`, `/ Examples`, left to right. Build the stress test and the
  examples first, then run `skills/tidy-component/component-page.js` (step 8).


## 5. Stress test
Follow `references/stress-test.md`. Build a frame `Stress test / <Component>` with one cell per
case (min, typical, max content; 0, 1, typical and many items; missing optional data; extreme
numbers; every state; Light, Dark, Corporate, Compact; narrowest and widest container; long
translation). Label each cell with its case.
- Every break (overflow, a wrap that pushes the layout, clipped text, empty gaps, misaligned
  rows) becomes a rule in the component: truncation with `maxLines`, a "+N" overflow item, min
  and max width, a placeholder for missing images, hidden empty rows.
- Fix the component, rebuild the stress frame, repeat until every case passes.

## 6. Check
1. Screenshot the set and the example, and look at them: overflow, clipped or one-letter-wide
   text, wrong widths, icons in the wrong color after a swap.
2. Light and Dark: a temporary frame with explicit Dark modes on Semantic and Components.
3. Run `${CLAUDE_PLUGIN_ROOT}/skills/audit-tokens/scan-components.js` on the new roots: zero raw
   values, unstyled text, clipping slots, empty icons or broken slots. Run `/eggux:audit-tokens` when tokens
   changed.
4. Remove temporary QA frames.


## 7. Review (status: in review)
Show the component set, one example and the stress test (screenshots), plus the content rules
that came out of the stress test. Iterate on feedback; every change re-runs the stress test.

## 8. After approval (status: approved → ready for dev)
What stays:

| Where | Client component | Master library component |
|---|---|---|
| Figma | Component with its description (when to use, content rules); the page row from `skills/tidy-component/component-page.js`: Docs, Component, Stress test, Examples | Same, in the master file |
| Docs | `eggux/components/<name>.md` in the client repo, from `templates/component.md` | `skills/build-ui/components/<name>.md` in the plugin, same template |
| Snapshot | `skills/update-component/snapshot.js` output (`flat`) saved to `eggux/components/<name>.snapshot.json`; `/eggux:update-component` diffs later hand edits against it | `skills/build-ui/components/<name>.snapshot.json` |
| Records | A decision in `eggux/decisions.md` (type component, with the content rules) | Inventory row in `references/figma-library.md`, `references/code-mapping.md`, `skills/build-ui/index.md`, `CHANGELOG.md`, regenerate `references/components/` (`scripts/component-docs.*`), version bump, `claude plugin validate .`, commit |
| Code (when the project has one) | The component with props that match Figma, the content rules (truncation, "+N"), and stories or tests for the stress cases | Code mapping only |

- Mark the component's section Ready for dev in Figma (Dev Mode); if the API refuses, tell the
  user to mark it.
- A client component that appears in a second project: propose promoting it to the master
  library (remove client content, generalize props, keep the stress test).
- New Plugin API trap learned: one line in `references/figma-api-notes.md`.

Later hand edits in Figma go through `/eggux:update-component`.

End with the status, what was built, the stress test result (cases, breaks found, rules added),
and where the docs and records are.
