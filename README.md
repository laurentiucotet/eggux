# EGG UX

A Claude Code plugin for running client UI projects on a shadcn-based design system:
discovery, brand intake into Figma, building UI from the library, a decision log and UX review.

Figma master library: [EGG UI v2](https://www.figma.com/design/BufvaVkSh9vMWPye117Ucd/EGG-UI---v2)

## Install

```bash
claude plugin marketplace add laurentiucotet/eggux
claude plugin install eggux@eggux
```

Inside a session: `/plugin marketplace add laurentiucotet/eggux`, then `/plugin install eggux@eggux`.
Update later with `claude plugin marketplace update eggux`.

The skills that touch Figma need the Figma MCP server connected.

## Skills

| Skill | What it does |
|---|---|
| `/eggux:init` | Creates the `eggux/` folder in a client project from templates |
| `/eggux:discovery` | Interview notes → objects (OOUX), actors, workflows |
| `/eggux:brand-intake` | Brand assets → `brand.md` + Semantic variables in the client's Figma file |
| `/eggux:build-ui` | Designs and builds screens from the library, following client files |
| `/eggux:decision-log` | Records decisions and terminology, propagates them to Figma and code |
| `/eggux:review` | Nielsen heuristics + EGG UX rules + token and workflow checks |
| `/eggux:audit-tokens` | Checks Figma variables (aliases, code syntax, scopes, contrast) and scans components for raw values |
| `/eggux:add-component` | Adds a component, preset, block or page shell to the library the EGG way, with QA and docs |

## How it is organized

The plugin holds the method; each client project holds its answers.

```
plugins/eggux/
├── references/          tokens, Figma inventory, Figma API notes, client file convention
└── skills/
    ├── init/templates/  brand, objects, actors, workflows, decisions
    ├── discovery/       OOUX method
    ├── brand-intake/
    ├── build-ui/        ux-rules.md, patterns/, components/
    ├── decision-log/
    ├── review/          Nielsen heuristics
    ├── audit-tokens/    audit.js, scan-components.js, run through Figma MCP
    └── add-component/   workflow for extending the library

client-project/
└── eggux/               brand.md, objects.md, actors.md, workflows.md, decisions.md
```

Precedence: client `decisions.md` > client `brand.md` overrides > plugin base rules.

Visual specs live in Figma and are read through MCP. The Markdown files hold what Figma cannot
express: when to use what, behavior, rules.

## Token tiers

`Primitives` (raw scales, hidden colors) → `Semantic` (brand layer, Light/Dark, shadcn CSS names)
→ `Components` (only when a component must deviate). Details in
[`plugins/eggux/references/tokens.md`](plugins/eggux/references/tokens.md).

## Figma library status

EGG UI v2 has foundations (variables, text and effect styles), 39 Lucide icons and components
for buttons, badges, chips, avatars, separators, forms (Input, Field, Select, Checkbox, Radio,
Switch), menus, tabs, tooltips, skeletons, alerts, toasts, dialogs, sheets and drawers, popovers, combobox, calendar and date picker, pagination, stepper, description list, timeline, cards, tables on auto-layout
grid and the sidebar, plus Field Presets (email, password, phone, card, address) and Blocks
organized by category (navigation, hero, sections, forms, app: record page, booking, notifications, multi-step form), Page Shells (app, marketing, auth),
and a Brand page with the logo and a theme preview. Content areas use Figma native slots.
Inventory and conventions: [`plugins/eggux/references/figma-library.md`](plugins/eggux/references/figma-library.md).

## What the pack covers

- **Patterns:** delete confirmation, empty state, form validation, form presets, loading states,
  search and filter, feedback messages, unsaved changes.
- **Components:** alert, avatar, badge (and chip), button, card, dialog, dropdown menu, input,
  select and choice inputs, sidebar, skeleton, table, tabs and toggle group, toast, tooltip,
  list and tree, accordion, navigation (breadcrumb, top bar, page header, navbar).

## Growing the pack

- New universal rule → one line in `build-ui/ux-rules.md`.
- Rule that needs explanation → new file in `build-ui/patterns/`.
- Component usage guidance → new file in `build-ui/components/`.
- Bump `version` in `plugins/eggux/.claude-plugin/plugin.json` so installs pick up the change.
- Validate before pushing: `claude plugin validate .`
