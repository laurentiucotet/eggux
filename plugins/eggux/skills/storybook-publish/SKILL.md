---
name: storybook-publish
description: Publish the Storybook to Chromatic so managers and developers open one link, play with the components, switch scheme, look and size, and see each branch or pull request. Sets up the GitHub workflow and the token secret, decides what Chromatic tests (publish only by default, visual snapshots only on a short list of key stories), builds the links for a meeting, and fixes a failing publish. Use when the user asks to share Storybook, give a manager a link, put it on Chromatic or GitHub, or when a Chromatic build fails ("publică storybook", "vreau să dau un link", "chromatic pică").
---

# Publish Storybook for review

Goal: a link a manager opens in a browser and uses, not a screen shared in a call. Storybook's own
toolbar gives them scheme, look and size; Chromatic only hosts the build and gives each branch
and pull request its own link.

## 1. What goes where
| Need | Who provides it |
|---|---|
| Play with a component, change props | Storybook: the Default story is a playground (Controls) |
| Scheme (light, dark), Look (platform, back office, showcase), breakpoint | Storybook toolbar (globals in the URL) |
| A link per branch and per pull request | Chromatic |
| A stable link to what is approved | Chromatic, branch `main` |
| Proof that nothing broke on mobile, desktop, light, dark | Chromatic visual snapshots with modes, on a short list of stories |
| Tests (interaction, accessibility) | `npm test` and `npm run check:stories` in GitHub, not in Chromatic |

## 2. Set up (once)
1. `npm install --save-dev chromatic` in the Storybook folder; script
   `"chromatic": "chromatic --exit-zero-on-changes"`.
2. Workflow `.github/workflows/chromatic.yml`: on push and pull request for the Storybook folder,
   `actions/checkout` with `fetch-depth: 0`, `actions/setup-node`, `npm ci`,
   `chromaui/action@latest` with `workingDir`, `buildScriptName: build-storybook`,
   `exitZeroOnChanges: true`. Each step runs only when the secret exists, and the notice step uses
   `working-directory: .` (the project folder does not exist before checkout).
3. The project token: Chromatic, Manage, Configure. Put it only in the repository secret
   `CHROMATIC_PROJECT_TOKEN` (GitHub, Settings, Secrets and variables, Actions). The name must
   match exactly. Never in a file, a commit or a chat; one pasted in a chat is regenerated.
4. Fonts come from `@fontsource` packages imported in `preview.tsx` (no Google request), and
   `preview.tsx` waits for them in a loader, so text is measured with the real font everywhere.
5. The workflow only runs from the branch that holds it and from pull requests; merge it to
   `main` for a manual run (Actions, Chromatic, Run workflow).

## 3. What Chromatic tests
Default: **publish only**. Set `parameters.chromatic = { disableSnapshot: true }` in `preview.tsx`
so no story is captured: the build passes, uses no snapshot quota and cannot fail on a play
function. The published Storybook is fully interactive. Confirm on the first build that Chromatic
reports the stories as published and tests none.

For proof across screen sizes and themes, turn snapshots on for a short list (about 50 key
stories, never the whole library): `parameters.chromatic = { disableSnapshot: false, modes: {...} }`
on those stories, with modes for the breakpoints and themes the product supports. Each mode
multiplies the snapshot count; check the plan's monthly quota before adding modes.

If snapshots are on and a build fails with "component errors", they are play functions that fail
in Chromatic's capture. Reproduce them locally in one run:
`npm run build-storybook && npm run check:stories -- --full`. The usual causes, in order:
CSS transitions read halfway (off under the Chromatic user agent in `preview.tsx`), state read
before an effect ran, a toast or popover not mounted yet, a pointer not moved away. Fix as in
`/eggux:code-component` step 3 ("Tests wait for the page"). A build that fails with "Failed to
extract stories" means a stories file exports something that is not a story (an `export type`).

## 4. Links for a meeting
Build them from the published URL; everything after `?` is read by Storybook:
- A story: `<url>/?path=/story/<story-id>` (the id is in the browser address bar).
- Look, scheme and size: add `&globals=scheme:dark;look:back-office;viewport.value:md`. Schemes:
  `light`, `dark`. Looks: `platform`, `back-office`, `showcase`. Sizes: the keys in
  `src/styles/breakpoints.ts` (`base`, `sm`, `md`, `lg`, `xl`, `2xl`). The old combined
  `theme:Dark` still works.
- Only the component, no Storybook chrome: `<url>/iframe.html?id=<story-id>&viewMode=story`.
- Branch link: Chromatic shows a stable URL per branch (it does not change with each push); the
  pull request status check links the build.
Put the links in a Storybook page for managers (Introduction or a "Tour" MDX page) so one link opens
the whole walk-through.

## 5. Access
Who can open the link is a Chromatic setting (Manage, Access); check it before the meeting and
invite the managers there. If they must open it without an account, host the static build
(`npm run build-storybook`, folder `storybook-static`) on a static host with a public link and keep
Chromatic for review.

## 6. Check
- `npm run typecheck`, `npm run build-storybook`, `npm run check:stories`: all clean.
- A push shows the workflow green in GitHub Actions and the build in Chromatic.
- Open the published link in a clean browser window: theme and size switch, Controls work, a
  story with a play function does not leave a confusing end state.
