---
name: storybook-ui-workflow
description: Storybook's workflow for UI changes in a project with Storybook - look up the components to reuse, write and update stories, run story tests, and publish a review of the result. Also shows existing components or stories in a review. Use when the user asks for it, when the project's agent instructions (such as AGENTS.md) ask for it, or when changing UI in a non-EGG project that has Storybook.
---

# Storybook UI workflow

## Prerequisites
1. Storybook must be installed in the project. Invoke `/eggux:storybook-init` only if the user
   explicitly invoked this skill and approves a Storybook installation.
2. Storybook 10.x or later (`npx storybook --version`). If older, offer
   `/eggux:storybook-upgrade`; a request to set up or install Storybook counts as approval.
3. **EGG UI code library:** a component built from Figma goes through `/eggux:code-component`
   (its stories carry the EGG tests: keyboard, sizes, every theme, stress cases). Use this
   workflow inside it for the review step, or on its own for changes that do not start from a
   Figma component.

Run the Storybook dev server and every Storybook CLI command from the same working directory:
the package where Storybook is installed (in a monorepo often a leaf package such as
`packages/ui`). If the sandbox blocks network access or ports, request escalated permissions
for Storybook CLI commands; otherwise the dev server can fail in confusing ways.

## Run
- **Storybook 11 or later:** run `npx storybook skills ui-workflow`.
- **Storybook 10.x:** run `npx storybook skills stories`, then `npx storybook skills write-story`
  before writing stories.

Read the output in its **entirety**: it is the mandatory, ordered workflow for UI changes,
writing stories, keeping stories in sync with every component you create, change or delete,
running story tests (`npx storybook tools test run`) and publishing a review
(`npx storybook tools review create`).

## Dev server
Some commands need a running Storybook:
1. Reuse a dev server that already serves this project's Storybook (probe the URL, usually
   `http://localhost:6006`). Otherwise start one in the background with the project's own
   script (for example `npm run storybook`) and wait until the URL responds. In a cloud session
   start it as `/eggux:code-setup` describes (`STORYBOOK_ALLOW_ALL_HOSTS=1`, `--host 0.0.0.0`)
   so the forwarded preview works.
2. The dev server is part of the deliverable: leave it running when the work is done so the user
   can keep browsing stories.

---
Adapted from [storybookjs/skills](https://github.com/storybookjs/skills) (branch `next`, commit `464320c`, synced from Storybook v11.0.0-alpha.7; Storybook is MIT licensed). Changes: works on Storybook 10.x as well as 11, does not push an upgrade to a prerelease, and hands EGG UI projects to the eggux code skills.
