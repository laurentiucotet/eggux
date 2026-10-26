# EGG UX

A Claude Code plugin for running client UI projects on a shadcn-based design system:
discovery, brand intake into Figma, building UI from the library, a decision log and UX review.

EGG UI is a generalist design system, complete enough for any product (SaaS, e-commerce,
fintech, booking, content, internal tools, admin panels), with domain-neutral components, two
themes (Default: blue primary, pill controls, 12 px cards and Plus Jakarta Sans; Corporate:
slate, square and Inter; each Light and Dark) plus a Showcase rebrand demo, an enterprise pack (data grid, filter
builder, approvals, audit log, roles and permissions, reports) and a validated chart palette,
motion and density tokens.

**Get the Figma library:** [EGG UI on Figma Community](https://www.figma.com/community/file/1694044412384019384). Duplicate it into your
workspace and start from there; client files start as a copy of it.

At a glance: 367 components on 74 pages, 245 blocks, 8 page shells, 93 complete screens and
email templates (SCREENS: Auth, Account, Settings, Emails), 4 full showcase pages, 667 variables in five
collections (Default and Corporate themes, Light and Dark, Density, Content in English and
Română), 16 text styles, 4 gradient styles, 110 Lucide icons, 6 brand icons, 12 sample logos and 56 sample
images (49 photos, 7 product screenshots). The plugin adds 12 skills, 32
patterns and 38 component guides.

## Install

```bash
claude plugin marketplace add laurentiucotet/eggux
claude plugin install eggux@eggux
```

Inside a session: `/plugin marketplace add laurentiucotet/eggux`, then `/plugin install eggux@eggux`.
Update later with `claude plugin marketplace update eggux`.

The skills that touch Figma need the Figma MCP server connected. Start a client file from the
[Community library](https://www.figma.com/community/file/1694044412384019384) so the component names, variables and pages match what the skills expect.

### Client decisions
Each client project keeps `eggux/decisions.md`. Write a request in its Inbox, one line with date,
time and who asked (`- 2026-10-21 09:15 · Andrei: cards with 12 px padding instead of 24`), then
run `/eggux:decision-log`: Claude makes it exact (tokens, scope), checks conflicts and
accessibility, applies it once at the source in Figma and code, and verifies the work
(statuses proposed → approved → applied → verified). A SessionStart hook reminds Claude of the
file and of new Inbox lines at the start of every session; build-ui reads it first and review
checks every applied decision.

## Skills

| Skill | What it does |
|---|---|
| `/eggux:init` | Creates the `eggux/` folder in a client project from templates |
| `/eggux:discovery` | Interview notes → objects (OOUX), actors, workflows |
| `/eggux:brand-intake` | Brand assets → `brand.md` + Semantic variables in the client's Figma file |
| `/eggux:new-feature` | Interviews you about a feature idea (actors, flows, data, scenarios, edge cases, states, feedback), writes `eggux/features/<slug>/` (feature, scenarios, workflows, decisions) and creates the feature's Figma page with a section per flow, scenario and edge case |
| `/eggux:update-feature` | Takes new input (decisions, details, comments, notes) and updates every file and Figma section it touches, marks affected screens "Needs update", archives superseded frames, checks that everything agrees and logs the change |
| `/eggux:build-ui` | Designs and builds screens from the library, following client files |
| `/eggux:decision-log` | Turns Inbox requests into decisions, applies them in Figma and code, verifies the work |
| `/eggux:review` | Nielsen heuristics + EGG UX rules + token and workflow checks |
| `/eggux:audit-tokens` | Checks Figma variables (aliases, code syntax, scopes, contrast) and scans components for raw values |
| `/eggux:new-component` | From a screenshot or description to an approved component: reuse map, proposal, build, stress test (min, typical, max content), review, docs and records |
| `/eggux:update-component` | After you edit a component by hand in Figma: finds what changed (snapshot diff), plays it back, polishes it (tokens, all variants, properties, layout), checks decisions, UX rules and affected instances, re-runs the stress test, reviews, then updates the doc, snapshot and records |
| `/eggux:tidy-component` | Cleans up a component (tokens, clip, names, description) and lays out its page in one row per component: Docs (generated doc frame), Component, Stress test, Examples (the component in real screens); builds a missing stress test and examples |

## How it is organized

The plugin holds the method; each client project holds its answers.

```
plugins/eggux/
├── hooks/               SessionStart reminder of the client's decisions.md and its Inbox
├── references/          tokens (incl. density, motion, chart palette), content strings, Figma inventory, Figma API notes, code mapping, client file convention
│   └── components/      generated reference: one file per component page (variants, properties, slots, parts, tokens, guides, code)
├── scripts/             component-docs.js (extract from Figma) + component-docs.py (write references/components)
└── skills/
    ├── init/templates/  brand, objects, actors, workflows, decisions
    ├── discovery/       OOUX method
    ├── brand-intake/
    ├── build-ui/        ux-rules.md, index.md (screen → shell, blocks, guides), patterns/, components/
    ├── decision-log/
    ├── review/          Nielsen heuristics
    ├── audit-tokens/    audit.js, scan-components.js, run through Figma MCP
    ├── new-feature/     interview → feature folder → Figma page with flows, scenarios, edge cases
    ├── update-feature/  new input → impact map → files and Figma page updated → consistency check
    ├── new-component/   screenshot or description → proposal → build → stress test → approval → docs
    ├── tidy-component/  cleanup → stress test → examples → page row: Docs, Component, Stress test, Examples
    └── update-component/ hand edit → snapshot diff → polish → impact → stress test → approval → docs

client-project/
└── eggux/               brand.md, objects.md, actors.md, workflows.md, decisions.md, features/<slug>/, components/
```

Precedence: client `decisions.md` > client `brand.md` overrides > plugin base rules.

Visual specs live in Figma and are read through MCP. The Markdown files hold what Figma cannot
express: when to use what, behavior, rules.

## Token tiers

`Primitives` (raw scales, hidden colors) → `Semantic` (brand layer, Light/Dark, shadcn CSS names)
→ `Components` (only when a component must deviate). Details in
[`plugins/eggux/references/tokens.md`](plugins/eggux/references/tokens.md).

## Figma library status

EGG UI v2 ([Community file](https://www.figma.com/community/file/1694044412384019384)) has foundations (variables, text and effect styles, density,
motion, chart palette, a `foreground/brand` text token), 110 Lucide icons and 6 brand icons, and components for actions, forms, selection, overlays, navigation, feedback,
data display (tables on auto-layout grid, charts, description list, timeline), dates and
scheduling, files, content (code block, table of contents, rich text editor), communication
(comments, chat, reactions, mentions), AI chat and AI states, commerce (product, cart, orders, account),
pricing, metrics, developer tools (endpoints, logs, diffs, JSON), automation, admin (integrations,
roles, API keys, sessions, SSO), sharing, notifications, surveys, Kanban, Rating, Carousel, Color
Picker, tour, video and audio. On top: Field Presets,
Blocks by category (AI, app, commerce, content, enterprise, forms, hero, navigation, page headers,
results, sections) and 8
Page Shells (app, marketing, auth, mobile, wizard, split view, docs, admin panel), plus a Brand page with the
logo and a theme preview. Content areas use Figma native slots.
Inventory and conventions: [`plugins/eggux/references/figma-library.md`](plugins/eggux/references/figma-library.md).
Per-component reference (generated from Figma): [`plugins/eggux/references/components/`](plugins/eggux/references/components/README.md).

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
3f. Done: published on [Figma Community](https://www.figma.com/community/file/1694044412384019384): Cover, Intro, Foundations pages, neutral content
   audit, listing copy in [`references/community-release.md`](plugins/eggux/references/community-release.md).
3h. Done: Donut / Pie, Bar Chart Horizontal, Heatmap; Import Mapping; Figma → code mapping
   ([`references/code-mapping.md`](plugins/eggux/references/code-mapping.md)) and
   [`CHANGELOG.md`](CHANGELOG.md).
3i. Done: block pages in Figma sections by family; 19 marketing and content blocks (contact,
   map, testimonials, CTA, blog, news, banner, features, hero, footer) and a Map component.
3j. Done: generic patterns (action feedback, bulk actions, permissions, errors and recovery,
   notifications, sharing, writing) and 14 common flows reused by discovery.
3k. Done: `/eggux:new-feature` interview and feature spec template.
3l. Done: `/eggux:new-component` with proposal, stress test, approval and component docs.
3m. Done: pricing, FAQ, stats, team, careers and gallery variants; Gauge, Treemap; Gantt.
3n. Done: Intro page; navbar variants (Centered, Search, Mega Menu), footer variants (Newsletter,
   Corporate, Centered); Help center family (hero, topics, popular, article list, support,
   docs page footer, changelog, status page) with a Help center example.
3o. Done: `/eggux:update-component` with snapshot diff, polish, impact and stress test.
3p. Done: features as folders (spec, scenarios, workflows, decisions) with a Figma page per
   feature; `/eggux:update-feature`.
3q. Done: Card variants, sizes, Elevation and density tokens; screen components: table cells,
   table pagination, filter bar and chips, faceted filter, filter sections, entity and progress
   cards, empty state.
3r. Done: AI components for agents and AI in the product (plan, artifacts, summary, suggested
   values, notice, model selector, context, voice, history, feedback).
3s. Done: Content collection (names and labels as variables, English and Română).
3t. Done: generated per-component reference (`references/components/`).
3u. Done: people picker, transfer list, inline edit, signature pad, sortable list, progress ring, scroll area, file preview, image cropper, avatar upload, menubar, cookie consent, funnel and scatter charts.
3v. Done: `/eggux:tidy-component` and the component page row (Docs, Component, Stress test, Examples); all 57 component pages (151 rows) with generated docs, stress tests and contextual examples.
3w. Done: admin panel shell test (grid page shell); Side Panel, Sidebar Double; Entity Card Actions slot; Sortable List Item 1:1 Leading image.
3x. Done: Page Headers blocks (detail, listing, search results, profile, event, topic, report, simple); Post Card compact.
3y. Done: Meta Item, Figure, Setting Row, Person Card; Tab counts.
3z. Done: Event Card and Date Tile, Resource Item, Quote.
3za. Done: Waterfall Chart and Combo Chart; project permission rules in .claude/settings.json.
3zb. Done (audit batch 1): Section Heading, Feature Item, Action Bar, Summary Row, Byline, Tag List; Avatar Group label; hand-built headings, button rows, totals, authors, tags, features and icon facts in blocks replaced by components.
3zc. Done (audit batch 2): Button loading, Button Icon sizes, Avatar square and xs, Sidebar Item level 2, Tab icon and vertical tabs, Menu Item description and submenu, rich Tooltip with shortcut, Progress tones, Image Placeholder 21:9 and locked ratios, Entity Card Show people, List Item without slots, five table cell parts, Pagination Compact; examples for empty state types and dialog sizes.
3zd. Done (0.50.0): 120 new components on 46 pages, among them forms (Copy Field, Search Field, Currency, Phone, Date and Duration inputs, Form Section, Fieldset, Error Summary), navigation and overlays (Page Toolbar, Account Menu, Notification Center, Welcome Dialog, Resizable Panels, Action Sheet, FAB), data and developer tools (Metric Strip, Usage Meter, Diff Viewer, JSON Viewer, Log Row, Endpoint Row), new charts (Distribution Bar, Bullet, Radar, Sankey, Choropleth, Dashboard Widget), commerce, pricing, admin, automation, sharing, surveys and AI states; 18 new icons.
3ze. Done (0.51.0): audit and consolidation: 6 merges, 10 wrappers turned into examples, 9 renames, naming conventions, quality fixes, about 45 blocks rebuilt on components.
3zf. Done (0.52.0): audit gaps closed: Uptime Bars, Pager Link, Image Figure, changelog lines, plan comparison cells, Location Card map, 5-role Permission Row, 25 components extended, 10 new blocks and a real example for every standalone component.
3zg. Done (0.53.0): lessons from a client home page rebuild test: `foreground/brand` token, card and section icons, list dividers, small Post Cards, event date on image, Hero Prompt block, brand icons; build-ui reproduces reference screens with a gap inventory and fidelity review.
3zh. Done (0.54.0): `Page Shell / Admin Panel` on the Page Shells page (grid shell for admin panel and CMS screens, Aside on / off); the test page is gone.
3zi. Done (0.55.0): Search Result Item with 8 types (page, record, person, file, media, product, event, answer) and per-type properties; Scroll Area content slot; separate List and Tree pages.
3zj. Done (0.56.0 to 0.58.0): de-wireframe program from audit 2: sample imagery and logos; soft badges, colored metrics, shadows, display type; EGG default theme (blue primary, pill controls, 12 px cards, Plus Jakarta Sans); Showcase modes, gradients, Background decorations and Icon Tile; four showcase pages and a new Cover; 62 new blocks with page examples; 42 style alternatives on existing components; SCREENS group with auth, account, settings and email templates.
3zk. Done (0.59.0 to 0.60.0): defects found while composing pages fixed (Feature Item with Icon Tile, Device Frame ratio, Navbar on-image, Comparison Table, Wizard, Mobile Header, Slider and more); blocks wave 2 (55 blocks, 12 page examples): marketing extras, case studies, legal, onboarding steps, finance and support dashboards, file manager, inbox and team chat, billing, commerce detail pages, AI review and generate, enterprise org chart, approval inbox, workflow builder, version history, user directory.
4. Next: Code Connect once a component codebase exists (the Figma names already match shadcn/ui).
   Open library gaps found while rebuilding real screens:
   - a Search Hero block;
5. System: documentation site.

## What the pack covers

[`skills/build-ui/index.md`](plugins/eggux/skills/build-ui/index.md) maps each screen and task
to its shell, blocks, patterns and component guides, and lists what each guide covers.

- **Patterns (32):** core flows (action feedback, bulk actions, common flows, delete confirmation,
  unsaved changes, multi-step form), forms (form validation, form presets, auth), states (empty
  state, loading states, errors and recovery, feedback messages, result pages, notifications),
  app screens (record page, search and filter, settings and admin, permissions and access,
  sharing and invites, approvals, audit log, reports, enterprise apps, booking), products (AI
  chat, commerce, content and docs, marketing pages, email), mobile and writing.
- **Component guides (38):** actions (button, dropdown menu), forms and choices (input, select,
  date picker, color picker, file upload, rich text editor), overlays (dialog, drawer, popover,
  tooltip, toast, tour), navigation (navigation, sidebar, tabs and toggle group, pagination,
  stepper), data (table, charts, description list, list and tree, boards and calendars, card),
  feedback and status (alert, badge, indicators, progress and slider, skeleton, rating), content
  and communication (content, comments and chat, AI chat, carousel, video player, avatar,
  accordion).
- **Rules:** `ux-rules.md` for rules that apply everywhere; Figma conventions and the library
  map in `references/figma-library.md`; code in `references/code-mapping.md`.

## Growing the pack

- New universal rule → one line in `build-ui/ux-rules.md`.
- Rule that needs explanation → new file in `build-ui/patterns/`.
- Component usage guidance → new file in `build-ui/components/`.
- Bump `version` in `plugins/eggux/.claude-plugin/plugin.json` so installs pick up the change.
- Validate before pushing: `claude plugin validate .`
