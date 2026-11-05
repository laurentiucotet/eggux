---
name: storybook-component-docs
description: Look up the components of a project with Storybook, with their props and usage examples, to answer questions about them or to reuse them instead of building duplicates. Use when the user asks which components exist, what props a component takes or how to use it, or when the project's agent instructions (such as AGENTS.md) ask for it. For a UI change, use storybook-ui-workflow, which includes the same lookup.
---

# Storybook component docs

## Prerequisites
1. Storybook must be installed in the project. If it is not, read the components' source files
   instead.
2. Storybook 10.x or later (`npx storybook --version`). If older, read the components' source
   files and offer `/eggux:storybook-upgrade`; upgrade only after the user approves.

Run every Storybook CLI command from the package where Storybook is installed. If the sandbox
blocks network access, request escalated permissions for Storybook CLI commands.

## Run
- **Storybook 11 or later:** run `npx storybook skills component-docs` and follow its output.
- **Storybook 10.x:** run `npx storybook skills stories` and follow its Documentation Workflow:
  `npx storybook tools docs list` once for the component and docs IDs, then
  `npx storybook tools docs show <id>` for props and usage examples. Use only IDs these tools
  return.

Do not invent props: a prop the tools do not document does not exist.

**EGG UI projects:** Storybook documents the coded component. For design intent (variants,
content rules, behavior) the source of truth stays the Figma component and
`references/components/<page>.md`; if the two disagree, report the gap (it is a
`/eggux:code-qa` finding).

---
Adapted from [storybookjs/skills](https://github.com/storybookjs/skills) (branch `next`, commit `464320c`, synced from Storybook v11.0.0-alpha.7; Storybook is MIT licensed). Changes: works on Storybook 10.x as well as 11, does not push an upgrade to a prerelease, and hands EGG UI projects to the eggux code skills.
