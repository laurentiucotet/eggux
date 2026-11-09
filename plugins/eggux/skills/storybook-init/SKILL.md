---
name: storybook-init
description: Add Storybook to a project that does not have it yet. Use when the user asks to install or add Storybook and there is no `storybook` dependency in package.json and no `.storybook/` folder. For an EGG UI client project, this hands over to /eggux:code-setup.
---

# Storybook init

1. If Storybook is already installed (a `storybook` dependency in `package.json`, or a
   `.storybook/` directory), do not install it again: switch to `/eggux:storybook-setup`.
2. If this is an EGG UI client project (an `eggux/` folder, or the user wants the EGG UI
   components in code), use `/eggux:code-setup` instead. It copies the eggux starter, which
   already has the Storybook config, themes, tokens and tests.
3. Otherwise install the latest stable release from the project root:
   `npm create storybook@latest` (or the matching command of the project's package manager,
   such as `pnpm create storybook@latest`). Use `@next` (Storybook 11 prerelease) only when the
   user asks for it.
4. Then invoke `/eggux:storybook-setup` for the project-specific configuration, such as the
   `.storybook/preview.ts` file and the first stories.

---
Adapted from [storybookjs/skills](https://github.com/storybookjs/skills) (branch `next`, commit `464320c`, synced from Storybook v11.0.0-alpha.7; Storybook is MIT licensed). Changes: works on Storybook 10.x as well as 11, does not push an upgrade to a prerelease, and hands EGG UI projects to the eggux code skills.
