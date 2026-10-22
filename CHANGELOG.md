# Changelog

Versions of the EGG UX plugin (`plugins/eggux/.claude-plugin/plugin.json`). The Figma library
EGG UI v2 changes in the same PRs; its own version is on the Intro page.

## 0.52.0
- Gaps from the 0.51.0 audit closed; the library has 345 components (339 + 6). New components: `Uptime Bars` (part `Uptime Day`, State operational,
  degraded, outage, maintenance, no-data), `Pager Link` (Direction previous, next) for docs prev / next,
  `Image Figure` (image with caption and credit); new parts `Release Note Line` (per-line New / Improved /
  Fixed) and `Table Cell Check` (included, excluded, text) for plan comparisons.
- Components extended, current instances unchanged: Service Status Row `Show bars`; Release Note Item
  `Show changes` with a Changes slot (badge colors now match the docs); Location Card `Show map`;
  Permission Row with `Type=permission|header|group`, 5 role cells (`Show role 4`, `Show role 5`) and a
  selectable role column; Avatar Upload `Hint`, `Show remove`; Usage Meter `Usage`; API Key Row `Show
  scope`; Order Row `paid`, `refunded` and `State=default|hover|selected`; Notification Center `Show tabs`;
  Integration Card letter tile, Connected badge and Learn more link; Session Row `State=current` on any
  device; Endpoint Row `State=default|hover|selected`; Workflow Node `Title`, `Detail`; Dashboard Widget
  content fills and hugs; Payment Method Card `Show default`; Address Card `Show actions`; Product Card
  fills its column with the image ratio exposed; Load More and Rating Summary editable and scalable;
  Search Result Item `Section`; Background Job `Status`, `Result`, `Error`; Skip Link `Label`; Action Sheet
  action texts and icons; Image Compare Slider and Sankey Chart resize.
- Fixes: Access Row pending and Org Chart Node vacant texts bound to their properties; Swatch Picker
  swatches named by color.
- Blocks rebuilt on the new parts: Status Page, Docs Page Footer, Changelog, Gallery Grid, Offices, Roles &
  Permissions, Comparison Table; App blocks use the new properties instead of overrides (Profile, Billing,
  API Keys, Notifications, Integrations, Team Members).
- New blocks: Commerce `Product Grid`, `Orders`, `Reviews`; App `Security`, `API Reference`,
  `Automations`, `Agenda`, `Share Dialog`, `Executive Dashboard`; Forms `Account Settings Form`.
- Every standalone component is now used by a block or a real example: 34 new example frames on 31
  component pages.
- Docs: docs.json, rows.json, code mapping, library map and 26 usage guides updated; Docs frames and the
  component reference regenerated.

## 0.51.0
- Audit and consolidation of the whole library (four audits: component quality, overlaps, docs
  consistency, usage in blocks). 356 components became 339, with no lost capability.
- Merges:
  - `Check Item` (Mark=check, dash, x) replaces Requirement Item and Check List Item.
  - `Feature Item` gets Marker=icon, number and replaces Step Item.
  - `Number Input` gets Size=sm and replaces Quantity Selector.
  - `Swatch` (Type=color, label; Size; State with unavailable) replaces Swatch and Variant Swatch.
  - `Option Card` gets Control=radio, checkbox and replaces Checkbox Card.
  - `Tabs` is one set with Variant=default, line, vertical (replaces Tabs Line and Tabs Vertical);
    `Tab` Style is now Variant.
- Removed thin wrappers, now examples built from the base component: AI Button, Theme Toggle, View
  Switcher, Pricing Toggle, Wishlist Button, Stock Indicator, Scroll To Top, SSO Button, Welcome
  Dialog, Language Switcher. Table Cell User stays (part of the table cell family, 200+ uses).
- Renamed: Checklist Item to `Task Item`, Range Fields to `Range Input`, Suggestion to `Prompt
  Suggestion`, Suggestion Review Bar to `AI Review Bar`, Job Item to `Background Job`, Tag List to
  `Badge List`, Table Cell Tags to `Table Cell Badges`, Model Selector to `Model Picker`, TOC Item to
  `Table of Contents Item`.
- Conventions applied: booleans are "Show <part>" (39 renamed) and icon swaps are `Icon`, `Leading
  icon`, `Trailing icon`; variant properties and values aligned (Trend, Level, State, Series, Type;
  values lowercase with hyphens; outcome states done and error); same-role text properties share a
  name (Title, Name, Description, Time, Duration).
