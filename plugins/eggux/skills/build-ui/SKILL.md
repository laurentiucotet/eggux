---
name: build-ui
description: Design or build screens, flows and pages for a client project from the EGG UI library (Figma) and shadcn (code), following the client's brand, objects, workflows and decisions. Use whenever the user asks to design, mock up, build or change a screen, page, flow, form, dialog, dashboard, settings page, checkout, onboarding or any UI, in Figma or in code.
---

# Build UI

## Read before building, in this order
0. `eggux/decisions.md`, the whole file. If the Inbox has lines, process them first with
   `/eggux:decision-log` (record, apply). Every applied decision overrides what follows.
1. `ux-rules.md` (next to this file): universal rules. Always.
2. `index.md` (next to this file): which shell, blocks, patterns and component guides fit the
   screen. Then read those `patterns/*.md` and `components/*.md`.
3. `${CLAUDE_PLUGIN_ROOT}/references/figma-library.md` (what exists, slots, conventions); for one
   component's exact properties, slots and tokens, `references/components/<page>.md`; and
   `${CLAUDE_PLUGIN_ROOT}/references/tokens.md` (token names, text styles, density, motion, charts).
4. The feature folder `eggux/features/<slug>/` when the screen belongs to a feature: actors,
   access, data, states and feedback from `feature.md`, flows from `workflows.md`, Given / When /
   Then from `scenarios.md`, rules from its `decisions.md` (Inbox lines not yet applied: run
   `/eggux:update-feature` first). Design into the feature's Figma page: replace the placeholder
   `<ID> / <n> <screen>` in the scenario's section with the screen, keep the name, update the
   status in `scenarios.md` and the Screens table, and remove a "Needs update" annotation once
   the screen follows the change. No spec for a new feature: suggest `/eggux:new-feature` first.
5. Client files in `eggux/`: `brand.md` (overrides win over base rules), then `objects.md`,
   `actors.md`, `workflows.md` as relevant to the screen.

If a client file is missing, say which skill creates it and continue with base rules only.

## Building
- **Start from the workflow.** Identify the actor, the goal and the step this screen serves.
  If the screen matches no workflow, ask what the actor is trying to do.
- **Objects drive layout.** Cards, rows and detail pages show the attributes marked in
  objects.md; CTAs are only those the actor is permitted.
- **Compose top down from the library.** Page Shell (App, Split View, Wizard, Marketing, Auth,
  Mobile) → Blocks → Field Presets → components. Use instances and fill slots; never detach. In
  code, use the shadcn components already in the project. Build something new only when nothing
  fits, say so, and suggest `/eggux:new-component` if it will repeat.
- **Tokens only.** Fills, strokes, radius, spacing, sizes and text styles bound to variables and
  styles. A raw value is a defect unless no token exists; then flag it.
- **Copy:** the client's terminology and voice, real-looking content, never lorem ipsum. Replace
  the library's neutral defaults ("Acme", "Website redesign") with the client's content.
- **States:** default, empty, loading and error for every screen; validation errors for forms.
- **Theme:** Corporate modes (+ Density Compact) for enterprise, back office and data-heavy
  products; Default modes otherwise, unless `brand.md` says which. See
  `patterns/enterprise-apps.md`.
- **Responsive:** desktop first unless the actor works on the phone; mobile follows
  `patterns/mobile.md`. Density Compact only for data-dense desktop screens.
- **Both modes:** check Light and Dark when the client uses Dark.

## Reproduce a reference screen
When the input is a screenshot or a live page to rebuild (a client's current product, a
competitor, a mock from another tool):
1. **Inventory before building.** List the sections top to bottom and, for each, the Page Shell,
   Block or component that covers it (`index.md`, `figma-library.md`, Blocks first, then
   components). Mark what nothing covers and what only covers it with an override. Show the table
   before building when the gaps change the plan.
2. **Theme from the reference.** Pick the mode closest to its colors (Default or Corporate, Light
   or Dark per region: a navy header is the Dark mode of the same theme on that frame). Accent
   text and inline links use `foreground/brand`; never put `background/*` tokens on text.
3. **Client header and footer are components.** The first screen of a client turns its navbar
   and footer into `Block / Navbar <client>` and a Footer block instance with the client content;
   later screens use instances, never copied frames.
4. **Build section by section**, screenshot each one, and fix before the next.
5. **Overrides are findings.** A text style changed on an instance, a hidden layer that should be
   a boolean, a size that cannot be set: list each one as a library gap and suggest
   `/eggux:update-component` or `/eggux:new-component`.
6. **Compare with the reference** side by side at the end: hierarchy, spacing rhythm, accent
   colors, what was approximated and why.

## Figma
- Load the Figma `figma-use` skill (and `figma-generate-design` for full screens) before writing.
  Read `${CLAUDE_PLUGIN_ROOT}/references/figma-api-notes.md` before any write: it lists the API
  traps that cost failed runs (resize turns hug into fixed, slot references, nested instances).
- Work in the client's file, never in the master library unless the user asks to change it.
- Slots: fill them in the instance (Card, Dialog, Sheet, Field, shells). Tables are GRID frames
  copied from the Table page template, not components.

## Code
Which code component implements each Figma component: `${CLAUDE_PLUGIN_ROOT}/references/code-mapping.md`.
Follow the project's structure. Semantic Tailwind classes that map to tokens (`bg-primary`,
`text-muted-foreground`, `border-border`), never palette classes (`bg-blue-600`).

## Before finishing
1. Run `${CLAUDE_PLUGIN_ROOT}/skills/audit-tokens/scan-components.js` on the frames you built
   (ROOTS = their ids): zero raw values, unstyled text, clipping or broken slots, empty icons.
2. Screenshot the result in Light (and Dark if used) and look at it: overflow, clipped text,
   wrong widths. When there is a reference, put it next to the result and compare.
3. Verify the decisions whose scope covers what you built (`decision-log` § Verify).
4. Run the checks of the `review` skill. Fix what fails, then report what was built and any rule
   you could not follow.
