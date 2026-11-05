---
name: storybook-upgrade
description: Upgrade Storybook in a project that already has it, or repair a broken Storybook install. Use when the user asks to upgrade Storybook, when a Storybook skill needs a newer version, or when Storybook packages have mismatched versions.
---

# Storybook upgrade

1. Check the current version (`npx storybook --version`) and the published ones
   (`npm view storybook dist-tags`): `latest` is the stable release, `next` the prerelease.
2. Target: the `latest` stable release. Upgrade to `next` (for example Storybook 11 beta) only
   when the user asks for the prerelease by name; say that a prerelease can break.
3. Read https://storybook.js.org/docs/releases/upgrading.md in its **entirety** for the current
   instructions, then run the upgrade from the Storybook package: `npx storybook@latest upgrade`
   (or `npx storybook@next upgrade` for the prerelease). Apply the migrations it proposes.
4. Check the result: `npx storybook doctor`, the project's typecheck, its story tests and
   `build-storybook`.
5. **EGG UI code library:** finish with `/eggux:code-qa`, which runs every story test, rebuilds
   Storybook and compares the stories with Figma. If the eggux starter itself was upgraded,
   update the version in `/eggux:code-setup` and the README.

---
Adapted from [storybookjs/skills](https://github.com/storybookjs/skills) (branch `next`, commit `464320c`, synced from Storybook v11.0.0-alpha.7; Storybook is MIT licensed). Changes: works on Storybook 10.x as well as 11, does not push an upgrade to a prerelease, and hands EGG UI projects to the eggux code skills.
