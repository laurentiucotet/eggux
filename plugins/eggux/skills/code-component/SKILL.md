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
- Reuse before you build. When the markup looks like a library part (pills = Chip in a Chip Group,
  a row = List Item, a group of toggles = Toggle Group, a field = Field, a bar of actions = Bulk
  Action Bar), find it first (`npm run kit -- --list`, or grep `src/components/ui`) and compose it.
  A hand-made copy drifts from the library: Response Feedback had its own pill buttons until it
  was moved to Chip.
- Do not make state depend on an effect that a key press or a test can beat. Effects from the first
  render run a moment after it. A ref flag set by a key handler and read in an effect ("move focus
  to the next day") must carry the target value and wait for the render that holds it (Calendar);
  rows that must take focus get `tabIndex` in the JSX, not from an effect (JSON viewer rows).
- No `export type` or other non-story export in a stories file: Chromatic indexes it as a story that
  does not exist and the whole publish fails.
- Top comment: the Figma component and page it implements.

## 3. Write the stories and tests
`src/components/ui/<name>.stories.tsx`. Every story is a test (`npm test`): it must render,
pass axe (`a11y.test = 'error'` in preview) and pass its `play` function.

**First decide where each variation goes** (`references/storybook-structure.md` has the full table).
Most of what people want to look at is not a story:
- The environment (light or dark, Platform or Back office, the width) is the **toolbar**. Never a story
  per theme or per width for looking.
- A value of a prop (variant, size, show icon, disabled, count, a text of any length) is a **control**
  of the `Default` playground. There is no "long text" story and no "short text" story: the text is a
  control. Long text and narrow columns are a hidden check.
- A set to compare at a glance (all variants, all sizes) is **one gallery story**, not one story each.
- A state or a flow that needs setup (open, loading, empty, a keyboard path) is a story only if
  someone opens it by name.
- Checks (stress, dark and Back office copies for contrast, edge cases) are **hidden** (`!dev`).
A visible story must teach something the Default with its Controls and the toolbar cannot. A
component ends with two to six visible stories; more means controls or checks leaked into the sidebar.
- Title: `Components/<Family>/<Component>` when the family holds several components
  (`Components/Table/Table Cell Status`, `Components/AI Chat/Prompt Input`), `Components/<Component>`
  when it stands alone (Button, Spinner). The family is the Figma page in the `COMPONENTS.md` row; a
  product area (AI Chat) is a family, not a section. A composition of components with real content
  is a Block (`Blocks/<Family>/<Name>`, no play function) and a whole screen is a Page
  (`Pages/<Area>/<Screen>`). Sections are fixed: Foundations, Components, Blocks, Pages
  (`references/storybook-structure.md`).
- `Default` is a playground: every option of the component is a control, in two groups in the
  Controls panel (the component's own props; the parts it holds). Rules:
  - `argTypes` with a readable `name` ("Show leading icon"), `control` (inline-radio for 2 to 3
    choices, select for more, boolean, text, range with min and max for counts and widths), a one
    line `description` and `table.category`.
  - Options that live on child parts (icon, meta, count, badge, description, disabled) are story
    switches that set the same thing on every child ("Show meta"); the render maps them to the
    child props.
  - Leave `component` out of the meta, so docgen does not add value, dir or handlers to the panel.
    `.storybook/preview.tsx` already hides functions, React nodes, arrays and objects.
  - `defaultOpen` and similar start-only props: give the root a `key` of the control, so changing
    it remounts (an Open switch for overlays).
  - A Width range for anything that resizes, so people see the resize contract and breakpoints.
  - The playground has no `play` (a failed assertion after a control change would turn the
    Interactions panel red). Its checks live in a hidden twin: `export const DefaultCheck` with
    `tags: ['!dev']` and the play function. Stories that spread `DefaultCheck` (theme copies) must
    write `tags: ['!dev']` themselves: tags are read from the source, not from the spread.
  - A story whose render ignores args sets `parameters: { controls: { disable: true } }`, so no
    switch does nothing.
  The play test of the main interaction uses `storybook/test` (`expect`, `userEvent`, `fn`) and
  the accessible role and name.
- One gallery story per Figma variant group (Variants, Sizes, Styles): every variant side by side, with
  a play test of the measured sizes the reference states (heights, widths). Not one story per variant.
- A state that is a prop (disabled, invalid, read-only) is a control, and its check (blocks clicks,
  `aria-invalid` with a description, value cannot change) runs in the hidden `DefaultCheck` or a hidden
  `States` story. A state that needs setup (open, loading with data, empty list) is a story when people
  open it by name, with its play test.
- Keyboard: Tab reaches it, Enter or Space activates, Escape closes overlays, arrows move in
  lists and groups; focus returns where it came from.
- Stress checks from the Figma stress test: long text, the 276 / 368 px columns, many items,
  missing optional parts; play tests check one line, truncation or wrapping as the resize
  contract says. They are tests, not documentation: put them in one `Stress` story per component
  (several cases rendered side by side) tagged `tags: ['!dev']`, hidden from the sidebar.
- Sidebar stories stay few: Default (the playground), the variant groups and the states people need
  to see. A manager opens these from a link: a story with a play function runs it on open and
  leaves its end state on screen (an example table left filtered), so example and demo stories
  carry no play; their checks go to a hidden twin like `DefaultCheck`.
- Titles may nest, one level per `/`, three levels at most:
  `Components/Table/Cells/Table Cell User`. Use it for a family of five or more parts.
- Theme checks: the main visual story again with `globals: { theme: 'Dark' }` and
  `globals: { theme: 'Corporate Light' }` (Corporate is the Back office look in the toolbar), so axe checks contrast in each mode. Tag them
  `tags: ['!dev']`: hidden from the sidebar (people switch themes with the toolbar), still run by
  `npm test`. One copy per theme, never a sidebar story per theme.
- `parameters.docs.description.component`: the one-line rule, the Figma location and the guide.
- Content in plain English, domain-neutral (Acme, EUR), no lorem ipsum.
- Tests wait for the page. A play function starts right after the first render in Chromatic
  (a toast mounts 13 ms later, focus moves in an effect, a scroll position is set in an effect). Read
  state that comes from an effect, a timer or a state update after an action with
  `await waitFor(() => expect(...))` or `findBy*`: focus after Tab or an arrow, scroll position,
  popovers and toasts, live-region text, `aria-expanded` after a key. Send keys one at a time when
  the next key depends on where the last one moved the focus. Move the pointer far away
  (`userEvent.pointer({ target: document.body, coords: ... })`) to close a hover card or tooltip;
  `unhover` alone keeps Radix's grace area open.

## 4. Run until green
`npm run typecheck` and `npm test -- src/components/ui/<name>.stories.tsx` (a few files at a time,
never the whole suite in one run). Fix the component, not the test, unless the test is wrong about
Figma. An axe failure is a real defect: fix it with
tokens; when the token itself fails (contrast of a Figma value), report it as a design finding
(Inbox line in `eggux/decisions.md`) instead of overriding it in code.

## 5. Compare with Figma
`npm run build-storybook`, then `node scripts/screenshot-stories.js <out> components-<name>--<story>`
for the main stories (the id follows the story title: `Components/AI Chat/Tool Call` → `components-ai-chat-tool-call--<story>`,
`Components/Table/Table Toolbar` → `components-table-table-toolbar--<story>`,
`Blocks/Table/Examples` → `blocks-table-examples--<story>`),
and put them next to the Figma screenshots of the same variants. Check
sizes, spacing, radius, colors, type and icon size; fix differences or explain them (a browser
default, a deliberate code behavior). Show the user the pair for the main story.
A `storybook dev` server started before the component file existed does not generate the new
Tailwind classes: the story shows unstyled while the tests pass. Restart it before looking at
new components in the dev server.

## 5b. Same stories as the review link
`npm run build-storybook && npm run check:stories -- --filter <name>` opens the stories of the
production build in a fresh page the way Chromatic does (no dev server, play starts at once). A
failure here that passes in `npm test` is a test or a component that reads state too early; fix
it as in step 3 ("Tests wait for the page"). Run the whole check before a push that publishes
(`/eggux:storybook-publish`).

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