- Quality: default variants use Size=default (Button, Avatar, Spinner, Rating, Price, Progress Ring,
  Section Heading); text bound in every variant; slots kept in collapsed variants (Side Panel,
  Sidebar Double); 670 accidental clips removed; controls at 36 bound to `density/control-height`;
  227 descriptions rewritten without HTML entities; new text and boolean properties where content
  could not be edited (Product Card price, Trend Indicator value, Stat Card trend, Toast title and
  description, Task Item action slot, and more).
- Blocks migrated to components: Pricing, Pricing Single, Pricing Calculator, Comparison Table,
  testimonials, stats, Features Split, Careers List, Job Header, Newsletter, Logo Cloud, Team, Contact
  Cards; API Keys, Integrations, Notifications, Onboarding Checklist, Billing, Booking, Team Members,
  Notification Preferences, Profile, Gantt; Status Page, help center blocks, Docs Page Footer,
  Product Detail, Order Summary, cart sheet, search headers, Footer Newsletter, Announcement Banner
  and heroes. Kept on purpose, with reasons in the audit: Testimonial Split, Offices, Gallery Grid,
  Team List, Changelog, Roles & Permissions.
- Docs: docs.json, rows.json, 40 guides, code mapping (every component has a row), library map
  conventions, Figma API notes, a quieter `scan-components.js`, regenerated Docs frames on every
  component page and the component reference.

## 0.50.0
- 120 new components and 5 parts, built on existing primitives and tokens, each with a Figma
  description, docs entry, row on its page and generated stress test.
  - Forms (Input, Select, Selection controls, File Upload, Color Picker, Toggle Group and the new
    Form Layout page): `Copy Field`, `Search Field`, `Inline Form`, `Currency Input`, `Phone Input`,
    `Date Input`, `Duration Input`, `Range Fields`, `Address Autocomplete`, `Select Option`,
    `Recurrence Picker`, `Language Switcher`, `Checkbox Card`, `File Field`, `Swatch Picker`
    (part `Swatch`), `Form Section`, `Fieldset`, `Error Summary`, `Requirement List` (part
    `Requirement Item`), `View Switcher`, `Theme Toggle`.
  - Navigation and overlays: `Back Link`, `Skip Link`, `Scroll To Top`, `Page Toolbar`, `Account
    Menu`, `Emoji Picker`, `App Launcher`, `Confirm Popover`, `Welcome Dialog`, `Resizable Panels`,
    `FAB`, `Action Sheet`, `Annotation Pin`, `Social Share`, `Show More`, `Load More`, `Shortcut Row`;
    new pages Notifications (`Notification Item`, `Notification Center`) and Search (`Search Result
    Item`).
  - Data and developer tools: new Metrics page (`Trend Indicator`, `Metric Strip` with part `Metric
    Strip Item`, `Usage Meter`, `Countdown`, `Leaderboard Row`); `Command Snippet`, `Endpoint Row`,
    `Log Row`, `Diff Viewer` (part `Diff Line`), `JSON Viewer`; `Version Item`, `Release Note Item`;
    charts `Dashboard Widget`, `Distribution Bar`, `Bullet Chart`, `Radar Chart`, `Sankey Chart`,
    `Choropleth Map`; new Automation page (`Automation Rule`, `Workflow Node`, `Mapping Row`).
  - Commerce and marketing: new Commerce component page (`Quantity Selector`, `Stock Indicator`,
    `Wishlist Button`, `Variant Swatch`, `Line Item`, `Mini Cart`, `Order Row`, `Shipment Tracker`,
    `Address Card`, `Payment Method Card`; the existing `Product Card` moved here from the block
    page); new Pricing page (`Price`, `Check List Item`, `Pricing Toggle`, `Plan Card`);
    `Announcement Pill`, `Trust Badge`, `Testimonial Card`, `Footnote`, `Step Item`, `Logo Tile`,
    `Review Item`, `Rating Summary`, `Link Preview`, `Location Card`, `Image Compare Slider`,
    `Device Frame`, `Video Thumbnail`, `Audio Player`.
  - Collaboration, admin and AI: `Agenda Item`, `Meeting Card`, `Availability Row`, `Time Slot`,
    `Loading Overlay`, `Job Item` (background job), new Surveys page (`Feedback Widget`, `NPS
    Survey`, `CSAT Rating`), `Service Status Row`, new Sharing page (`Access Row`, `Invite Row`,
    `Share Link Row`), `Presence Bar`, `Mention Chip`, `Reaction Bar` (part `Reaction`), `Thread
    Summary`, `Checklist Item`, `Job Listing`, new Admin page (`Integration Card`, `Permission Row`,
    `API Key Row`, `Session Row`, `SSO Button`, `Org Chart Node`), `AI Button`, `AI Loading`,
    `Confidence Indicator`, `Suggestion Review Bar`, `Saved View Item`.
