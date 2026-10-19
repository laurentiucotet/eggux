# EGG UX

A Claude Code plugin for running client UI projects on a shadcn-based design system:
discovery, brand intake into Figma, building UI from the library, a decision log and UX review.

EGG UI is a generalist design system, aiming to be complete for any product (SaaS, e-commerce,
fintech, booking, content, internal tools), with domain-neutral components and a validated
chart palette, motion and density tokens.

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
├── references/          tokens (incl. density, motion, chart palette), Figma inventory, Figma API notes, client file convention
└── skills/
    ├── init/templates/  brand, objects, actors, workflows, decisions
    ├── discovery/       OOUX method
    ├── brand-intake/
    ├── build-ui/        ux-rules.md, index.md (screen → shell, blocks, guides), patterns/, components/
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

EGG UI v2 has foundations (variables, text and effect styles), 43 Lucide icons and components
for buttons, badges, chips, avatars, separators, forms (Input, Field, Select, Checkbox, Radio,
Switch), menus, tabs, tooltips, skeletons, alerts, toasts, dialogs, sheets and drawers, popovers, combobox, calendar and date picker, pagination, stepper, description list, timeline, time picker, input OTP, file upload, progress, slider, charts (bar, line, area, sparkline, chart card), spinner, kbd, status dot, cards, tables on auto-layout
grid and the sidebar, plus Field Presets (email, password, phone, card, address) and Blocks
organized by category (navigation, hero, sections, forms, app: record page, booking, notifications, multi-step form), Page Shells (app, marketing, auth, mobile),
and a Brand page with the logo and a theme preview. Content areas use Figma native slots.
Inventory and conventions: [`plugins/eggux/references/figma-library.md`](plugins/eggux/references/figma-library.md).

## Roadmap

1. Done: foundations (chart palette, motion, density), charts, spinner, kbd, status dot.
2. Done (high-use first): Input Group, Number Input, Button Group, Split Button, Tag Input /
   multi-select, Date Range Picker, Hover Card, Wizard shell, result pages, auth flows.
3. Done: Navigation Menu, Command Palette, search suggestions, Split View shell, SaaS admin blocks
   (team, billing, profile, onboarding, API keys, notifications, integrations), commerce blocks;
   default content made domain-neutral.
3b. Done: content (Post Card, Code Block, Table of Contents, Blog List, Article, Docs shell),
   marketing sections (Logo Cloud, Team, Contact, Newsletter, Comparison Table), Kanban, Scheduler.
3c. Next: rich text editor, comments thread, chat, carousel, rating, color picker, month view.
4. Later: Table of Contents, Tour, Docs shell, Rating, Color Picker, more charts.
5. Blocks per vertical: SaaS admin (onboarding, billing, team, profile, integrations, API keys),
   commerce (product, cart, checkout, orders), content (blog, article, docs), auth (reset, 2FA,
   invite), communication (inbox, chat, comments).
6. Advanced display: Scheduler, Kanban, Carousel, Rich Text Editor, Code Block, Prose.
7. System: CHANGELOG, Code Connect, documentation site.

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
