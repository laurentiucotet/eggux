---
name: code-qa
description: Check the coded EGG UI components against their tests and against Figma before a release or after a token, theme or dependency change. Runs typecheck and every story test (interaction, keyboard, accessibility in each theme), rebuilds Storybook, screenshots the stories and compares them with the Figma components, then reports what passes, what broke and why. Use when the user asks to test the components ("rulează testele", "verifică Storybook", "e totul ok în cod?"), before a release, after /eggux:code-setup refreshed tokens, or after upgrading Storybook (/eggux:storybook-upgrade), Tailwind or React.
---

# Code QA

Read-only by default: it reports. It fixes only what the user approves, through
`/eggux:code-component` (component defects) or Figma (design defects).

## 1. Automated checks
In the code library folder:
1. `npm run typecheck`.
2. `npm test`: every story renders, passes its play function and axe. Note each failure with the
   story id, the assertion and the axe rule (`color-contrast`, `label`, `button-name`...).
3. `npm run build-storybook` must succeed.

## 2. Coverage
Compare `COMPONENTS.md` with the Figma library (`references/figma-library.md`) and the client's
screens: which components the screens use that have no code yet. Per coded component, check that
its stories cover every Figma variant group, state and the stress cases (`/eggux:code-component`
step 3). List what is missing.

## 3. Visual check against Figma
For components changed since the last QA (git log of `src/components/ui`, or all when asked):
`node scripts/screenshot-stories.js <out> <story ids>` and `get_screenshot` of the same Figma
variants. Compare size, spacing, radius, color, type, icon size and states in Light and Dark.

## 4. Report
One table: component, tests (pass / fail with the reason), visual (matches / differs: what),
coverage gaps. Then the causes in groups:
- Code defect: fix with `/eggux:code-component` (update mode).
- Design or token defect (a Figma value fails contrast, sizes disagree with the reference): an
  Inbox line in `eggux/decisions.md`, never a silent override in code.
- Test defect (the test asserts something Figma does not say): fix the test and say so.
Record a QA task in `eggux/tasks.md` (Stage: qa) with the result.

Never mark a failing test as skipped or loosen an assertion to get green.
