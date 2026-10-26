# Publishing EGG UI to Figma Community

Checklist and listing copy for the master library (`BufvaVkSh9vMWPye117Ucd`). Run the audit
steps again before every new Community version.

## Done in the file
- [x] Cover page with a 1920 x 1080 `Thumbnail` frame (artwork, the only frame allowed to
      have detached styles).
- [x] Intro page: "Getting started" frame with what is inside (current counts), how to use,
      how the file is organized, conventions, credits and license (Inter, Roboto Mono, Lucide,
      shadcn/ui, CC BY 4.0) and the changelog. Update counts and changelog with every release.
- [x] Foundations page: color roles in pairs, chart palette, type scale, spacing, radius,
      elevation, motion, modes; everything bound to variables and styles.
- [x] Page order: Cover, Intro, Foundations, Brand, COMPONENTS (A-Z), BLOCKS (A-Z).
- [x] Neutral default content (no client or domain leftovers, all amounts in EUR); no lorem
      ipsum. The audit regex now covers medical and RON terms (180 texts fixed in 0.22).
- [x] Every component and component set has a description.
- [x] Component scan clean on library pages (`skills/audit-tokens/scan-components.js`).
- [x] Token audit: the 4 known contrast exceptions in Light / Dark, only warning-as-text in
      Corporate (`tokens.md`).
- [x] Fonts are free Google Fonts (Inter, Roboto Mono); icons Lucide (ISC).

## To do by hand in Figma
1. Rename the file to **EGG UI** (it is currently "Document" or the team name).
2. Cover page: right click `Thumbnail` → **Set as thumbnail**.
3. Remove the file from any team-only library you do not want to share; check it has no
   comments you would not publish (comments are not published, but review them anyway).
4. Share → **Publish to Community**: name, tagline, description, tags, category
   "Design systems", support contact, license CC BY 4.0 (default).
5. Optional carousel images: export the Cover, "Example / theme comparison" and
   "Example / enterprise invoices" (Enterprise page), the "AI chat app" example (AI page) and
   the Foundations page top at 1920 x 1080.
6. Done: the Community page is [EGG UI](https://www.figma.com/community/file/1694044412384019384), linked from the README. Publish a new version
   from the master file after each release and keep the counts below current.

## Listing copy

**Name:** EGG UI: design system for product and enterprise teams

**Tagline:** 345 components, 128 blocks and 8 page shells. Default and Corporate themes in
Light and Dark, data grid, approvals, audit and AI chat. Variables, native slots, shadcn/ui names.

**Description:**
EGG UI is a complete design system for product and enterprise teams: SaaS, internal tools,
admin panels, finance, commerce, content and AI products.

What is inside
- Two themes, four modes: Default (Light, Dark) and Corporate (Light, Dark), plus Density
  (Comfortable, Compact). Switch a frame and the whole screen follows.
- Enterprise pack: data grid with saved views, groups, totals and bulk actions; filter
  builder; approval chain; audit log with field changes; roles and permissions matrix; report;
  long record form with save bar; organization switcher.
- 345 components: forms, selection, overlays, navigation, feedback, tables
  on auto layout grid, charts (bar, line, donut, heatmap, gauge, treemap, funnel, scatter), dates, scheduling and Gantt, files with preview and image cropper, people picker, rich text editor, comments and
  chat, commerce, AI chat, cookie consent, tour and video.
- 128 blocks by category (AI, App, Commerce, Content, Enterprise, Forms, Hero,
  Navigation, Page Headers, Results, Sections), including navbar and footer variants and a help center kit (search,
  topics, articles, support, changelog, status), and 8 page shells (App, Marketing, Auth, Mobile, Wizard, Split View, Docs, Admin Panel).
- 638 variables in five collections (Content holds names and labels in English and Română): Primitives, Semantic (Light, Dark), Components and
  Density (Comfortable, Compact). 16 text styles, shadows and motion tokens.
- AI chat kit: prompt input, user and assistant messages, reasoning, tool calls with
  approval, sources and citations, suggestions, assistant panel, inline AI.
- Native slots for every content area, so you fill components instead of detaching them.
- Variant names match shadcn/ui props, so design and code speak the same words.
- Contrast checked in both modes: text 4.5:1, controls 3:1, chart colors 3:1.
- 97 Lucide icons as single vector layers.

How to start: duplicate, put your logo in Logo Mark, change primary and radius in the
Semantic collection, then build from a page shell. The Intro page walks you through it.

Fonts: Inter, Roboto Mono (Google Fonts). Icons: Lucide (ISC).

**Tags (max 12):** design system, enterprise, ui kit, variables, dark mode, shadcn, data grid,
dashboard, saas, ai chat, tokens, accessibility
