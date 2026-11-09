# EGG UI in code (Storybook starter)

React + Tailwind components on the EGG UI tokens, with shadcn/ui names, documented and tested in
Storybook. It is the starting point that `/eggux:code-setup` copies into a client project; new
components come one at a time with `/eggux:code-component`, checks with `/eggux:code-qa`.

```
npm install
npm run storybook        # http://localhost:6006, themes and density in the toolbar (restart after adding component files)
npm test                 # every story as a test: render, play function, axe
npm run build-storybook  # static site in storybook-static/
npm run check:stories    # every story of the production build in a fresh page, like Chromatic
npm run kit -- --list    # trim the kit for a new product: list, dry run, --apply (see below)
npm run chromatic        # publish for review (needs CHROMATIC_PROJECT_TOKEN); CI does it on push
npm run tokens           # tokens/egg-ui.tokens.json -> src/styles/tokens.css
```

## How it fits together
- `tokens/*.tokens.json`: Figma variables exported with `plugins/eggux/scripts/export-tokens.js`
  (run through use_figma). `scripts/tokens-to-css.js` turns them into `src/styles/tokens.css`,
  one block per Figma mode (`:root`, `.dark`, `.theme-corporate`, `.theme-showcase`,
  `.density-compact`). Never edit tokens.css by hand.
- `src/styles/globals.css`: Tailwind 4 plus `@theme inline`, so `bg-primary`, `rounded-button`,
  `text-brand` read the tokens.
- `src/components/ui/<name>.tsx`: one component, props named after the Figma properties.
- `src/components/ui/<name>.stories.tsx`: the stories are the documentation and the tests:
  variants, states, keyboard, measured sizes from Figma, stress cases, theme stories.
- `.storybook/preview.tsx`: theme switcher (the six Semantic modes), Density toolbar, axe
  failures fail the test (`a11y.test = 'error'`).
- `scripts/screenshot-stories.js`: PNGs of built stories for the side-by-side check with Figma.
- `scripts/check-stories.mjs`: opens every story of `storybook-static` the way Chromatic does (new
  1200 x 900 page, en-US, UTC) and lists the ones that throw. Catches tests that read state before
  effects ran, which `npm test` (dev build) does not.
- `scripts/kit-trim.mjs`: keeps the components you name plus what they import, removes the rest
  (`/eggux:kit-trim`).
- `.github/workflows/chromatic.yml` (repository root): publishes the Storybook on push and pull
  request (`/eggux:storybook-publish`).
- `COMPONENTS.md`: which Figma components exist in code.

Tests run in a real Chromium through Vitest browser mode (`@storybook/addon-vitest`,
`@vitest/browser-playwright`); keep `playwright` at the version of the installed browser.
