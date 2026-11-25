# Pipeline and deliverables

How one designer moves a project from the first brief to shipped screens with EGG UX. You do
the UX, the UI in Figma and, when the project needs it, the components and screens in code.
The task list (`eggux/tasks.md`, `/eggux:board`) uses these nine stages; every task names one
stage and one deliverable.

## Day 1: jump start
`/eggux:start` sets up a new project in one go: the `eggux/` folder, a first context drafted from
whatever the client sent (briefs, notes, screenshots, documents), the unknowns as questions in
Decide, the brand in the client's Figma copy of EGG UI and, when there is a codebase, EGG UI
in code with Storybook. You start with a map of the product, a list of questions for the
client and a design system in Figma and code, instead of a blank file.

## Stages

| # | Stage | You deliver (done when) | Skills | When |
|---|---|---|---|---|
| 1 | Discovery | Actors, objects and workflows written; research with accepted findings; unknowns in `questions.md` | `start`, `discovery`, `brand-intake`, board (Context, Documents, Understand) | always |
| 2 | Decisions | Every question decided and every Inbox request a numbered decision with scope and a way to verify | `decision-log`, board (Decide, Decision log) | always |
| 3 | Design | A feature folder per feature; screens in Figma for every state and width, built from the library; new components approved | `new-feature`, `update-feature`, `build-ui`, `new-component`, `update-component` | always |
| 4 | Review | Heuristic, accessibility and responsive review; findings fixed or recorded | `review`, `responsive`, `audit-tokens` | always |
| 5 | Handoff | `features/<slug>/handoff.md` at `ready for dev`: done-when list, screens and states with Figma links, components with props, rules, final copy, no blocking question | `new-feature`, `update-feature` | always |
| 6 | Build | Components and screens in code on the client stack, tokens from Figma variables, a story for every state that passes its tests | `code-setup`, `code-component`, `kit-trim`, `storybook-*`, `build-ui` (code) | when you code, or a developer builds from the handoff |
| 7 | QA | Built UI compared with Figma, keyboard and screen reader pass, contrast, widths 360 to 1440, every story green | `code-qa`, `review` | always: you check what was built, by you or a developer |
| 8 | Release | Storybook published, changelog and migration notes for anything renamed or removed | `storybook-publish` | when you own the component library in code |
| 9 | Feedback | Usage, support and client feedback back in the Inbox as one-line requests | `decision-log`, notes | always |

Rules:
- A decision comes before the work it changes: question or Inbox, then decision, then design and
  code.
- A task moves to Review when its deliverable exists; Done when it is reviewed or verified.
- Work that skips a stage says why in the task notes (a copy change needs no discovery).

## Questions and decisions: two ways in
- **Decide** (`questions.md`, Q-xxx): something is not decided yet. It comes from an accepted
  research finding, an unknown from discovery or a feature, or a blindspot. You get options with
  pros and cons, choose one, and it becomes a `proposed` decision.
- **Inbox** (`decisions.md`): the client already decided ("the button is now Request access").
  You write one line; `decision-log` turns it into a decision.
Both end in `decisions.md`, made exact, applied in Figma and code and verified by
`decision-log`.

## What you deliver, by medium
### In Figma
- Context and research synthesis (who, what hurts, evidence), the questions and decisions.
- Flows (`features/<slug>/workflows.md`, F-xx), scenarios and edge cases (S-xx, E-xx).
- Screens for every state and width, built from the library; annotations for behavior, content
  and edge cases.
- Prototype for the main flows when the client needs one.

### In code (when the project needs it)
- Components whose props match the Figma variants and properties, with a story for every state,
  long text and narrow widths, passing interaction and accessibility tests.
- Tokens from the Figma variables (Light, Dark, themes) as CSS variables.
- Screens built from those components, checked against Figma.

### For whoever builds it
- `handoff.md` per feature: the one file a developer, or you on a later day, builds from. The
  board shows it screen by screen (route, states, components, copy, scenarios).

## Keeping the library healthy
EGG UI is yours across projects. When a project changes a component, the change goes through
`update-component` (Figma) and `code-component` (code), and the board's Components view shows
which screens of which features use it, so you know what to recheck. `tidy-component`,
`audit-tokens` and `code-qa` keep both sides in sync.
