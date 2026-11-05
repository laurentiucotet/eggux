---
name: code-setup
description: Set up the EGG UI component library in code with Storybook and tests in a client project, or refresh its tokens after Figma variables change. Copies the starter in plugins/eggux/storybook (React, Tailwind, shadcn/ui names, Storybook 10, Vitest with accessibility checks), exports the client's Figma variables to CSS and runs the tests. Use when the user wants Storybook, a coded design system, components in code ("fă și storybook", "pune componentele în cod"), or says the tokens or the brand changed in Figma and the code must follow.
---

# Code setup

The starter lives in `${CLAUDE_PLUGIN_ROOT}/storybook`. It already holds the token pipeline, the
Storybook config (themes and density in the toolbar, a11y addon, docs) and three components
(Button, Badge, Input) with stories and tests. Components after that are added one at a time with
`/eggux:code-component`.

## 1. Decide where the code lives
Look at the client project first.
- **No front-end yet, or a design-system repo:** copy the starter to `design-system/` at the
  project root (everything except `node_modules` and `storybook-static`).
- **An existing React app with Tailwind (and shadcn/ui):** keep its structure. Copy
  `src/styles/tokens.css`, the `@theme inline` block of `src/styles/globals.css`, `.storybook/`,
  `vitest.config.ts` and the scripts; put components in the app's `components/ui` (shadcn's
  path). Add the dev dependencies from the starter's `package.json` that the app lacks.
- **Not React:** say so and stop; tokens.css still works on any stack (step 3).
Ask only if two of these fit equally.

## 2. Install
`npm install` in the chosen folder. Storybook, Vitest and `@vitest/browser-playwright` versions are
pinned in the starter; keep `playwright` at the version whose Chromium is installed on the
machine (`npx playwright install chromium` when none is).

## 3. Tokens from the client's Figma file
1. Run `${CLAUDE_PLUGIN_ROOT}/scripts/export-tokens.js` through `use_figma` on the client's file
   (load the figma-use skill first). It is read-only and returns every Semantic, Components and
   Density variable with its WEB code-syntax name and one resolved value per mode.
2. Save the returned JSON to `tokens/<client>.tokens.json` exactly as returned; copying it is the
   intended workflow.
3. `node scripts/tokens-to-css.js tokens/<client>.tokens.json > src/styles/tokens.css` (or the
   app's path). Modes become `:root`, `.dark`, `.theme-<name>`, `.theme-<name>.dark`,
   `.density-compact`.
4. Report `dupes` (two variables with the same code name: fix the code syntax in Figma) and
   `expressions` (code syntax is a formula such as `color-mix(...)`: code computes it, nothing to
   export). Never fix a code syntax in Figma without reading what it is for.
5. A token present in tokens.css but missing from the `@theme inline` block in globals.css has no
   Tailwind utility yet: add `--color-<name>: var(--<name>)` when a component needs it.
Never edit tokens.css by hand; change the variable in Figma, export again, regenerate.

## 4. Check
- `npm run typecheck` and `npm test` (every story renders, passes its play function and axe in
  the themes it sets). All green before anything else. If Playwright cannot find its browser
  (cloud sessions ship one Chromium), run the tests with `PW_CHROMIUM=<path to chrome>`.
- `npm run storybook` and give the user the URL. In a cloud or remote session the user's
  browser reaches it through a forwarded host, which Storybook refuses ("Invalid host"): start it
  with `STORYBOOK_ALLOW_ALL_HOSTS=1 npx storybook dev -p 6006 --host 0.0.0.0 --no-open --ci` and
  report the port with the preview tool. `127.0.0.1` links only work on the machine running it. `npm run build-storybook` produces a static site to host anywhere.
  Restart the dev server after adding component files: one started before them does not
  generate their Tailwind classes, so new stories look unstyled while the tests pass.
- Record a task in `eggux/tasks.md` (Stage: build) and, for a client project, a decision
  `D-xxx · Components in code with Storybook` with where the code lives.

## Refresh after Figma changes
When variables change (rebrand, new token, a decision applied in Figma): steps 3 and 4 only. A
failing story after a token change is a real contrast or size change: show it to the user before
changing the test.