- 18 new Lucide icons (97 in total): sun, moon, monitor, smartphone, layout-grid, external-link,
  star, share-2, arrow-left, key-round, credit-card, package, zap, image, code, at-sign, smile,
  git-branch.
- Docs: 125 docs entries and rows, generated Docs frames and stress tests on 46 pages, notes in 41
  guides, new Commerce, Marketing and Admin sections in the code mapping, library map and component
  reference (356 components on 71 pages).
- Not built: examples in real screens for the new components (their Examples sections hold a note).

## 0.49.0
- Audit batch 2: more cases for components that already exist.
  - `Button` State=loading (spinner instead of the leading icon); `Button Icon` Size sm 32,
    default 36, lg 40.
  - `Avatar` Shape circle or square (companies, apps) and Size xs 20.
  - `Sidebar Item` Level=2 for sub-pages.
  - `Tab` Show icon + Icon swap and Style=vertical; new `Tabs Vertical` (Tabs page).
  - `Menu Item` Show description and Submenu.
  - `Tooltip` Show title (rich, wraps at 280) and Show shortcut (Kbd).
  - `Progress` Tone default, success, warning, error.
  - `Image Placeholder` Ratio 21:9; every ratio is locked, so an instance on FILL keeps its
    proportion.
  - `Entity Card` Show people; `List Item` Show leading and Show trailing.
  - New table cell parts: `Table Cell Link`, `Date`, `File`, `Tags`, `Avatars`.
  - New `Pagination Compact` (Pagination page).
- Examples: "empty state types" (no data yet, no results, error, no access, first run), "dialog
  sizes" (sm 384, default 512, lg 672; Sheet widths in the docs), "settings with vertical tabs",
  "table cell types", "menu with descriptions", "rich tooltip and shortcut".
- Not built: Card interactive states (Entity Card, Option Card and Post Card already carry hover,
  focus and selected) and a compact List Item variant (Show description off covers it).
- Docs rows, regenerated stress tests on 15 pages, guides, code mapping, library map and
  component reference (230 components on 61 pages).

## 0.48.0
- Audit batch 1: six components built from patterns that were drawn by hand in the blocks again
  and again.
  - `Section Heading` (new page): title, description, optional overline, Actions slot; Size lg
    (h2), default (h3), sm (h4). Centered marketing sections keep the Section Header block.
  - `Feature Item` (new page): icon tile, title, text, optional link; stacked, inline, centered.
  - `Action Bar` (Button page): Actions and Leading slots, optional divider; Align end, start,
    center.
  - `Summary Row` (Description List page): label and amount; default, discount, total.
  - `Byline` (Avatar page): Avatar, name, detail; sm, default, lg.
  - `Tag List` (Badge page): Badges in a Tags slot and a "+N" Badge.
- `Avatar Group`: Label and Show label ("Maintained by 3 analysts").
- In use: section headings in Integrations, Audit Log, Roles, Report, Record Form, Import
  Mapping, Status Page and two test screens; Action Bars in heroes, page headers, CTAs, Empty
  Page, Import Mapping, Map Section, Job Header; Summary Rows in Order Summary and Pricing
  Calculator; Bylines in Article, Blog Post Header and testimonials; Tag Lists in page headers,
  Job Header and test screens; Feature Items in Features, Bento Grid and Careers Benefits; Meta
  Items in Support Options, Careers List and Map Section; Avatar Group labels in two page headers
  and the Showcase screen.
- Examples "sections on a page", "features in a grid", "form footer", "invoice totals", "article
  meta", "dataset header"; docs rows and generated stress tests; guides (button, avatar, badge,
  description-list, content, marketing-pages, commerce, enterprise-apps, content-and-docs,
  form-validation), code mapping, library map and component reference (223 components on 61
  pages). README lists audit batches 2 and 3.

## 0.47.0
- New `Waterfall Chart` (start total, increases in color/blue/600, decreases in color/red/600,
  end total; signed labels and connectors) and `Combo Chart` (bars on the left axis, a line on
  the right axis; the one exception to "one y axis") on the Chart page, with the examples "cash
  bridge" and "volume and on-time rate" in Chart Card.
- Both charts resize with their container (constraints on gridlines, bars and labels); the
  Figma API notes say how.
- Bar Chart and Line Chart docs point to Combo Chart for two units; charts guide, code mapping,
  library map and component reference updated (217 components).
