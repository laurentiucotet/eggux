# EGG UX

A Claude Code plugin for running client UI projects on a shadcn-based design system:
discovery, brand intake into Figma, building UI from the library, a decision log and UX review.

EGG UI is a generalist design system, complete enough for any product (SaaS, e-commerce,
fintech, booking, content, internal tools, back office), with domain-neutral components, two
themes (Default and Corporate, each Light and Dark), an enterprise pack (data grid, filter
builder, approvals, audit log, roles and permissions, reports) and a validated chart palette,
motion and density tokens.

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

EGG UI v2 has foundations (variables, text and effect styles, density, motion, chart palette),
78 Lucide icons and components for actions, forms, selection, overlays, navigation, feedback,
data display (tables on auto-layout grid, charts, description list, timeline), dates and
scheduling, files, content (code block, table of contents, rich text editor), communication
(comments, chat), AI chat, commerce, Kanban, Rating, Carousel, Color Picker, tour and video. On top: Field Presets,
Blocks by category (AI, app, commerce, content, forms, hero, navigation, results, sections) and 7
Page Shells (app, marketing, auth, mobile, wizard, split view, docs), plus a Brand page with the
logo and a theme preview. Content areas use Figma native slots.
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
3c. Done: Rich Text Editor, comments (Comment, Comment Composer, Comments block), chat (Chat
   Message, Typing Indicator, Chat Composer, Conversation block), month view, Rating, Carousel,
   Color Picker.
3d. Done: AI chat (Prompt Input, Attachment, User and Assistant Message, Reasoning, Tool Call
   with approval, Sources, Citation, Suggestion) and AI blocks (empty chat, conversation,
   assistant panel, inline AI), with the `ai-chat` pattern.
3e. Done: tour (Coachmark, Hotspot, spotlight example), Video Player with `video/*` tokens.
3g. Done: Corporate theme (Corporate Light / Dark modes) and enterprise pack: data grid with
   saved views, groups and totals, Filter Builder, Approvals, Audit Log, Roles & Permissions,
   Report, Record Form, Save Bar, Org Switcher; dense examples and a theme comparison.
3f. Done: Community preparation: Cover, Intro, Foundations pages, neutral content audit,
   listing copy in [`references/community-release.md`](plugins/eggux/references/community-release.md).
4. Later: more charts (pie, donut, heatmap).
5. System: CHANGELOG, Code Connect, documentation site.

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
