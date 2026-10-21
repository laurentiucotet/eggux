# Changelog

Versions of the EGG UX plugin (`plugins/eggux/.claude-plugin/plugin.json`). The Figma library
EGG UI v2 changes in the same PRs; its own version is on the Intro page.

## 0.42.0
- Every component page in the master library now uses the row layout: 151 rows on 57 pages,
  each with Docs, Component, Stress test and Examples sections. Helper parts sit in their main
  component's row and are documented under Parts.
- Docs frames for all 151 main components: summary, when to use and not, anatomy, variants,
  properties, slots, parts, content rules, accessibility, tokens and styles, code and guides.
  Content lives in `skills/tidy-component/docs.json`; rows in `rows.json`; `jobs.py` builds
  the script for any pages.
- `component-page.js` v2: several pages per call, existing stress tests and examples assigned to
  the row that uses them, a basic stress test generated where none existed (marked "Generated
  cases", to replace during review), "Example / in <block>" from the smallest block that uses
  the component.
- 51 new contextual examples (components in the App or Marketing page shell, dialogs over an
  overlay, toast in its corner, menus at their anchor).
- `references/components/*.md` now include when to use, anatomy, rules and accessibility from
  `docs.json`. Intro page text updated.

## 0.41.0
- `/eggux:tidy-component`: cleans up a component and lays out its page in one row per
  component, left to right: `<Name> / Docs` (a doc frame generated from the component and a
  short docs config: summary, use and avoid, anatomy, variants, properties, slots, rules,
  accessibility, tokens, code), `/ Component`, `/ Stress test`, `/ Examples`.
  `component-page.js` builds or refreshes the row.
- new-component ends with the row; update-component re-runs it; stress-test and figma-library
  describe the layout.
- Cookie Consent page tidied: docs frame and four examples (banner on a marketing site, card in
  an app, preferences over an app, card on mobile).

## 0.40.0
- 16 new components: `Person Option`, `People Picker`, `Transfer List` (Select page); `Inline
  Edit`, `Signature Pad` (Input); `Sortable List Item` (List & Tree); `Progress Ring`
  (Progress); `Scroll Area` (new page); `File Preview` (File Upload); `Image Cropper`, `Avatar
  Upload` (Image); `Menubar Trigger`, `Menubar` and a "menubar open" example (Menu); `Cookie
  Consent` banner, card and preferences (new page); `Funnel Chart`, `Scatter Chart` (Chart).
  New icon `grip-vertical`.
- Stress tests for each; the content rules they found are in the descriptions (truncation,
  minimum widths, centered crop selection).
- Guides: select, input, list-and-tree, progress-and-slider, file-upload, dropdown-menu,
  charts, marketing-pages (cookie consent); index, inventory, code mapping; component
  reference regenerated (58 pages, 205 components, 830 variants); Intro 2.10.

## 0.39.0
- Carousel kit: `Carousel Arrow` (outline, overlay × previous, next × 4 states), `Carousel
  Indicator` (dots, bars with Pause, counter × default, overlay), `Carousel Thumbnail`,
  `Carousel Slide` (caption, overlay), `Carousel Gallery`, `Carousel Hero`, `Lightbox`.
  `Carousel` now uses the arrow and indicator components.
- `Stress test / Carousel`; carousel guide (which one, parts), code mapping, inventory,
  component reference regenerated; counts 189 components, 778 variants; Intro 2.9.

## 0.38.0
- `references/components/`: one generated Markdown file per component page (56 pages, 182
  components): variants, every property with its default, slots, the components and icons it is
  built from, tokens and styles used, examples and stress tests on the page, links to usage
  guides and the code mapping. Index in `references/components/README.md`.
- `scripts/component-docs.js` (read-only extraction with use_figma) and
  `scripts/component-docs.py` (writes the files); new-component and update-component regenerate
  them for library changes; build-ui reads them for exact properties.
- Figma descriptions: removed leftover domain words (Combobox, Option Card, Input Group,
  Block / Record Header).

## 0.37.0
- `Content` variable collection (STRING, modes English and Română): 85 variables for brand
  names, actions, statuses, feedback, field labels, AI notice, legal and navigation. 382 texts
  and instance properties in the master library bound to them.
- Brand page: Content panel and an English / Română comparison of the invoices example.
- `references/content.md` (groups, rules, binding, client setup); brand-intake sets `brand/*`
  and adds language modes; decision-log changes terminology through Content; writing and
  tokens link it.
- Counts corrected to 182 components (180 on component pages + Logo and Logo Mark).

## 0.36.0
- 12 AI components on the AI Chat page: `Model Selector`, `Model Option`, `Context Chip`,
  `Voice Recorder`, `Chat History Item`, `Response Feedback`, `Plan Step`, `Agent Plan`,
  `Artifact Card`, `AI Summary`, `AI Suggestion`, `AI Notice`.
- Examples: agent at work, AI on a record page, chat history; `Stress test / AI components`.
- ai-chat pattern: agents, context, AI in the product (summary, suggested values, notice),
  model choice, voice, history; component guide, index, code mapping, inventory; counts 184
  components, 748 variants; Intro 2.7.

## 0.35.0
- 13 components for building screens:
  - Table: `Table Cell Amount` (trend none, up, down), `Table Cell Status`, `Table Cell
    Progress`, `Table Cell Actions`, `Table Pagination`.
  - Filters (page renamed from Filter Builder): `Filter Bar` (two rows), `Filter Chip` (empty
    trigger, active), `Faceted Filter`, `Facet Option`, `Filter Section`.
  - Cards: `Entity Card` (4 states), `Progress Card` (on track, at risk, off track).
  - `Empty State` (default, sm) on its own page.
- `Example / invoices with filters` and `Example / no results` (Table page); stress tests on the
  Table, Filters, Card and Empty State pages. Rules from the stress tests: filter value
  truncates at 200, entity title 2 lines and subtitle 1, progress target wraps, status note
  truncates at 96, pagination range on one line, filter bar on two rows.
- Fixed: primary buttons whose leading icon had turned dark after an icon swap (5 instances).
- Guides: table, card, search and filter, empty state, index, code mapping, figma-library,
  API notes; counts 172 components, 714 variants.

## 0.34.2
- Combobox, Tag, Tag Input and their examples move from the Popover page to the Select page:
  pages group components by what they are (a field that selects), not by how they are built
  (a Popover with a Command). Instances, including those in Filter Builder, stay linked.
- new-component: put a component on the page of what it is, not of the parts it uses.

## 0.34.1
- Removed 4 orphan Card variants that a failed clone left on the Cover page; checked every page
  for leftovers. API note: set the current page before creating nodes and check for strays.

## 0.34.0
- Card: `Elevation` toggle (false / true, shadow md) replaces `Variant=elevated`; Variant is
  default, outline, muted; 12 variants. Default cards are flat (no shadow sm).
- Clip content turned off on 107 frames that did not need it (Card set and placeholders, Card
  stress test, Intro, Help center example, Stat Card, Option Card); focus variants keep it.
- The scan caught the 4 new variants with slots turned into plain frames (a clone side effect);
  rebuilt as real slots on the shared keys, and instance content survives every toggle.
- `scan-components.js` reports `clippingFrame`; API notes on `createFrame()` clipping by default
  and on cloning variants; new-component: clip content off, on/off looks as true/false variant
  properties; `feature-page.js` placeholders no longer clip.

## 0.33.0
- Card: `Variant` (default, outline, muted, elevated) and `Size` (default, sm); 8 variants.
  Padding and gap on Density tokens `density/card-padding`, `-sm`, `density/card-gap`, `-sm`
  (24 / 16 and 16 / 12 in Compact); `card/muted-background` (neutral/50 in Light for 4.5:1).
  Stat Card and Option Card use the same padding tokens. Slot placeholder text wraps.
- `Stress test / Card`: 6 cases × 9 rows (variants, sm, Dark, Compact, Corporate Light).
- Guides: when to use a variant, a size or a separate component; padding model; tokens, code
  mapping and the decision-log example on the new tokens; API notes on bound paint base colors
  and property keys after `combineAsVariants`.

## 0.32.0
- `new-feature` writes a folder per feature, `eggux/features/<slug>/`: `feature.md` (spec,
  screens, impact on the product, changelog), `scenarios.md` (S-xx scenarios and E-xx edge
  cases with Given / When / Then), `workflows.md` (F-xx flows with steps and a Mermaid
  diagram), `decisions.md` (Inbox and FD-xx feature decisions).
- `new-feature/feature-page.js`: creates the feature's Figma page after a `FEATURES` divider,
  with sections Overview, Flows, one per scenario, one per edge case, States and Archive;
  screens as named placeholders; all on tokens and text styles.
- New skill `update-feature`: classifies new input, maps its impact on the feature files,
  product files, other features and the Figma page, applies it everywhere, marks affected
  screens with a "Needs update" annotation, archives superseded frames, checks consistency and
  logs the change. Migrates old single-file specs.
- build-ui designs into the feature page's sections; review checks scenarios, edge cases and
  feature decisions by ID; the SessionStart hook reports feature Inbox lines.

## 0.31.0
- New skill `update-component`: after a hand edit in Figma, diffs the component against its
  saved snapshot (or the master library), plays back the changes, polishes them (tokens, sibling
  variants, properties, auto layout, layer names), flags conflicts with decisions and UX rules
  and breaking property changes, lists affected instances, re-runs the stress test, reviews,
  and after approval updates the component doc, snapshot and records.
- `skills/update-component/snapshot.js`: read-only snapshot of a component set (properties,
  layout, tokens or raw values, text styles, instances) with an optional diff against a
  baseline.
- new-component saves a snapshot at approval; the component template and project-files list it.

## 0.30.1
- Manifest: removed `displayName`, which older Claude Code versions reject at install
  ("Unrecognized key").

## 0.30.0
- Figma Intro page: getting started, what is inside with counts, how to use, file organization,
  conventions, credits and license, changelog (library version 2.4).
- 6 navigation blocks: Navbar Centered, Navbar Search, Navbar Mega Menu; Footer Newsletter,
  Footer Corporate, Footer Centered.
- New Help center family (Content page), 8 blocks: Help Hero, Help Categories, Help Popular
  Articles, Help Article List, Support Options, Docs Page Footer, Changelog, Status Page; plus
  `Example / Help center`. 109 blocks in total.
- Guides: navbar and footer picks in marketing-pages; help center, changelog and status page
  rules in content-and-docs; index rows; code mapping; Community checklist (Intro done).

## 0.29.0
- 13 blocks: Pricing Single, Pricing Calculator; FAQ Grid, FAQ Centered; Stats Cards, Stats
  Split; Team Grid, Team List; Careers List, Careers Benefits, Job Header; Gallery Grid,
  Gallery Mosaic. New families Careers and Gallery.
- Charts: Gauge (on track, at risk, off track), Treemap.
- Gantt: `Gantt Bar`, `Gantt Milestone`, `Block / Gantt` with dependencies and a today line.
- Guides: chart picks, Gantt rules, marketing block families; code mapping; API notes on vector
  strokes and duplicate page names.

## 0.28.0
- `add-component` becomes `new-component`: from a screenshot or description, reuse map,
  proposal, build, stress test, review, approval; after approval the component doc
  (`eggux/components/<name>.md` for clients, `components/<name>.md` in the plugin for the
  library), a decision or library records, code with stories for the stress cases, Ready for dev.
- `references/stress-test.md`: cases (text length, counts, missing data, numbers, dates, states,
  themes, widths, translation), test content, Figma layout, breaks and the rules they become.
- `templates/component.md` for component docs.

## 0.27.0
- New skill `new-feature`: plays back the idea, interviews in rounds (purpose, access, flow,
  data, states, edge cases, feedback, scope) with defaults from the patterns and the client
  files, writes `eggux/features/<slug>.md` with acceptance criteria and updates objects,
  actors, workflows and decisions.
- build-ui reads the feature spec; review checks its acceptance criteria, states and edge cases.

## 0.26.0
- Generic patterns: action-feedback (when a toast, when the visible change is enough, per action),
  bulk-actions, permissions-and-access, errors-and-recovery (sessions, offline, conflicts,
  undo, trash, history), notifications, sharing-and-invites, writing (labels, messages,
  dates, numbers).
- `common-flows.md`: 14 reusable flows (create, edit, delete, bulk, find, invite, share,
  onboard, sign in, approve, import, export, change plan, act on a notification); discovery
  and the workflows template refer to them ("Based on").
- ux-rules: feedback rule rewritten, new Safety and recovery section, writing rule; review
  checks action feedback and access, offline and error states.

## 0.25.0
- Block pages organized in Figma sections: `Blocks` with one sub-section per family, `Examples`
  next to it; add-component places new blocks in their family.
- 19 new blocks: Contact Cards, Contact with Map, Offices, Map Section; Testimonial Single,
  Grid, Split, Carousel; CTA Split, CTA Card; Features Split, Bento Grid; Hero with Screenshot;
  Blog Grid, Blog Featured, Blog Post Header, News List; Announcement Banner, Footer Simple.
- `Map` component; marketing and content patterns list which block fits which need.

## 0.24.0
- Decisions workflow: `decisions.md` with Inbox, numbered decisions (type, scope,
  implementation, verify, status); `decision-log` records, applies design decisions at the
  source (Components or Semantic tokens, code component) and verifies the work.
- SessionStart hook (`plugins/eggux/hooks/`) reminds Claude of the decisions file and new
  Inbox lines; build-ui reads decisions first and verifies them before finishing; review
  checks every applied decision; brand-intake records brand changes as decisions.
- Skill audit fixes: external validator reference replaced by `/eggux:audit-tokens`;
  add-component updates code-mapping and the changelog.

## 0.23.0
- Charts: Donut Chart (donut, pie), Bar Chart Horizontal, Heatmap.
- Enterprise: Import Mapping block and import rules.
- `references/code-mapping.md` (Figma component → code), this changelog.

## 0.22.0
- Corporate theme: Corporate Light / Corporate Dark modes (blue primary, slate, 4 px radius,
  firmer input borders).
- Enterprise pack: data grid template with saved views, groups and totals, Filter Builder,
  Approvals, Audit Log, Roles & Permissions, Report, Record Form, Save Bar, Org Switcher.
- Dense "enterprise invoices" example and a Default vs Corporate comparison.
- 180 leftover domain texts neutralized; patterns enterprise-apps, approvals, audit-log, reports.

## 0.21.0
- Tour (Coachmark, Hotspot), Video Player with `video/*` tokens.
- Community preparation: Cover, Intro, Foundations pages, listing copy.

## 0.20.0
- AI chat kit (Prompt Input, messages, Reasoning, Tool Call with approval, Sources, Citation,
  Suggestion) and AI blocks; `ai-chat` pattern.

## 0.19.0
- Rich Text Editor, comments, chat, month view, Rating, Carousel, Color Picker.

## 0.18.0 and earlier
- Foundations (variables, Light and Dark, density, motion, chart palette), core components,
  field presets, blocks for app, marketing, auth, commerce and content, seven page shells,
  charts, Kanban, Scheduler, skills for discovery, brand intake, build, review and audits.
