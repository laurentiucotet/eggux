---
name: code-component
description: Build or update one EGG UI component in code from its Figma component, with Storybook stories and tests (interaction, keyboard, sizes, accessibility in every theme, stress cases), until the tests pass and the story matches Figma. Use when the user says "creează componenta asta", "fă Select-ul în cod", "adaugă Dialog în Storybook", gives a Figma link or a component name and wants it in code, or when a Figma component changed and its code must follow.
---

# Code component

One component per run. Tests are part of the component: a component without passing stories is
not done. Needs the code library from `/eggux:code-setup`.

## 1. Read the source
Input: a Figma link, a component name from the library, or a screenshot (find the matching
library component first; if none fits, the component is new: run `/eggux:new-component` in Figma
first, code follows Figma).
1. `references/components/<page>.md` for the component: variants, properties, sizes, anatomy,
   content and behavior rules, resize behavior.
2. `references/code-mapping.md`: the shadcn component it maps to and the EGG changes (rows for
   this component in every section: Core, Style alternatives, Resize behavior, waves).
3. The guide `skills/build-ui/components/<guide>.md` named in the description.
4. Figma: `get_screenshot` of the component set (and of its stress test frame) for the visual
   target. `get_design_context` only when the reference lacks a detail.
5. Client overrides: `eggux/decisions.md` (a decision about this component wins) and
   `eggux/components/<name>.md` for client components.

## 2. Write the component
`src/components/ui/<name>.tsx` (kebab-case file, PascalCase export).
- Start from the shadcn/ui source of the mapped component when there is one; keep its API and
  `data-slot` names. Radix primitives come from `radix-ui`, icons from `@/components/icons` (IconMCP, same
  names as the Figma `Icon/<name>` in PascalCase: `Icon/trash-2` → `Trash2`), never `lucide-react`.
  An icon the set lacks: add it from IconMCP to `icons/iconmcp.json` and run `npm run icons`.
- Props mirror Figma: Variant → `variant`, Size → `size`, other variant properties → props of the
  same name in camelCase, booleans `Show x` → optional props or children, text properties →
  children or named props, slots → `children` or named `ReactNode` props. Default values are the
  Figma defaults.
- Styles only through tokens: Tailwind classes on the theme (`bg-primary`, `rounded-button`,
  `h-[var(--control-height)]`) or `var(--token)` for component tokens. No hex, no raw px except
  the sizes the reference states. Write every class name in full (Tailwind cannot see
  `bg-[var(--x-${k})]`).
- Text colors on colored fills use the matching `*-foreground` token, never `text-white`.
- Resize contract from the reference: `min-w-0` + `truncate` or `line-clamp-*`, `shrink-0` on
  icons and controls, `max-w-*` where Figma has maxWidth.
- Accessibility: native elements first, labels, `aria-*` states that match Figma states
  (`aria-invalid`, `aria-busy`, `aria-expanded`, `aria-current`), visible focus ring, keyboard
  behavior of the matching WAI-ARIA pattern.
- Top comment: the Figma component and page it implements.

## 3. Write the stories and tests
`src/components/ui/<name>.stories.tsx`. Every story is a test (`npm test`): it must render,
pass axe (`a11y.test = 'error'` in preview) and pass its `play` function.
- `Default` with a play test of the main interaction (click, type, open, select) using
  `storybook/test` (`expect`, `userEvent`, `fn`) and the accessible role and name.
- One story per Figma variant group (Variants, Sizes, Styles), with a play test of the measured
  sizes the reference states (heights, widths).
- One story per state Figma has: disabled, loading, invalid, read-only, open, empty; each with a
  play test of what the state must do (blocks clicks, `aria-invalid` with a description, value
  cannot change).
- Keyboard: Tab reaches it, Enter or Space activates, Escape closes overlays, arrows move in
  lists and groups; focus returns where it came from.
- Stress stories from the Figma stress test: long text, the 276 / 368 px columns, many items,
  missing optional parts; play tests check one line, truncation or wrapping as the resize
  contract says.
- Theme stories: the main visual story again with `globals: { theme: 'Dark' }` and
  `globals: { theme: 'Corporate Light' }`, so axe checks contrast in each mode.
- `parameters.docs.description.component`: the one-line rule, the Figma location and the guide.
- Content in plain English, domain-neutral (Acme, EUR), no lorem ipsum.

## 4. Run until green
`npm run typecheck` and `npm test -- src/components/ui/<name>.stories.tsx`. Fix the component,
not the test, unless the test is wrong about Figma. An axe failure is a real defect: fix it with
tokens; when the token itself fails (contrast of a Figma value), report it as a design finding
(Inbox line in `eggux/decisions.md`) instead of overriding it in code.

## 5. Compare with Figma
`npm run build-storybook`, then `node scripts/screenshot-stories.js <out> components-<name>--<story>`
for the main stories, and put them next to the Figma screenshots of the same variants. Check
sizes, spacing, radius, colors, type and icon size; fix differences or explain them (a browser
default, a deliberate code behavior). Show the user the pair for the main story.

## 6. Record
- Add the component to `COMPONENTS.md` in the code library (name, Figma page, stories, tests,
  status).
- Task in `eggux/tasks.md` (Stage: build, Deliverable: component + stories, Links:
  `component:<Name>`) moved to review.
- If the code needed a behavior Figma does not show, add it to the code mapping row the user's
  project keeps, or propose it for `references/code-mapping.md`.

## Update mode
When the Figma component changed (`/eggux:update-component` output or a decision): read the
changed properties, update the component and its stories, run the tests, compare again. Breaking
prop changes are listed for the user with the screens that use them.
