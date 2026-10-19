---
name: build-ui
description: Design or build screens, flows, components and blocks for a client project from the EGG UI library (Figma) and shadcn (code), following the client's brand, objects, workflows and decisions. Use whenever the user asks to design, mock up, build, or change a screen, page, flow, form, dialog or component.
---

# Build UI

## Read before building, in this order
1. `ux-rules.md` (next to this file): universal rules. Always.
2. `${CLAUDE_PLUGIN_ROOT}/references/tokens.md`: token names and text styles.
3. Client files in `eggux/`: `decisions.md` (terminology wins), `brand.md` (overrides win over
   base rules), then `objects.md`, `actors.md`, `workflows.md` as relevant to the screen.
4. `patterns/<name>.md` for every pattern the screen uses.
5. `components/<name>.md` for every component the screen uses, when the file exists.

If a client file is missing, say which skill creates it and continue with base rules only.

## Building
- **Start from the workflow.** Identify the actor, the goal and the step this screen serves.
  If the user asks for a screen that matches no workflow, ask what the actor is trying to do.
- **Objects drive layout.** Cards, list rows and detail pages show the attributes marked in
  objects.md; CTAs are only those the actor is permitted.
- **Compose from the library.** In Figma, search the design system and use instances of
  existing components and blocks. In code, use shadcn components already in the project. Build
  something new only when nothing fits, and say so.
- **Tokens only.** Bind fills, strokes, radius, spacing and text styles to variables and styles.
  A raw value is a defect unless no token exists, in which case flag it.
- **Copy:** use the client's terminology and voice. Real-looking content, never lorem ipsum.
- **States:** for every screen, cover default, empty, loading and error. For forms, cover
  validation errors.
- **Both modes:** check Light and Dark when the client uses Dark.

## Figma
Use the Figma MCP skills (`figma-use`, `figma-generate-design`) for every write. Build in the
client's file, never in the master library unless the user explicitly asks to change the library.

## Code
Follow the project's existing structure. Use semantic Tailwind classes that map to tokens
(`bg-primary`, `text-muted-foreground`, `border-border`), never palette classes (`bg-blue-600`).

## Before finishing
Run the checks in the `review` skill on what you built, fix what fails, then report what was
built and any rule you could not follow.
