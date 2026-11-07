# Handoff: EGG UI components into Storybook

Status on 2026-11-07, branch `claude/zealous-planck-j9rsnj`.

**317 of the 427 Figma components are in code** with stories and passing tests. The list with
what each test checks is in `../COMPONENTS.md`. The differences found between Figma, the
references and code are in its "Design findings" section; the ones that need a decision in
Figma are marked there.

## How the work runs
One Figma page (or part of one) per agent, several agents in parallel, following
`skills/code-component/SKILL.md` ("A whole Figma page"). Every agent gets `wip/agent-brief.md`
(rules, lessons learned, report format) plus its scope: page name, page id, the components in
order and what already exists to reuse. The orchestrator alone edits shared files
(COMPONENTS.md, existing components, icons, tokens), reruns each agent's story files, records the
rows and commits only the files it names.

Figma file: `BufvaVkSh9vMWPye117Ucd` (EGG UI). Page ids are in the table below.

## Unfinished files in this folder
None. The Select and Navigation files that were here are finished and in `src/` (2026-11-07).

## What is left (110 components)
Page ids: run `get_metadata` on the file without a node id, or see the inventory in the session
that made this file. Next in line:
Small pages (Kanban, Automation, Video, Background, Color Picker, Admin), and last Chart (8) and Email (16).

| Figma page | In code | Missing |
|---|---|---|
| AI Chat | 24/25 | Attachment (not on the AI Chat page in Figma any more; check where it went) |
| Admin | 0/5 | Integration Card, Permission Row, API Key Row, Session Row, Org Chart Node |
| Automation | 0/3 | Automation Rule, Workflow Node, Mapping Row |
| Background | 0/4 | Background / Grid, Background / Dots, Background / Glow, Background / Beam |
| Carousel | 0/8 | Carousel, Carousel Arrow, Carousel Indicator, Carousel Slide, Carousel Gallery, Carousel Thumbnail, Carousel Hero, Lightbox |
| Chart | 19/27 | Dashboard Widget, Bullet Chart, Radar Chart, Sankey Chart, Choropleth Map, Radial Chart, Box Plot |
| Chat | 0/8 | Chat Message, Typing Indicator, Chat Composer, Mention Chip, Reaction Bar, Reaction, Thread Summary, Conversation Item |
| Color Picker | 0/4 | Color Picker, Swatch Picker, Swatch, Color Input |
| Commerce | 0/8 | Product Card, Line Item, Mini Cart, Order Row, Shipment Tracker, Address Card, Payment Method Card, Payment Method Mark |
| Editor | 0/7 | Rich Text Editor, Comment, Comment Composer, Selection Toolbar, Comment Highlight, Comment Thread, Comments Panel |
| Email | 0/16 | Email / Header, Email / Hero, Email / Button, Email / Content, Email / Code, Email / Details, Email / Details Row, Email / Line Items, Email / Line Item, Email / Total Row, Email / Callout, Email / Divider, Email / Stats, Email / Stat, Email / Article, Email / Footer |
| Filters | 0/8 | Filter Bar, Filter Chip, Faceted Filter, Facet Option, Filter Section, Filter Group, Filter Condition, Saved View Item |
| Form Presets | 0/1 | Field Preset |
| Image | 2/8 | Map, Image Cropper, Avatar Upload, Image Compare Slider, Device Frame, Image Figure |
| Kanban | 0/2 | Kanban Card, Kanban Column |
| Mobile | 0/7 | Mobile Header, Bottom Nav Item, Bottom Nav, FAB, Action Sheet, Store Badge, QR Code |
| Prose | 0/6 | Prose, Prose Heading, Prose Paragraph, Prose List Item, Prose Blockquote, Highlight |
| Scheduler | 1/7 | Calendar Event, Gantt Bar, Gantt Milestone, Agenda Item, Meeting Card, Availability Row |
| Video | 0/3 | Video Player, Video Thumbnail, Audio Player |

Blocks built outside the 427 count: Block / Navbar (default, on-image, mobile), Block / Footer, Block / Footer Simple (`site-navigation.tsx`).

## Notes
- The full suite (`npm test`) is slow (well over 10 minutes for ~1,000 stories). Run story files
  in groups while building; run the full suite before a release.
- Transitions are off in tests (`.storybook/vitest.setup.ts`). Day labels are built without the
  browser comma (`formatFullDate`).
- Shared changes still open: DropdownMenuItem asChild (real links in menus), item options on
  sub/radio/checkbox menu items, Sheet and Drawer switching to the shared Scrim / Dialog Header /
  Dialog Footer, Range and Duration Input switching to Input Addon, Setting Row stories using
  Select, Badge icon and count options, Board icon (Columns2) for Toggle Group.