- `.claude/settings.json`: allow rules for the Figma write and screenshot tools, PR create and
  merge, and git push, so sessions on this repo stop asking for them.

## 0.46.0
- New `Event Card` (horizontal for lists, vertical with an image for grids) and its part
  `Date Tile` (Card page): format badges, title, time and place as Meta Items, one action.
- New `Resource Item` (File Upload page): a file people download or open, with type icon,
  name, format and size, action.
- New `Quote` (new Quote page): default with a left rule, pull centered.
- In use: `Block / Article` (Quote), the Showcase test screen downloads (Resource Item);
  examples "upcoming events", "events grid", "downloads", "quote in an article", "pull quote
  between sections".
- Docs rows, generated stress tests, guides (card, file-upload, content, marketing-pages),
  code mapping, library map and component reference (215 components on 59 pages).

## 0.45.0
- New `Meta Item` and `Figure` (Description List page): a fact with an icon; a number with what
  it counts (stacked or inline, default or lg, source, divider).
- New `Setting Row` (Selection controls page): title, description, Control slot, divider.
- New `Person Card` (Card page): vertical and horizontal, Avatar, Tags, Contact (Meta Items) and
  Actions slots.
- `Tab`: Show count with an exposed Badge Count.
- The parts that were built by hand now use them: Header Event and Header Profile (Meta Item,
  Figure), Header Report (Figure), Header Search Results (tab counts), Block / Settings Section
  (Setting Row), the Showcase test screen (Person Card).
- Docs rows, generated stress tests and examples on Card, Description List, Selection controls
  and Tabs; guides, code mapping, library map and component reference updated. Figure closes the
  "Stat Card without trend" gap.
- Figma API notes: setting any icon swap to the same icon resets its color; replacing grid
  children can add a row.

## 0.44.0
- New block page Page Headers: `Block / Header Detail`, `Header Listing`, `Header Search
  Results`, `Header Profile`, `Header Event`, `Header Topic`, `Header Report`, `Header Simple`,
  with examples "topic page" and "event page". Generalized from the Mobility Global test
  screens, domain-neutral content.
- `Post Card` Layout=compact (title on 2 lines, meta, optional 1:1 image) for related, most read
  and up next lists; the Article test screen uses it.
- marketing-pages.md § Page headers (which header for which page), content-and-docs.md and the
  build-ui index point to them; figma-library.md lists the page and the new layout.

## 0.43.1
- figma-library.md lists Side Panel and Sidebar Double, the new Entity Card and Sortable List
  Item slots, and the tested back office grid shell.
- build-ui index: a Back office / CMS screen row; drawer and sidebar guides list the new
  components.
- README roadmap: open library gaps found while rebuilding real screens.

## 0.43.0
- New `Side Panel` (Drawer page): inline aside beside the page content with a header (Title,
  Actions slot, collapse), Content and Footer slots; State expanded 320 / collapsed 48.
- New `Sidebar Double` (Sidebar page): icon rail for sections plus a panel with a header
  (Panel title, Panel actions slot) and Sidebar Groups; Mode expanded 288 / collapsed 48.
- `Entity Card`: Actions slot (Show actions) for one direct action on every card (add, remove,
  pin); Leading takes a 1:1 image.
- `Sortable List Item`: Leading slot (Show leading) with a 1:1 image, 48 px.
- Docs, stress tests and examples for the four rows (tidy-component); guides for sidebar,
  drawer, card, list and tree, enterprise apps; code-mapping rows for the new components.
- Test page "Test / Mobility Global": `Page Shell / Back office (test)`, a grid shell
  (navigation and aside columns hug their content, body scrolls, actions fixed at the bottom),
  tested at 1440 and 1280, with collapsed navigation and panel, and as a list.
- component-page.js leaves viewport examples (clipped `Example /` screens) and GRID frames
  alone when fitting to hug. component-docs.js also finds `Examples /` frames;
  component-docs.py keeps the index rows of pages not in the run.

## 0.42.2
- Figma API notes: grid row sizes must be set to hug after the cells are added; switching
  `layoutMode` keeps the old sizing modes; a growing child is FIXED until set back to hug.
  Found while rebuilding three Mobility Global back office and showcase screens with the library.

## 0.42.1
- Fixed stress test frames that stopped growing with their content (an auto-layout frame built
  with `resize()` stays FIXED on both axes), so their white frame and section were shorter than
  the cases: 20 frames on 11 pages back to hug, every row section refit.
- `component-page.js` sets stress test and example frames back to hug when their content runs
  past their edge, and reports any frame or section that still clips (`overflow`).
  tidy-component checks that list; stress-test.md says how to build grids with hug sizing.

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
