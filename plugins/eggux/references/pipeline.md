# Pipeline and deliverables

How work moves through an EGG UX project, what each stage delivers and which skill does it. The
task list (`eggux/tasks.md`, `/eggux:board`) uses these nine stages; every task names one stage
and one deliverable.

## Stages

| # | Stage | Deliverable (done when) | Skill |
|---|---|---|---|
| 1 | Discovery | Objects, actors and workflows written; research synthesis with the top problems | `discovery`, `brand-intake` |
| 2 | Decisions | Every request in the Inbox is a numbered decision with scope and a way to verify | `decision-log` |
| 3 | Design | Screens in Figma for every flow, all states (empty, loading, error, long content, no access), desktop and mobile; new components approved | `new-feature`, `build-ui`, `new-component`, `update-component` |
| 4 | Review | Heuristic, accessibility and responsive review with findings fixed or recorded | `review`, `responsive`, `audit-tokens` |
| 5 | Handoff | Each screen links its feature spec (scenarios, edge cases), components map to code (`code-mapping.md`), open questions closed | `update-feature`, `tidy-component` |
| 6 | Build | Code components and screens on the client stack, tokens from Figma variables, stories for every state that pass their tests | `code-setup`, `code-component`, `build-ui` (code) |
| 7 | QA | Built UI compared with Figma (visual), keyboard and screen reader pass, contrast, widths 360 to 1440 | `code-qa`, `review` |
| 8 | Release | Changelog, version, migration notes for anything renamed or removed | manual |
| 9 | Feedback | Usage, support and client feedback back in the Inbox as one-line requests | `decision-log`, notes |

Rules:
- A decision comes before the work it changes: Inbox, then decision, then design and code.
- A task moves to Review when its deliverable exists; Done when it is reviewed or verified.
- Work that skips a stage says why in the task notes (a copy change needs no discovery).

## Deliverables by role

### UI/UX designer
- Problem statement and research synthesis (who, what hurts, evidence).
- Flows and information architecture (`workflows.md`, feature folders with F-xx, S-xx, E-xx).
- Screens in Figma for every state and width, built from the library.
- Prototype for the main flows; usability test plan and results.
- Annotations: behavior, content, edge cases; decisions recorded, never only in chat.

### Design engineer
- Coded components whose props match the Figma variants and properties.
- Token pipeline: Figma variables to CSS variables (Light, Dark, themes, density).
- Stories for every state of every component (Storybook or an equivalent), including long text
  and narrow widths from the stress test.
- Accessibility in code: keyboard, focus, ARIA, reduced motion.
- Tests: interaction, accessibility (axe) and visual regression on the stories.
- Code Connect mappings so Figma shows the real code; design QA reports on built screens.

### Design system maintainer
- Tokens in tiers (Primitives, Semantic, Components) with modes, documented in `tokens.md`.
- The Figma library and the code library in sync, one name per component.
- Documentation per component: when to use, anatomy, properties, rules, accessibility, code.
- A contribution path: proposal, review, approval, release (`new-component`, `update-component`).
- Versions, changelog, deprecations and migration notes.
- Audits on a schedule: tokens, contrast, responsive, unused and detached components.
- Adoption measures: library coverage on screens, detached instances, components never used.
