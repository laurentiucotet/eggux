# EGG UI v2: what exists in Figma

Inventory of the master library (`BufvaVkSh9vMWPye117Ucd`). Client files start as a duplicate,
so the same names exist there. Use instances of these; build something new only when nothing
fits, and say so. When this list and the file disagree, the file wins: update this list.
Full per-component detail (every property with its default, slots, parts, tokens, guides, code)
is generated into `references/components/` by `scripts/component-docs.*`.

EGG UI is a generalist design system: complete enough for any product (SaaS, e-commerce, fintech,
booking, content, internal tools). Component names, descriptions and props stay domain-neutral;
example content varies across domains. Default texts in components and blocks use a neutral
product ("Acme": projects, customers, invoices); domain content lives in examples only.
Domain-specific needs become Field Presets or Blocks.

## Foundations
- Variables: `Primitives` (Value), `Semantic` and `Components` (Light, Dark, Corporate Light,
  Corporate Dark), `Density` (Comfortable, Compact). Chart palette `chart/1..8`, motion `motion/*`. See `tokens.md`.
- Text styles: see `tokens.md`. Effect styles: `shadow/*`, `blur/*`, `backdrop-blur/*`.

## Components

| Page | Component | Variants | Properties |
|---|---|---|---|
| Icons | `Icon/<name>` | - | Lucide, 24 px, one `Vector` layer bound to `foreground/default`. Rescale to 16 (UI) or 12 (badge) |
| Tour | `Coachmark` | Side: bottom, top, right, left | Title, Description, Step, Show media (Media slot), Show close, Show back. Arrow points at the target |
| Tour | `Hotspot` | - | 24 px beacon that opens a Coachmark |
| Video | `Video Player` | State: poster, playing, buffering | Duration, Time, Show subtitles. `video/*` tokens, dark in both modes |
| AI Chat | `Prompt Input` | State: default, focus, streaming, disabled | Placeholder, Value, Show attachments, Show tools, Show voice; Attachments, Tools (native slots). Send becomes Stop while streaming |
| AI Chat | `Attachment` | Type: file, image. State: default, uploading, error | Name, Meta, Show remove |
| AI Chat | `User Message` | - | Text, Show actions (copy, edit). Bubble hugs, max 576 |
| AI Chat | `Assistant Message` | State: default, streaming, error | Content (native slot), Show actions (copy, regenerate, good, bad) |
| AI Chat | `Reasoning` | State: running, collapsed, expanded | Label, Details |
| AI Chat | `Tool Call` | Status: running, done, error, approval | Title, Detail; approval has Deny / Approve |
| AI Chat | `Source Item` | - | Number, Title, Domain |
| AI Chat | `Sources` | - | Label, Show list; Items (native slot) |
| AI Chat | `Citation` | - | Label |
| AI Chat | `Suggestion` | Layout: chip, card | Label, Description, Icon (card) |
| AI Chat | `Model Selector` | State: default, hover, focus | Model. Sparkles + name + chevron; opens Model Options |
| AI Chat | `Model Option` | Selected: false, true. State: default, hover | Name, Description, Show badge; Badge exposed |
| AI Chat | `Context Chip` | Type: file, record, person | File, Record, Person (one text property per type, truncates at 180), Show remove |
| AI Chat | `Voice Recorder` | State: recording, processing | Cancel, recording dot, time, waveform, send; Transcribing… |
| AI Chat | `Chat History Item` | State: default, hover, active | Title (1 line), Time, Show time, Pinned; menu on hover |
| AI Chat | `Response Feedback` | - | Title, reason Chips, Textarea (Show details), Note, Cancel / Send |
| AI Chat | `Plan Step` | Status: pending, running, done, error | Title, Detail, Error, Show detail, Time, Show time |
| AI Chat | `Agent Plan` | - | Title, Status, Footer, Show stop, Show footer; Progress exposed; Steps (native slot) |
| AI Chat | `Artifact Card` | Type: document, chart, table. State: default, hover | <Type> title and meta per type; Open |
| AI Chat | `AI Summary` | State: ready, generating, error | Title, Meta, Show feedback, Show disclaimer; Content (native slot) |
| AI Chat | `AI Suggestion` | State: suggested, accepted | Label, Value, Reason; Accept / Dismiss; accepted shows the AI label |
| AI Chat | `AI Notice` | Type: label, disclaimer | Label, Disclaimer |
| Button | `Button` | Variant: default, secondary, outline, ghost, destructive, link. Size: sm, default, lg. State: default, hover, focus, disabled, loading (spinner instead of the leading icon) | Label; Leading icon, Trailing icon (boolean + swap) |
| Button | `Button Icon` | Variant: default, secondary, outline, ghost, destructive. Size: sm 32, default 36, lg 40. State: default, hover, focus, disabled | Icon (swap) |
| Button | `Button Group Item` | Position: first, middle, last. State: default, hover, focus, disabled | Label, Show label, Icon + Icon type |
| Button | `Button Group` | - | Items (native slot) |
| Button | `Action Bar` | Align: end, start, center | Show divider, Show leading; Leading, Actions (native slots). The row of buttons that ends a form, a step or a hero |
| Button | `Split Button` | Variant: default, outline | Label; chevron opens a Menu |
| Badge | `Badge` | Variant: default, secondary, destructive, outline, success, warning, info. Shape: rounded, pill | Label; Icon (boolean + swap); Dot; Count + Count value |
| Badge | `Badge Count` | Variant: default, secondary, destructive, outline | Count (numeric bubble for nav items and icon buttons) |
| Badge | `Status Dot` | Status: success, warning, error, info, neutral | Label, Show label |
| Badge | `Tag List` | - | Show more; Tags (native slot) of Badges + "+N" Badge (exposed). A few tags on one line |
| Chip | `Chip` | State: default, hover, focus, selected, disabled | Label, Leading icon, Remove |
| Avatar | `Avatar` | Type: initials, image. Size: xs 20, sm 24, default 32, lg 40, xl 48. Shape: circle (people), square (companies, apps) | Initials, Status (online dot). Photo = image fill on the `image` layer |
| Avatar | `Avatar Group` | Size: sm, default, lg | Avatars (native slot), overlap with a 2 px background ring, "+N" as last avatar; Label + Show label ("Maintained by 3 analysts") |
| Avatar | `Byline` | Size: sm, default, lg | Name, Detail, Show detail, Show avatar; Avatar (exposed). Who wrote, said or owns something |
| Separator | `Separator` | Orientation: horizontal, vertical. Spacing: none, sm (4), md (8) | Use anywhere: menus, cards, toolbars, sidebars |
| Input | `Input` | State: default, focus, error, disabled. Content: placeholder, filled | Value; Leading icon (boolean + swap); Trailing (native slot) + Show trailing |
| Input | `Password Strength` | Strength: empty, weak, fair, good, strong | Meter + message under a new-password field |
| Input | `Field` | State: default, error, disabled | Label, Hint, Show hint, Error. Control (native slot, default Input) |
| Input | `Textarea` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Min height 64, grows with content; put it in a Field |
| Input | `Input Addon` | Position: start, end | Text |
| Input | `Input Group` | State: default, focus, error, disabled | Value, Show start, Show end; Start, End (native slots) |
| Input | `Number Input` | State: default, focus, error, disabled | Value; − / + steppers |
| Input | `Inline Edit` | State: view, hover, editing, saving, error | Value. Pencil on hover; Input with check and x while editing |
| Input | `Signature Pad` | State: empty, signed | Pad (clips the stroke), baseline, Clear, Type instead; signer and time when signed |
| Input OTP | `OTP Slot` | Position: first, middle, last. State: empty, filled, active, error | Digit |
| Input OTP | `Input OTP` | Length: 4, 6 | Groups of OTP Slots (3 + 3 with separator) |
| Kbd | `Kbd` | - | Key |
| Kbd | `Kbd Group` | - | Keys (native slot) |
| Spinner | `Spinner` | Size: sm 16, default 20, lg 32. Tone: muted, default | Loader icon; rotate in code |
| File Upload | `File Dropzone` | State: default, drag-over, error, disabled | Hint; Browse button exposed |
| File Upload | `File Item` | State: uploading, complete, error | File name; Progress, cancel/remove, Retry |
| File Upload | `Resource Item` | - | Icon (swap), Name, Meta, Divider; Actions (native slot). A file people download or open |
| File Upload | `File Preview` | State: ready, loading, unavailable | File name, Meta; zoom, download, close; page thumbnails; page count. Page area clips |
| Progress | `Progress` | Tone: default, success, warning, error. Value: 0, 25, 50, 75, 100 | Resize the indicator for other values |
| Progress | `Progress Ring` | Size: sm, default, lg. Value: 0, 25, 50, 75, 100 | Show label (percent inside on default and lg) |
| Slider | `Slider` | Type: single, range. State: default, focus, disabled | Move range and thumbs for other values |
| Selection controls | `Checkbox` | Checked: false, true, indeterminate. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Radio` | Checked: false, true. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Switch` | Checked: false, true. State: default, focus, disabled | Label, Show label |
| Selection controls | `Setting Row` | - | Title, Description, Show description, Divider; Control (native slot: Switch, Select, Button) |
| Scroll Area | `Scroll Area` | Orientation: vertical, horizontal | Clips its content; thin scrollbar on border/default |
| Select | `Select` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Open state = Select (focus) + Menu with Checked on the selected item |
| Select | `Combobox` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Searchable select trigger (chevrons-up-down); opens a Command |
| Select | `Tag` | State: default, disabled | Label, Remove |
| Select | `Tag Input` | State: default, focus, error, disabled | Tags (native slot), Chevron |
| Select | `Person Option` | Selected: false, true. State: default, hover | Name, Detail, Show detail; Checkbox and Avatar (exposed) |
| Select | `People Picker` | State: closed, open | Placeholder; Selected, Results (native slots); search, invite by email |
| Select | `Transfer List` | - | Left title, Right title; Available, Selected (native slots of Facet Options); counts, search, move buttons |
| Popover | `Popover` | - | Content (native slot). 288 wide, popover tokens, shadow/md |
| Popover | `Command Input` | - | Value. Search field with bottom divider |
| Popover | `Command` | - | Command Input (exposed), Items (native slot), Empty, Show items. Base for Combobox and ⌘K |
| Popover | `Hover Card` | - | Content (native slot), 320 wide |
| Popover | `Command Dialog` | - | Command Input (exposed), Items (native slot), footer with key hints. 560 wide |
| Calendar | `Calendar Day` | State: default, hover, focus, today, selected, outside, disabled, range-start, range-middle, range-end | Day |
| Calendar | `Calendar` | - | Month. Monday-first month grid, prev/next ghost Button Icons |
| Calendar | `Date Picker` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Calendar icon; opens Calendar in a popover |
| Calendar | `Time Picker` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Clock icon; opens a Menu of times |
| Calendar | `Date Range Picker` | - | Presets (native slot), Summary, Show presets; two Calendars; Cancel / Apply |
| Chart | `Bar Chart` | Type: single, grouped, stacked | Bars ≤ 24, 4 px data-end radius, 2 px gaps; y axis, grid, x labels |
| Chart | `Line Chart` | Type: line, area | 2 px lines, end dots with surface ring, area at opacity/10 |
| Chart | `Donut Chart` | Type: donut, pie | Total, Total label; 4 segments (arcData) and legend with values |
| Chart | `Bar Chart Horizontal` | - | Ranked rows: label, bar (share of track), value |
| Chart | `Heatmap` | - | 7 × 12 grid, 5 opacity steps of chart/1, legend Fewer → More |
| Chart | `Gauge` | Status: on track, at risk, off track | Label; arc with value, target tick, written status |
| Chart | `Treemap` | - | Six tinted cells with colored edge, labels inside when they fit |
| Chart | `Funnel Chart` | - | 4 stages: name, count, bar, conversion; overall rate. Min width 480 |
| Chart | `Scatter Chart` | Series: one, two | X title, Y title; points on chart/1, chart/2; axes and gridlines |
| Chart | `Waterfall Chart` | - | 7 steps: totals neutral, increases blue, decreases red; signed labels, connectors, legend. Resizes with its container |
| Chart | `Combo Chart` | - | Bars (chart/1, left axis) + line (chart/2, right axis, end label); legend names the axes. Resizes with its container |
| Chart | `Sparkline` | Trend: up, down | 120 x 32, no axes |
| Chart | `Chart Legend Item` | Key: swatch, line. Series: 1-8 | Label |
| Chart | `Chart Legend` | - | Items (native slot) |
| Chart | `Chart Tooltip Row` | Series: 1-8 | Label, Value |
| Chart | `Chart Tooltip` | - | Title; Rows (native slot) |
| Chart | `Chart Card` | - | Title, Description, Insight, Note, Show legend, Show footer; Actions, Chart (native slots); Legend exposed |
| Code Block | `Code Block` | - | Language, Code, Show header; Copy button |
| Editor | `Rich Text Editor` | State: default, focus | Toolbar (heading, bold, italic, underline, lists, quote, link); Content (native slot), Show footer (hint + counter) |
| Chat | `Comment` | Type: comment, reply. State: default, resolved | Name, Time, Text, Show actions; Avatar exposed |
| Chat | `Comment Composer` | - | Avatar, Textarea, attach, ⌘↵ hint, Comment button |
| Chat | `Chat Message` | Direction: incoming, outgoing | Text, Time, Show meta (time + delivery status) |
| Chat | `Typing Indicator` | - | Three dots + "… is typing" |
| Chat | `Chat Composer` | - | Attach, message field, Send |
| Quote | `Quote` | Variant: default (left rule), pull (centered) | Quote, Name, Role, Show avatar, Show attribution. A quotation in running content |
| Section Heading | `Section Heading` | Size: lg (h2), default (h3), sm (h4) | Title, Description, Overline, Show overline, Show description, Show actions; Actions (native slot). Opens a section of an app or content page |
| Feature Item | `Feature Item` | Layout: stacked, inline, centered | Title, Description, Icon (swap), Show description, Show link. One benefit: icon tile, title, text |
| Rating | `Rating` | Size: sm, default. Value: 0-5 | Show value, Show count, Count. Value text edited per instance |
| Carousel | `Carousel` | Type: single (720), multiple (1152) | Slides (native slot); Carousel Arrow (outline) and Carousel Indicator (dots); viewport clips |
| Carousel | `Carousel Arrow` | Variant: outline, overlay. Direction: previous, next. State: default, hover, focus, disabled | Round 36 (outline) or 40 with shadow (overlay) |
| Carousel | `Carousel Indicator` | Type: dots, bars, counter. Tone: default, overlay | Counter; bars include Pause |
| Carousel | `Carousel Thumbnail` | State: default, hover, active | 64 square, Image Placeholder inside, 2 px ring when active |
| Carousel | `Carousel Slide` | Type: caption, overlay | Title, Description (caption); Headline, Text, action (overlay); Show description, Show action |
| Carousel | `Carousel Gallery` | - | Stage (image layer, overlay arrows, counter, open viewer) + Thumbnails slot; Show thumbnails |
| Carousel | `Carousel Hero` | - | 1440 × 560 banner: image, scrim, Overline, Headline, Text, action, bars, arrows |
| Carousel | `Lightbox` | - | 1280 × 800 viewer on video/* tokens: Counter, Title, download, close, arrows, thumbnails |
| Color Picker | `Color Picker` | - | Saturation area, hue slider, hex Input Group with opacity; Swatches (native slot) |
| Cookie Consent | `Cookie Consent` | Type: banner, card, preferences | Title, Body. Accept all and Reject all with equal weight; Customize; categories with Switches, Necessary always on |
| Kanban | `Kanban Card` | State: default, hover, dragging | Title, Due date, Show labels, Show meta; assignee exposed |
| Kanban | `Kanban Column` | - | Title, Cards (native slot); count exposed |
| Scheduler | `Gantt Bar` | Status: planned, in progress, done, blocked | Label; tinted bar, colored edge, progress line, status icon |
| Scheduler | `Gantt Milestone` | - | Label; diamond on the date |
| Scheduler | `Calendar Event` | Size: default, compact. Category: 1-4 | Title, Time |
| Pagination | `Pagination Item` | Type: page, previous, next, ellipsis. State: default, hover, active, focus, disabled | Label (page) |
| Pagination | `Pagination` | - | Items (native slot) |
| Pagination | `Pagination Compact` | - | Label ("Page 2 of 12"); previous and next Button Icon sm (exposed) |
| Stepper | `Step` | Orientation: horizontal, vertical. State: completed, current, upcoming, error | Title, Description, Show description, Number, Connector |
| Stepper | `Stepper` | - | Steps (native slot) |
| Description List | `Description List Item` | Orientation: horizontal, vertical | Label, Divider; Value (native slot) |
| Description List | `Meta Item` | - | Icon (swap, 16, muted), Label, Show icon. One fact: date, place, people, contact |
| Description List | `Figure` | Layout: stacked, inline. Size: default, lg | Value, Label, Source, Show source, Divider. A number with what it counts; no trend |
| Description List | `Summary Row` | Variant: default, discount, total | Label, Value. One line of a money breakdown, amount right aligned |
| Timeline | `Timeline Item` | Tone: default, primary, success, warning, destructive | Title, Time, Description, Show description, Icon (swap), Connector; Content (native slot) + Show content |
| Menu | `Menu Item` | Variant: default, destructive. State: default, highlighted, disabled | Label, Leading icon, Shortcut + Shortcut text, Checked, Description + Show description, Submenu (chevron) |
| Menu | `Menu Label` | - | Label |
| Menu | `Menu` | - | Items (native slot). Base for Dropdown menu, Select options and context menus |
| Menu | `Menubar Trigger` | State: default, hover, open | Label |
| Menu | `Menubar` | - | Menus (native slot of Menubar Triggers); opens a Menu below the trigger |
| Mobile | `Mobile Header` | Type: app, detail | Title; Leading, Trailing (native slots) |
| Mobile | `Bottom Nav Item` | State: default, active | Label, Icon (swap) |
| Mobile | `Bottom Nav` | - | Items (native slot), 3-5 items, safe-area padding |
| Tabs | `Tab` | Style: pill, line, vertical. State: default, active, focus, disabled | Label, Show count (Badge Count exposed), Icon (swap) + Show icon |
| Tabs | `Tabs`, `Tabs Line`, `Tabs Vertical` | - | Tabs (native slot of Tab instances); Tabs Vertical: 200 wide column of Tab Style=vertical |
| Toggle Group | `Toggle Group Item` | State: off, hover, on, focus, disabled | Label, Show label, Icon + Icon type |
| Toggle Group | `Toggle Group` | Variant: default, outline | Items (native slot). Sets a value; Tabs switch panels |
| List & Tree | `List Item` | State: default, hover, selected, focus, disabled | Title, Description, Show description, Show leading, Show trailing. Leading, Trailing (native slots) |
| List & Tree | `Tree Item` | Type: collapsed, expanded, leaf. State: default, hover, selected. Level: 0-3 | Label, Checkbox (exposed), Icon + Icon type, Count |
| List & Tree | `Sortable List Item` | State: default, hover, dragging, drop-target | Label, Description, Show description, Show leading; grip handle; Leading (native slot, 1:1 image 48), Trailing (native slot) |
| Tooltip | `Tooltip` | Side: top, bottom, left, right | Label (wraps at 280), Title + Show title (rich), Show shortcut (Kbd exposed) |
| Skeleton | `Skeleton` | Shape: text, circle, block | Resize instances to the real layout |
| Alert | `Alert` | Variant: default, destructive, success, warning, info. Layout: inline, banner | Title, Description, Show description, Actions (native slot) + Show actions, Dismiss |
| Toast | `Toast` | Type: default, success, error, warning, info, loading | Show description, Action (nested Button exposed), Close button (off by default). Text edited per instance |
| Dialog | `Dialog Header` | - | Title, Description, Show description, Close. Media (native slot) + Show media |
| Dialog | `Dialog Footer` | - | Actions (native slot) |
| Dialog | `Dialog` | - | Header, Content, Footer (native slots); Show header, Show content, Show footer. Width sm 384, default 512, lg 672, xl 896 (resize) |
| Dialog | `Alert Dialog` | Type: confirm, destructive, acknowledge | Header, Footer (native slots). Status icon in the header Media slot |
| Drawer | `Sheet` | Side: right, left | Side drawer, full height, 384 wide (480 forms, 640 record or preview). Header, Content, Footer (native slots) from Dialog Header/Footer |
| Drawer | `Drawer` | - | Bottom drawer, top radius xl. Handle; Header (no close), Content, Footer (native slots, stacked full-width buttons) |
| Drawer | `Side Panel` | State: expanded (320), collapsed (48) | Inline aside, no overlay. Title, Collapsible, Show footer; Actions, Content, Footer (native slots) |
| Card | `Card Header` | - | Title, Description, Show description, Show action. Action (native slot) |
| Card | `Card Footer` | - | Actions (native slot) |
| Card | `Card` | Variant: default, outline, muted. Size: default (24), sm (16). Elevation: false, true (toggle, shadow md) | Header, Content, Footer (native slots, each with side padding); Show header, Show content, Show footer. Padding and gap from `density/card-*` (16 / 12 in Compact) |
| Card | `Stat Card` | Trend: up, down, neutral | Label, Value, Footnote, Show footer. Change badge and trend line edited per instance |
| Card | `Option Card` | State: default, hover, focus, selected, disabled | Title, Description, Show description, Icon + Icon type. Selectable card with a radio |
| Card | `Entity Card` | State: default, hover, focus, selected | Title (2 lines), Subtitle (1 line), Footer text; Show menu, Show tags, Show details, Show footer, Show actions, Show people; Leading (avatar, icon or 1:1 image), Tags, Details, Actions (native slots). Card padding sm tokens |
| Card | `Person Card` | Layout: vertical (280), horizontal (400) | Name, Role, Organization, Show organization, Show tags, Show contact, Show actions; Avatar, Tags, Contact (Meta Items), Actions (native slots) |
| Card | `Event Card` | Layout: horizontal (640), vertical (352, image) | Title, Show tags, Show actions, Show image; Date Tile (exposed); Tags, Meta (Meta Items), Actions (native slots) |
| Card | `Date Tile` | Size: default (56), sm (44) | Month, Day. Part of Event Card |
| Card | `Progress Card` | Status: on track, at risk, off track | Label, Value, Target (wraps under the value), Footnote; Progress exposed |
| Card | `Post Card` | Layout: vertical, horizontal, compact | Title, Excerpt, Date, Author, Show author, Show excerpt, Show image (compact: 1:1 image 64); category Badge exposed. Compact = title on 2 lines + meta, for related lists |
| Table | `Table Cell` | header: default, hover, resizing, dragging. body: default, hover, selected, editing, error. expanded | Content (native slot). Header hover/resizing show the resize handle |
| Table | `Table Cell Link`, `Table Cell Date`, `Table Cell File`, `Table Cell Tags`, `Table Cell Avatars` | - | Content for body cells: link (underlined), date (Show time), file (icon, name, size), tags (Tag List), people (Avatar Group sm) |
| Table | `Table Header Label` | Sort: off, sortable, ascending, descending. Align: left, right | Label |
| Table | `Table Cell Text` | Style: default, strong, muted. Align: left, right | Text |
| Table | `Table Cell Stack` | - | Title, Description |
| Table | `Table Cell User` | - | Name, Email, Show email. Avatar exposed |
| Table | `Table Toolbar` | - | Selection ("2 selected"), Actions (native slot) |
| Table | `Data Grid Toolbar` | - | Start, End (native slots): saved view, search, filters with count, columns, group by, export |
| Table | `Table Cell Amount` | Trend: none, up, down | Amount; Note (none), Increase (up), Decrease (down); Show note. Right-aligned |
| Table | `Table Cell Status` | - | Badge (exposed), Note (truncates at 96), Show note |
| Table | `Table Cell Progress` | - | Progress (exposed, 96 wide), Label |
| Table | `Table Cell Actions` | - | Show edit (icon button), Show menu (ellipsis). Right-aligned |
| Table | `Table Pagination` | - | Range (one line, truncates), Show rows per page; Select + Pagination |
| Table | `Table Group Row` | - | Label, Subtotal, Show subtotal; count exposed. Goes in a Table Cell Type=expanded spanning all columns |
| Filters | `Filter Condition` | Position: first, next | Field, operator (Selects), value (Tag Input by default), remove |
| Filters | `Filter Group` | - | Conditions (native slot), Add condition; muted nested group |
| Filters | `Filter Bar` | - | Two rows: Search + End slot (sort, columns); Filters slot (wraps) + Clear all. Show clear, Show filters |
| Filters | `Filter Chip` | Type: empty (dashed "+ Field"), active. State: default, hover, focus | Field, Value (truncates at 200), Show remove |
| Filters | `Faceted Filter` | - | Popover: Command Input, Items (native slot of Facet Options), Clear filters; Show footer |
| Filters | `Facet Option` | Checked: false, true. State: default, hover | Label, Count, Show count |
| Filters | `Filter Section` | Expanded: true, false | Title, Show selected count, Show more; Options (native slot). For filter side panels |
| Approvals | `Approval Step` | Status: approved, current, rejected, upcoming | Name, Role, Time, Comment, Show comment, Connector |
| Audit | `Change Item` | - | Field, Old, New |
| Save Bar | `Save Bar` | State: default, saving, error | Sticky bar with message, Discard, Save changes |
| Sidebar | `Org Switcher` | - | Organization list with role and plan, search, create, manage |
| Sidebar | `Sidebar Item` | Level: 1, 2 (sub-page, no icon; expanded only). Mode: expanded, collapsed. State: default, hover, active, disabled | Label, Icon (swap), Badge (Badge Count, exposed), Chevron |
| Sidebar | `Sidebar Group Label` | - | Label |
| Sidebar | `Sidebar Group` | Mode: expanded, collapsed | Items (native slot), Show label |
| Sidebar | `Sidebar Workspace`, `Sidebar User` | Mode: expanded, collapsed | Title, Subtitle |
| Sidebar | `Sidebar` | Mode: expanded (256), collapsed (48) | Header, Content, Footer (native slots) |
| Sidebar | `Sidebar Double` | Mode: expanded (288: rail 48 + panel 240), collapsed (48) | Panel title; Rail header, Rail, Rail footer, Panel actions, Panel (native slots) |
| Navigation | `Breadcrumb Item` | Type: link, current, ellipsis. State: default, hover (link) | Label, Separator |
| Navigation | `Breadcrumb` | - | Items (native slot) |
| Navigation | `Top Bar` | - | Sidebar trigger; Breadcrumb, Actions (native slots) |
| Navigation | `Page Header` | - | Title (heading/h3), Description, Show description; Actions (native slot) |
| Navigation | `Nav Link` | State: default, hover, active | Label, Chevron (marketing navbar) |
| Navigation | `Navigation Menu Link` | State: default, hover | Title, Description, Show icon, Icon (swap) |
| Navigation | `Navigation Menu Panel` | - | Links, Featured (native slots), Show featured |
| Navigation | `TOC Item` | Level: 1, 2. State: default, hover, active | Label |
| Navigation | `Table of Contents` | - | Items (native slot) |
| Accordion | `Accordion Item` | Density: default, compact. State: collapsed, expanded | Title, Leading icon + type, Show meta; Meta, Content (native slots) |
| Accordion | `Accordion` | - | Items (native slot) |
| Image | `Map` | - | Label, Address, Show label, Show controls, Show pin. Roads scale, pin stays centered; put a static map image as fill in production |
| Image | `Image Placeholder` | Ratio: 21:9, 16:9, 4:3, 1:1, 3:4 | Show caption. Put the photo as image fill on the instance. Ratio locked: FILL keeps the height in proportion |
| Image | `Image Cropper` | Shape: square, circle | Image layer (fill), scrim, selection that stays centered, zoom Slider, rotate, Cancel, Save |
| Image | `Avatar Upload` | State: empty, filled, uploading, error | Avatar, rules hint, Upload or Change, Remove |
| Sections (blocks) | `Section Header` | Align: center, left | Overline, Title (heading/h2), Description |
| Page Shells | `Page Shell / App`, `/ Marketing`, `/ Auth` | - | Page (native slot); Sidebar and Top Bar exposed in App |
| Page Shells | `Page Shell / Mobile` | - | 390 x 844. Mobile Header + Page (native slot) + Bottom Nav (exposed, `Bottom nav` boolean) |
| Page Shells | `Page Shell / Wizard` | - | Logo, Step text, Save and exit, Progress, Page (native slot, 672), Back / Continue |
| Page Shells | `Page Shell / Split View` | - | Sidebar + Top Bar; List (384) and Detail (native slots); resize handle |
| Page Shells | `Page Shell / Docs` | - | Header with search; Nav and Content (native slots); Table of Contents exposed |
| Brand | `Logo Mark` | - | The one place to put the client symbol; used by Logo and Sidebar Workspace |
| Brand | `Logo` | Type: mark, wordmark, full | Name |
| Form Presets | `Field Preset` | Type: email, password, new-password, phone, card-number, card-expiry, card-cvc, postal-code, country, region | Built from Field + Input/Select; nested Field exposed |
| Forms | `Block / Sign In`, `/ Sign Up`, `/ Payment`, `/ Address` | - | Card + Field Presets + Buttons |
| Navigation (blocks) | `Block / Navbar`, `Block / Footer` | - | Logo, Nav Links, CTAs; footer link columns |
| Hero | `Block / Hero Centered`, `Block / Hero Split` | - | Badge, display headline, lead, CTAs, Image Placeholder |
| Sections | `Block / Features`, `/ Stats`, `/ CTA`, `/ Pricing`, `/ Testimonials`, `/ FAQ` | - | Section Header + Cards, grid, Toggle Group, Accordion |
| App | `Block / Settings Section`, `/ Empty Page`, `/ Filtered List` | - | Settings row, first-use page, filter panel + list |
| App | `Block / Record Header`, `/ Record Detail`, `/ Notifications`, `/ Booking` | - | Record page header with tabs; details + activity; notifications popover; calendar + time slots |
| App | `Block / Analytics` | - | 4 Stat Cards + 2 Chart Cards (grouped bars, area) |
| App | `Block / Team Members`, `/ Billing`, `/ Onboarding Checklist`, `/ Profile`, `/ API Keys`, `/ Notification Preferences` | - | Settings and admin cards, 768 wide |
| App | `Block / Integrations` | - | Search + grid of integration cards, 1136 wide |
| App | `Block / Gantt` | - | Project timeline: task list by phase with owners, weeks, Gantt Bars, milestones, dependencies, today line, zoom |
| App | `Block / Kanban Board`, `/ Scheduler Week` | - | Board with columns and a dragged card; week view with toolbar, events, now line |
| App | `Block / Scheduler Month` | - | Month grid, up to 3 events per day + "+N more", today marked |
| App | `Block / Comments`, `/ Conversation` | - | Comment thread with replies, resolved comment and composer; chat with header, day separator, grouped messages, typing, composer |
| Page Headers | `Block / Header Detail`, `/ Header Listing`, `/ Header Search Results`, `/ Header Profile`, `/ Header Event`, `/ Header Topic`, `/ Header Report`, `/ Header Simple` | - | Tops of inner pages: detail (product, dataset, service) with people and media; listing hub with type switch and search; search results with tabs and sort; person; event with date, place and speakers; topic with subtopic chips; report with three figures; plain page (legal, about). Examples: topic page, event page |
| Content | `Block / Blog List`, `/ Article` | - | Featured + grid of Post Cards + pagination; reading column with prose and TOC |
| Sections (blocks) | `Block / Contact Cards`, `/ Contact with Map`, `/ Offices`, `/ Map Section` | - | Contact family: channel cards; form + map + address; office cards with maps; full-width map with overlay card |
| Sections (blocks) | `Block / Testimonial Single`, `/ Testimonial Grid`, `/ Testimonial Split`, `/ Testimonial Carousel` | - | Testimonials family: one quote; six cards with ratings; case study with results; carousel |
| Sections (blocks) | `Block / CTA Split`, `/ CTA Card`, `/ Features Split`, `/ Bento Grid` | - | CTA with image; CTA on primary; alternating feature rows; bento overview with real components |
| Content | `Block / Blog Grid`, `/ Blog Featured`, `/ Blog Post Header`, `/ News List` | - | Blog family: latest three; featured + list; article top; dated news list |
| Hero | `Block / Hero with Screenshot` | - | Headline, CTAs and the real product (Block / Analytics) in a browser frame |
| Navigation (blocks) | `Block / Announcement Banner`, `/ Footer Simple` | - | Banner family: one-line message on primary, dismissible; compact footer |
| Sections (blocks) | `Block / Pricing Single`, `/ Pricing Calculator` | - | Pricing family: one plan with what is included; seat slider with tiers and live total |
| Sections (blocks) | `Block / FAQ Grid`, `/ FAQ Centered`, `/ Stats Cards`, `/ Stats Split` | - | FAQ family: two columns of short answers; centered accordion with a contact card. Stats family: proof numbers as cards; numbers next to the story and source |
| Sections (blocks) | `Block / Team Grid`, `/ Team List` | - | Team family: photo grid of eight; leadership list with one-line bios |
| Sections (blocks) | `Block / Careers List`, `/ Careers Benefits`, `/ Job Header` | - | Careers family: open roles by department with filters; benefits as icon cards; top of a job page |
| Sections (blocks) | `Block / Gallery Grid`, `/ Gallery Mosaic` | - | Gallery family: three-column masonry with captions; one large image and four small with Show all |
| Sections (blocks) | `Block / Logo Cloud`, `/ Team`, `/ Contact`, `/ Newsletter`, `/ Comparison Table` | - | Marketing sections, 1440 wide, 1152 container |
| Navigation (blocks) | `Block / Navbar Mobile` | - | Logo + menu button, 390 wide. Opens the full-screen "mobile nav open" panel |
| Navigation (blocks) | `Block / Navbar Centered`, `/ Navbar Search`, `/ Navbar Mega Menu` | - | Navbar family: logo centered with split links; docs and help navbar with search and ⌘K; open mega menu with grouped Navigation Menu Links and a featured item |
| Navigation (blocks) | `Block / Footer Newsletter`, `/ Footer Corporate`, `/ Footer Centered` | - | Footer family: newsletter + three columns; corporate footer with company details, certifications, five columns, status, language; minimal centered |
| Content | `Block / Help Hero`, `/ Help Categories`, `/ Help Popular Articles`, `/ Help Article List` | - | Help center family: search hero with popular searches; topic cards with counts; popular articles; category page with topic nav, breadcrumb, dated articles |
| Content | `Block / Support Options`, `/ Docs Page Footer`, `/ Changelog`, `/ Status Page` | - | Help center family: channels with hours and reply times; helpful vote, edit link, previous / next; dated releases with New / Improved / Fixed; status with 90-day uptime bars and incidents |
| Forms | `Block / Multi-step Form` | - | Stepper + Card with Combobox, Date Picker, Select, Textarea; Back / Continue |
| Forms | `Block / Forgot Password`, `/ Check Email`, `/ Reset Password`, `/ Two-Factor`, `/ Accept Invite` | - | Auth flow cards, 384 wide |
| Empty State | `Empty State` | Size: default, sm | Title, Description, Show description, Icon (swap), Show actions; Actions (native slot) |
| Results | `Block / Result` | Type: not-found, server-error, no-access, maintenance, success | Show code; Actions (native slot) |
| Commerce | `Product Card` | State: default, sale, sold-out | Name, Variant text, Show action, Show wishlist |
| Commerce | `Block / Product Detail` | - | Gallery, options (Toggle Group), quantity, add to cart, details accordion |
| Commerce | `Block / Order Summary` | - | Lines, discount code, totals, pay button, trust line |
| Enterprise | `Block / Filter Builder`, `/ Approval Request`, `/ Audit Log` | - | Advanced filters popover; request with details and approval chain; read-only event log with field changes |
| Enterprise | `Block / Roles & Permissions`, `/ Report`, `/ Record Form` | - | Role matrix with Save Bar; report with KPIs, chart, breakdown; long edit form with section nav |
| Enterprise | `Block / Import Mapping` | - | Import stepper, file column → field mapping with samples and status, problems alert, save as template |
| AI | `Block / AI Chat Empty`, `/ AI Conversation` | - | Welcome with input and starter prompts; conversation with reasoning, tool calls, citations, sources, approval, input |
| AI | `Block / AI Assistant Panel`, `/ Inline AI` | - | 400-wide copilot panel with context; inline popover with actions and a result to accept |

Icons available: plus, minus, check, x, search, chevron-down, chevron-up, chevron-left,
chevron-right, chevrons-up-down, arrow-up-down, info, circle-alert, triangle-alert, circle-check,
loader-circle, mail, trash-2, ellipsis, pencil, copy, archive, user, users, settings, log-out,
calendar, clock, trending-up, trending-down, map-pin, phone, building, inbox, house, file-text,
chart-column, panel-left, bell, menu, upload, heart, shopping-bag, bold, italic, underline,
list, text-quote, link, heading, sparkles, thumbs-up, thumbs-down, refresh-cw, square, arrow-up,
paperclip, globe, wrench, mic, message-square, square-pen, play, pause, volume-2, maximize,
captions, lightbulb, list-filter, columns-3, download, shield-check, history, lock, eye, pin,
arrow-right, user-check (78).

## Conventions used
- Variant values use the shadcn prop values (`Variant=outline`, `Size=sm`), so Figma maps 1:1 to code.
- Focus is a 2 px gap (`background/default`) plus a 4 px ring (`border/ring`), as drop shadows.
  Figma draws shadow spread only with `clipsContent` on, so focus variants clip; nothing else does.
- Disabled is the variant at `opacity/50`.
- Text inside a variant is bound to a TEXT property, so text styling is shared by all variants.
  Per-variant decoration (like the link hover underline) is drawn with a frame stroke instead.
- Icons are a single `Vector` layer. Swapping keeps the stroke color override only when layer
  structure matches, so every new icon is flattened to one layer named `Vector`.
- Cloning a variant turns its SLOT into a plain frame named after the property. Clone first,
  then create slots, or delete the frame and create a fresh slot.
- Header / Content / Footer: Dialog and Card are built from a Header component, a Footer
  component and a container with three native slots, matching shadcn `*Header`, `*Footer`.

## Slots
Content areas use Figma native slots (component property type `SLOT`), never instance-swap
placeholders. A slot holds a default (a placeholder or the usual child); in an instance, replace
it with any layers or instances.

- Every slot has `clipsContent` off: `createSlot()` turns it on by default and it cuts focus
  rings, shadows and dropdowns.
- In Figma: select the slot in the instance and add content to it. "Reset slot" brings back the default.
- Through the Plugin API (build-ui): in an instance, slots are named after their property
  (`Header`, `Content`, `Footer`, `Items`, `Control`). Find them with
  `inst.children.find(n => n.type === 'SLOT' && n.name === 'Content')`, remove the default,
  `appendChild` the content, then set `layoutSizingHorizontal = 'FILL'` on each child.
- Creating a slot in a library component: `component.createSlot()` adds the node and a `SLOT`
  property (key in `slot.componentPropertyReferences.slotContentId`). In a component set,
  create the slot in every variant before `combineAsVariants`: slots with the same name merge
  into one property. Rename it with `editComponentProperty(key, { name, description })`.
- A slot cannot use GRID layout. Grid layouts (tables) are frames built by the designer.
- Use a slot when the content varies per use. Use boolean or TEXT properties when the variation
  is fixed (show footer, title text, leading icon on a menu item).

## Tables on auto-layout grid
The table is a template frame, not a component: copy `Template / invoices table (grid)` from the
Table page. It is a frame with `layoutMode = GRID`, one column per field (fixed width for
checkbox and actions, flex for content), rows that hug their content.

- Each cell is a `Table Cell` instance with `layoutSizingHorizontal/Vertical = FILL`.
- A row state (hover, selected) is the same State on every cell of that row.
- An expanded row is one `Table Cell` Type=expanded spanning all columns (`gridColumnSpan`),
  placed right after its row, whose expand button shows chevron-down.
- Put `Table Toolbar` above the grid while rows are selected.

## Brand page
`Brand` holds Logo Mark, Logo and a Theme preview (color roles, type scale, radius, a few
components) bound to Semantic tokens. To brand a client file: replace the glyph in Logo Mark,
re-alias Semantic tokens (`/eggux:brand-intake`), check the preview in Light and Dark.

## Page shells
Start every screen from a shell on the Page Shells page and fill its `Page` slot (which shell for
which screen: `skills/build-ui/index.md`):
- App: Sidebar + Top Bar (Breadcrumb, actions) + Page (Page Header, then content). Example on
  the App blocks page: "dashboard screen".
- Marketing: Navbar + Page (stack Blocks from Hero and Sections) + Footer. Width 1440, content
  container `layout/container/6xl` (1152).
- Auth: logo + one centered card (Sign In, Sign Up) on `background/muted`.
- Split View: App shell with List (384, resizable) and Detail slots for mail, chat, tickets, files.
- Docs: header with search, left navigation, reading column, table of contents.
- Wizard: focused flow without sidebar: step counter, Save and exit, progress, sticky Back / Continue.
- Back office on a grid (test, page "Test / Mobility Global": `Page Shell / Back office (test)`, not
  yet on the Page Shells page): Navigation column hugs Sidebar or Sidebar Double, Header (Top Bar +
  Page Header), Body with Main (flex) and Aside (hugs a Side Panel), Actions bar fixed at the
  bottom; only the Body scrolls. Variants Aside on / off, Show actions.
- Mobile (< 768): Mobile Header + Page + Bottom Nav. The App Sidebar opens from the menu button
  as a left Sheet ("mobile menu open"); marketing pages use `Block / Navbar Mobile`. See
  `build-ui/patterns/mobile.md`.

## Pages
The file opens with Cover (1920 x 1080 thumbnail), Intro (getting started, credits, changelog),
Foundations (tokens shown as swatches, type, spacing, radius, elevation, motion) and Brand.
Brand has a second Theme preview in Corporate Light, a Content panel (brand strings bound to the `Content` collection) and an English / Română comparison of the invoices example. Then two groups of pages, each sorted A-Z: COMPONENTS (layer 1 and Form Presets) and BLOCKS (block
categories and Page Shells). Block pages have no prefix. `Navigation` exists in both sections:
the first holds the components (Breadcrumb, Top Bar), the second the Navbar and Footer blocks.
Keep new pages in A-Z order inside their section.

Every component page has one row per main component, left to right: `<Name> / Docs` (a
generated doc frame), `<Name> / Component` (the component and its helper parts),
`<Name> / Stress test`, `<Name> / Examples` (the component in real screens).
`skills/tidy-component/component-page.js` builds the rows from `rows.json` and `docs.json`.

Every block page uses Figma sections: `Blocks` with one sub-section per family (Sections page:
Section Header, Features, Stats, CTA, Pricing, Testimonials, FAQ, Logo Cloud, Team, Contact,
Newsletter; App page: Settings and admin, Lists, Records, Communication, Scheduling and boards,
Dashboards; and so on), and `Examples` next to it with every `Example / …` frame. New blocks go
into their family section.

## Four layers
1. Primitives and components (Button, Input, Field, Card...): no business meaning.
2. Field Presets: a component with a purpose (email, phone, card number) built from layer 1.
3. Blocks: whole compositions (navigation, hero, sections, forms, app sections) built from
   layers 1 and 2, one page per category under the BLOCKS divider (AI, App, Commerce, Content,
   Enterprise, Forms, Hero, Navigation, Page Headers, Results, Sections).
4. Page Shells: full pages with a Page slot where blocks go.
A change in layer 1 flows up. Add a preset or block only when the same composition appears in
two or more projects; otherwise build it in the client file.

## Examples on the pages
Example frames (not components) show composition; copy them as a starting point:
list row loading (Skeleton), icon button with tooltip, open select, dialog over page, filter
chips, cards (list, profile, form, empty state), stat cards row, invoices table (grid), inline edit
and column resize, permissions tree, navigation tree, view switch, app shell (Sidebar + header +
stats + table), sheet over list, bottom drawer with filters,
textarea in field, combobox open, record page (App shell + record blocks), activity timeline, mobile list, mobile menu open,
mobile nav open, price range, verify phone, time picker open, date and time, upload documents, density comparison (Table page), search with shortcut, button loading, input groups, split button open, multi-select open, date range
filter, 404 in app, onboarding step, navbar with mega menu, search with suggestions, inbox (split
view), cart sheet, checkout page, docs page, date picker open, date range, table footer with pagination, color
field, AI chat app, product tour, enterprise invoices, theme comparison, menubar open, data grid
(enterprise) template.

## Not built yet
Nothing from the current roadmap. Icons: the 79 Lucide icons stay; the team may switch to Phosphor
(flatten each icon to one `Vector` layer so swaps keep their color). When something is missing,
compose from the components above, tokens and text styles, and flag it.
