---
name: code-component
description: Build or update one EGG UI component in code from its Figma component, with Storybook stories and tests (interaction, keyboard, sizes, accessibility in every theme, stress cases), until the tests pass and the story matches Figma. Use when the user says "creează componenta asta", "fă Select-ul în cod", "adaugă Dialog în Storybook", gives a Figma link or a component name and wants it in code, or when a Figma component changed and its code must follow.
---

# Code component

One component per run, plus the components it contains that are not in code yet (step 1, item 5).
Tests are part of the component: a component without passing stories is not done. Needs the code library from `/eggux:code-setup`.

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
   target. `get_design_context` only when the reference lacks a detail. On a section or a page
   (`<Name> / Component`) it returns only a sparse outline: run `get_metadata` on the section to
   get the variant symbol ids, then `get_design_context` on each variant you need.
5. Dependencies: list every library component the requested one contains: its "Built from" line,
   the instances in its variants (`get_metadata` / `get_design_context` name them: Badge Count,
   Field, Spinner, Alert...) and the default content of its slots. Check each against
   `COMPONENTS.md`. Every one missing from Storybook is created in this same run, before the
   requested component, without asking: tell the user the list in one line ("Collapsible needs
   Field, which is not in code yet: I build Field first"), then build each one completely with
   this skill (file, stories, tests, `COMPONENTS.md` row), and repeat for their own dependencies
   until all are in code. The requested component then imports them; never inline a copy of
   another library component. Only when a dependency is very large (a whole other page) ask
   whether to build it now; if the user says no, inline the minimum, mark it
   `// TODO <Component>` and note it in the `COMPONENTS.md` row.
6. Client overrides: `eggux/decisions.md` (a decision about this component wins) and
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
- Disabled with slots: a disabled component must disable what is put in its slots too. Wrap each
  slot in `<fieldset disabled={disabled} className="m-0 min-w-0 border-0 p-0">`; fading the
  container alone leaves the slotted buttons active and fails axe contrast.
- Top comment: the Figma component and page it implements.

## 3. Write the stories and tests
`src/components/ui/<name>.stories.tsx`. Every story is a test (`npm test`): it must render,
pass axe (`a11y.test = 'error'` in preview) and pass its `play` function.
- Title follows the Figma page, so the sidebar groups like the library: `Components/<Figma page>/<Component>`
  when the page holds several components (`Components/Table/Table Cell Status`,
  `Components/Accordion/Show More`), `Components/<Component>` when it is the only one on its page
  (Button, Spinner). The Figma page is the one in the `COMPONENTS.md` row.
- `Default` with a play test of the main interaction (click, type, open, select) using
  `storybook/test` (`expect`, `userEvent`, `fn`) and the accessible role and name.
- One story per Figma variant group (Variants, Sizes, Styles), with a play test of the measured
  sizes the reference states (heights, widths).
- One story per state Figma has: disabled, loading, invalid, read-only, open, empty; each with a
  play test of what the state must do (blocks clicks, `aria-invalid` with a description, value
  cannot change).
- Keyboard: Tab reaches it, Enter or Space activates, Escape closes overlays, arrows move in
  lists and groups; focus returns where it came from.
- Stress checks from the Figma stress test: long text, the 276 / 368 px columns, many items,
  missing optional parts; play tests check one line, truncation or wrapping as the resize
  contract says. They are tests, not documentation: put them in one `Stress` story per component
  (several cases rendered side by side) tagged `tags: ['!dev']`, hidden from the sidebar.
- Sidebar stories stay few: Default, the variant groups and the states people need to see.
- Theme checks: the main visual story again with `globals: { theme: 'Dark' }` and
  `globals: { theme: 'Corporate Light' }`, so axe checks contrast in each mode. Tag them
  `tags: ['!dev']`: hidden from the sidebar (people switch themes with the toolbar), still run by
  `npm test`. One copy per theme, never a sidebar story per theme.
- `parameters.docs.description.component`: the one-line rule, the Figma location and the guide.
- Content in plain English, domain-neutral (Acme, EUR), no lorem ipsum.

## 4. Run until green
`npm run typecheck` and `npm test -- src/components/ui/<name>.stories.tsx`. Fix the component,
not the test, unless the test is wrong about Figma. An axe failure is a real defect: fix it with
tokens; when the token itself fails (contrast of a Figma value), report it as a design finding
(Inbox line in `eggux/decisions.md`) instead of overriding it in code.

## 5. Compare with Figma
`npm run build-storybook`, then `node scripts/screenshot-stories.js <out> components-<name>--<story>`
for the main stories (the id follows the story title: `AI Chat/Tool Call` → `ai-chat-tool-call--<story>`,
`Components/Table/Table Toolbar` → `components-table-table-toolbar--<story>`),
and put them next to the Figma screenshots of the same variants. Check
sizes, spacing, radius, colors, type and icon size; fix differences or explain them (a browser
default, a deliberate code behavior). Show the user the pair for the main story.
A `storybook dev` server started before the component file existed does not generate the new
Tailwind classes: the story shows unstyled while the tests pass. Restart it before looking at
new components in the dev server.

## 6. Record
- Add the component to `COMPONENTS.md` in the code library (name, Figma page, stories, tests,
  status).
- Task in `eggux/tasks.md` (Stage: build, Deliverable: component + stories, Links:
  `component:<Name>`) moved to review.
- If the code needed a behavior Figma does not show, add it to the code mapping row the user's
  project keeps, or propose it for `references/code-mapping.md`.

## A whole Figma page
A link to a page or to several sections (an AI Chat page holds 19 components) is more than one
run.
1. List the components on the page (`get_metadata`, `<Name> / Component` sections) with what
   `COMPONENTS.md` already has, and ask how many to build now; offer the core set that makes the
   page usable first.
2. Order them by "Built from": shared dependencies first (step 1, item 5), then the components.
3. For many components, split them into groups and run one agent per group in parallel. Each
   agent gets this skill, the page reference, its section ids and the components already done as
   the style reference, and owns only its own new `<name>.tsx` / `<name>.stories.tsx` files.
   Shared files are the orchestrator's alone: `button.tsx` and other existing components,
   `icons/` (`npm run icons`), `globals.css`, `tokens.css`, `package.json`, `COMPONENTS.md`,
   `eggux/tasks.md`, `eggux/decisions.md`. Agents report missing icons, shared changes and design
   findings instead of making them, and run tests only on their own story files.
4. After all agents: apply the shared changes, run `npm run typecheck` and the full `npm test`,
   do the Figma comparison (step 5) once for the whole page (parallel builds would overwrite
   `storybook-static`), then record every component (step 6) and the findings in one place.

## Update mode
When the Figma component changed (`/eggux:update-component` output or a decision): read the
changed properties, update the component and its stories, run the tests, compare again. Breaking
prop changes are listed for the user with the screens that use them.
