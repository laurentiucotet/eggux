---
name: kit-trim
description: Start a new product from the EGG UI kit and keep only what it needs. Decides the product's surfaces (platform, back office), brand, breakpoints, lists the components with what depends on what, keeps the chosen ones plus everything they import, removes the rest with their stories, docs rows and tokens, then runs the checks and publishes. Use when the user wants to take EGG UI or EGG UX into a separate project, keep only some components, strip the library down, or start a new product from it ("păstrez doar ce am nevoie", "proiect nou din kit", "scoate ce nu folosesc").
---

# Trim the kit for a new product

The kit is large on purpose; a product uses a fraction of it. Trim in this order, deciding the
look first, because it decides which tokens and components are needed.

## 1. Decide the product's frame (ask only what is not clear)
- **Surfaces:** one look, or several? Platform (what customers see) and back office (staff) are
  two surfaces of the same components. In this kit a surface is a token mode, not a second
  component set: Light and Dark are the platform look (pill controls, 12 px cards, Plus Jakarta
  Sans), Corporate is the back-office look (square controls, 4 px radius, Inter).
  See `references/tokens.md`, "Themes".
- **Brand:** the client's colors re-alias the same tokens in one mode (`/eggux:brand-intake`).
- **Breakpoints:** the widths the product supports. Edit `src/styles/breakpoints.ts`; the Size
  selector and Foundations / Breakpoints read it (Figma's `layout/breakpoint/*` is the source). Mobile is in scope
  by default: components resize with the breakpoint, and mobile-only patterns (bottom navigation,
  bottom sheet, thumb-reach actions) come after the base components.
Write the answers as a decision (`/eggux:decision-log`); they are the brief for everything below.

## 2. Same component, different surface
When one component must look or behave differently per surface, pick the lightest tool that works:
1. **A token** when only a value differs (color, radius, spacing, font, border). Put it in the
   Components collection for the surface's mode (`button/radius`, `input/radius`); the code reads
   the same CSS variable in every mode. No code change.
2. **A prop** when the structure differs but the behavior is the same (Toggle Group with icons
   only in back office, a compact Table Cell). The prop sets the structure; tokens set the look.
3. **A separate component** only when the behavior differs (a filter bar in the platform, a column
   filter row in the back office). Name it for what it does, not for the surface.
Never branch on the surface name inside a component (`if (surface === 'admin')`); the surface
arrives as tokens and props.

## 3. Choose the components
In the Storybook folder:
- `npm run kit -- --list`: every component, its size, what it imports, what uses it, and whether it
  has stories. Stories-only files (`table-examples`) are names too.
- Pick the screens the product needs first, then the components they use, by name.
- `npm run kit -- <name> <name> ...`: a dry run. It shows what stays, what is pulled in because a
  kept component (or its stories) imports it, and how many go. Read the pulled-in list: a surprise
  there is a component that is heavier than it looked, or a story that imports a demo helper
  (`--no-stories` ignores story imports and drops the stories that need a removed part).
- `npm run kit -- <name> <name> ... --apply` deletes the rest (files and COMPONENTS.md rows). Do it on
  a branch; git is the undo.

## 4. Trim the rest
- **Tokens:** the tokens file is generated from Figma variables (`/eggux:code-setup`, step 3).
  Remove the surfaces and brands the product does not use from the Figma variable modes first, then
  export again; never edit the generated CSS by hand.
- **Icons:** `npm run icons` regenerates the icon set from the list; drop the icons nothing imports.
- **Docs and skills:** remove references and decisions for deleted components from
  `eggux/decisions.md`; keep the skills, they are the workflow.
- **Sidebar:** keep the four sections (Foundations, Components, Blocks, Pages;
  `references/storybook-structure.md`). Blocks and Pages hold the product's own compositions and
  screens; start them empty and fill them with the first real screens.
- **Foundations pages** (`src/foundations/`: colors with contrast, typography, shape and spacing,
  motion and elevation, breakpoints, themes and looks) read the tokens live, so they follow the trim
  with no work. Check `Themes and looks` after changing the looks: it shows the same components in
  every look and scheme.

## 5. Check
- `npm run typecheck`, then `npm test` a few story files at a time, then
  `npm run build-storybook && npm run check:stories`. Fix what broke; a failing import means a
  component still needs something that was removed: add the name back with `npm run kit`.
- Publish for review (`/eggux:storybook-publish`) and open the link on a phone and a desktop in
  Light, Dark and each surface.

## 6. From here, the loop
Figma component, then `/eggux:code-component` (playground Default, hidden checks, tests that wait),
then `npm run check:stories`, then a push that publishes the branch link for review.
