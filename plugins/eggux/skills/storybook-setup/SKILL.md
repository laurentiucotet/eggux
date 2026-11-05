---
name: storybook-setup
description: Make an installed Storybook work for the real project, with a working preview file (providers, global CSS, mocks) and stories for real components. Use when Storybook is installed but stories do not render, the preview is empty, or the user wants stories for the project's existing components.
---

# Storybook setup

## Prerequisites
1. Confirm Storybook exists (`package.json`, `.storybook/`). If not, switch to
   `/eggux:storybook-init`.
2. Check the version with `npx storybook --version` from the package where Storybook is
   installed (in a monorepo often a leaf package such as `packages/ui`).
   - **10.x or later:** continue. 10.x is supported; do not upgrade for this skill.
   - **Older than 10:** switch to `/eggux:storybook-upgrade` and come back afterwards. A request
     to set up or install Storybook counts as approval for that upgrade; for other requests, ask
     first.
3. **EGG UI code library** (the eggux starter: `tokens/egg-ui.tokens.json`, `COMPONENTS.md`,
   the Semantic and Density toolbar in `.storybook/preview.tsx`): the starter is already set up.
   Do not run the generic setup on it, and never delete its components or stories. To add or fix
   components use `/eggux:code-component`; to refresh tokens use `/eggux:code-setup`.

## Run
From the Storybook package run `npx storybook skills setup` and **follow the printed Markdown
precisely**. It is generated for this project (framework, config dir, package manager) and works
on 10.x and 11. Do not substitute your own plan.

If the sandbox blocks network access, request escalated permissions for Storybook CLI commands.

---
Adapted from [storybookjs/skills](https://github.com/storybookjs/skills) (branch `next`, commit `464320c`, synced from Storybook v11.0.0-alpha.7; Storybook is MIT licensed). Changes: works on Storybook 10.x as well as 11, does not push an upgrade to a prerelease, and hands EGG UI projects to the eggux code skills.
