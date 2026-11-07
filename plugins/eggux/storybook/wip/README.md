# Handoff: EGG UI components into Storybook

Status on 2026-11-07, branch `claude/zealous-planck-j9rsnj`.

**195 of the 427 Figma components are in code** with stories and passing tests. The list with
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

## What is left (232 components)
Page ids: run `get_metadata` on the file without a node id, or see the inventory in the session
that made this file. Next in line:
Card leftovers (Post Card, Entity Card, Person Card), then Table cells, Pagination, Tabs-like
small pages, and last Chart (26) and Email (16).

| Figma page | In code | Missing |
|---|---|---|
| AI Chat | 24/25 | Attachment |
| Admin | 0/5 | Integration Card, Permission Row, API Key Row, Session Row, Org Chart Node |
| Approvals | 0/1 | Approval Step |
| Audit | 0/4 | Change Item, Version Item, Release Note Item, Release Note Line |
| Automation | 0/3 | Automation Rule, Workflow Node, Mapping Row |
| Background | 0/4 | Background / Grid, Background / Dots, Background / Glow, Background / Beam |
| Card | 11/14 | Post Card, Entity Card, Person Card |
| Carousel | 0/8 | Carousel, Carousel Arrow, Carousel Indicator, Carousel Slide, Carousel Gallery, Carousel Thumbnail, Carousel Hero, Lightbox |
| Chart | 1/27 | Bar Chart, Bar Chart Horizontal, Line Chart, Donut Chart, Heatmap, Gauge, Gauge Target, Treemap, Funnel Chart, Scatter Chart, Chart Legend, Chart Legend Item, Chart Tooltip, Chart Tooltip Row, Chart Card, Waterfall Chart, Combo Chart, Dashboard Widget, Distribution Bar, Distribution Segment, Bullet Chart, Radar Chart, Sankey Chart, Choropleth Map, Radial Chart, Box Plot |
| Chat | 0/8 | Chat Message, Typing Indicator, Chat Composer, Mention Chip, Reaction Bar, Reaction, Thread Summary, Conversation Item |
| Code Block | 0/9 | Code Block, Code Highlight, Command Snippet, Endpoint Row, Log Row, Diff Viewer, Diff Line, JSON Viewer, Inline Code |
| Color Picker | 0/4 | Color Picker, Swatch Picker, Swatch, Color Input |
| Commerce | 0/8 | Product Card, Line Item, Mini Cart, Order Row, Shipment Tracker, Address Card, Payment Method Card, Payment Method Mark |
| Cookie Consent | 0/1 | Cookie Consent |
| Editor | 0/7 | Rich Text Editor, Comment, Comment Composer, Selection Toolbar, Comment Highlight, Comment Thread, Comments Panel |
| Email | 0/16 | Email / Header, Email / Hero, Email / Button, Email / Content, Email / Code, Email / Details, Email / Details Row, Email / Line Items, Email / Line Item, Email / Total Row, Email / Callout, Email / Divider, Email / Stats, Email / Stat, Email / Article, Email / Footer |
| File Upload | 0/6 | File Dropzone, File Item, File Preview, Resource Item, File Field, File Type Icon |
| Filters | 0/8 | Filter Bar, Filter Chip, Faceted Filter, Facet Option, Filter Section, Filter Group, Filter Condition, Saved View Item |
| Form Presets | 0/1 | Field Preset |
| Form Layout | 0/5 | Form Section, Fieldset, Error Summary, Requirement List, Check Item |
| Image | 1/8 | Map, Image Cropper, Avatar Upload, Image Compare Slider, Device Frame, Image Figure, Thumbnail |
| Input OTP | 0/2 | Input OTP, OTP Slot |
| Kanban | 0/2 | Kanban Card, Kanban Column |
| Kbd | 2/3 | Shortcut Row |
| List | 0/5 | List Item, Sortable List Item, Task Item, Job Listing, List Group Header |
| Metrics | 0/6 | Trend Indicator, Metric Strip, Metric Strip Item, Usage Meter, Countdown, Leaderboard Row |
| Mobile | 0/7 | Mobile Header, Bottom Nav Item, Bottom Nav, FAB, Action Sheet, Store Badge, QR Code |
| Notifications | 0/2 | Notification Item, Notification Center |
| Pagination | 0/5 | Pagination Item, Pagination, Pagination Compact, Load More, Pager Link |
| Pricing | 0/11 | Price, Plan Card, Comparison Table, Plan Option Row, Meter Banner, Paywall Card, Lock Badge, Gate Overlay, Usage Limit Banner, Trial Banner, Upsell Card |
| Progress | 1/5 | Progress Segment, Progress Ring, Background Job, Top Loading Bar |
| Prose | 0/6 | Prose, Prose Heading, Prose Paragraph, Prose List Item, Prose Blockquote, Highlight |
| Quote | 0/3 | Quote, Testimonial Card, Footnote |
| Rating | 0/3 | Rating, Review Item, Rating Summary |
| Save Bar | 0/1 | Save Bar |
| Scheduler | 1/7 | Calendar Event, Gantt Bar, Gantt Milestone, Agenda Item, Meeting Card, Availability Row |
| Scroll Area | 0/1 | Scroll Area |
| Search | 0/3 | Search Result Item, Search Suggestions, Search Suggestion Item |
| Section Heading | 0/1 | Section Heading |
| Sharing | 0/3 | Access Row, Invite Row, Share Link Row |
| Slider | 0/1 | Slider |
| Spinner | 1/2 | Loading Overlay |
| Stepper | 0/2 | Step, Stepper |
| Surveys | 0/3 | Feedback Widget, NPS Survey, CSAT Rating |
| Table | 14/24 | Table Cell User, Table Cell Progress, Table Cell File, Table Cell Badges, Table Cell Avatars, Table Cell Media, Data Grid Toolbar, Table Pagination, Column Settings, Column Settings Item |
| Timeline | 0/1 | Timeline Item |
| Toolbar | 0/1 | Toolbar |
| Tour | 0/3 | Coachmark, Hotspot, Annotation Pin |
| Tree | 0/1 | Tree Item |
| Video | 0/3 | Video Player, Video Thumbnail, Audio Player |

## Notes
- The full suite (`npm test`) is slow (well over 10 minutes for ~1,000 stories). Run story files
  in groups while building; run the full suite before a release.
- Transitions are off in tests (`.storybook/vitest.setup.ts`). Day labels are built without the
  browser comma (`formatFullDate`).
- Shared changes still open: DropdownMenuItem asChild (real links in menus), item options on
  sub/radio/checkbox menu items, Sheet and Drawer switching to the shared Scrim / Dialog Header /
  Dialog Footer, Range and Duration Input switching to Input Addon, Setting Row stories using
  Select, Badge icon and count options, Board icon (Columns2) for Toggle Group.
