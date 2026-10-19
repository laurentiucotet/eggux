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
| `/eggux:audit-tokens` | Checks Figma variables: aliases, code syntax, scopes, contrast in Light and Dark |

## How it is organized

The plugin holds the method; each client project holds its answers.

```
plugins/eggux/
├── references/          token architecture, Figma inventory, client file convention
└── skills/
    ├── init/templates/  brand, objects, actors, workflows, decisions
    ├── discovery/       OOUX method
    ├── brand-intake/
    ├── build-ui/        ux-rules.md, patterns/, components/
    ├── decision-log/
    ├── review/          Nielsen heuristics
    └── audit-tokens/    audit.js, run through Figma MCP

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

EGG UI v2 has foundations (variables, text and effect styles) and these components: Button,
Button Icon, Badge, Input, Field, Alert, Card (with a native content slot) and 14 Lucide icons. Inventory and
conventions: [`plugins/eggux/references/figma-library.md`](plugins/eggux/references/figma-library.md).

## What the pack covers

- **Patterns:** delete confirmation, empty state, form validation, loading states, search and
  filter, feedback messages, unsaved changes.
- **Components:** alert, badge, button, card, dialog, dropdown menu, input, select and choice
  inputs, skeleton, table, tabs, toast, tooltip.

## Growing the pack

- New universal rule → one line in `build-ui/ux-rules.md`.
- Rule that needs explanation → new file in `build-ui/patterns/`.
- Component usage guidance → new file in `build-ui/components/`.
- Bump `version` in `plugins/eggux/.claude-plugin/plugin.json` so installs pick up the change.
- Validate before pushing: `claude plugin validate .`
