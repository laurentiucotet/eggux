---
name: build-ui
description: Design or build screens, flows and pages for a client project from the EGG UI library (Figma) and shadcn (code), following the client's brand, objects, workflows and decisions. Use whenever the user asks to design, mock up, build or change a screen, page, flow, form, dialog, dashboard, settings page, checkout, onboarding or any UI, in Figma or in code.
---

# Build UI

## Read before building, in this order
1. `ux-rules.md` (next to this file): universal rules. Always.
2. `index.md` (next to this file): which shell, blocks, patterns and component guides fit the
   screen. Then read those `patterns/*.md` and `components/*.md`.
3. `${CLAUDE_PLUGIN_ROOT}/references/figma-library.md` (what exists, slots, conventions) and
   `${CLAUDE_PLUGIN_ROOT}/references/tokens.md` (token names, text styles, density, motion, charts).
4. Client files in `eggux/`: `decisions.md` (terminology wins), `brand.md` (overrides win over
   base rules), then `objects.md`, `actors.md`, `workflows.md` as relevant to the screen.

If a client file is missing, say which skill creates it and continue with base rules only.

## Building
- **Start from the workflow.** Identify the actor, the goal and the step this screen serves.
  If the screen matches no workflow, ask what the actor is trying to do.
- **Objects drive layout.** Cards, rows and detail pages show the attributes marked in
  objects.md; CTAs are only those the actor is permitted.
- **Compose top down from the library.** Page Shell (App, Split View, Wizard, Marketing, Auth,
  Mobile) → Blocks → Field Presets → components. Use instances and fill slots; never detach. In
  code, use the shadcn components already in the project. Build something new only when nothing
  fits, say so, and suggest `/eggux:add-component` if it will repeat.
- **Tokens only.** Fills, strokes, radius, spacing, sizes and text styles bound to variables and
  styles. A raw value is a defect unless no token exists; then flag it.
- **Copy:** the client's terminology and voice, real-looking content, never lorem ipsum. Replace
  the library's neutral defaults ("Acme", "Website redesign") with the client's content.
- **States:** default, empty, loading and error for every screen; validation errors for forms.
- **Responsive:** desktop first unless the actor works on the phone; mobile follows
  `patterns/mobile.md`. Density Compact only for data-dense desktop screens.
- **Both modes:** check Light and Dark when the client uses Dark.

## Figma
- Load the Figma `figma-use` skill (and `figma-generate-design` for full screens) before writing.
  Read `${CLAUDE_PLUGIN_ROOT}/references/figma-api-notes.md` before any write: it lists the API
  traps that cost failed runs (resize turns hug into fixed, slot references, nested instances).
- Work in the client's file, never in the master library unless the user asks to change it.
- Slots: fill them in the instance (Card, Dialog, Sheet, Field, shells). Tables are GRID frames
  copied from the Table page template, not components.

## Code
Follow the project's structure. Semantic Tailwind classes that map to tokens (`bg-primary`,
`text-muted-foreground`, `border-border`), never palette classes (`bg-blue-600`).

## Before finishing
1. Run `${CLAUDE_PLUGIN_ROOT}/skills/audit-tokens/scan-components.js` on the frames you built
   (ROOTS = their ids): zero raw values, unstyled text, clipping or broken slots, empty icons.
2. Screenshot the result in Light (and Dark if used) and look at it: overflow, clipped text,
   wrong widths.
3. Run the checks of the `review` skill. Fix what fails, then report what was built and any rule
   you could not follow.
