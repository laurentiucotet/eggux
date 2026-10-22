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

Nested Buttons (with text), Badges, Badge Counts and Chips inside components are exposed: select
the parent instance and edit their Label in its properties panel. Badges whose text follows a
variant of the parent (Order Row status, Release Note type, Endpoint method) stay internal.

## Foundations
- Variables: `Primitives` (Value), `Semantic` and `Components` (Light, Dark, Corporate Light,
  Corporate Dark), `Density` (Comfortable, Compact). Chart palette `chart/1..8`, motion `motion/*`. See `tokens.md`.
- Text styles: see `tokens.md`. Effect styles: `shadow/*`, `blur/*`, `backdrop-blur/*`.

## Components

| Page | Component | Variants | Properties |
|---|---|---|---|
| Icons | `Icon/<name>` | - | Lucide, 24 px, one `Vector` layer bound to `foreground/default`. Rescale to 16 (UI) or 12 (badge) |
| Icons | `Icon/brand/<name>` | - | Brand logos from Simple Icons, filled, 24 px, one `Vector` bound to `foreground/default`: apple-podcasts, spotify, linkedin, youtube, github, x. Frame "Icons / Brand" |
| Tour | `Coachmark` | Side: bottom, top, right, left | Title, Description, Step, Show media (Media slot), Show close, Show back. Arrow points at the target |
| Tour | `Hotspot` | - | 24 px beacon that opens a Coachmark |
| Video | `Video Player` | State: poster, playing, buffering | Duration, Time, Show subtitles. `video/*` tokens, dark in both modes |
| AI Chat | `Prompt Input` | State: default, focus, streaming, disabled | Placeholder, Value, Show attachments, Show tools, Show voice; Attachments, Tools (native slots). Send becomes Stop while streaming |
| AI Chat | `Attachment` | Type: file, image. State: default, uploading, error | Name, Meta, Show remove |
| AI Chat | `User Message` | - | Text, Show actions (copy, edit). Bubble hugs, max 576 |
| AI Chat | `Assistant Message` | State: default, streaming, error | Content (native slot), Show actions (copy, regenerate, good, bad) |
| AI Chat | `Reasoning` | State: running, collapsed, expanded | Label, Status, Details |
| AI Chat | `Tool Call` | Status: running, done, error, approval | Title, Description; approval has Deny / Approve |
| AI Chat | `Source Item` | - | Number, Title, Domain |
| AI Chat | `Sources` | - | Label, Show list; Items (native slot) |
| AI Chat | `Citation` | - | Label |
| AI Chat | `Prompt Suggestion` | Layout: chip, card | Label, Description, Icon (card) |
| AI Chat | `Model Picker` | State: default, hover, focus | Model. Sparkles + name + chevron; opens Model Options |
| AI Chat | `Model Option` | Selected: false, true. State: default, hover | Name, Description, Show badge; Badge exposed |
| AI Chat | `Context Chip` | Type: file, record, person | File, Record, Person (one text property per type, truncates at 180), Show remove |
| AI Chat | `Voice Recorder` | State: recording, processing | Cancel, recording dot, time, waveform, send; Transcribing… |
| AI Chat | `Chat History Item` | State: default, hover, active | Title (1 line), Time, Show time, Pinned; menu on hover |
| AI Chat | `Response Feedback` | - | Title, reason Chips, Textarea (Show details), Note, Cancel / Send |
| AI Chat | `Plan Step` | Status: pending, running, done, error | Title, Description, Error, Show detail, Time, Show time |
| AI Chat | `Agent Plan` | - | Title, Status, Footer, Show stop, Show footer; Progress exposed; Steps (native slot) |
| AI Chat | `Artifact Card` | Type: document, chart, table. State: default, hover | <Type> title and meta per type; Open |
| AI Chat | `AI Summary` | State: ready, generating, error | Title, Meta, Show feedback, Show disclaimer; Content (native slot) |
| AI Chat | `AI Suggestion` | State: suggested, accepted | Label, Value, Reason, Note; Accept / Dismiss; accepted shows the AI label |
| AI Chat | `AI Notice` | Type: label, disclaimer | Label, Disclaimer |
| Button | `Button` | Variant: default, secondary, outline, ghost, destructive, link. Size: sm, default, lg. State: default, hover, focus, disabled, loading (spinner instead of the leading icon) | Label; Show leading icon + Leading icon (swap), Show trailing icon + Trailing icon (swap) |
| Button | `Button Icon` | Variant: default, secondary, outline, ghost, destructive. Size: sm 32, default 36, lg 40. State: default, hover, focus, disabled | Icon (swap) |
| Button | `Button Group Item` | Position: first, middle, last. State: default, hover, focus, disabled | Label, Show label, Show icon + Icon (swap) |
| Button | `Button Group` | - | Items (native slot) |
| Button | `Action Bar` | Align: end, start, center | Show divider, Show leading; Leading, Actions (native slots). The row of buttons that ends a form, a step or a hero |
| Button | `Split Button` | Variant: default, outline | Label; chevron opens a Menu |
| Badge | `Badge` | Variant: default, secondary, destructive, outline, success, warning, info. Shape: rounded, pill | Label; Show icon + Icon (swap); Show dot; Show count + Count value |
| Badge | `Badge Count` | Variant: default, secondary, destructive, outline | Count (numeric bubble for nav items and icon buttons) |
| Badge | `Status Dot` | Status: success, warning, error, info, neutral | Label, Show label |
| Badge | `Badge List` | - | Show more; Tags (native slot) of Badges + "+N" Badge (exposed). A few tags on one line |
| Chip | `Chip` | State: default, hover, focus, selected, disabled | Label, Show leading icon + Leading icon (swap), Show remove |
| Avatar | `Avatar` | Type: initials, image. Size: xs 20, sm 24, default 32, lg 40, xl 48. Shape: circle (people), square (companies, apps) | Initials, Show status (online dot). Photo = image fill on the `image` layer |
| Avatar | `Avatar Group` | Size: sm, default, lg | Avatars (native slot), overlap with a 2 px background ring, "+N" as last avatar; Label + Show label ("Maintained by 3 analysts") |
| Avatar | `Byline` | Size: sm, default, lg | Name, Description, Show detail, Show avatar; Avatar (exposed). Who wrote, said or owns something |
| Separator | `Separator` | Orientation: horizontal, vertical. Spacing: none, sm (4), md (8) | Use anywhere: menus, cards, toolbars, sidebars |
| Input | `Input` | State: default, focus, error, disabled. Content: placeholder, filled | Value; Show leading icon + Leading icon (swap); Trailing (native slot) + Show trailing |
| Input | `Password Strength` | Level: empty, weak, fair, good, strong | Meter + message under a new-password field |
| Input | `Field` | State: default, error, disabled | Label, Hint, Show hint, Error. Control (native slot, default Input) |
| Input | `Textarea` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Min height 64, grows with content; put it in a Field |
| Input | `Input Addon` | Position: start, end | Text |
| Input | `Input Group` | State: default, focus, error, disabled | Value, Show start, Show end; Start, End (native slots) |
| Input | `Number Input` | Size: default 36, sm 32. State: default, focus, error, disabled | Value; − / + steppers. sm is the quantity in Line Item and dense rows |
| Input | `Inline Edit` | State: view, hover, editing, saving, error | Value, Error. Pencil on hover; Input with check and x while editing |
| Input | `Signature Pad` | State: empty, signed | Pad (clips the stroke), baseline, Clear, Type instead; signer and time when signed |
| Input OTP | `OTP Slot` | Position: first, middle, last. State: empty, filled, active, error | Digit |
| Input OTP | `Input OTP` | Length: 4, 6 | Groups of OTP Slots (3 + 3 with separator) |
| Kbd | `Kbd` | - | Key |
| Kbd | `Kbd Group` | - | Keys (native slot) |
| Spinner | `Spinner` | Size: sm 16, default 20, lg 32. Tone: muted, default | Loader icon; rotate in code |
| File Upload | `File Dropzone` | State: default, drag-over, error, disabled | Title (not in drag-over), Hint, Error (error state); Browse button exposed |
| File Upload | `File Item` | State: uploading, done, error | File name; Progress, cancel/remove, Retry |
| File Upload | `Resource Item` | - | Icon (swap), Name, Meta, Show divider; Actions (native slot). A file people download or open |
| File Upload | `File Preview` | State: ready, loading, unavailable | File name, Meta; zoom, download, close; page thumbnails; page count. Page area clips |
| Progress | `Progress` | Tone: default, success, warning, error. Value: 0, 25, 50, 75, 100 | Resize the indicator for other values |
| Progress | `Progress Ring` | Size: sm, default, lg. Value: 0, 25, 50, 75, 100 | Show label (percent inside on default and lg) |
| Slider | `Slider` | Type: single, range. State: default, focus, disabled | Move range and thumbs for other values |
| Selection controls | `Checkbox` | Checked: false, true, indeterminate. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Radio` | Checked: false, true. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Switch` | Checked: false, true. State: default, focus, disabled | Label, Show label |
| Selection controls | `Setting Row` | - | Title, Description, Show description, Show divider; Control (native slot: Switch, Select, Button) |
| Scroll Area | `Scroll Area` | Orientation: vertical, horizontal | Clips its content; thin scrollbar on border/default |
| Select | `Select` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Open state = Select (focus) + Menu with Checked on the selected item |
| Select | `Combobox` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Searchable select trigger (chevrons-up-down); opens a Command |
| Select | `Tag` | State: default, disabled | Label, Show remove |
| Select | `Tag Input` | State: default, focus, error, disabled | Tags (native slot), Show chevron |
| Select | `Person Option` | Selected: false, true. State: default, hover | Name, Description, Show detail; Checkbox and Avatar (exposed) |
| Select | `People Picker` | State: closed, open | Placeholder; Selected, Results (native slots); search, invite by email |
| Select | `Transfer List` | - | Left title, Right title; Available, Selected (native slots of Facet Options); counts, search, move buttons |
| Popover | `Popover` | - | Content (native slot). 288 wide, popover tokens, shadow/md |
| Popover | `Command Input` | - | Value. Search field with bottom divider |
| Popover | `Command` | - | Command Input (exposed), Items (native slot), Show empty, Show items. Base for Combobox and ⌘K |
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
| Chart | `Gauge` | Status: on-track, at-risk, off-track | Label; arc with value, target tick, written status |
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
| Editor | `Comment` | Type: comment, reply. State: default, resolved | Name, Time, Text, Show actions; Avatar exposed |
| Editor | `Comment Composer` | - | Avatar, Textarea, attach, ⌘↵ hint, Comment button |
| Chat | `Chat Message` | Direction: incoming, outgoing | Text, Time, Show meta (time + delivery status) |
| Chat | `Typing Indicator` | - | Three dots + "… is typing" |
| Chat | `Chat Composer` | - | Attach, message field, Send |
| Quote | `Quote` | Variant: default (left rule), pull (centered) | Quote, Name, Role, Show avatar, Show attribution. A quotation in running content |
| Section Heading | `Section Heading` | Size: lg (h2), default (h3), sm (h4) | Title, Description, Overline, Show overline, Show description, Show actions; Actions (native slot). Opens a section of an app or content page |
| Feature Item | `Feature Item` | Layout: stacked, inline, centered. Marker: icon, number | Title, Description, Number, Icon (swap), Show description, Show link. One benefit, capability or step: icon tile or step number, title, text |
| Rating | `Rating` | Size: sm, default. Value: 0-5 | Show value, Show count, Count. Value text edited per instance |
| Carousel | `Carousel` | Type: single (720), multiple (1152) | Slides (native slot); Carousel Arrow (outline) and Carousel Indicator (dots); viewport clips |
| Carousel | `Carousel Arrow` | Variant: outline, overlay. Direction: previous, next. State: default, hover, focus, disabled | Round 36 (outline) or 40 with shadow (overlay) |
| Carousel | `Carousel Indicator` | Type: dots, bars, counter. Tone: default, overlay | Counter; bars include Pause |
| Carousel | `Carousel Thumbnail` | State: default, hover, active | 64 square, Image Placeholder inside, 2 px ring when active |
| Carousel | `Carousel Slide` | Type: caption, overlay | Title, Description (caption); Headline, Text, action (overlay); Show description, Show action |
| Carousel | `Carousel Gallery` | - | Stage (image layer, overlay arrows, counter, open viewer) + Thumbnails slot; Show thumbnails |
| Carousel | `Carousel Hero` | - | 1440 × 560 banner: image, scrim, Overline, Title, Text, action, bars, arrows |
| Carousel | `Lightbox` | - | 1280 × 800 viewer on video/* tokens: Counter, Title, download, close, arrows, thumbnails |
| Color Picker | `Color Picker` | - | Saturation area, hue slider, hex Input Group with opacity; Swatches (native slot) |
| Cookie Consent | `Cookie Consent` | Type: banner, card, preferences | Title, Body. Accept all and Reject all with equal weight; Customize; categories with Switches, Necessary always on |
| Kanban | `Kanban Card` | State: default, hover, dragging | Title, Due date, Show labels, Show meta; assignee exposed |
| Kanban | `Kanban Column` | - | Title, Cards (native slot); count exposed |
| Scheduler | `Gantt Bar` | Status: planned, in-progress, done, blocked | Label; tinted bar, colored edge, progress line, status icon |
| Scheduler | `Gantt Milestone` | - | Label; diamond on the date |
| Scheduler | `Calendar Event` | Size: default, sm. Series: 1-4 | Title, Time |
| Pagination | `Pagination Item` | Type: page, previous, next, ellipsis. State: default, hover, active, focus, disabled | Label (page) |
| Pagination | `Pagination` | - | Items (native slot) |
| Pagination | `Pagination Compact` | - | Label ("Page 2 of 12"); previous and next Button Icon sm (exposed) |
| Stepper | `Step` | Orientation: horizontal, vertical. State: completed, current, upcoming, error | Title, Description, Show description, Number, Show connector |
| Stepper | `Stepper` | - | Steps (native slot) |
| Description List | `Description List Item` | Orientation: horizontal, vertical | Label, Show divider; Value (native slot) |
| Description List | `Meta Item` | - | Icon (swap, 16, muted), Label, Show icon. One fact: date, place, people, contact |
| Description List | `Figure` | Layout: stacked, inline. Size: default, lg | Value, Label, Source, Show source, Show divider. A number with what it counts; no trend |
| Description List | `Summary Row` | Variant: default, discount, total | Label, Value. One line of a money breakdown, amount right aligned |
| Timeline | `Timeline Item` | Tone: default, primary, success, warning, destructive | Title, Time, Description, Show description, Icon (swap), Show connector; Content (native slot) + Show content |
| Menu | `Menu Item` | Variant: default, destructive. State: default, highlighted, disabled | Label, Show leading icon + Leading icon (swap), Show shortcut + Shortcut text, Checked, Description + Show description, Show submenu (chevron) |
| Menu | `Menu Label` | - | Label |
| Menu | `Menu` | - | Items (native slot). Base for Dropdown menu, Select options and context menus |
| Menu | `Menubar Trigger` | State: default, hover, open | Label |
| Menu | `Menubar` | - | Menus (native slot of Menubar Triggers); opens a Menu below the trigger |
| Mobile | `Mobile Header` | Type: app, detail | Title; Leading, Trailing (native slots) |
| Mobile | `Bottom Nav Item` | State: default, active | Label, Icon (swap) |
| Mobile | `Bottom Nav` | - | Items (native slot), 3-5 items, safe-area padding |
| Tabs | `Tab` | Variant: default, line, vertical. State: default, active, focus, disabled | Label, Show count (Badge Count exposed), Icon (swap) + Show icon |
| Tabs | `Tabs` | Variant: default, line, vertical | Tabs (native slot of Tab instances with the same Variant). default: pill tabs in a card; line: underlined page sections; vertical: a 200 wide column for settings |
| Toggle Group | `Toggle Group Item` | State: default, hover, selected, focus, disabled | Label, Show label, Show icon + Icon (swap) |
| Toggle Group | `Toggle Group` | Variant: default, outline | Items (native slot). Sets a value; Tabs switch panels. Theme, view and billing period switches are examples on this page, not components |
| List & Tree | `List Item` | State: default, hover, selected, focus, disabled | Title, Description, Show description, Show leading, Show trailing. Leading, Trailing (native slots) |
| List & Tree | `Tree Item` | Type: collapsed, expanded, leaf. State: default, hover, selected. Level: 0-3 | Label, Show checkbox (Checkbox exposed), Show icon + Icon (swap), Show count |
| List & Tree | `Sortable List Item` | State: default, hover, dragging, drop-target | Label, Description, Show description, Show leading; grip handle; Leading (native slot, 1:1 image 48), Trailing (native slot) |
| Tooltip | `Tooltip` | Side: top, bottom, left, right | Label (wraps at 280), Title + Show title (rich), Show shortcut (Kbd exposed) |
| Skeleton | `Skeleton` | Shape: text, circle, block | Resize instances to the real layout |
| Alert | `Alert` | Variant: default, destructive, success, warning, info. Layout: inline, banner | Title, Description, Show description, Actions (native slot) + Show actions, Show close |
| Toast | `Toast` | Type: default, success, error, warning, info, loading | Show description, Show action (nested Button exposed), Show close (off by default). Title and description text edited per instance (no TEXT properties) |
| Dialog | `Dialog Header` | - | Title, Description, Show description, Show close. Media (native slot) + Show media |
| Dialog | `Dialog Footer` | - | Actions (native slot) |
| Dialog | `Dialog` | - | Header, Content, Footer (native slots); Show header, Show content, Show footer. Width sm 384, default 512, lg 672, xl 896 (resize) |
| Dialog | `Alert Dialog` | Type: confirm, destructive, acknowledge | Header, Footer (native slots). Status icon in the header Media slot |
| Drawer | `Sheet` | Side: right, left | Side drawer, full height, 384 wide (480 forms, 640 record or preview). Header, Content, Footer (native slots) from Dialog Header/Footer |
| Drawer | `Drawer` | - | Bottom drawer, top radius xl. Show handle; Header (no close), Content, Footer (native slots, stacked full-width buttons) |
| Drawer | `Side Panel` | State: expanded (320), collapsed (48) | Inline aside, no overlay. Title, Collapsible, Show footer; Actions, Content, Footer (native slots) |
| Card | `Card Header` | - | Title, Description, Show description, Show action. Action (native slot) |
| Card | `Card Footer` | - | Actions (native slot) |
| Card | `Card` | Variant: default, outline, muted. Size: default (24), sm (16). Elevation: false, true (toggle, shadow md) | Header, Content, Footer (native slots, each with side padding); Show header, Show content, Show footer. Padding and gap from `density/card-*` (16 / 12 in Compact) |
| Card | `Stat Card` | Trend: up, down, neutral | Label, Value, Trend text, Footnote, Show footer. Trend line edited per instance |
| Card | `Option Card` | Control: radio, checkbox. State: default, hover, focus, selected, disabled | Title, Description, Show description, Show icon + Icon (swap). Selectable card: a radio for one choice, a checkbox for several; the whole card is the target |
| Card | `Entity Card` | State: default, hover, focus, selected | Title (2 lines), Description (1 line), Footer text; Show menu, Show tags, Show details, Show footer, Show actions, Show people; Leading (avatar, icon or 1:1 image), Tags, Details, Actions (native slots). Card padding sm tokens |
| Card | `Person Card` | Layout: vertical (280), horizontal (400) | Name, Role, Organization, Show organization, Show tags, Show contact, Show actions; Avatar, Tags, Contact (Meta Items), Actions (native slots) |
| Card | `Event Card` | Layout: horizontal (640), vertical (352, image) | Title, Show tags, Show actions, Show image; Date Tile (exposed); Tags, Meta (Meta Items), Actions (native slots) |
| Card | `Date Tile` | Size: default (56), sm (44) | Month, Day. Part of Event Card |
| Card | `Progress Card` | Status: on-track, at-risk, off-track | Label, Value, Target (wraps under the value), Footnote; Progress exposed |
| Card | `Post Card` | Layout: vertical, horizontal, compact | Title, Excerpt, Date, Author, Show author, Show excerpt, Show image (compact: 1:1 image 64; horizontal: image half the width, 160-640); category Badge exposed. Compact = title on 2 lines + meta, for related lists |
| Table | `Table Cell` | header: default, hover, resizing, dragging. body: default, hover, selected, editing, error. expanded | Content (native slot). Header hover/resizing show the resize handle |
| Table | `Table Cell Check` | Value: included, excluded, text | Text, Note, Show note. Plan comparison value in a table cell: included (check), excluded (dash) or a text value such as "100 GB" or "Unlimited", with an optional note ("per seat"). |
| Table | `Table Cell Link`, `Table Cell Date`, `Table Cell File`, `Table Cell Badges`, `Table Cell Avatars` | - | Content for body cells: link (underlined), date (Show time), file (icon, name, size), badges (Badge List), people (Avatar Group sm) |
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
| Filters | `Filter Section` | State: expanded, collapsed | Title, Show selected count, Show more; Options (native slot). For filter side panels |
| Approvals | `Approval Step` | Status: approved, current, rejected, upcoming | Name, Role, Time, Comment, Show comment, Show connector |
| Audit | `Change Item` | - | Field, Old, New |
| Save Bar | `Save Bar` | State: default, saving, error | Sticky bar with message, Discard, Save changes |
| Sidebar | `Org Switcher` | - | Organization list with role and plan, search, create, manage |
| Sidebar | `Sidebar Item` | Level: 1, 2 (sub-page, no icon; expanded only). Mode: expanded, collapsed. State: default, hover, active, disabled | Label, Icon (swap), Show badge (Badge Count, exposed), Show chevron |
| Sidebar | `Sidebar Group Label` | - | Label |
| Sidebar | `Sidebar Group` | Mode: expanded, collapsed | Items (native slot), Show label |
| Sidebar | `Sidebar Workspace`, `Sidebar User` | Mode: expanded, collapsed | Title, Description |
| Sidebar | `Sidebar` | Mode: expanded (256), collapsed (48) | Header, Content, Footer (native slots) |
| Sidebar | `Sidebar Double` | Mode: expanded (288: rail 48 + panel 240), collapsed (48) | Panel title; Rail header, Rail, Rail footer, Panel actions, Panel (native slots) |
| Navigation | `Breadcrumb Item` | Type: link, current, ellipsis. State: default, hover (link) | Label, Show separator |
| Navigation | `Breadcrumb` | - | Items (native slot) |
| Navigation | `Top Bar` | - | Show sidebar trigger; Breadcrumb, Actions (native slots) |
| Navigation | `Page Header` | - | Title (heading/h3), Description, Show description; Actions (native slot) |
| Navigation | `Nav Link` | State: default, hover, active | Label, Show chevron (marketing navbar) |
| Navigation | `Navigation Menu Link` | State: default, hover | Title, Description, Show icon, Icon (swap) |
| Navigation | `Navigation Menu Panel` | - | Links, Featured (native slots), Show featured |
| Navigation | `Table of Contents Item` | Level: 1, 2. State: default, hover, active | Label |
| Navigation | `Table of Contents` | - | Items (native slot) |
| Accordion | `Accordion Item` | Size: default, sm. State: collapsed, expanded | Title, Show leading icon + Leading icon (swap), Show meta; Meta, Content (native slots) |
| Accordion | `Accordion` | - | Items (native slot) |
| Image | `Map` | - | Label, Address, Show label, Show controls, Show pin. Roads scale, pin stays centered; put a static map image as fill in production |
| Image | `Image Placeholder` | Ratio: 21:9, 16:9, 4:3, 1:1, 3:4 | Show caption. Put the photo as image fill on the instance. Ratio locked: FILL keeps the height in proportion |
| Image | `Image Cropper` | Shape: square, circle | Image layer (fill), scrim, selection that stays centered, zoom Slider, rotate, Cancel, Save |
| Image | `Avatar Upload` | State: empty, filled, uploading, error | Label, Show label, Hint, Show remove. Profile or logo picture in settings: the avatar, a Label (Show label), a Hint with the upload rules, Upload or Change (exposed Button, set its Label, e.g. |
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
| App | `Block / Security`, `/ Share Dialog` | - | Two-factor, sign-in alerts, SSO URL and active sessions; share dialog with invite, access list and link |
| App | `Block / API Reference`, `/ Automations` | - | Endpoint list, curl snippet, JSON response, request log, schema diff; automation rules, rule flow and field mapping |
| App | `Block / Agenda`, `/ Executive Dashboard` | - | Next meeting, today's agenda, weekly availability, time slots; dashboard widgets with bullet charts, distribution bars, leaderboard, countdown |
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
| Hero | `Block / Hero Prompt` | - | AI-first home hero: optional Badge, headline with an accent line in `foreground/brand`, label, Prompt Input, optional suggestions, image |
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
| Forms | `Block / Account Settings Form` | - | Long settings form: Error Summary, Form Sections, phone, date, currency and address inputs, Fieldset, Recurrence Picker, Requirement List, Action Bar |
| Forms | `Block / Forgot Password`, `/ Check Email`, `/ Reset Password`, `/ Two-Factor`, `/ Accept Invite` | - | Auth flow cards, 384 wide |
| Empty State | `Empty State` | Size: default, sm | Title, Description, Show description, Icon (swap), Show actions; Actions (native slot) |
| Results | `Block / Result` | Type: not-found, server-error, no-access, maintenance, success | Show code; Actions (native slot) |
| Commerce | `Product Card` | State: default, sale, sold-out | Name, Variant text, Show action, Show wishlist, Price, Old price. A product in a grid or carousel: photo, sale or sold-out badges, wishlist, name, variant text, Price and Old price, optional quick add. |
| Commerce | `Block / Product Detail` | - | Gallery, options (Toggle Group), quantity, add to cart, details accordion |
| Commerce | `Block / Order Summary` | - | Lines, discount code, totals, pay button, trust line |
| Commerce | `Block / Product Grid`, `/ Orders`, `/ Reviews` | - | Category listing with filters, sort, product grid and Load More; order history with tracking, address and payment; rating summary with reviews |
| Enterprise | `Block / Filter Builder`, `/ Approval Request`, `/ Audit Log` | - | Advanced filters popover; request with details and approval chain; read-only event log with field changes |
| Enterprise | `Block / Roles & Permissions`, `/ Report`, `/ Record Form` | - | Role matrix with Save Bar; report with KPIs, chart, breakdown; long edit form with section nav |
| Enterprise | `Block / Import Mapping` | - | Import stepper, file column → field mapping with samples and status, problems alert, save as template |
| AI | `Block / AI Chat Empty`, `/ AI Conversation` | - | Welcome with input and starter prompts; conversation with reasoning, tool calls, citations, sources, approval, input |
| AI | `Block / AI Assistant Panel`, `/ Inline AI` | - | 400-wide copilot panel with context; inline popover with actions and a result to accept |
| Accordion | `Show More` | State: collapsed, expanded | Text. A long text cut to 3 lines with a Show more / Show less toggle. |
| Admin | `API Key Row` | - | Name, Meta, Key, Show scope. One API key or token in developer settings: key icon, name with a scope Badge (Show scope; set its Label, e.g. |
| Admin | `Integration Card` | Status: available, connected, error | Name, Category, Description, Logo, Vendor, Show icon, Show letter, Letter, Show badge, Show vendor, Show link. One app in an integrations directory or settings: logo tile, name, category, one-line value and state. |
| Admin | `Org Chart Node` | State: default, selected, vacant | Name, Role, Reports, Vacancy. One person or open role in an org chart: avatar, name, role and direct reports. |
| Admin | `Permission Row` | Type: permission, header, group | Title, Description, Show description, Show changed, Show role 4, Show role 5, Group. One row of a role matrix, built from Table Cells so rows, the header and group rows share one grid. |
| Admin | `Session Row` | Device: desktop, mobile. State: default, current | Name, Meta. One signed-in device in security settings: device and browser, approximate location, partial IP, last active, Sign out. |
| AI Chat | `AI Loading` | - | Status, Progress, Show progress, Show stop. Placeholder while AI writes an answer or a summary in place: what it is doing now, shimmer lines in the shape of the result, step and time left, Stop. |
| AI Chat | `Confidence Indicator` | Level: high, medium, low | Show info. Says how sure the AI is about an extracted value, a match or an answer: high, medium or low. |
| AI Chat | `AI Review Bar` | - | Count, Show bulk actions. Floating bar for reviewing AI edits in a document or form one by one: position, previous and next, accept or reject, and accept or reject all. |
| Alert | `Service Status Row` | Status: operational, degraded, outage, maintenance | Name, Uptime, Show uptime, Show bars. One service on a status page or an admin health panel: name, uptime over the last 90 days and the current status in words with a Status Dot. |
| Alert | `Uptime Bars` | - | Start label, End label, Show labels. Uptime history of one service: 90 Uptime Day bars, oldest on the left, with an optional caption row (Show labels: "90 days ago" and "Today"). |
| Alert | `Uptime Day` | State: operational, degraded, outage, maintenance, no-data | One day in Uptime Bars. |
| Audit | `Release Note Item` | Type: new, improved, fixed | Title, Text, Date, Show image, Show link, Show text, Show changes, Changes (slot). One entry of a changelog or "What's new": type badge (New, Improved, Fixed), version and date, a title that says the benefit, two sentences on how to use it, optional screenshot and link. |
| Audit | `Release Note Line` | Type: new, improved, fixed | Text. One tagged line in a changelog entry: a Badge for the Type (New info, Improved secondary, Fixed success) and one sentence that says what changed for the user. |
| Audit | `Version Item` | State: current, past, selected | Version, Meta, Summary. One saved version in a version history panel: who, when, what changed, and Restore. |
| Automation | `Automation Rule` | Status: on, off | Name, Meta, Trigger, Condition, Action, Show condition. One automation in a rules list, written as a sentence: When trigger, and condition, then action. |
| Automation | `Mapping Row` | Status: mapped, unmapped, error | Source, Sample. Maps one source column or field to a target field during import or sync setup: source with a sample, arrow, target Select and status. |
| Automation | `Workflow Node` | Type: trigger, condition, action. State: default, selected, error | Title, Detail. One step on an automation or approval canvas: trigger, condition (branches) or action. |
| Avatar | `Presence Bar` | - | Who else has this document, record or board open right now: a live dot and their avatars. |
| Badge | `Announcement Pill` | - | Label, Show tag. A short link above a hero title to the newest launch: "New" tag, one line, arrow. |
| Badge | `Trust Badge` | - | Name, Description, Icon. A certification or compliance claim with what backs it: SOC 2, ISO 27001, GDPR, PCI DSS. |
| Brand | `Logo Tile` | Style: bordered, plain | Name. A customer or partner logo in a tile for logo clouds, integration grids and case study lists. |
| Button | `Social Share` | - | Label, Show label, Show networks. Share buttons for a public page: copy link, email, the system share sheet and up to three networks. |
| Card | `Link Preview` | Layout: horizontal, vertical | Domain, Title, Description, Show image. A pasted URL shown as a card in comments, chat, notes and editors: site, title, description and image from the page metadata. |
| Card | `Location Card` | - | City, Address, Show tag, Show map. One office, store or venue: city with an optional tag Badge (Show tag), full address, phone and hours as Meta Items, and a Get directions link. |
| Chart | `Bullet Chart` | - | Title, Unit, Value, Target. One measure against its target and bands (poor, fair, good) in one line: revenue vs plan, SLA vs goal. |
| Chart | `Choropleth Map` | - | Values by region on a map, shaded from light (low) to dark (high): revenue by county, customers by country. |
| Chart | `Dashboard Widget` | - | Title, Period, Updated, Show footer, Content (slot). A movable, resizable tile on a customizable dashboard: drag handle, title, period, refresh, expand and menu, any chart, KPI or list in Content (fills the width, hugs the height), last updated. |
| Chart | `Distribution Bar` | - | Title, Total, Show legend. Parts of one whole as a single 100% bar: invoices by status, budget by category, storage by type. |
| Chart | `Radar Chart` | - | Compares 1-3 items across 5-8 qualities on the same scale: vendor scores, skill profiles, plan features. |
| Chart | `Sankey Chart` | - | Shows how amounts flow from sources to outcomes: payment method to paid or overdue, traffic source to sign-up, budget to spend. |
| Chat | `Mention Chip` | State: default, you | Name. A person mentioned in text (comments, chat, notes): @ and the name on a tinted chip, inline with the text. |
| Chat | `Reaction` | State: default, reacted | Emoji, Count. One emoji reaction with its count; State=reacted when the reader added it. Part of Reaction Bar. |
| Chat | `Reaction Bar` | - | Reactions (slot). Reactions under a comment or message: one Reaction per emoji with its count, then a button that opens the Emoji Picker. |
| Chat | `Thread Summary` | - | Replies, Last. Collapsed replies under a comment or message: who replied, how many and when the last one came. |
| Code Block | `Command Snippet` | - | Command, Show prompt. One command or value people copy into a terminal or config: install line, CLI command, environment variable. |
| Code Block | `Diff Line` | Type: context, added, removed | Text, Line. One line of a diff: number, marker, sign and text. Part of Diff Viewer. |
| Code Block | `Diff Viewer` | - | File, Added, Removed, Lines (slot). What changed between two versions of a text, contract, config or code: file name with counts, then Diff Lines. |
| Code Block | `Endpoint Row` | Method: GET, POST, PUT, PATCH, DELETE. State: default, hover, selected | Path, Summary. One API endpoint in a reference list: method badge, path in mono with parameters in braces, one-line summary. |
| Code Block | `JSON Viewer` | - | Structured data people inspect: webhook payloads, API responses, event properties, audit details. |
| Code Block | `Log Row` | Level: debug, info, warn, error | Time, Message. One line of a log or event stream: time with milliseconds, level and message in mono. |
| Color Picker | `Swatch` | Type: color, label. Size: default, sm. State: default, selected, unavailable | Label. One choice: a color dot (Type=color) or a box with a short label like S, M, L (Type=label). Size=sm (28) in Swatch Picker, default (36) for product options; ring when selected, faded when unavailable. |
| Color Picker | `Swatch Picker` | - | Label, Show label, Swatches (slot). A short set of colors for labels, categories, calendars and project avatars: 6-10 Swatches from the chart palette in the Swatches slot, one selected, its name under them. |
| Commerce | `Address Card` | State: default, selected | Name, Address, Show default, Show radio, Show actions. A saved address to pick or manage: name, address lines in the country's format, phone, Default badge, Edit and Remove (Show actions). |
| Commerce | `Line Item` | Layout: cart, summary | Name, Variant, Quantity, Total; Number Input sm (cart). One product in a cart, checkout summary, order or invoice: image, name, variant, quantity and line total. |
| Commerce | `Mini Cart` | - | Items (slot). The cart in a popover after Add to cart or from the cart icon: items, subtotal, View cart and Checkout. |
| Commerce | `Order Row` | Status: processing, shipped, delivered, cancelled, paid, refunded. State: default, hover, selected | Number, Meta, Total. One order or invoice in an account history: number, date and item count, status, total, chevron to the order page. |
| Commerce | `Payment Method Card` | State: default, expired | Card, Brand, Show default. A saved card or account: brand, last 4 digits, expiry, Default badge (Show default) and a menu. |
| Commerce | `Shipment Tracker` | - | ETA, Carrier. Where an order is: the expected day first, carrier and tracking number, then the steps with dates. |
| Drawer | `Resizable Panels` | - | Start (slot), End (slot). Two panels with a handle to drag the split: list and detail, editor and preview, code and output. |
| File Upload | `File Field` | State: empty, selected, error | File name, Error. One file as a form field: Choose file, then the name and size, with remove. |
| Filters | `Saved View Item` | State: default, hover, active | Name, Show shared, Show count. One saved filter set (a view) in a list or sidebar: name, shared icon and item count. |
| Form Layout | `Error Summary` | - | Title, Errors (slot). At the top of a long form after a failed submit: how many fields need a fix and a link to each. |
| Form Layout | `Fieldset` | State: default, error | Legend, Description, Show description, Error, Options (slot). A group of related controls with one label: checkboxes, radios, the parts of an address or a date. |
| Form Layout | `Form Section` | Layout: side, stacked | Title, Description, Show description, Show divider, Fields (slot). One group of a long form or settings page: title and a sentence on the left, the fields on the right. |
| Form Layout | `Check Item` | Mark: check, dash, x | Label. One line with a mark: check when met or included, dash when pending or not included, x after a failed submit. Part of Requirement List; also the feature list of Plan Card. |
| Form Layout | `Requirement List` | - | Title, Show title, Items (slot of Check Items). Rules checked live while people type or before they publish: password rules, import checks, what a listing needs. |
| Image | `Device Frame` | Device: browser, phone | Address, Screen (slot). A browser window or a phone around a product screenshot for marketing pages, docs and case studies. |
| Image | `Image Compare Slider` | - | Two images of the same view, before and after, with a handle to drag between them: redesigns, photo edits, document versions, site changes. |
| Image | `Image Figure` | - | Caption, Show credit, Credit. An image with a caption under it (HTML figure and figcaption) for galleries, articles and docs. |
| Input | `Copy Field` | State: default, copied | Value. A read-only value people copy and paste elsewhere: API key, invite link, webhook URL, reference code. |
| Input | `Currency Input` | State: default, focus, error, disabled | Amount, Currency. An amount with its currency: a currency picker on the left and the amount right-aligned in the locale format. |
| Input | `Date Input` | State: default, focus, error, disabled | Day, Month, Year. A date people type in day, month and year segments, with a calendar button that opens Date Picker. |
| Input | `Duration Input` | State: default, focus, error | Hours, Minutes. A length of time in hours and minutes for time entries, SLAs, reminders and meeting length. |
| Input | `Inline Form` | State: default, error, success | Hint, Error, Success message, Show hint. One field and one button on a line: newsletter sign-up, coupon code, invite by email, add a tag. |
| Input | `Phone Input` | State: default, focus, error, disabled | Country, Number. Phone number with a country code picker; formats as people type and stores the number in E.164. |
| Input | `Range Input` | State: default, error | Min, Max, Unit. Two fields for a minimum and a maximum: price or amount filters, typed date ranges, quantities. |
| Input | `Search Field` | State: default, focus, filled | Placeholder, Query, Show shortcut. Search box for a list, a table or the whole app: search icon, a placeholder that names what is searched, a shortcut hint and clear. |
| Kbd | `Shortcut Row` | - | Action. One keyboard shortcut in the shortcuts dialog or a help page: what it does, then the keys. |
| List & Tree | `Task Item` | State: open, done, overdue | Title, Due, Show due, Show assignee. One task in a checklist (onboarding, a project, a record's to-dos): checkbox, title, due date and assignee. |
| List & Tree | `Job Listing` | - | Title, Meta, Location, Posted, Salary, Show badge, Show salary. One open role in a careers list: title, team, type and work mode, location, posted date, salary range and Apply. |
| Menu | `Account Menu` | - | Name, Email. The menu behind the signed-in person's avatar: name and email, personal settings, and Log out. |
| Metrics | `Countdown` | - | Days, Hours, Minutes, Seconds, Show seconds. Time left until a deadline people act on: an offer, a webinar start, a payment due, a session that expires. |
| Metrics | `Leaderboard Row` | State: default, current | Rank, Name, Value. A ranked person or team: rank, avatar, name and value. |
| Metrics | `Metric Strip` | - | Metrics (slot). A row of 3-5 key figures at the top of a dashboard, report or record page, lighter than Stat Cards: label, value, trend, dividers between. |
| Metrics | `Metric Strip Item` | - | Label, Value, Show trend, Show divider. One figure in a Metric Strip: label, value and an optional Trend Indicator. |
| Metrics | `Trend Indicator` | Trend: up, down, flat. Tone: positive, negative, neutral | Value, Comparison, Show comparison. A change against a period: arrow, signed percent or amount, and what it is compared to. Trend says which way it moved; Tone says if that is good, bad or neither. |
| Metrics | `Usage Meter` | Level: normal, near, over | Label, Show hint. How much of a plan limit is used: seats, storage, API calls, documents per month. Label, used of limit, bar and a hint. |
| Mobile | `Action Sheet` | - | Title, Description, Show header, Action 1, Action 1 icon, Action 2, Action 2 icon, Action 3, Action 3 icon, Destructive action, Destructive action icon, Cancel. A short list of actions for one item on mobile, rising from the bottom: share, duplicate, download, delete. |
| Mobile | `FAB` | Type: icon, extended | Label, Icon. Floating action button for the one main action on a mobile screen: new invoice, compose, add. |
| Navigation | `Back Link` | State: default, hover | Label. A link above the page title back to the list the record came from: "All invoices" with a left arrow. |
| Navigation | `Page Toolbar` | - | Show search, Show filters, Show view, Show primary. The row between a list page title and the list: search and Filters on the left, a view switch (Toggle Group) and the primary action on the right. |
| Navigation | `Skip Link` | - | Label. First focusable element of every page, hidden until it gets keyboard focus; then it shows top left and jumps to the main content. |
| Notifications | `Notification Center` | - | Show tabs, Items (slot). The panel behind the bell in the top bar: title with Mark all as read, optional tabs by type (Show tabs: All, Mentions, Approvals), newest first, unread on top, View all at the bottom. |
| Notifications | `Notification Item` | State: unread, read | Message, Meta, Show actions, Actions (slot). One notification: who did what to which object, when and where, with an unread dot and optional actions. |
| Pagination | `Load More` | State: default, loading | Count. End of a feed or long list that grows in place: "Showing 20 of 248 invoices" and an outline Button. |
| Pagination | `Pager Link` | Direction: previous, next. State: default, hover, focus | Title. Previous / next link at the end of a docs page or article: a bordered card with a caption and an arrow on the matching side, then the title of the linked page (Title). |
| Popover | `App Launcher` | - | Grid of the products in a suite, opened from a layout-grid Button Icon in the top bar. |
| Popover | `Confirm Popover` | Tone: default, destructive | Title, Description. A small confirmation next to the button that triggered it, for actions with some cost that do not need a dialog. |
| Popover | `Emoji Picker` | - | Searchable grid of emoji for reactions, a status or a workspace icon, opened in a Popover. |
| Pricing | `Plan Card` | Variant: default, featured | Title, Description, Features title, Features (slot). One plan in a pricing section: name, who it is for, Price, the main action and what it adds as Check Items. |
| Pricing | `Price` | Size: sm, default, lg | Amount, Old price, Period, Show old price, Show period. A price as people compare it: amount with currency, period, and the old price struck through during a discount. |
| Progress | `Background Job` | State: running, done, error | Title, Status, Result, Error. A task that runs in the background (export, import, bulk send, report): name, progress with count and time left, cancel; done offers the result (Download); failed says where it stopped and offers Retry. |
| Quote | `Footnote` | - | Number, Text, Show back link. A numbered note at the end of an article, report or pricing page that explains a claim in the text. |
| Quote | `Testimonial Card` | - | Quote, Show rating. One customer quote as a card for testimonial grids and carousels: optional rating, the quote with a specific result, Byline. |
| Rating | `Rating Summary` | - | Average, Count. Average rating with the split across 1-5 stars, above the reviews. |
| Rating | `Review Item` | - | Name, Date, Title, Text, Show verified, Show helpful. One customer review: who, verified purchase, date, stars, a title, the text and Helpful votes. |
| Scheduler | `Agenda Item` | State: upcoming, now, past | Title, Start, End, Meta. One event in a day agenda: start and end time, a color bar for the calendar, title, place and people. |
| Scheduler | `Availability Row` | State: available, unavailable | Day. Working hours for one weekday in booking and team settings: on/off Switch, the day, one or more time ranges and a button to add a range. |
| Scheduler | `Meeting Card` | State: upcoming, live | Title. A meeting people are about to join: title, time with time zone, place or video link, who is invited, Join and Details. |
| Scheduler | `Time Slot` | State: default, hover, selected, disabled | Time. One bookable start time in a booking flow, shown in a grid under the chosen day. |
| Search | `Search Result Item` | - | Title, Snippet, Show path, Show meta, Path, Updated, Section. One result on a search page: where it lives (path), title that links to it, a two-line snippet around the matched words, type and date. |
| Select | `Address Autocomplete` | - | Query, Show suggestions. Address field with suggestions as people type; a pick fills the address fields below it. |
| Select | `Recurrence Picker` | Frequency: daily, weekly, monthly | Show summary. How often something repeats: interval and unit, the days or the day, when it ends, and a summary sentence. |
| Select | `Select Option` | Type: icon, avatar, none. State: default, highlighted | Title, Description, Show description, Checked, Icon. A rich option in a Select, Combobox or Menu list: icon or avatar, title, a muted second line and a check when selected. |
| Sharing | `Access Row` | Type: editable, owner, pending | Name, Email. One person or group with access to an object in a share dialog: avatar, Name and Email, and their role. |
| Sharing | `Invite Row` | - | Show role. Adds people to an object or a workspace: email or name with suggestions from the directory, the role they get, and Invite. |
| Sharing | `Share Link Row` | Type: restricted, anyone | General access of an object at the bottom of a share dialog: who can open the link, and Copy link. |
| Spinner | `Loading Overlay` | - | Label, Show label. Covers one region while its content reloads, keeping the old content faded underneath, with a Spinner and a short label. |
| Surveys | `CSAT Rating` | State: unanswered, answered | Question. Customer satisfaction after one interaction: five faces with words under them; one tap sends it. |
| Surveys | `Feedback Widget` | State: ask, comment, thanks | Question, Thanks. A one-tap question at the end of a help article, an AI answer or a finished task: Yes or No, then an optional comment, then thanks. |
| Surveys | `NPS Survey` | State: unanswered, answered | Question. Net Promoter Score: a 0-10 scale with anchors, then one optional open question. |
| Tour | `Annotation Pin` | State: default, active, resolved | Number. A numbered marker on a design, document or screenshot where a comment lives. |
| Video | `Audio Player` | - | Title, Time, Duration. Plays one audio file: podcast episode, voice message, recorded call. |
| Video | `Video Thumbnail` | - | Show duration. A video before it plays: poster frame, play button and duration. |

Icons available: plus, minus, check, x, search, chevron-down, chevron-up, chevron-left,
chevron-right, chevrons-up-down, arrow-up-down, arrow-up, arrow-right, arrow-left, info,
circle-alert, triangle-alert, circle-check, loader-circle, mail, at-sign, trash-2, ellipsis, pencil,
copy, archive, user, users, user-check, settings, log-out, calendar, clock, history, trending-up,
trending-down, map-pin, phone, smartphone, monitor, building, inbox, house, file-text, chart-column,
panel-left, layout-grid, columns-3, bell, menu, upload, download, heart, star, smile, thumbs-up,
thumbs-down, shopping-bag, package, credit-card, bold, italic, underline, list, list-filter,
text-quote, link, external-link, share-2, heading, code, git-branch, sparkles, zap, lightbulb,
refresh-cw, square, paperclip, globe, wrench, mic, message-square, square-pen, play, pause,
volume-2, maximize, captions, image, shield-check, key-round, lock, eye, pin, grip-vertical, sun,
moon (97).

## Conventions used
- Variant values use the shadcn prop values (`Variant=outline`, `Size=sm`), so Figma maps 1:1 to code.
  The default variant is the default value (`Size=default`, `Tone=default`).
- Variant property names come from one list: Variant, Size, State, Type, Status, Layout, Level,
  Position, Side, Shape, Tone, Content, Ratio, Device, Provider, Step, Frequency, Method, Trend,
  Series, Key, Align, Mark, Marker, Control, Mode, Orientation, Value, Direction, Length, Spacing,
  Sort, Elevation. Tab no longer uses `Style`: it is `Variant`, like Tabs. `Checked`, `Selected` and
  `Expanded` are variant properties only where a component has both a state axis and a selection
  axis (Checkbox `Checked` × State, Model Option `Selected` × State); otherwise selection is a
  State value.
- Values are lowercase with hyphens (`on-track`, `in-progress`, `drag-over`). Only `Method` keeps
  uppercase HTTP verbs (GET, POST).
- One vocabulary for outcomes: `pending`, `running`, `done`, `error` (no `complete`, no `failed`).
  Steppers keep `upcoming`, `current`, `completed`, `error`.
- Selection: `selected` for something picked (rows, options, cards, Toggle Group Item),
  `active` for the current place in navigation (Sidebar Item, Tab, Nav Link, Pagination Item),
  `highlighted` only for keyboard focus inside a menu list (Menu Item, Select Option).
- Booleans are `Show <part>`: Show leading icon, Show trailing icon, Show icon, Show close, Show
  remove, Show divider, Show connector, Show chevron, Show badge, Show count and so on. Exceptions
  that name a state: `Checked` (Menu Item, Select Option), `Collapsible` (Side Panel), `Pinned`
  (Chat History Item).
- An icon swap is named after its part, next to its boolean: `Show leading icon` + `Leading icon`,
  `Show trailing icon` + `Trailing icon`, `Show icon` + `Icon`.
- TEXT properties: `Title` for headings of cards and rows, `Name` for people and entities, `Label`
  for controls; `Description` for prose, `Meta` for compact facts; `Value` for metrics, `Amount`
  for money; players use `Time` and `Duration`.
- "A table" means the table template of Table Cells on the Table page
  (`Template / invoices table (grid)`); there is no Table component.
- Focus is a 2 px gap (`background/default`) plus a 4 px ring (`border/ring`), as drop shadows.
  Figma draws shadow spread only with `clipsContent` on, so focus variants clip. Crops and
  viewers clip too (image, media, viewport, slide, plot, track, map, avatar, logo); nothing else
  does.
- Disabled is the variant at `opacity/50`.
- Text inside a variant is bound to a TEXT property, so text styling is shared by all variants.
  Per-variant decoration (like the link hover underline) is drawn with a frame stroke instead.
- Component descriptions are written with `descriptionMarkdown`. Setting `description` stores
  quotes as `&quot;` in the published description.
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
- A variant that hides a slot (a collapsed Side Panel or Sidebar Double) keeps the SLOT node,
  hidden, so content placed in an instance survives the variant switch. See `figma-api-notes.md`.
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
`Brand` holds Logo Mark, Logo, Logo Tile (customer and partner logos for logo clouds) and a
Theme preview (color roles, type scale, radius, a few components) bound to Semantic tokens. To brand a client file: replace the glyph in Logo Mark,
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
`Commerce` too: the first holds Product Card and the cart, order and account parts, the second the
Product Detail and Order Summary blocks.
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
list row loading (Skeleton), icon button with tooltip, select open, dialog over page, filter
chips, cards, stat cards, invoices table (grid), inline edit and column resize, permissions tree,
navigation tree, app shell (Sidebar + header + stats + table), sheet over list, bottom drawer on
mobile, combobox open, record page (App shell + record blocks), activity, mobile list, mobile
menu open, mobile nav open, price range, verify phone, time picker open, date and time, upload
documents, density comparison (Table page), input groups, split button open, multi-select open,
date range filter, 404 in app, onboarding step, navbar with mega menu, search with suggestions,
inbox (split view), cart sheet, checkout page, docs page, date picker open, date range, table
footer, AI chat app, product tour, enterprise invoices, theme comparison, menubar open, data grid
(enterprise) template.

Since 0.51.0 some former components are examples built from base components: "AI action",
"wishlist", "scroll to top" and "sign-in providers" (Button page), "theme switch", "view switch"
and "billing period" (Toggle Group page), "stock status" (Badge page), "welcome dialog" (Dialog
page) and "language switch" (Select page). Copy the example; there is no component to insert.

## Not built yet
Open gaps from the README roadmap: `Page Shell / Back office` on the Page Shells page (from the
tested grid shell), a Search Hero block, and examples in real screens for the 0.50.0 components
(their rows have generated stress tests). Icons: the 97 Lucide icons stay; the team may switch
to Phosphor (flatten each icon to one `Vector` layer so swaps keep their color). When something
is missing, compose from the components above, tokens and text styles, and flag it.
