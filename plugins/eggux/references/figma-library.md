# EGG UI v2: what exists in Figma

Inventory of the master library (`BufvaVkSh9vMWPye117Ucd`, published as [EGG UI on Figma Community](https://www.figma.com/community/file/1694044412384019384)). Client files start as a duplicate,
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
| Video | `Video Player` | State: poster, playing, buffering. Size: default, lg (1152 x 648, 96 px play button and spinner) | Duration, Time, Show subtitles. `video/*` tokens, dark in both modes. lg for players 960 wide and up |
| AI Chat | `Prompt Input` | State: default, focus, streaming, disabled. Content: placeholder, filled | Placeholder, Value, Show attachments, Show tools, Show voice; Attachments, Tools (native slots). Send becomes Stop while streaming; enabled when filled, disabled on the placeholder. A draft left in the input is State=default, Content=filled |
| AI Chat | `Attachment` | Type: file, image. State: default, uploading, error | Name, Meta, Show remove |
| AI Chat | `User Message` | - | Text, Show actions (copy, edit). Bubble hugs, max 576 |
| AI Chat | `Assistant Message` | State: default, streaming, error, stopped | Content (native slot), Show actions (copy, regenerate, good, bad), Show branch + Branch ("2 of 3"); stopped: "You stopped this answer" above the actions |
| AI Chat | `Reasoning` | State: running, collapsed, expanded | Label, Status, Details |
| AI Chat | `Tool Call` | Status: running, done, error, approval | Title, Description, Approval message (approval), Error message (error); approval has Deny / Approve. Status Badges soft: done soft-success, error soft-destructive, approval soft-warning |
| AI Chat | `Source Item` | - | Number, Letter (favicon initial), Title, Domain |
| AI Chat | `Sources` | - | Label, Favicon 1, Favicon 2, Favicon 3 (the Letters of the first three Source Items), Show list; Items (native slot) |
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
| Button | `Button` | Variant: default, secondary, outline, ghost, destructive, link, soft. Size: sm, default, lg, xs 28, xl 48. State: default, hover, focus, disabled, loading (spinner instead of the leading icon) | Label; Show leading icon + Leading icon (swap), Show trailing icon + Trailing icon (swap). xs: ui/label-small, 14 px icons; xl for the main action of a hero or phone screen. link has no side padding, so it lines up with the text above |
| Button | `Button Icon` | Variant: default, secondary, outline, ghost, destructive, soft. Size: sm 32, default 36, lg 40, xs 28. State: default, hover, focus, disabled, loading (spinner replaces the icon) | Icon (swap); xs has a 14 px icon |
| Button | `Button Group Item` | Position: first, middle, last. State: default, hover, focus, disabled | Label, Show label, Show icon + Icon (swap) |
| Button | `Button Group` | - | Items (native slot) |
| Button | `Action Bar` | Align: end, start, center. Style: default, sticky-mobile | Show divider, Show leading; Leading, Actions (native slots). sticky-mobile: phone bottom bar (390, min 320) with Show summary (Summary label, Summary value) and xl Buttons sharing the width. The row of buttons that ends a form, a step or a hero |
| Button | `Split Button` | Variant: default, outline | Label; chevron opens a Menu |
| Badge | `Badge` | Variant: default, secondary, destructive, outline, success, warning, info, soft-success, soft-warning, soft-destructive, soft-info, soft-neutral, category-1 to category-8. Shape: rounded, pill. Size: default 20, sm 16, lg 24 | Label; Show icon + Icon (swap); Show dot; Show count + Count value. Category colors from badge/category-{n}-bg / -fg (chart hues, Swatch Picker order) |
| Badge | `Badge Count` | Variant: default, secondary, destructive, outline. Type: count, dot | Count (numeric bubble for nav items and icon buttons, "99+" above 99); Type=dot is an 8 px unread dot |
| Badge | `Status Dot` | Status: success, warning, error, info, neutral | Label, Show label |
| Badge | `Badge List` | - | Show more; Tags (native slot) of Badges + "+N" Badge (exposed). A few tags on one line |
| Chip | `Chip` | State: default, hover, focus, selected, disabled. Tone: default, soft-info, soft-success, soft-warning, soft-neutral, category-1 to category-8 (selected only on default). Size: default 32, sm 24, lg 40 | Label, Show leading icon + Leading icon (swap), Show avatar + Avatar (exposed), Show count + Count value, Show remove. Label truncates at 320 |
| Avatar | `Avatar` | Type: initials, image, icon. Size: xs 20, sm 24, default 32, lg 40, xl 48, 2xl 64, 3xl 96. Shape: circle (people), square (companies, apps) | Initials, Photo (swap, Type=image: Image / Person / *), Icon (swap, Type=icon: user, bot, users), Show status + Avatar Status (exposed: online, away, busy, offline), Show verified (info tick) |
| Avatar | `Avatar Group` | Size: sm, default, lg | Avatars (native slot), overlap with a 2 px background ring, "+N" as last avatar; Label + Show label ("Maintained by 3 analysts"); Names + Show names ("Ana, Mihai and 3 others"). Label and names truncate on one line |
| Avatar | `Byline` | Size: sm, default, lg | Name, Description, Show detail, Show avatar; Avatar (exposed). Who wrote, said or owns something |
| Separator | `Separator` | Orientation: horizontal, vertical. Spacing: none, sm (4), md (8) | Use anywhere: menus, cards, toolbars, sidebars. Horizontal: Show label (Label slot: "or continue with", a date, or a ghost sm Button) and Show start line (off puts the label at the start) |
| Input | `Input` | Style: default, filled, floating. Size: default 36, sm 32, lg 40 (default and filled). State: default, focus, error, disabled, read-only (not floating). Content: placeholder, filled | Value; Label (floating); Show leading icon + Leading icon (swap); Show clear; Show loading (Spinner sm); Trailing (native slot) + Show trailing |
| Input | `Password Strength` | Level: empty, weak, fair, good, strong | Meter + message under a new-password field. Messages ask only for length ("Weak: make it longer.") |
| Input | `Field` | State: default, error, disabled. Layout: vertical, horizontal (160 label column, min width 400) | Label, Show label, Hint, Show hint, Error. Show required (red asterisk), Show optional ("Optional", field/optional string), Show info (Info Tip Trigger), Show counter (Field Counter exposed). Control (native slot, default Input) |
| Input | `Textarea` | State: default, focus, error, disabled, read-only. Content: placeholder, filled | Value. Min height 64, grows with content; put it in a Field (limit: Field Show counter) |
| Input | `Input Addon` | Position: start, end | Text |
| Input | `Input Group` | State: default, focus, error, disabled | Value, Show start, Show end, Show loading; Start, End (native slots) |
| Input | `Number Input` | Size: default 36, sm 32. State: default, focus, error, disabled | Value; − / + steppers. sm is the quantity in Line Item and dense rows |
| Input | `Inline Edit` | State: view, hover, editing, saving, error | Value, Error. Pencil on hover; Input with check and x while editing |
| Input | `Signature Pad` | State: empty, signed | Pad (clips the stroke), baseline, Clear, Type instead; signer and time when signed |
| Input OTP | `OTP Slot` | Position: first, middle, last. State: empty, filled, active, error | Digit |
| Input OTP | `Input OTP` | Length: 4, 6 | Groups of OTP Slots (3 + 3 with separator) |
| Kbd | `Kbd` | - | Key (`foreground/default` on `background/muted`) |
| Kbd | `Kbd Group` | - | Keys (native slot) |
| Spinner | `Spinner` | Size: sm 16, default 20, lg 32. Tone: muted, default. Type: default, dots | Loader icon; rotate in code. dots: three pulsing dots for typing and AI writing |
| File Upload | `File Dropzone` | State: default, drag-over, error, disabled. Size: default, sm | Title (not in drag-over), Hint, Error (error state); Browse button exposed. sm: one row, title and hint 1 line each, 480 and Fill |
| File Upload | `File Item` | State: uploading, done, error. Type: file, image. Layout: row, tile | File name; Progress, cancel/remove, Retry. image: Image Placeholder 1:1 thumbnail (set its Image). tile: 160 wide, media 112, remove or cancel on the media corner, Retry under the error |
| File Upload | `Resource Item` | - | Icon (swap), Name, Meta, Show divider; Actions (native slot). A file people download or open |
| File Upload | `File Preview` | State: ready, loading, unavailable | File name, Meta; zoom, download, close; page thumbnails; page count. Page area clips |
| Progress | `Progress` | Tone: default, success, warning, error. Value: 0 to 100 by 10, plus 25, 75, indeterminate (segmented: 0, 25, 50, 75, 100). Type: default, segmented. Size: default (8), sm (4), lg (12) | Show label (off) + Label: a row above the bar with the label and an editable value text ("40%", "3 of 5"). indeterminate: Tone=default, no value text. Sizes and label on Type=default only. Pick the nearest Value step. segmented: Segments (native slot) of Progress Segment instances |
| Progress | `Progress Segment` | State: complete, upcoming. Tone: default, success, warning, error | One segment of Progress Type=segmented; only inside its Segments slot, FILL width |
| Progress | `Progress Ring` | Size: sm, default, lg. Value: 0, 25, 50, 75, 100 | Show label (percent inside on default and lg) |
| Slider | `Slider` | Type: single, range. State: default, focus, disabled. Value: 0, 25, 50, 75, 100 (single; range is 50 only) | Value places the thumb; keep the number and marks in step. Range: move the thumb wrappers for other values. Stretches to any width; the thumbs stay 16 px and follow the value. Show value (Tooltip over each thumb), Show marks + Min label, Mid label, Max label |
| Selection controls | `Checkbox` | Checked: false, true, indeterminate. State: default, focus, error, disabled | Label, Show label, Description, Show description |
| Selection controls | `Radio` | Checked: false, true. State: default, focus, error, disabled | Label, Show label, Description, Show description |
| Selection controls | `Switch` | Checked: false, true. State: default, focus, disabled. Size: default, sm, lg | Label, Show label, Description, Show description |
| Selection controls | `Setting Row` | - | Title, Description, Show description, Show divider; Control (native slot: Switch, Select, Button) |
| Scroll Area | `Scroll Area` | Orientation: vertical, horizontal | Content (native slot); clips its content; thin scrollbar on border/default |
| Select | `Select` | Style: default, filled, ghost. Size: default, sm, lg. State: default, focus, error, disabled, read-only. Content: placeholder, filled | Value, Show clear; Label + Show label (ghost, "Sort by:"); Show leading icon + Leading icon (swap), Show avatar (Avatar xs exposed), Show status dot (Status Dot exposed). Open state = Select (focus) + Menu with Checked on the selected item. ghost hugs, for sort and period switches |
| Select | `Combobox` | Size: default, sm, lg. State: default, focus, error, disabled, read-only. Content: placeholder, filled | Value, Show clear; Show leading icon + Leading icon (swap), Show avatar, Show status dot. Searchable select trigger (chevrons-up-down); opens a Command |
| Select | `Tag` | State: default, disabled. Tone: default, category-1 to category-8. Size: default 24, sm 20 | Label, Show remove, Show avatar + Avatar (exposed), Show leading icon + Leading icon (swap). Label truncates at 192 |
| Select | `Tag Input` | Size: default, sm, lg. State: default, focus, error, disabled | Tags (native slot), Show chevron |
| Select | `Person Option` | Selected: false, true. State: default, hover | Name, Description, Show detail; Checkbox and Avatar (exposed) |
| Select | `People Picker` | State: closed, open | Placeholder; Selected, Results (native slots); search, invite by email |
| Select | `Transfer List` | - | Left title, Right title; Available, Selected (native slots of Facet Options); counts, search, move buttons |
| Popover | `Popover` | - | Content (native slot). 288 wide, popover tokens, shadow/md |
| Popover | `Command Input` | - | Value. Search field with bottom divider |
| Popover | `Command` | - | Command Input (exposed), Items (native slot), Show empty, Show items. Base for Combobox and ⌘K |
| Popover | `Hover Card` | - | Content (native slot), 320 wide |
| Popover | `Command Dialog` | - | Command Input (exposed), Items (native slot), footer with key hints. 560 wide |
| Calendar | `Calendar Day` | State: default, hover, focus, today, selected, outside, disabled, range-start, range-middle, range-end, booked | Day; Show dot (4 px event dot), Show note + Note ("€89", grows to 36). booked: muted with a strike line, not pickable |
| Calendar | `Calendar` | Caption: label, dropdown. Months: 1, 2 | Month, Second month, Show week numbers. Monday-first month grid, prev/next ghost Button Icons; dropdown has month and year Selects (ghost sm); 2 months side by side (498) |
| Calendar | `Date Picker` | Type: single, range. Size: default, sm, lg. State: default, focus, error, disabled, read-only. Content: placeholder, filled | Value (single), Range (range, "1 Oct to 31 Oct 2026"). Calendar icon; single opens Calendar in a popover, range opens Date Range Picker |
| Calendar | `Time Picker` | Type: single, range. Size: default, sm, lg. State: default, focus, error, disabled. Content: placeholder, filled | Value (single); Range "09:00 to 10:30", Duration "1 h 30 min", Show duration (range, 240, lg 280, min 220). Clock icon; opens a Menu of times |
| Calendar | `Date Range Picker` | - | Presets (native slot), Summary, Show presets; two Calendars; Cancel / Apply |
| Chart | `Bar Chart` | Type: single, grouped, stacked | Bars ≤ 24, 4 px data-end radius, 2 px gaps; y axis, grid, x labels |
| Chart | `Line Chart` | Type: line, area, stacked-area, step | Show series 2 (on), Show series 3 (off), Show comparison (off: previous period of series 1, dashed muted). 2 px lines, end dots with surface ring, area at opacity/10, stacked bands at opacity/20 |
| Chart | `Donut Chart` | Type: donut, pie | Total, Total label; 4 segments (arcData) and legend with values |
| Chart | `Bar Chart Horizontal` | - | Ranked rows: label, bar (share of track), value |
| Chart | `Heatmap` | Data: default, late-peak, weekdays-only | 7 × 12 grid, 5 opacity steps of chart/1, legend Fewer → More. Other data only by detaching in client files |
| Chart | `Gauge` | Status: on-track, at-risk, off-track | Label, Value, Min, Target label, Max; target tick is an exposed `Gauge Target` (set Target); set the "value" ellipse arc per instance (Sweep = share x 50%); written status |
| Chart | `Gauge Target` | Target: 50, 60, 70, 75, 80, 85, 90, 95 | The target tick of a Gauge; only inside a Gauge (exposed as "target") |
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
| Chart | `Chart Card` | State: default, loading, empty, error | Title, Description, Insight, Note, Show legend, Show footer; Actions, Chart (native slots); Legend exposed. loading: Skeleton bars; empty: exposed Empty State sm (chart Spot Illustration); error: exposed Empty State sm Tone=error with Try again. Chart slot kept (hidden) outside default; legend and footer only in default |
| Code Block | `Code Block` | - | Language, Code, Show header; Copy button; Show tabs + Tabs (native slot of Tab line sm), Show line numbers + Line numbers, Show highlight (exposed Code Highlight, pick Line) |
| Editor | `Rich Text Editor` | State: default, focus | Toolbar (Toolbar default with Toggles: heading, bold, italic, underline, lists, quote, link); Content (native slot), Show footer (hint + counter) |
| Editor | `Comment` | Type: comment, reply. State: default, resolved | Name, Time, Text, Show actions; Avatar exposed |
| Editor | `Comment Composer` | - | Avatar, Textarea, attach, ⌘↵ hint, Comment button |
| Chat | `Chat Message` | Direction: incoming, outgoing. Size: default, compact | Text, Time, Show meta (time + delivery status). Short text hugs, long text wraps; bubble max 440 (compact 300, for panels under 480) |
| Chat | `Typing Indicator` | - | Three dots + "… is typing" |
| Chat | `Chat Composer` | - | Attach, message field, Send |
| Quote | `Quote` | Variant: default (left rule), pull (centered), large (display size, one per page) | Quote, Name, Role, Show avatar, Show attribution. Name and Role wrap in narrow cards. A quotation in running content |
| Section Heading | `Section Heading` | Size: lg (h2), default (h3), sm (h4) | Title, Description, Overline, Show overline, Show description, Show actions, Show icon + Icon (swap); Actions (native slot). Opens a section of an app or content page |
| Feature Item | `Feature Item` | Layout: stacked, inline, centered, card. Marker: icon, number | Title, Description, Number, Show description, Show link; Marker=icon holds an exposed Icon Tile (Icon and Style set on the tile). One benefit, capability or step: icon tile or step number, title, text |
| Feature Item | `Icon Tile` | Style: neutral, brand, gradient, outline. Size: sm 32, default 40, lg 48 | Icon (swap). A rounded square with one icon for feature, step and bento grids; one Style per grid |
| Rating | `Rating` | Size: sm, default, lg (Style=default only, review forms). Value: 0-5. Style: default, badge | Show value, Show count, Count, Score (the shown number in both Styles; Value only fills the stars). Never scale a Rating |
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
| Kanban | `Kanban Card` | State: default, hover, dragging | Title, Due date, Show labels, Show meta, Show cover (Image Placeholder exposed), Show priority (Badge sm exposed); assignee exposed |
| Kanban | `Kanban Column` | State: default, drop-target, collapsed (48 wide) | Title, Limit + Show limit, Cards (native slot); count exposed |
| Scheduler | `Gantt Bar` | Status: planned, in-progress, done, blocked | Label; tinted bar, colored edge, progress line, status icon |
| Scheduler | `Gantt Milestone` | - | Label; diamond on the date |
| Scheduler | `Calendar Event` | Size: default, sm. Series: 1-4. State: default, selected, dragging (Size=default). Status: confirmed, tentative, cancelled (Size=default) | Title, Time |
| Pagination | `Pagination Item` | Type: page, previous, next, ellipsis. State: default, hover, active, focus, disabled | Label (page) |
| Pagination | `Pagination` | Style: numbered, simple, dots | Items (native slot, numbered); Label (simple, "Page 2 of 10"); dots: Carousel Indicator |
| Pagination | `Pagination Compact` | - | Label ("Page 2 of 12"); previous and next Button Icon sm (exposed) |
| Stepper | `Step` | Orientation: horizontal, vertical. State: completed, current, upcoming, error. Style: default, dots | Title, Description, Show description, Number, Show connector |
| Stepper | `Stepper` | Orientation: horizontal, vertical. Style: default, dots | Steps (native slot, Steps with the same Orientation and Style) |
| Description List | `Description List Item` | Orientation: horizontal, vertical. Style: default, bordered (horizontal) | Label, Show divider, Show action (Copy Button xs exposed, horizontal); Value (native slot). bordered: muted label cell 96-192, border around the row |
| Description List | `Meta Item` | - | Icon (swap, 16, muted), Label, Show icon. One fact: date, place, people, contact |
| Description List | `Figure` | Layout: stacked, inline. Size: default, lg. Tone: default, on-primary (text in `foreground/primary`) | Value, Label, Source, Show source, Show divider. A number with what it counts; no trend. on-primary on primary bands |
| Description List | `Summary Row` | Variant: default, discount, total | Label, Value. One line of a money breakdown, amount right aligned |
| Timeline | `Timeline Item` | Tone: default, primary, success, warning, destructive. Layout: default, card, alternating-left, alternating-right, horizontal. Size: default, sm (Layout=default) | Title, Time, Description, Show description, Icon (swap), Show connector; Content (native slot) + Show content. card: the header wraps, so Time moves under the Title in narrow cards. horizontal: 200 wide, time above title. sm: 16 px dot, compact feed |
| Menu | `Menu Item` | Variant: default, destructive. State: default, highlighted, disabled | Label, Show leading icon + Leading icon (swap), Show shortcut + Shortcut text, Checked, Description + Show description, Show submenu (chevron) |
| Menu | `Menu Label` | - | Label |
| Menu | `Menu` | - | Items (native slot). Base for Dropdown menu, Select options and context menus |
| Menu | `Menubar Trigger` | State: default, hover, open | Label |
| Menu | `Menubar` | - | Menus (native slot of Menubar Triggers); opens a Menu below the trigger |
| Mobile | `Mobile Header` | Type: app, detail, brand, search. Size: default, large (app, detail) | Title (app, detail), Logo (swap, brand: entry screens); Leading, Trailing (native slots; Leading hidden in brand). search: Search Field (exposed) fills the bar, Cancel in Trailing. large: Title in heading/h2 under the bar, collapses to default on scroll |
| Mobile | `Bottom Nav Item` | State: default, active | Label, Icon (swap) |
| Mobile | `Bottom Nav` | Style: default, floating | Items (native slot), 3-5 items, safe-area padding |
| Tabs | `Tab` | Variant: default, line, vertical, pills, boxed. State: default, active, focus, disabled. Size: default, sm | Label, Show count (Badge Count exposed), Icon (swap) + Show icon. sm is 4 px lower with tighter padding, for card headers, panels and toolbars |
| Tabs | `Tabs` | Variant: default, line, vertical, pills, boxed | Tabs (native slot of Tab instances with the same Variant), Show overflow (a "More" Tab with an ellipsis that opens a Menu; not in vertical). default: pill tabs in a card; line: underlined page sections; vertical: a 200 wide column for settings; pills: list filters, active tab filled; boxed: tabs and Panel (native slot) in one bordered unit |
| Toggle Group | `Toggle Group Item` | Variant: default, segmented. Size: default, sm, lg. State: default, hover, selected, focus, disabled | Label, Show label, Show icon + Icon (swap). sm 32 (segmented 24), default 36 (28), lg 40 (32) |
| Toggle Group | `Toggle Group` | Variant: default, outline, segmented | Items (native slot; FILL in segmented: group and items on FILL share the track, keep items on HUG in a hugging group). Sets a value; Tabs switch panels. Theme, view and billing period switches are examples on this page, not components |
| List | `List Item` | State: default, hover, selected, focus, disabled | Title, Description, Show description, Show leading, Show trailing, Show divider. Leading, Trailing (native slots) |
| Tree | `Tree Item` | Type: collapsed, expanded, leaf. State: default, hover, selected. Level: 0-3 | Label, Show checkbox (Checkbox exposed), Show icon + Icon (swap), Show count (Badge Count exposed: set its Count) |
| List | `Sortable List Item` | State: default, hover, dragging, drop-target | Label, Description, Show description, Show leading; grip handle; Leading (native slot, 1:1 image 48), Trailing (native slot) |
| Tooltip | `Tooltip` | Side: top, bottom, left, right. Variant: default, light | Label (wraps at 280), Title + Show title (rich), Show shortcut (Kbd exposed) |
| Skeleton | `Skeleton` | Shape: text, circle, block | Resize instances to the real layout |
| Alert | `Alert` | Variant: default, destructive, success, warning, info. Layout: inline, banner. Style: default, soft, accent | Title, Description, Show description, Actions (native slot) + Show actions, Show close |
| Toast | `Toast` | Type: default, success, error, warning, info, loading. Style: default, inverted | Title, Description, Show description, Show action (nested Button exposed), Show close (off by default), Show avatar (Type=default, exposed Avatar sm), Show progress (exposed Progress Size=sm under the text) |
| Dialog | `Dialog Header` | - | Title, Description, Show description, Show close. Media (native slot) + Show media |
| Dialog | `Dialog Footer` | - | Actions (native slot) |
| Dialog | `Dialog` | Size: default (512), sm (384), lg (672), xl (896), fullscreen (390 x 844, mobile) | Header, Content, Footer (native slots); Show header, Show content, Show footer. Pick the Size instead of resizing; Scrim Tone=dialog behind it |
| Dialog | `Alert Dialog` | Type: confirm, destructive, acknowledge | Header, Content, Footer (native slots); Show content (off by default; type-to-confirm Field, what is lost). Status icon in the header Media slot |
| Drawer | `Sheet` | Side: right, left | Side drawer, full height, 384 wide (480 forms, 640 record or preview). Header, Content, Footer (native slots) from Dialog Header/Footer |
| Drawer | `Drawer` | - | Bottom drawer, top radius xl. Show handle; Header (no close), Content, Footer (native slots, stacked full-width buttons) |
| Drawer | `Side Panel` | State: expanded (320), collapsed (48) | Inline aside, no overlay. Title, Collapsible, Show footer; Actions, Content, Footer (native slots) |
| Card | `Card Header` | - | Title, Description, Show description, Show action, Show icon + Icon (swap). Action (native slot) |
| Card | `Card Footer` | - | Actions (native slot) |
| Card | `Card` | Variant: default, outline, muted, inverted. Size: default (24), sm (16). Elevation: false, true (toggle, shadow md). State: default, hover, focus (default and outline, Elevation false). Media: none, top (default and outline, Elevation false) | Header, Content, Footer (native slots, each with side padding); Show header, Show content, Show footer. Media=top: Image Placeholder 16:9 exposed. Padding and gap from `density/card-*` (16 / 12 in Compact) |
| Card | `Stat Card` | Trend: up, down, neutral. Layout: vertical, compact, horizontal | Label, Value, Trend text, Footnote, Show footer, Show sparkline. Change Badge exposed: set its Label and Variant per instance (default tone follows Trend); trend line edited per instance |
| Card | `Option Card` | Control: radio, checkbox. State: default, hover, focus, selected, disabled. Layout: default, media (280, 16:9 preview), compact | Title, Description, Show description, Show icon + Icon (swap). Selectable card: a radio for one choice, a checkbox for several; the whole card is the target |
| Card | `Entity Card` | State: default, hover, focus, selected | Title (2 lines), Description (1 line), Footer text; Show menu, Show tags, Show details, Show footer, Show actions, Show people; Leading (avatar, icon or 1:1 image), Tags, Details, Actions (native slots). Card padding sm tokens |
| Card | `Person Card` | Layout: vertical (280), horizontal (400), photo (280, 3:4 photo) | Name, Role, Organization, Show organization, Show tags, Show contact, Show actions; Avatar, Tags, Contact (Meta Items), Actions (native slots) |
| Card | `Event Card` | Layout: horizontal (640), vertical (352, image). Date position: text, image (vertical: tile over the image) | Title, Show tags, Show actions, Show image; Date Tile (exposed); Tags, Meta (Meta Items), Actions (native slots) |
| Card | `Date Tile` | Size: default (56), sm (44) | Month, Day. Part of Event Card |
| Card | `Progress Card` | Status: on-track, at-risk, off-track | Label, Value, Target (wraps under the value), Footnote; Progress exposed |
| Card | `Post Card` | Layout: vertical, horizontal, compact, overlay. Size: default, sm (sm horizontal: image one third, 120-240) | Title, Excerpt, Date, Author, Show author, Show excerpt, Show image (compact: 1:1 image 64; horizontal: image half the width, 160-640); category Badge (layer `Badge`) exposed. Compact = title on 2 lines + meta, for related lists |
| Table | `Table Cell` | header: default, hover, resizing, dragging. body: default, hover, selected, editing, error. expanded. footer (totals). Style: default, striped (body default) | Content (native slot). Header hover/resizing show the resize handle. footer and striped on card/muted-background |
| Table | `Table Cell Check` | Value: included, excluded, text | Text, Note, Show note. Plan comparison value in a table cell: included (check), excluded (dash) or a text value such as "100 GB" or "Unlimited", with an optional note ("per seat"). |
| Table | `Table Cell Link`, `Table Cell Date`, `Table Cell File`, `Table Cell Badges`, `Table Cell Avatars` | - | Content for body cells: link (underlined), date (Show time), file (icon, name, size), badges (Badge List), people (Avatar Group sm) |
| Table | `Table Header Label` | Sort: off, sortable, ascending, descending. Align: left, right | Label; Show info (Info Tip Trigger), Show menu (ellipsis Button Icon xs). Align=right truncates the label |
| Table | `Table Cell Text` | Style: default, strong, muted. Align: left, right | Text |
| Table | `Table Cell Stack` | - | Title, Description |
| Table | `Table Cell User` | - | Name, Email, Show email. Avatar exposed |
| Table | `Table Toolbar` | - | Selection ("2 selected"), Actions (native slot) |
| Table | `Data Grid Toolbar` | - | Start, End (native slots): saved view, search, filters with count, columns, group by, export |
| Table | `Table Cell Amount` | Trend: none, up, down | Amount; Note (none), Increase (up), Decrease (down); Show note. Right-aligned |
| Table | `Table Cell Status` | - | Badge (exposed), Note (fills the cell, ellipsis on one line), Show note. Hugs badge + full note; set it to FILL in a cell to truncate |
| Table | `Table Cell Progress` | - | Progress (exposed, 96 wide), Label |
| Table | `Table Cell Actions` | - | Show edit (icon button), Show menu (ellipsis). Right-aligned |
| Table | `Table Pagination` | - | Range (one line, truncates), Show rows per page; Select + Pagination |
| Table | `Table Group Row` | State: expanded, collapsed | Label, Subtotal, Show subtotal; count exposed. Collapsed groups use State=collapsed (chevron right). Goes in a Table Cell Type=expanded spanning all columns |
| Filters | `Filter Condition` | Position: first, next | Field, operator (Selects), value (Tag Input by default), remove |
| Filters | `Filter Group` | - | Conditions (native slot), Add condition; muted nested group |
| Filters | `Filter Bar` | - | Two rows: Search + End slot (sort, columns); Filters slot (wraps) + Clear all. Show clear, Show filters |
| Filters | `Filter Chip` | Type: empty (dashed "+ Field"), active. State: default, hover, focus | Field, Value (truncates at 200), Show remove |
| Filters | `Faceted Filter` | - | Popover: Command Input, Items (native slot of Facet Options), Clear filters; Show footer |
| Filters | `Facet Option` | Checked: false, true. State: default, hover | Label, Count, Show count |
| Filters | `Filter Section` | State: expanded, collapsed | Title, Show selected count, Show more; Options (native slot). For filter side panels |
| Approvals | `Approval Step` | Status: approved, current, rejected, upcoming | Name, Role, Time, Comment, Show comment, Show connector |
| Audit | `Change Item` | - | Field, Old, New |
| Save Bar | `Save Bar` | State: default, saving, error | Message (default, "Unsaved changes"; set the count), Error (error). Sticky bar with the message, Discard, Save changes; Saving… while saving |
| Sidebar | `Org Switcher` | - | Organization list with role and plan, search, create, manage |
| Sidebar | `Sidebar Item` | Level: 1, 2 (sub-page, no icon; expanded only). Mode: expanded, collapsed. State: default, hover, active, disabled | Label, Icon (swap), Show badge (Badge Count, exposed), Show chevron, Show action (ghost xs Button Icon, exposed, ellipsis; expanded only, on hover and active) |
| Sidebar | `Sidebar Group Label` | - | Label, Show action (ghost xs Button Icon, exposed, plus: add to the group) |
| Sidebar | `Sidebar Group` | Mode: expanded, collapsed | Items (native slot), Show label |
| Sidebar | `Sidebar Workspace`, `Sidebar User` | Mode: expanded, collapsed | Title, Description |
| Sidebar | `Sidebar` | Mode: expanded (256), collapsed (48). Variant: sidebar, floating, inset | Header, Content, Footer (native slots). floating: panel inside spacing/2 with border, radius/lg, shadow/sm (collapsed 64); inset: no border, the page beside it is inset with radius/xl and shadow/sm |
| Sidebar | `Sidebar Double` | Mode: expanded (288: rail 48 + panel 240), collapsed (48) | Panel title; Rail header, Rail, Rail footer, Panel actions, Panel (native slots) |
| Navigation | `Breadcrumb Item` | Type: link, current, ellipsis. State: default, hover (link) | Label, Show separator |
| Navigation | `Breadcrumb` | Style: default, background | Items (native slot) |
| Navigation | `Top Bar` | Style: default, floating | Show sidebar trigger; Breadcrumb, Actions (native slots) |
| Navigation | `Page Header` | - | Title (heading/h3), Description, Show description, Show actions; Actions (native slot). Record pages: Show back link (Back Link exposed), Show meta (Meta slot of Meta Items) with Show badge (status Badge exposed at the start of the meta line), Show pager (Pager label "3 of 24" + previous / next Button Icons) |
| Navigation | `Nav Link` | State: default, hover, active | Label, Show chevron (marketing navbar) |
| Navigation | `Navigation Menu Link` | State: default, hover | Title, Description, Show icon, Icon (swap) |
| Navigation | `Navigation Menu Panel` | - | Links, Featured (native slots), Show featured |
| Navigation | `Table of Contents Item` | Level: 1, 2. State: default, hover, active | Label |
| Navigation | `Table of Contents` | - | Title ("On this page", names the list), Items (native slot) |
| Accordion | `Accordion Item` | Size: default, sm. State: collapsed, expanded. Style: default, card. Icon: chevron, plus | Title, Show leading icon + Leading icon (swap), Show meta; Meta, Content (native slots) |
| Accordion | `Accordion` | Style: default, card | Items (native slot) |
| Image | `Map` | - | Label, Address, Show label, Show controls, Show pin. Roads scale, pin stays centered; put a static map image as fill in production |
| Image | `Image Placeholder` | Ratio: 21:9, 16:9, 4:3, 3:2, 1:1, 3:4, 2:3, 9:16. State: default, loading, error | Show caption, Show image + Image (swap), Fallback text (error). loading: background/accent fill; error: image icon and "Image unavailable" (follows Show caption). The height follows the width at the Ratio |
| Image | `Image Cropper` | Shape: square, circle | Image layer (fill), scrim, selection that stays centered, zoom Slider, rotate, Cancel, Save |
| Image | `Avatar Upload` | Shape: circle (people), square (workspaces, companies). State: empty, filled, uploading, error | Label, Show label, Hint, Show remove; Upload or Change (exposed Button, set its Label). Profile or logo picture in settings; square sets Label to "Workspace logo" |
| Sections (blocks) | `Section Header` | Align: center, left | Overline (`foreground/brand` in both Align values; do not override), Title (heading/h2), Description |
| Page Shells | `Page Shell / App`, `/ Marketing`, `/ Auth` | - | Page (native slot); Sidebar and Top Bar exposed in App. App hugs its content with a min height of 900: put a taller page in the Page slot, never resize the shell |
| Page Shells | `Page Shell / Mobile` | - | 390 x 844. Mobile Header + Page (native slot) + Bottom Nav (exposed, `Bottom nav` boolean) |
| Page Shells | `Page Shell / Wizard` | - | Logo, Step text, Save and exit, Progress, Page (native slot, 672), Back / Continue; Show back (Continue stays on the right) |
| Page Shells | `Page Shell / Split View` | - | Sidebar + Top Bar; List (384) and Detail (native slots); resize handle |
| Page Shells | `Page Shell / Docs` | - | Header with search; Nav and Content (native slots); Table of Contents exposed |
| Page Shells | `Page Shell / Admin Panel` | Aside: on, off | Navigation, Header, Main, Aside, Actions (native slots); Show actions. Grid: navigation and aside hug, Main flexes, actions fixed at the bottom, only the Body scrolls |
| Brand | `Logo Mark` | - | The one place to put the client symbol; used by Logo and Sidebar Workspace |
| Brand | `Logo` | Type: mark, wordmark, full | Name |
| Form Presets | `Field Preset` | Type: email, password, new-password, phone, card-number, card-expiry, card-cvc, postal-code, country, region, url, time-zone, currency, language, date-of-birth, tax-id, iban | Built from Field + Input, Select, Input Group (url) or Date Input (date-of-birth); nested Field exposed. Each Type sets its own Hint and Error. country, time-zone, currency, language show a placeholder; tax-id has Show info on |
| Forms | `Block / Sign In`, `/ Sign Up`, `/ Payment`, `/ Address` | - | Card + Field Presets + Buttons. Address: Card and its Card Header exposed (Title, Description, "Delivery address"); City "Cluj-Napoca" |
| Navigation (blocks) | `Block / Navbar` | Style: default, on-image (no fill or border; text and icons on `video/foreground`, for full-bleed photo and video heroes) | Logo (swap), Show cart (ghost cart Button Icon with Badge Count, exposed); Nav Links, CTAs |
| Navigation (blocks) | `Block / Footer` | - | Logo, footer link columns |
| Hero | `Block / Hero Centered` | - | Badge, display headline, lead, CTAs, Image Placeholder |
| Hero | `Block / Hero Split` | Media: screenshot (Device Frame, exposed), image (4:3 Image, exposed) | Badge, display headline, lead, CTAs; Show trust (Trust badges native slot under the actions, 2 Trust Badges) |
| Sections | `Block / Features`, `/ CTA`, `/ Pricing`, `/ Testimonials`, `/ FAQ` | - | Section Header + Cards, grid, Toggle Group, Accordion |
| Sections | `Block / Stats` | - | Show header (Section Header center, exposed); Metric Strip with 4 values in heading/h1 |
| App | `Block / Settings Section`, `/ Empty Page`, `/ Filtered List` | - | Settings row, first-use page, filter panel + list |
| App | `Block / Record Header`, `/ Record Detail`, `/ Notifications`, `/ Booking` | - | Record page header with tabs; details + activity; notifications popover; calendar + time slots |
| App | `Block / Analytics` | - | 4 Stat Cards + 2 Chart Cards (grouped bars, area) |
| App | `Block / Team Members`, `/ Billing`, `/ Onboarding Checklist`, `/ Profile`, `/ API Keys`, `/ Notification Preferences` | - | Settings and admin cards, 768 wide |
| App | `Block / Integrations` | - | Search + grid of integration cards, 1136 wide |
| App | `Block / Security`, `/ Share Dialog` | - | Two-factor, sign-in alerts, SSO URL and active sessions; share dialog with invite, access list and link |
| App | `Block / API Reference`, `/ Automations` | - | Endpoint list, curl snippet, JSON response, request log, schema diff; automation rules, rule flow and field mapping |
| App | `Block / Agenda`, `/ Executive Dashboard` | - | Next meeting, today's agenda, weekly availability, time slots; dashboard widgets with bullet charts, distribution bars, leaderboard, countdown |
| App | `Block / Gantt` | - | Project timeline: task list by phase with owners, weeks, Gantt Bars, milestones, dependencies, today line, zoom |
| App | `Block / Kanban Board`, `/ Scheduler Week` | - | Board with columns and a dragged card; week view with toolbar, events, now line on background/default |
| App | `Block / Scheduler Month` | - | Month grid, up to 3 events per day + "+N more", today marked |
| App | `Block / Comments`, `/ Conversation` | - | Comment thread with replies, resolved comment and composer; chat with header, day separator, grouped messages, typing, composer |
| Page Headers | `Block / Header Detail`, `/ Header Listing`, `/ Header Search Results`, `/ Header Profile`, `/ Header Event`, `/ Header Topic`, `/ Header Report`, `/ Header Simple` | - | Tops of inner pages: detail (product, dataset, service) with people and media; listing hub with type switch and search; search results with tabs and sort; person (Header Profile stretches: side padding spacing/8, container max 1152, Action Bar hugs its buttons); event with date, place and speakers; topic with subtopic chips; report with three figures; plain page (legal, about). Examples: topic page, event page |
| Content | `Block / Blog List`, `/ Article` | - | Featured + grid of Post Cards + pagination; reading column with prose and TOC. Article: Title, Excerpt (the lead), Date; Byline (author Name, Description) and category Badge exposed |
| Sections (blocks) | `Block / Contact Cards`, `/ Contact with Map`, `/ Offices`, `/ Map Section` | - | Contact family: channel cards; form + map + address; office cards with maps; full-width map with overlay card |
| Sections (blocks) | `Block / Testimonial Single`, `/ Testimonial Grid`, `/ Testimonial Split`, `/ Testimonial Carousel` | - | Testimonials family: one quote; six cards with ratings (Grid: Section Header exposed for the title and description; each card keeps its own properties); case study with results; carousel |
| Sections (blocks) | `Block / CTA Split`, `/ CTA Card`, `/ Bento Grid` | - | CTA with image; CTA on primary; bento overview with real components |
| Sections (blocks) | `Block / Features Split` | - | Alternating feature rows: text 448 and Device Frame 640 (5/7); Show header (Section Header center, exposed) |
| Content | `Block / Blog Grid`, `/ Blog Featured`, `/ Blog Post Header`, `/ News List` | - | Blog family: latest three; featured + list; article top; dated news list |
| Hero | `Block / Hero with Screenshot` | - | Headline, CTAs and the real product (Block / Analytics) in a browser frame |
| Hero | `Block / Hero Prompt` | - | AI-first home hero: content centered at 864 (optional Badge, headline with an accent line in `foreground/brand`, label, Prompt Input, optional suggestions, Action Bar center), then Show image: Device Frame 960 (exposed) |
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
| Empty State | `Empty State` | Size: default, sm. Media: icon, image, illustration. Tone: default, error (Media=icon only) | Title, Description, Show description, Icon (swap), Show actions; Actions (native slot). illustration: exposed Spot Illustration (120, sm 80). error: Error title, Error description, Try again Button, soft destructive tile |
| Results | `Block / Result` | Type: not-found, server-error, no-access, maintenance, success | Show code; Actions (native slot) |
| Commerce | `Product Card` | Layout: vertical, horizontal, overlay. State: default, sale, sold-out. Size: default, sm (vertical only) | as before + Show swatches (off: 4 Swatch sm under the variant text); sm 180 (min 140), smaller name, wishlist sm |
| Commerce | `Block / Product Detail` | - | Gallery, options (Toggle Group), quantity, add to cart, details accordion |
| Commerce | `Block / Order Summary` | - | Title, Show pay button; Subtotal row, Shipping row, VAT row, Total row (Summary Rows) and Pay button exposed. Lines, discount code, totals, pay button, trust line. Turn Show pay button off on checkout steps with their own Continue |
| Commerce | `Block / Product Grid`, `/ Orders`, `/ Reviews` | - | Category listing with filters, sort, product grid and Load More; order history with tracking, address and payment; rating summary with reviews |
| Enterprise | `Block / Filter Builder`, `/ Approval Request`, `/ Audit Log` | - | Advanced filters popover; request with details and approval chain; read-only event log with field changes |
| Enterprise | `Block / Roles & Permissions`, `/ Report`, `/ Record Form` | - | Role matrix with Save Bar; report with KPIs, chart, breakdown; long edit form with section nav |
| Enterprise | `Block / Import Mapping` | - | Import stepper, file column → field mapping with samples and status, problems alert, save as template |
| AI | `Block / AI Chat Empty`, `/ AI Conversation` | - | Welcome with input and starter prompts; conversation with reasoning, tool calls, citations, sources, approval, input |
| AI | `Block / AI Assistant Panel`, `/ Inline AI` | - | 400-wide copilot panel with context; inline popover with actions and a result to accept |
| Accordion | `Show More` | State: collapsed, expanded | Text. A long text cut to 3 lines with a Show more / Show less toggle. |
| Admin | `API Key Row` | - | Name, Meta, Key, Show scope. One API key or token in developer settings: key icon, name with a scope Badge (Show scope; set its Label, e.g. |
| Admin | `Integration Card` | Status: available, connected, error | Name, Category, Description, Logo, Vendor, Show icon, Show letter, Letter, Show badge, Show vendor, Show link. One app in an integrations directory or settings: logo tile, name, category, one-line value and state. |
| Admin | `Org Chart Node` | State: default, selected, vacant | Name, Role, Reports, Vacancy, Hiring status (vacant: Vacancy "Open role", then Role · Hiring status). One person or open role in an org chart: avatar, name, role and direct reports. |
| Admin | `Permission Row` | Type: permission, header, group | Title, Description, Show description, Show changed, Show role 4, Show role 5, Group. One row of a role matrix, built from Table Cells so rows, the header and group rows share one grid. |
| Admin | `Session Row` | Device: desktop, mobile. State: default, current | Name, Meta. One signed-in device in security settings: device and browser, approximate location, partial IP, last active, Sign out. |
| AI Chat | `AI Loading` | - | Status, Progress, Show progress, Show stop. Shimmer lines scale with the width (100%, 92%, 60%). Placeholder while AI writes an answer or a summary in place: what it is doing now, shimmer lines in the shape of the result, step and time left, Stop. |
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
| Background | `Background / Grid` | - | Fade. 40 px grid lines in `border/default` at 60% with a radial fade; decorative, at the back of a hero or CTA band |
| Background | `Background / Dots` | - | Fade. 24 px dot pattern in `foreground/muted` at 50% |
| Background | `Background / Glow` | Position: top, center, bottom-right | Blurred ellipse in `gradient/brand-glow`; follows the primary color of the mode |
| Background | `Background / Beam` | - | Three soft diagonal beams in the primary color |
| Badge | `Announcement Pill` | - | Label, Show tag. A short link above a hero title to the newest launch: "New" tag, one line, arrow. |
| Badge | `Trust Badge` | Tone: default, on-primary, inverted | Name, Description, Icon. on-primary on a primary band, inverted on an inverted card; never recolor by hand. A certification or compliance claim with what backs it: SOC 2, ISO 27001, GDPR, PCI DSS. |
| Brand | `Logo Tile` | Style: bordered (`background/card` with border), plain (no fill, logo at 70%) | Logo (swap: Logo / *). A customer or partner logo in a tile for logo clouds, integration grids and case study lists. |
| Brand | `Logo / <Name>` | - | 12 fictional sample logos (Northwind, Lumora, Orbitly, Fieldstone, Kestrel, Quintra, Halcyon, Brightpath, Corvid, Meridian, Tidewater, Vireo), 32 high, bound to foreground/default |
| Imagery | `Image / Person, Product, Office, Cover, Abstract, City / NN` | - | 49 sample photos (Unsplash License, not covered by CC BY 4.0; replace them), image fill FILL. Used through the Image Placeholder `Image` swap and the Avatar `Photo` swap |
| Imagery | `Image / Screenshot / <What>` | - | 7 product screenshots rendered from blocks (Dashboard, AI chat, Kanban, Invoices, Approval, Product page, Audit Log), light theme; inside a Device Frame for hero and feature visuals. 960 wide, height hugs a locked-ratio layer, so a swap or resize keeps the whole screen |
| Button | `Social Share` | - | Label, Show label, Show networks. Share buttons for a public page: copy link, email, the system share sheet and up to three networks. |
| Card | `Link Preview` | Layout: horizontal, vertical | Domain, Title, Description, Show image. A pasted URL shown as a card in comments, chat, notes and editors: site, title, description and image from the page metadata. |
| Card | `Location Card` | - | City, Address, Show tag, Show map. One office, store or venue: city with an optional tag Badge (Show tag), full address, phone and hours as Meta Items, and a Get directions link. |
| Chart | `Bullet Chart` | - | Title, Unit, Value, Target. One measure against its target and bands (poor, fair, good) in one line: revenue vs plan, SLA vs goal. |
| Chart | `Choropleth Map` | - | Values by region on a map, shaded from light (low) to dark (high): revenue by county, customers by country. |
| Chart | `Dashboard Widget` | - | Title, Period, Updated, Show footer, Content (slot). A movable, resizable tile on a customizable dashboard: drag handle, title, period, refresh, expand and menu, any chart, KPI or list in Content (fills the width, hugs the height), last updated. |
| Chart | `Distribution Bar` | - | Title, Total, Show legend; Segments (native slot) of `Distribution Segment`: fixed width = share x bar width, last segment on Fill. Legend wraps; show items 5 and 6 for more parts. Parts of one whole as a single 100% bar: invoices by status, budget by category, storage by type. |
| Chart | `Distribution Segment` | Color: chart-1 to chart-8 | One part of a Distribution Bar; only inside its Segments slot. Fixed width = share x bar width, the last one on Fill |
| Chart | `Radar Chart` | - | Compares 1-3 items across 5-8 qualities on the same scale: vendor scores, skill profiles, plan features. |
| Chart | `Sankey Chart` | - | Shows how amounts flow from sources to outcomes: payment method to paid or overdue, traffic source to sign-up, budget to spend. |
| Chat | `Mention Chip` | State: default, you | Name. A person mentioned in text (comments, chat, notes): @ and the name on a tinted chip, inline with the text. |
| Chat | `Reaction` | State: default, reacted | Emoji, Count. One emoji reaction with its count; State=reacted when the reader added it. Part of Reaction Bar. |
| Chat | `Reaction Bar` | - | Reactions (slot). Reactions under a comment or message: one Reaction per emoji with its count, then a button that opens the Emoji Picker. |
| Chat | `Thread Summary` | - | Replies, Last; Avatar Group exposed (photos, "+N" initials; switch an Avatar to Type=initials without a photo). Collapsed replies under a comment or message: who replied, how many and when the last one came. |
| Code Block | `Command Snippet` | - | Command, Show prompt. One command or value people copy into a terminal or config: install line, CLI command, environment variable. |
| Code Block | `Diff Line` | Type: context, added, removed | Text, Line. One line of a diff: number, marker, sign and text. Part of Diff Viewer. |
| Code Block | `Diff Viewer` | - | File, Added, Removed, Lines (slot). What changed between two versions of a text, contract, config or code: file name with counts, then Diff Lines. |
| Code Block | `Endpoint Row` | Method: GET, POST, PUT, PATCH, DELETE. State: default, hover, selected | Path, Summary. One API endpoint in a reference list: method badge, path in mono with parameters in braces, one-line summary. |
| Code Block | `JSON Viewer` | - | Structured data people inspect: webhook payloads, API responses, event properties, audit details. |
| Code Block | `Log Row` | Level: debug, info, warn, error | Time, Message. One line of a log or event stream: time with milliseconds, level and message in mono. |
| Color Picker | `Swatch` | Type: color, label. Size: default, sm. State: default, selected, unavailable | Label, Name, Show name. One choice: a color dot (Type=color) or a box with a short label like S, M, L (Type=label). Size=sm (28) in Swatch Picker, default (36) for product options; ring when selected, faded when unavailable. |
| Color Picker | `Swatch Picker` | - | Label, Show label, Swatches (slot). A short set of colors for labels, categories, calendars and project avatars: 6-10 Swatches from the chart palette in the Swatches slot, one selected, its name under them. |
| Commerce | `Address Card` | State: default, selected | Name, Address, Show default, Show radio, Show actions. A saved address to pick or manage: name, address lines in the country's format, phone, Default badge, Edit and Remove (Show actions). |
| Commerce | `Line Item` | Layout: cart, summary | Name, Variant, Quantity, Total; Number Input sm (cart). One product in a cart, checkout summary, order or invoice: image, name, variant, quantity and line total. |
| Commerce | `Mini Cart` | - | Items (slot). The cart in a popover after Add to cart or from the cart icon: items, subtotal, View cart and Checkout. |
| Commerce | `Order Row` | Status: processing, shipped, delivered, cancelled, paid, refunded. State: default, hover, selected | Number, Meta, Total. One order or invoice in an account history: number, date and item count, status, total, chevron to the order page. |
| Commerce | `Payment Method Card` | State: default, expired | Card, Brand, Show default. A saved card or account: brand, last 4 digits, expiry, Default badge (Show default) and a menu. |
| Commerce | `Shipment Tracker` | - | ETA, Carrier; Ordered step, Shipped step, Out for delivery step, Delivered step exposed (set Title, Description with the date, State). Where an order is: the expected day first, carrier and tracking number, then the steps with dates. |
| Drawer | `Resizable Panels` | - | Start (slot), End (slot). Two panels with a handle to drag the split: list and detail, editor and preview, code and output. |
| File Upload | `File Field` | State: empty, selected, error | File name, Error. One file as a form field: Choose file, then the name and size, with remove. |
| Filters | `Saved View Item` | State: default, hover, active | Name, Show shared, Show count. One saved filter set (a view) in a list or sidebar: name, shared icon and item count. |
| Form Layout | `Error Summary` | - | Title, Errors (slot). At the top of a long form after a failed submit: how many fields need a fix and a link to each. |
| Form Layout | `Fieldset` | State: default, error | Legend, Description, Show description, Error, Options (slot). A group of related controls with one label: checkboxes, radios, the parts of an address or a date. |
| Form Layout | `Form Section` | Layout: side, stacked | Title, Description, Show description, Show divider, Fields (slot). One group of a long form or settings page: title and a sentence on the left, the fields on the right. |
| Form Layout | `Check Item` | Mark: check, dash, x. Tone: default, on-primary, inverted | Label. on-primary and inverted marks use the label color. One line with a mark: check when met or included, dash when pending or not included, x after a failed submit. Part of Requirement List; also the feature list of Plan Card. |
| Form Layout | `Requirement List` | - | Title, Show title, Items (slot of Check Items). Rules checked live while people type or before they publish: password rules, import checks, what a listing needs. |
| Image | `Device Frame` | Device: browser, phone | Address, Screen (slot: an `Image / Screenshot / *` at Fill width; its height follows the image. Resize the frame, never the screen). A browser window or a phone around a product screenshot for marketing pages, docs and case studies. |
| Image | `Image Compare Slider` | - | Two images of the same view, before and after, with a handle to drag between them: redesigns, photo edits, document versions, site changes. |
| Image | `Image Figure` | - | Caption, Show credit, Credit. An image with a caption under it (HTML figure and figcaption) for galleries, articles and docs. |
| Input | `Copy Field` | State: default, copied | Value. A read-only value people copy and paste elsewhere: API key, invite link, webhook URL, reference code. |
| Input | `Currency Input` | State: default, focus, error, disabled | Amount, Currency. An amount with its currency: a currency picker on the left and the amount right-aligned in the locale format. |
| Input | `Date Input` | State: default, focus, error, disabled | Day, Month, Year. Segments hug 16-24 (year 32-44), centered |
| Input | `Duration Input` | State: default, focus, error | Hours, Minutes. A length of time in hours and minutes for time entries, SLAs, reminders and meeting length. |
| Input | `Inline Form` | State: default, error, success. Tone: default, on-primary (secondary Button; hint, error and success in `foreground/primary`) | Hint, Error, Success message, Show hint; Button exposed (set its Label). One field and one button on a line: newsletter sign-up, coupon code, invite by email, add a tag. |
| Input | `Phone Input` | State: default, focus, error, disabled | Country, Number. Phone number with a country code picker; formats as people type and stores the number in E.164. |
| Input | `Range Input` | State: default, error | Min, Max, Unit. Two fields for a minimum and a maximum: price or amount filters, typed date ranges, quantities. |
| Input | `Search Field` | State: default, focus, filled. Size: default, lg | Placeholder, Query, Show shortcut. Search box for a list, a table or the whole app: search icon, a placeholder that names what is searched, a shortcut hint and clear. |
| Kbd | `Shortcut Row` | - | Action. One keyboard shortcut in the shortcuts dialog or a help page: what it does, then the keys. |
| List | `Task Item` | State: open, done, overdue | Title, Due (bound in every State; overdue writes "Overdue · was due …"), Show due, Show assignee. One task in a checklist (onboarding, a project, a record's to-dos): checkbox, title, due date and assignee. |
| List | `Job Listing` | - | Title, Meta, Location, Posted, Salary, Show badge, Show salary. One open role in a careers list: title, team, type and work mode, location, posted date, salary range and Apply. |
| Menu | `Account Menu` | - | Name, Email. The menu behind the signed-in person's avatar: name and email, personal settings, and Log out. |
| Metrics | `Countdown` | Style: default, boxed, inline | Days, Hours, Minutes, Seconds, Show seconds. Time left until a deadline people act on: an offer, a webinar start, a payment due, a session that expires. |
| Metrics | `Leaderboard Row` | State: default, current | Rank, Name, Value. A ranked person or team: rank, avatar, name and value. |
| Metrics | `Metric Strip` | - | Metrics (slot). A row of 3-5 key figures at the top of a dashboard, report or record page, lighter than Stat Cards: label, value, trend, dividers between. |
| Metrics | `Metric Strip Item` | - | Label, Value, Show trend, Show divider. One figure in a Metric Strip: label, value and an optional Trend Indicator. |
| Metrics | `Trend Indicator` | Trend: up, down, flat. Tone: positive, negative, neutral. Style: text, badge | Value, Comparison, Show comparison. A change against a period: arrow, signed percent or amount, and what it is compared to. Trend says which way it moved; Tone says if that is good, bad or neither. |
| Metrics | `Usage Meter` | Level: normal, near, over | Label, Show hint; bar (Progress) exposed: set its Value to the nearest step of the real share. How much of a plan limit is used: seats, storage, API calls, documents per month. Label, used of limit, bar and a hint. |
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
| Pricing | `Plan Card` | Variant: default, featured, inverted, compact | Title, Description, Features title, Features (slot). One plan in a pricing section: name, who it is for, Price, the main action and what it adds as Check Items. |
| Pricing | `Comparison Table` | Plans: 3 (label column 432, plan columns 240), 4 (label 352, plans 200) | Header row per plan (name, optional Badge, Price sm, sm Button), section label rows, feature rows of Table Cell Check. Plans matches the plan cards above it; used by Block / Comparison Table (3) and Pricing with Comparison (4) |
| Pricing | `Price` | Size: sm, default, lg, xl | Amount, Old price, Period, Show old price, Show period. A price as people compare it: amount with currency, period, and the old price struck through during a discount. |
| Progress | `Background Job` | State: running, done, error | Title, Status, Result, Error. A task that runs in the background (export, import, bulk send, report): name, progress with count and time left, cancel; done offers the result (Download); failed says where it stopped and offers Retry. |
| Quote | `Footnote` | - | Number, Text, Show back link. A numbered note at the end of an article, report or pricing page that explains a claim in the text. |
| Quote | `Testimonial Card` | Variant: default, minimal, logo, featured | Quote, Show rating, Logo (swap), Show image (featured). One customer quote as a card for testimonial grids and carousels: optional rating, the quote with a specific result, Byline. |
| Rating | `Rating Summary` | - | Average, Count. Average rating with the split across 1-5 stars, above the reviews. |
| Rating | `Review Item` | - | Name, Date, Title, Text, Show verified, Show helpful. One customer review: who, verified purchase, date, stars, a title, the text and Helpful votes. |
| Scheduler | `Agenda Item` | State: upcoming, now, past | Title, Start, End, Meta. One event in a day agenda: start and end time, a color bar for the calendar, title, place and people. |
| Scheduler | `Availability Row` | State: available, unavailable | Day. Working hours for one weekday in booking and team settings: on/off Switch, the day, one or more time ranges and a button to add a range. |
| Scheduler | `Meeting Card` | State: upcoming, live | Title. A meeting people are about to join: title, time with time zone, place or video link, who is invited, Join and Details. |
| Scheduler | `Time Slot` | State: default, hover, selected, disabled | Time. One bookable start time in a booking flow, shown in a grid under the chosen day. |
| Search | `Search Result Item` | Type: page, record, person, file, media, product, event, answer | One result on a search page. Text properties are per type (pick the Type first): page Title, Snippet, Path, Section, Updated; record Record, Record details; person Name, Role, Email; file File name, File details, Owner; media Media title, Media summary, Media details; product Product, Product summary; event Event, When and where; answer Question, Answer, Sources (slot). Show path, Show meta, Show action, Show feedback, Icon (swap) |
| Select | `Address Autocomplete` | - | Query, Show suggestions. Address field with suggestions as people type; a pick fills the address fields below it. |
| Select | `Recurrence Picker` | Frequency: daily, weekly, monthly | Show summary. How often something repeats: interval and unit, the days or the day, when it ends, and a summary sentence. |
| Select | `Select Option` | Type: icon, avatar, none, create. State: default, highlighted | Title, Description, Show description, Checked, Icon; Create label (create: plus, "Create label \"Urgent\""). A rich option in a Select, Combobox or Menu list |
| Sharing | `Access Row` | Type: editable, owner, pending | Name, Email. One person or group with access to an object in a share dialog: avatar, Name and Email, and their role. |
| Sharing | `Invite Row` | - | Show role. Adds people to an object or a workspace: email or name with suggestions from the directory, the role they get, and Invite. |
| Sharing | `Share Link Row` | Type: restricted, anyone | General access of an object at the bottom of a share dialog: who can open the link, and Copy link. |
| Spinner | `Loading Overlay` | - | Label, Show label. Covers one region while its content reloads, keeping the old content faded underneath, with a Spinner and a short label. |
| Surveys | `CSAT Rating` | State: unanswered, answered | Question. Customer satisfaction after one interaction: five faces with words under them; one tap sends it. |
| Surveys | `Feedback Widget` | State: ask, comment, thanks | Question, Thanks. A one-tap question at the end of a help article, an AI answer or a finished task: Yes or No, then an optional comment, then thanks. |
| Surveys | `NPS Survey` | State: unanswered, answered | Question. Net Promoter Score: a 0-10 scale with anchors, then one optional open question. |
| Tour | `Annotation Pin` | State: default, active, resolved | Number. A numbered marker on a design, document or screenshot where a comment lives. |
| Video | `Audio Player` | Variant: default, compact. State: paused, playing | Title, Time, Duration. compact: 280 pill with play, waveform and Duration (voice messages) |
| Video | `Video Thumbnail` | - | Show duration. A video before it plays: poster frame, play button and duration. |
| Hero | `Block / Hero with Logo Cloud` | - | Announcement Pill, display Title with accent, Description, Action Bar (2 CTAs), browser Device Frame (exposed) with `Image / Screenshot / Invoices`, Logo caption + Logos slot (6 Logo Tile plain); Show announcement, Show screenshot, Show logos |
| Hero | `Block / Hero with Form` | - | Eyebrow, display Title with accent, Description, Inline Form (exposed, "Start free" + hint), social proof (Avatar Group with photos + Rating 4.9), 4:3 Image (exposed, `Image / Office / 03`); Show eyebrow, Show social proof |
| Hero | `Block / Hero with Phone` | - | Eyebrow, display Title with accent, Description, Stores (`Store Badge` App Store + Google Play), Rating 4.8 (12,400 ratings), phone Device Frame (exposed) with a Page Shell / Mobile list screen, cropped in a `section/muted-background` panel; Show eyebrow, Show rating |
| Hero | `Block / Hero Full-bleed Image` | - | 1440 x 720 photo (Image exposed, `Image / City / 01`), `video/scrim` layer, Navbar Style=on-image (exposed), Announcement Pill, white Title and Description (`video/foreground`, 4.9:1 over the brightest pixel), 2 CTAs; Show announcement, Show navbar |
| Hero | `Block / Hero with Video` | - | Announcement Pill, display Title with accent, Description, Action Bar, Video Player (State=poster, Size=lg, exposed, 1152 x 648, office photo poster, 3:12, shadow/xl); Show announcement, Show actions |
| Hero | `Block / Hero with Stats` | - | Eyebrow + display Title with accent left, Description + Action Bar right, 21:9 Image (exposed, `Image / Office / 05`), Metric Strip with 4 figures (€2.4B, 38,000, 11 h, 99.99%); Show eyebrow, Show image |
| Hero | `Block / Hero Image Collage` | - | Eyebrow, display Title with accent, Description, Action Bar, social proof (Avatar Group + Rating 4.9), Collage of 5 staggered Image Placeholders (3:4 and 1:1, people and offices, all exposed); Show eyebrow, Show social proof |
| Mobile | `Store Badge` | Store: app-store, google-play | Store mark, small line and store name; follows the theme (dark badge in Light, light in Dark). Used by Hero with Phone |
| Mobile | `QR Code` | Size: default (128), sm (96), lg (160) | Tile on `background/card` with a bound radius; padding is the quiet zone; one vector of sample modules in `foreground/card`. Sample artwork that does not scan: replace it with the real code. Used by Block / CTA App Download, next to Store Badges with a text action |
| Sections (blocks) | `Block / Features with Screenshot` | - | Section Header Align=left (exposed), Items (native slot: 4 Feature Items Layout=inline, Marker=icon), Show actions (exposed primary Button + link Button), Device Frame browser (exposed, shadow/xl) with `Image / Screenshot / Approval` |
| Sections (blocks) | `Block / Features Tabs` | - | Section Header center (exposed), Tabs Variant=line (exposed, 4 Tabs with icons), Panel title, Panel description, Show panel link (exposed outline Button), Device Frame browser 1152 (exposed, shadow/xl) with `Image / Screenshot / Invoices` |
| Sections (blocks) | `Block / How It Works` | - | Muted band. Section Header center (exposed), Steps (native slot: 3 step cards, Feature Item Marker=number + example strip of outline and soft Badges), Show actions (exposed Buttons) |
| Sections (blocks) | `Block / Bento Grid 2` | - | Section Header center (exposed); 5 tiles: Chart Card (exposed, area Line Chart), Answers (AI Summary), Projects (2 Kanban Cards), Team (Avatar Group with photos, Team label, role Badges), Invoices (rows with soft status Badges). TEXT per tile: <Tile> title, <Tile> description |
| Sections (blocks) | `Block / Feature Checklist` | - | Image Placeholder 4:3 (exposed, Image / Office / 03), Section Header left (exposed), Items (native slot: 8 Check Items, two columns), Show actions (exposed Buttons) |
| Sections (blocks) | `Block / Integrations Grid` | - | Muted band. Section Header center (exposed), Logos (native slot: 12 Logo Tiles bordered, 4 per row, fictional `Logo / *`), Note, Show footer (exposed outline Button + link) |
| Sections (blocks) | `Block / Security and Compliance` | - | Trust family. Section Header left (exposed), Show actions (security pack + trust center Buttons), Controls (native slot: 6 items, Icon Tile neutral + title + sentence), Show certifications + Badges (native slot: 4 Trust Badges) |
| Sections (blocks) | `Block / Trust Strip` | - | Trust family. Badges (native slot: 4 Trust Badges: delivery, returns, secure checkout, repairs), 1440 x 182, no heading |
| Sections (blocks) | `Block / Logo Grid` | - | Logo Cloud family: Section Header (exposed), Logos (slot: 8 `Logo Tile` bordered, 4 per row), Action (exposed Button link), Show action |
| Sections (blocks) | `Block / Logos Split` | - | Logo Cloud family: Eyebrow, Title, Description, Show eyebrow, Show action, Action (exposed); Logos (slot: 6 `Logo Tile` plain on a muted panel, 3 per row) |
| Sections (blocks) | `Block / Logo Marquee` | - | Logo Cloud family: Caption, Show caption; Logos (slot: 10 `Logo Tile` plain in one row, clipped at 1440 with faded edges: `fade left` and `fade right` on `gradient/background-transparent`) |
| Sections (blocks) | `Block / CTA with Screenshot` | - | CTA family: primary band, Eyebrow, Title, Description, Note, Show eyebrow, Show proof, Show note; Primary action and Secondary action (exposed Buttons); Device Frame (exposed, browser with `Image / Screenshot / Dashboard`, cropped) |
| Sections (blocks) | `Block / Newsletter Split` | - | Newsletter family: Eyebrow, Title, Description, Show eyebrow, Show image; Benefits (slot: 3 Check Items); Inline Form and Image (exposed, `Image / Office / 03`) |
| Sections (blocks) | `Block / Newsletter Card` | - | Newsletter family: primary card with shadow, Title, Description, Subscribers, Show badge, Show proof; Badge and Inline Form (exposed, Tone=on-primary); Avatar Group with photos |
| Sections (blocks) | `Block / Pricing with Comparison` | - | Pricing family: Section Header (exposed), billing Toggle Group with saving Badge (Show billing period), Plans (slot: 4 Plan Cards, one featured), Comparison toggle (exposed Button), Comparison Table Plans=4 (Show comparison), Note, Show note |
| Sections (blocks) | `Block / Stats Brand Band` | - | Stats family: full-width primary band, Title, Description, Source, Show header, Show source; Figures (slot: 4 `Figure` lg Tone=on-primary, centered) |
| Sections (blocks) | `Block / About Hero` | - | About family: Eyebrow, Title (`display/lg` with accent), Description, Show eyebrow; Images (slot: 4 Image Placeholders, Person, Office, City photos) |
| Sections (blocks) | `Block / Our Story` | - | About family: muted band, Eyebrow, Title, Description, Milestones title, Show eyebrow, Show image; Image Figure (exposed); Milestones (slot: 5 Timeline Items in a card) |
| Sections (blocks) | `Block / Values` | - | About family: Section Header (exposed); Values (slot: 6 Feature Items stacked with brand icon tiles, 3 per row) |
| Sections (blocks) | `Block / Mission with Figures` | - | About family: Eyebrow, Title, Description, Show eyebrow, Show image; Figures (slot: 4 `Figure` lg with dividers, 2 per row); Image (exposed, 1:1 `Image / City / 01`) |
| Navigation (blocks) | `Block / Banner Floating` | - | Banner family. 1440 wide, transparent, 24 px padding; elevated card (1040, shadow/lg) with Icon Tile, Title, Description, Secondary action and Primary action Buttons, dismiss. Title, Description; Show icon, Show secondary action, Dismiss; Icon Tile, Primary action, Secondary action exposed |
| Navigation (blocks) | `Block / Banner Countdown` | - | Banner family. Promo bar on background/primary: sale Badge, Title, Description (terms with end date), Countdown, Primary action, dismiss. Title, Description; Show badge, Show description, Dismiss; Badge, Countdown, Primary action exposed |
| Navigation (blocks) | `Block / Banner with Action` | - | Banner family. Quiet top bar on section/muted-background with bottom border: soft-info Badge, Message, link Action, dismiss. Message; Show badge, Dismiss; Badge, Action exposed |
| AI | `Block / AI Search Answer` | - | 960 wide. Search Field (filled query), scope Chips + Result count, AI Summary "AI overview" with cited paragraphs, list and Sources (4 Source Items), Results title, Results (native slot) of Search Result Items (page, record, file, person) with Separators. Show filters, Show answer, Show results header, Results title, Result count; Search Field and AI Summary exposed |
| AI | `Block / Agent Task Run` | - | 960 wide. Run Title, Meta, status Badge (soft-warning "Waiting for approval"), Task card (Avatar + task text), Agent Plan (5 Plan Steps, Progress 75), Activity (native slot) of Tool Calls ending with Status=approval, Results (native slot) of Artifact Cards (document, table). Title, Meta, Task, Activity title, Results title; Show task, Show activity, Show results; Agent Plan and Status exposed |
| App | `Block / SaaS Metrics Dashboard` | - | 1136 wide. Metric Strip (MRR, net new MRR, active subscriptions, ARPU, MRR churn with Trend Indicators); Chart Cards: trials and activation (Combo Chart), MRR by plan (Donut), trial to paid (Funnel, chart/5), churned MRR by reason (Bar Chart Horizontal, chart/6). Numbers add up |
| App | `Block / Sales Pipeline` | - | 1136 wide. Metric Strip of stage value and deal count (Lead, Qualified, Proposal, Negotiation, Won this quarter); stage conversion Funnel (chart/3) in a Chart Card; top reps as Leaderboard Rows with photo avatars in a Card; largest open deals table of Table Cells (Stack, User, soft stage Badge, Amount, Date, Progress) |
| App | `Block / Commerce Admin` | - | 1136 wide. Four Stat Cards (revenue, orders, average order value, conversion rate; sparklines on three, soft change Badges); revenue area Line Chart; top products Bar Chart Horizontal (chart/3); recent orders as Order Rows with soft status Badges in a Card; sales by channel Donut |
| App | `Block / Project Overview` | - | Project name, Meta. 1136 wide. Header with soft status Badge and Avatar Group with photos; four Progress Cards (tasks, budget, milestones, hours; soft status Badges); compact timeline of Gantt Bars with a Gantt Milestone and today line; tasks due this week as Task Items with photo assignees |
| App | `Block / Home Today` | - | Greeting, Day summary. 1136 wide. AI Summary of the day; Today (Agenda Items: past, now, upcoming, colored by calendar), Tasks (Task Items, overdue first) and Notifications (Notification Items with photo avatars) in three Cards |
| App | `Block / Data Table` | - | Show toolbar, Show active filters, Show selection bar, Show pagination; Page Header exposed (Title, Description, Actions). Invoices list page, 1136: Page Header with New invoice, Data Grid Toolbar (saved view, search, Filters 3, Columns, Sort, Export), active filter chips, table card with Table Toolbar "2 selected" (Export, Mark as paid, Delete), GRID of Table Cells (checkbox, number, Table Cell User, Table Cell Stack, soft status Badge, issued, due, amount right aligned, Table Cell Actions), 10 rows with 2 selected, Table Pagination |
| App | `Block / Stacked List` | - | Items (native slot of List Items), Show header, Show load more; Card Header exposed. Projects list, 1136: Card Header with New project, bordered list of 7 List Items (photo Avatar, title, one line of meta, Avatar Group sm, soft status Badge, row menu), Load More |
| App | `Block / Grid List` | - | Cards (native slot, wraps), Show filters, Show load more; Page Header exposed. Customers, 1136: Page Header (Import, Add customer), Filter Bar (search, Sort, grid or list Toggle Group, filter chips, Clear all), 6 Entity Cards in 3 columns (initials logo, meta, soft status and plan Badges, three facts, people photos), Load More |
| App | `Block / Create Record Dialog` | - | Dialog and Dialog Header exposed. 1440x900: Page Shell / App with Block / Data Table behind dialog/overlay; Dialog lg 672 "New invoice": Combobox, Input, two Date Pickers with hint, Select, Currency Input, Textarea, Checkbox; Cancel, Save as draft, Create invoice |
| App | `Block / Delete Confirmation` | - | Alert Dialog and Dialog Header exposed. 1440x900: Page Shell / App with Block / Stacked List behind dialog/overlay; Alert Dialog Type=destructive "Delete project?" naming what is lost, Field "Type Website redesign to confirm" with the Input filled (focus); Cancel, Delete project |
| App | `Block / Record Preview Sheet` | - | Sheet and Dialog Header exposed. 1440x900: Page Shell / App with Block / Data Table behind dialog/overlay; Sheet 640 right "INV-1047": Figure lg amount, soft Badge Overdue + Meta Item due date, 6 Description List Items, Activity with 4 Timeline Items (warning, default, primary, default); Open invoice, Send reminder |
| App | `Block / Command Palette` | - | Command Dialog exposed (Items slot). 1440x900: Page Shell / App with Block / Grid List behind dialog/overlay; Command Dialog at 140 from the top: Suggestions (Create invoice highlighted, ⌘N), Recent (3 records), Go to (Dashboard G D, Invoices G I, Settings ⌘,), Menu Labels, Separators, key hints |
| App | `Block / Upgrade Dialog` | - | Dialog and Dialog Header exposed. 1440x900: Page Shell / App with Block / Stacked List behind dialog/overlay; Dialog 768 "Upgrade to add more projects" (10 of 10 projects), Monthly / Yearly Toggle Group, Plan Card Starter (Current plan, disabled) and Plan Card featured Business (€24 per user / month, Upgrade to Business) with Check Items; Maybe later, Compare all plans |
| App | `Block / Data Table`, `/ Stacked List`, `/ Grid List` | - | Lists family: invoices table page with toolbar, filter chips, selection bar and pagination; projects as List Items with people, status and menu; customers as Entity Cards in 3 columns with Filter Bar and Load More |
| App | `Block / Create Record Dialog`, `/ Delete Confirmation`, `/ Record Preview Sheet`, `/ Command Palette`, `/ Upgrade Dialog` | - | Overlays family, 1440x900 screens (Page Shell / App + list block behind `dialog/overlay`): create form dialog; type-to-confirm destructive Alert Dialog; Sheet 640 record preview with timeline; ⌘K Command Dialog; plan limit dialog with two Plan Cards |
| Commerce | `Block / Store Navbar` | - | Logo (swap), Show promo bar, Show search, Show wishlist, Show cart count. Promo bar (Announcement Banner), logo, six category links (Nav Link), Search Field "Search products", account and wishlist Button Icons, cart Button Icon with Badge Count (exposed) |
| Commerce | `Block / Store Footer` | - | Logo (swap), Show newsletter, Newsletter title, Newsletter text, Address, Show payment methods, Payment methods (slot), Show country selector, Copyright. Newsletter card with Inline Form, address, four link columns (Shop, Help, Company, Legal), Payment Method Marks, copyright with VAT note, country and currency Select |
| Commerce | `Block / Storefront Hero` | - | Eyebrow, Title, Description, Rating text, Show rating, Show categories, Show secondary action. Full-height lifestyle photo (Image Placeholder 1:1, exposed) with a floating rating card, display/lg headline, two shop Buttons, three category links (Navigation Menu Link) |
| Commerce | `Block / Category Tiles` | - | Show header, Show action, Tiles (slot). Section Header + View all link, four 3:4 photo tiles with name and style count, on `section/muted-background` |
| Commerce | `Block / Promo Section` | - | Title, Description, Countdown label, Fine print, Show badge, Show countdown, Show secondary action, Show fine print. Soft destructive Badge with the end date, offer headline, Countdown, two Buttons, fine print, lifestyle photo |
| Commerce | `Block / Incentives` | - | Items (slot). Four Trust Badges: free delivery, 30-day returns, 2-year warranty, support hours |
| Commerce | `Block / Product Carousel` | - | Products (slot), Show action, Show arrows. Section Header, Shop all link, previous / next Carousel Arrows, row of five Product Cards with Show rating on, fifth cut at the edge |
| Commerce (blocks) | `Block / Category Filters` | Layout: sidebar (1440), drawer (390) | Title, Count, Show breadcrumb, Show active filters, Show load more; Results (native slot, Product Cards 258 wide, 3 per row). Sidebar: breadcrumb, title and count, Sort by Select, Filter Sections (Category with counts, Price as range Slider + Range Input, Color Swatch Picker, Size Swatches, Availability, collapsed Material and Brand), active Filter Chips + Clear all, Load More. Drawer: Sheet with Sort, the same Filter Sections, Clear all and "Show 32 products" |
| Commerce (blocks) | `Block / Product Quick View` | - | Name, Description, Color label, Size label, Show badges, Show rating, Show size, Show details link; Carousel Gallery (exposed). 880-wide dialog surface (Dialog tokens): gallery, soft badges, price with old price, rating, color and size Swatches, quantity, Add to cart, wishlist, stock and delivery, View full details |
| Commerce (blocks) | `Block / Shopping Cart Page` | - | Title, Subtitle, Note, Show note, Show continue shopping, Recommendations title, Show recommendations; Items (native slot: Line Item cart + Separator), Recommendations (native slot: Product Cards). Order Summary with lines hidden, totals and Checkout |
| Commerce (blocks) | `Block / Checkout Single Page` | - | Title, Subtitle, Terms, Delivery title, Show breadcrumb, Show sign in, Show newsletter opt-in. Contact (Field, opt-in Checkbox), Block / Address, billing same as delivery, delivery method radio Option Cards, Block / Payment, Order Summary with lines and "Pay €159.30" |
| Commerce (blocks) | `Block / Order Confirmation` | - | Eyebrow, Title, Description, Order number, Order date, Billing, Help, Show tracker; Items (native slot: Line Item summary). Icon Tile, Shipment Tracker, Summary Rows to the amount paid, Address Card, Payment Method Card, Continue shopping |
| Email | `Email / Header` | - | Logo (swap: Logo, Logo / *), Show preheader link, Preheader link ("View in browser"). Transparent, sits on the muted canvas |
| Email | `Email / Hero` | - | Title (heading/h2), Text, Show text, Eyebrow, Show eyebrow, Show image (Image Placeholder 16:9, exposed) |
| Email | `Email / Button` | Align: left, center | Label. Solid `background/primary` pill (`button/radius`), 44 px, bulletproof in code |
| Email | `Email / Content` | - | Heading, Show heading, Text (body/default 16) |
| Email | `Email / Code` | - | Label, Code (Roboto Mono 36, `font/mono`), Hint, Show hint |
| Email | `Email / Details` | - | Title, Show title; Rows (native slot) of `Email / Details Row` (Label, Value) |
| Email | `Email / Line Items` | - | Title, Show title; Items (slot) of `Email / Line Item` (Name, Meta, Amount, Show image, exposed Image); Totals (slot) of `Email / Total Row` (Type: default, total; Label, Amount) |
| Email | `Email / Callout` | Tone: default, info, success, warning, destructive | Title, Show title, Text, Show icon. `badge/soft-*` tints, text foreground/default |
| Email | `Email / Divider` | - | Separator inside 40 px side padding |
| Email | `Email / Stats` | - | Items (slot) of `Email / Stat` (Value, Label, Change, Show change) |
| Email | `Email / Article` | - | Title, Text, Link, Show image (Image Placeholder 4:3, exposed) |
| Email | `Email / Footer` | - | Address, Reason, Show social (LinkedIn, X, YouTube, GitHub), Show preferences, Show unsubscribe |
| Forms | `Block / Sign In Split` | - | 1440 x 900. Left: Logo (exposed), Form (native slot, default `Block / Sign In`), Footer text + Show footer. Right: full-height photo (Image Placeholder exposed, `Image / Office / 06`, swap to `Image / Screenshot / *` for a product screen) in a radius/xl panel with a Testimonial Card (exposed, shadow/lg) at the bottom; Show testimonial |
| Forms | `Block / Sign Up Split` | - | 1440 x 900. Left: Logo (exposed), Form (native slot, default `Block / Sign Up`), Footer + Show footer. Right on `section/muted-background`: Title, Description, Benefits (native slot, 4 Check Items), Logos caption + Logos (native slot, 6 plain Logo Tiles), Show logos |
| Forms | `Block / Welcome Role Select` | - | 672 wide (the Wizard Page slot). Step + Progress (Show progress), Title, Description, Role question + 6 radio Option Cards with icons in 2 columns, Team question + 5 compact Option Cards, Skip for now / Continue (Show actions) |
| App | `Block / Settings Page with Tabs` | - | 1136 wide, no fill, gap spacing/6. Page Header "Settings" (exposed, Actions slot empty), line Tabs (exposed): General (active), Members (count 10), Notifications, Security, Billing, API keys, Integrations, Appearance; Sections (native slot, 960 wide) with two Form Sections Layout=side: "Workspace" (Workspace name, Logo Avatar Upload square initials, Workspace URL Input Group "app.orbitly.io/") and "Language and region" (Language, Time zone, Currency, Week starts on Selects); Save Bar (exposed, 960, "2 unsaved changes"). Show save bar, Show tabs |
| App | `Block / Danger Zone` | - | 960 wide. Card (exposed) with destructive border and title "Danger zone", description, Setting Rows: Transfer ownership (outline Button "Transfer ownership"), Delete workspace (destructive Button) with counts and the 30-day grace period. Put last in a settings page; the button opens an Alert Dialog with typed confirmation |
| Sections (blocks) | `Block / Features with Code` | - | Section Header Align=left (exposed), Items (native slot: 3 Feature Items Layout=inline, icons code, zap, key-round), Show actions (exposed primary Button "Read the docs" + link "API reference"), Show install (exposed Command Snippet `npm install @acme/sdk`), Code Block (exposed, TypeScript sample creating and sending an EUR invoice, shadow/lg) |
| Sections (blocks) | `Block / Use Cases` | - | Section Header center (exposed), Cards (native slot: 4 Card Variant=outline, header and footer off, each Image Placeholder 4:3 with `Image / *`, team overline, outcome title, sentence, link Button; equal heights) |
| Sections (blocks) | `Block / Us vs Them` | - | Muted band. Section Header center (exposed), comparison card (5xl): header with Compare label, Logo (exposed, highlighted column on `card/muted-background`), Them 1, Them 2; Rows (native slot: 8 rows, Table Cell Text + Table Cell Check included / excluded / text), Note (sources and date), Show actions (exposed Buttons) |
| Sections (blocks) | `Block / Press Mentions` | - | Logo Cloud family. Section Header center (exposed), Mentions (native slot: 3 cards with a `Logo / Press / *` masthead, Quote default without avatar, writer, publication and month, "Read the article" link), Logos caption, Logos (native slot: 3 Logo Tile plain with press logos), Show logos |
| Sections (blocks) | `Block / CTA with Form` | - | CTA family, muted band. Title, Description, Inline Form (exposed: "Work email", "Start free trial", trial hint), Benefits (native slot: 3 Check Items) + Show benefits, Privacy note + Show note |
| Sections (blocks) | `Block / CTA App Download` | - | CTA family, primary band (`radius/xl`). Eyebrow + Show eyebrow, Title, Description, Stores (`Store Badge` app-store + google-play), `QR Code` default (sample pattern, replace with the real code) with QR title, QR caption, Show QR; phone Device Frame (exposed, Page Shell / Mobile customers screen, cropped, shadow/xl) |
| Sections (blocks) | `Block / Pricing Usage-based` | - | Pricing family. Section Header center (exposed); tier card: Unit label, Rate label, Tiers (native slot: 5 bands, Table Cell Text strong + right-aligned rate, current band highlighted with Badge soft-info "Your estimate"), Included (native slot: 4 Check Items); estimate card (shadow/lg): Estimate value, Slider with marks (Value=50, 2,500), 3 Summary Rows, Separator, Price lg (exposed, €735 / month), Price note, Buttons (exposed) |
| Sections (blocks) | `Block / Pricing Enterprise Banner` | - | Pricing family. Inverted card (Card inverted tokens, padding 48): Badge pill (exposed), Title, Description, Features (native slot: 6 Check Items), Price ("Custom pricing"), Price note, Contact sales + Book a demo (exposed Buttons), Show trust badges + Badges (native slot: 4 Trust Badges) |
| Brand | `Logo / Press / <Name>` | - | 6 fictional sample press mastheads (The Ledger Review, Northbeam Daily, Margin Weekly, Tallyline, Counting House, Fieldnote Business), outlined vectors, 32 high, bound to foreground/default; for Press Mentions and Logo Tile |
| Content | `Block / Legal Page` | - | Prose family. 1440: Header Simple (breadcrumb, Privacy policy, lead, last updated), then 1152 body in three columns: Table of Contents (exposed, 7 numbered sections, first active) + Download PDF (outline sm), reading column 720 with Content (native slot: soft info Alert "The short version", 7 h3 sections with paragraphs and a bullet list) and a footer note under a Separator, Related (exposed Table of Contents "Other policies", 5 links). Footer note; Show table of contents, Show download, Show related, Show footer note |
| Content | `Block / Content with Image` | - | Prose family. 1440, py 96: Eyebrow, h2 Title, Content (native slot: lead, paragraphs, pull Quote with name and role), Image Figure (exposed, 544, `Image / Office / 04`, caption and credit). Eyebrow, Title; Show eyebrow, Show image |
| Navigation (blocks) | `Block / Navbar Flyout` | - | Navbar family. 1440: Navbar (exposed, Style=default; Product Nav Link active with chevron, Start free trial) and an open Navigation Menu Panel (exposed, shadow/lg, 8 px below) with 6 icon Navigation Menu Links, a footer row in the Links slot (Watch the 3-minute demo, Contact sales, All features link) and a Featured card on `section/muted-background` (Dashboard screenshot, soft-info Badge "New in 4.2", title, line, link). Show featured on the panel |
| Forms | `Block / Waitlist` | State: default, joined | 1440 on `section/muted-background`. default: Logo, soft-info Badge (launch date), display Title, Description, Inline Form ("Join the waitlist" + hint), Avatar Group with photos and list size. joined: Joined title, Joined description, position card (shadow/md): #1,248 of 9,320, Progress 75 with estimated invite week, referral (Copy Field, Share on LinkedIn, Email a friend). Title, Description, Joined title, Joined description, Position, Position note, Estimate, Referral title, Referral note; Show badge, Show proof, Show referral; Logo, Badge, Inline Form, Avatar Group, Copy Field exposed |
| Forms | `Block / Workspace Setup` | - | Onboarding family, 672 wide (Wizard Page slot). Step + Progress 50, Title, Description, Fields (native slot: square Avatar Upload logo, Workspace name, Workspace URL Input Group with `app.acme.com/` addon, Default currency + Time zone Selects side by side), Back / Continue. Step, Title, Description; Show progress, Show actions |
| Forms | `Block / Invite Team Step` | - | Onboarding family, 672. Step + Progress 75, Title, Description, Invite Row (exposed), Invited title + People (native slot: 3 Access Rows, owner and pending), Separator, Link title, Copy Field (exposed), Link note, Skip for now / Continue. Step, Title, Description, Invited title, Link title, Link note; Show progress, Show invited, Show invite link, Show actions |
| Forms | `Block / Plan Select Step` | - | Onboarding family, 672. Step + Progress 100, Title, Description, billing (segmented Toggle Group Monthly / Yearly exposed + soft-success Badge "Save 20% with yearly"), Plans (native slot: 3 compact Plan Cards, €9 / €19 / €29 per user / month with old prices; Pro has the primary button and a primary border), 3 Check Items + Trial note, Back / Skip, stay on Free. Step, Title, Description, Trial note; Show progress, Show billing, Show trial note, Show actions |
| App | `Block / Inbox` | - | Title, Subject, Contact, Show filters, Show composer, Conversations (native slot), Messages (native slot); Search Field and Chat Composer exposed. 1136x720 card: list pane 360 (title with soft-info "3 unread" Badge, compose Button Icon, Search Field, segmented Toggle Group Open / Assigned to me / Closed, 8 List Items with photo Avatar, subject, time and Badge Count, first selected) and the open conversation (photo, subject, contact line, soft-warning "Waiting on us" Badge, archive / snooze / more, "Today" separator, 5 Chat Messages, Chat Composer) |
| App | `Block / Team Chat` | - | Channel, Topic, Show channels, Show thread, Messages (native slot), Replies (native slot); Chat Composer and Search Field exposed. 1136x720: channels pane 240 on sidebar/background (workspace, Search Field ⌘K, Channels and Direct messages as Sidebar Items with Badge Counts, design active, finance private with lock), channel header (name, topic, photo Avatar Group "12", search / pin / more), 4 messages as Comments with photos, Reaction Bar (👍 4 reacted, 🎉 2; 👀 1) and Thread Summary, Chat Composer "Message #design"; thread panel 320 (parent message, "3 replies" separator, 3 reply Comments, Reply composer) |
| App | `Block / Support Chat Widget` | View: home, chat | Show launcher, Greeting, Agent, Agent status; Search Field and Chat Composer exposed. 400 wide panel (radius/xl, shadow/xl) above a lg Launcher Button Icon (shadow/lg). home: primary header with team photos, close, display greeting and reply time; Recent message card (List Item, Send us a message Button), help card (Search Field, 3 article List Items with chevrons). chat: primary header (back, agent photo, name, status, close), Chat Messages Size=compact, suggested article card, Chat Composer |
| App | `Block / Activity Feed` | - | Title, Description, Show filters, Show load more, Events (native slot); Export Button and Load More exposed. 768 card: header with Export, Chips (All selected, Comments, Changes, Payments, Files) and a "Last 7 days" Select, Timeline Items grouped under Today / Yesterday (comment with a Comment in Content, 2 Change Items, payment success, overdue warning, attachment, member joined), Load More "Showing 6 of 48 events" |
| App | `Block / Invoice Detail` | - | Invoice number, Show toolbar, Show payment details, Lines (native slot); Logo, Status Badge, Amount due Summary Row and toolbar Buttons exposed. 960: Back Link "All invoices", Download PDF, Print, Send invoice; paper (background/card, radius/xl, padding 48, shadow/sm): Logo full, soft-info "Sent" Badge, Invoice heading, INV-1047, From / Bill to parties, Details as Summary Rows (issued, due, reference, terms), Table Cells header + 3 lines (description, qty, unit price, amount), payment details on card/muted-background, Summary Rows Subtotal €4,600.00, VAT (19%) €874.00, Paid €0.00, total Amount due €5,474.00, legal footer |
| App | `Block / Plan Checkout` | - | Title, Description, Renewal note, Show payment, Show payment methods; Price, Total, Pay Button and Seats Field exposed. 1136: title and description, billing period Option Cards radio (Monthly €29, Yearly €24 selected), Seats Field with Number Input 12 and hint, Payment (Field Presets card-number, card-expiry, card-cvc, country; Checkbox save card); summary card 400 (Business, yearly + soft-success "Save 17%", Price €24 per user / month, 3 Check Items, Summary Rows 12 seats × €288.00 €3,456.00, credit −€48.00 discount, VAT €647.52, total €4,055.52, lg Button "Pay €4,055.52" with lock, renewal note, 4 Payment Method Marks) |
| App | `Block / Plan and Usage` | - | Plan, Plan details, Period, Show upgrade, Meters (native slot); Price, Status Badge, Alert and Plan Card exposed. 960: current plan card (overline, Business + soft-success Active, billing line, Price lg €24, Change seats, Switch to monthly, ghost Cancel plan), usage card with 4 Usage Meters in 2 columns (Seats 11 of 12 near, Projects 48 of 50 near, Storage 42 of 100 GB, API calls 104K of 100K over; bars match the numbers), upgrade row (Alert warning Style=accent, title, text, link Button "Compare all plans", Plan Card featured Enterprise 400 with "Custom" price, Talk to sales and 4 Check Items) |
| App | `Block / Workspace Settings` | - | Show danger zone, Sections (native slot); Danger Zone exposed. 960: Form Sections side: Workspace (name, square logo Avatar Upload, URL Input Group "app.orbitly.io/" + hint; copied from Settings Page with Tabs), Workspace ID (Field + Copy Field), Language and region (4 Selects), then Block / Danger Zone (Transfer ownership, Delete workspace) |
| App | `Block / Appearance Settings` | - | Sections (native slot). 960: Form Sections side: Theme (Option Cards radio with sun, moon, monitor icons; System selected), Density (segmented Toggle Group Comfortable / Compact), Language and format (Fields with Selects: English (UK), 26/10/2026, 1.234,56, Monday), Accessibility (3 Switches with descriptions) |
| App | `Block / Invite Members Dialog` | - | Dialog and Dialog Header exposed. 1440x900: Page Shell / App (Team active, Home > Settings > Members) with Settings Page with Tabs on Members (Block / Team Members) behind dialog/overlay; Dialog 560 "Invite people to Acme": Invite Row (2 emails, Editor, Invite), Usage Meter near "11 of 12 after these invites", Pending invites (2 Access Rows Type=pending), Separator, Invite link Copy Field; Reset link, Cancel, Send 2 invites |
| App | `Block / Finance Dashboard` | - | 1136 wide, no fill, gap spacing/6. Metric Strip (cash balance €134,000, open receivables €412,600, overdue €70,140 / 141 invoices, days sales outstanding 38 days, Trend Indicators with positive tone for falling overdue and DSO); Chart Card "Cash flow, October" with Waterfall Chart (opening €120K + €128K in − €114K out = €134K) and a period Select; Chart Card "Invoices" with two Distribution Bars (by status: Paid, Pending, Overdue, Draft; open receivables by age: Not due, Due this month, 1 to 30 days late, 30+ days late); Card "Largest overdue invoices" with Send all reminders, table of Table Cells (Stack customer + invoice, Date, soft Badge days overdue, muted reminders text, Amount, Remind Button) and a View all link in the Card Footer |
| App | `Block / Support Dashboard` | - | 1136 wide, no fill, gap spacing/6. Four Stat Cards (open tickets 248, first response 1h 42m, solved 612, satisfaction 83%) with trend lines and footnotes; Chart Card "First response SLA" with Gauge (91% against an 80% target, arc overridden) and Urgent / High / Normal rows with soft Badges; Chart Card "New tickets by hour" with Heatmap and a channel Select; Chart Card "Customer satisfaction" with a ratings Distribution Bar and the CSAT Rating (answered) customers see; Card "Breaching SLA soon" with a table (ticket Stack, priority Badge, assignee Table Cell User with photo, SLA Badge) and Open the queue link |
| App | `Block / Grouped Table` | - | Show header, Show total; Page Header exposed (Title, Description, Actions: Group by Select, Export). 1136, background/default. Table of Table Cells: header row (Due sorted), three Table Group Rows in Table Cell Type=expanded (Overdue 3 · €5,620.00, Due this week 4 · €12,480.00, Paid 12 · €38,940.00 State=collapsed), 7 body rows (invoice number, customer Stack, owner Table Cell User with photo, issued and due Dates, soft Badge with days, Table Cell Amount), total row €57,040.00 |
| App | `Block / People Directory` | - | Show toolbar, Show index; Page Header exposed (People, 86 people in 9 teams, Export, Invite people). 1136, background/default. Toolbar: Search Field, team and office Selects, Cards / List segmented Toggle Group; groups A, B, C with letter, count and rule; Person Cards Layout=horizontal (346 wide, 3 per row, photo Avatar, name, role, team · office, email and local time Meta Items, Message and View profile Buttons); A to Z index on the right |
| App | `Block / File Manager` | - | Show tree, Show folders, Show dropzone; Breadcrumb exposed. 1136, background/default. Left: bordered panel with Tree Items (folders with counts, selected Invoices 2026, Shared with me, Recent, Trash) and a Storage Usage Meter. Right: Breadcrumb, title and counts, Search Field, list / grid segmented Toggle Group, New folder and Upload Buttons, four folder Cards (outline, sm, Card Header with folder icon and more Button Icon), Files Card (sort Select, uploading File Item, six Resource Items with download, share and more) and a File Dropzone |
| App | `Block / Empty States Set` | - | Show labels, Show in context. 1136, background/default. Row 1 in bordered panels: No results (Media=icon, search), No access (Media=icon, lock, Request access), First use (Media=image with `Image / Screenshot / Invoices`, Create invoice + Import CSV). Row 2: Empty State Size=sm under table column headers, and inside a Card (Recent activity, no actions) |
| App | `Block / Scheduler Day` | - | Show toolbar. 1136, background/default. Toolbar from Scheduler Week (Today, previous / next, "Monday, 26 October 2026", Day selected, New booking); resource header with photo Avatar, name and bookings count for 5 people; hours 08:00 to 18:00 at 48 px per hour; Calendar Events by start and length (Size=sm for 30 minutes, Series 1-4 per booking type); out-of-office block on section/muted-background; now line across all columns |
| Sections (blocks) | `Block / Testimonial Wall` | - | Testimonials family, muted band. Section Header (exposed), Show rating summary (Rating 4.8 from 1,240 reviews); Highlight (slot: `Testimonial Card` featured with photo + logo, and a minimal pull quote), Show highlight; Column 1, Column 2, Column 3 (slots: 7 `Testimonial Card`s, default with rating and logo, staggered masonry); Show action (exposed outline Button) |
| Sections (blocks) | `Block / Testimonial Video` | - | Testimonials family. Video Thumbnail 640 x 360 (exposed, shadow/lg, `Image / Office / 07` poster); Logo Tile plain (exposed, Show logo); Quote default with avatar (exposed); Figures (slot: 3 `Figure` with divider), Show figures; Show action (exposed link Button) |
| Sections (blocks) | `Block / Stats with Image` | - | Stats family. Image Placeholder 3:4 (exposed, `Image / Office / 08`), Show image; Eyebrow, Title, Description, Note, Show eyebrow, Show note; Figures (slot: 4 `Figure` lg with divider and source, 2 per row) |
| Sections (blocks) | `Block / Team Cards Social` | - | Team family. Section Header (exposed); Cards (slot: 4 `Person Card` Layout=photo, 270 wide, Actions slot with ghost sm Button Icons: `Icon/brand/linkedin`, `x`, `github`, `Icon/mail`); Hiring text, Show hiring (exposed link Button) |
| Sections (blocks) | `Block / FAQ with Categories` | - | FAQ family. Section Header (exposed); Table of Contents (exposed, 6 topics, first active); Help title, Help text, Show help card (muted card, exposed outline Button); Category title + soft count Badge; `Accordion` Style=card (exposed) with 5 `Accordion Item` Style=card, first expanded |
| Sections (blocks) | `Block / Book a Demo` | - | Contact family, muted band. Eyebrow, Title, Description, Logos caption, Show eyebrow, Show testimonial, Show logos; Benefits (slot: 4 Check Items); Testimonial Card logo (exposed); Logos (slot: 6 `Logo Tile` plain); Card (exposed, elevated, shadow/lg) with Card Header and a form: Field + Input, `Field Preset` email and country, Select, Textarea, Checkbox, lg Button, reply note |
| Sections (blocks) | `Block / Timeline Section` | - | About family. Section Header (exposed); Milestones (slot: 5 columns, each a year `Badge` pill (soft-neutral, default for the current year) on a `Separator` rail and a `Timeline Item` Layout=card, connector off, icon and Tone) |
| Sections (blocks) | `Block / Case Study Grid` | - | Case studies family (new). Section Header (exposed); Show filters (6 industry Chips, first selected); Stories (slot: 6 items, 3 per row: `Post Card` vertical with photo, industry Badge, title, excerpt, read time, author off + result row with top border: `Figure` and `Logo Tile` plain); Show action (exposed outline Button) |
| Sections (blocks) | `Block / Case Study Header` | - | Case studies family (new). Back Link (exposed, Show back link); Logo Tile plain (exposed); Title, Description; Show actions (exposed default + outline Buttons); Facts (slot: 5 caption + `Meta Item` pairs on a muted card), Show facts; Results (slot: 3 `Figure` lg above a top border); Image Placeholder 21:9 (exposed, Show image) |
| Commerce (blocks) | `Block / Product List Simple` | - | Listing family, 1440, padding 96. Show header, Show action, Show load more; Section Header left (exposed: "New this week", "New arrivals"), Shop all products link (exposed); Products (native slot, wraps: 8 Product Cards Layout=vertical, 270 wide, 4 per row, Show rating on, two sale and one sold-out, `Image / Product / 01-07`); Load More "Showing 8 of 48 products" |
| Commerce (blocks) | `Block / Product Detail Image Grid` | - | Product family, 1440. Name, Description, Option 1 label, Option 2 label, Option 3 label, Delivery note; Show breadcrumb, Show badge, Show option 3, Show incentives, Show details. Breadcrumb, Gallery (native slot: 2 x 2 Image Placeholders 3:4, 348 wide), buy box (sticky in code): soft-info Badge pill (exposed), h2 name, Rating with review count, Price (exposed), color Swatches, case size and band label Swatches (one unavailable), Number Input, Add to cart lg (exposed) + wishlist Button Icon, In stock Badge with dot, Incentives (3 Trust Badges), Accordion (Details expanded, Size and fit, Delivery and returns) |
| Commerce (blocks) | `Block / Product Specs` | - | Product family, 1440, on `section/muted-background`. Note, Show note, Show figures; Section Header left (exposed), Specs (native slot: 8 Description List Items horizontal with units), Figures (native slot, wraps: 4 Image Figures with 1:1 images and captions) |
| Commerce (blocks) | `Block / Checkout Multi-step` | - | Checkout family, 1440. Title, Subtitle ("Step 2 of 4..."), Note, Show back. Stepper horizontal (exposed: Cart completed, Delivery current, Payment, Review), Step (native slot: Contact with Field Preset email and Sign in link, Block / Address retitled Delivery address, delivery method radio Option Cards), Back to cart ghost + Continue to payment lg (exposed); Block / Order Summary (pay button hidden) + note |
| Commerce (blocks) | `Block / Order Detail` | - | Account family, 1440. Title, Meta, Billing, Return text; Show breadcrumb, Show actions, Show tracker, Show return. Breadcrumb, order number h1 + status Badge soft-info pill (exposed), Download invoice + Buy again (exposed), Shipment Tracker (exposed), Items card: Items (native slot: 3 Line Items summary with product photos), Summary Rows (subtotal, discount, delivery, VAT included, Total paid); Address Card, Payment Method Card, billing address, return card on `card/muted-background` with Start a return (exposed) and Contact support link |
| Commerce (blocks) | `Block / Write a Review` | - | Reviews family, 1440. Title, Description, Product name, Product meta; Show summary, Show guidelines, Show fit, Show photos, Show highlights. Product card (photo, name, variant, delivery date), Rating Summary, guidelines; form card: Rating Size=lg (4 of 5, "Good"), fit Toggle Group segmented, Title Field + Input, Review Field + Textarea with length hint, photos File Dropzone + 2 thumbnails, highlight Chips (2 selected), Display name Field, consent Checkbox, Submit review (exposed) + Cancel |
| AI | `Block / AI Document Review` | - | Assistant family, 960. Title, Meta; Show badge, Show share, Show review bar, Show notice. Header with soft-info Badge "3 AI suggestions" (exposed) and Share; Rich Text Editor (exposed; Content: clauses as h4 + paragraphs with 3 AI Suggestions, suggested and accepted); AI Review Bar "1 of 3 suggestions" with shadow/lg; AI Notice disclaimer |
| AI | `Block / AI Generate` | - | Generate family (new), 960. Title, Description, Results title, Result count; Show options, Show earlier. Prompt Input State=focus with the prompt and a Model Picker in Tools (exposed); options: Output Toggle Group segmented (Images, Documents, Charts), Aspect ratio, Variations and Style Selects in Fields; results header with AI Notice label and Regenerate; Results (native slot, wraps: 3 Image Placeholders 16:9 with `Image / Abstract / *` + AI Loading for the running one); Earlier (native slot: 3 Artifact Cards document, chart, table) |
| AI | `Block / AI Settings` | - | Settings family (new), 960. Title, Description; Show data controls, Show memory, Show notice. Three cards of Setting Rows: Model defaults (Model Picker, answer length Select, Show reasoning Switch), Data controls (workspace content on, training opt-in off, chat history Select), Memory (remember preferences, Manage, Clear memory destructive); AI Notice disclaimer |
| Enterprise | `Block / Org Chart` | - | Show toolbar, Chart (native slot); Page Header exposed (Title, Description, Actions: Export, Add position). 1200: canvas on card/muted-background (border, card radius, padding 24) with a toolbar row (hint text, zoom group Button Icons minus / plus with "100%") and a tree of Org Chart Nodes joined by 1 px border/default connectors: CEO Sarah Lindqvist, three reports (CFO, CTO Ana Popescu State=selected, VP Sales), under the CTO an Engineering Manager and a State=vacant "Open role" (Role Head of Platform, Hiring status Hiring). Photo Avatars |
| Enterprise | `Block / Approval Inbox` | - | Show filters, Requests (native slot), Detail (native slot); Page Header exposed (Delegate while away, Export). 1200: split view card: list pane 384 (Search Field, segmented Toggle Group Waiting (12) / Approved / Rejected, 10 List Items with photo Avatar, requester and amount, age, soft-warning "Due tomorrow" and soft-destructive "Overdue" Badges, first selected, Show 2 more) and the detail pane with the header, Details card and Approval chain card (Approval Steps) taken from Block / Approval Request (Reject, Approve) |
| Enterprise | `Block / Workflow Builder` | - | Show rules, Show side panel, Canvas (native slot); Page Header (soft-success Active Badge, Test run, Publish) and Side Panel exposed. 1200: canvas on card/muted-background with toolbar (draft hint, zoom group) and Workflow Nodes: trigger Invoice received, condition "Amount over €5,000?" with Yes (soft-info) / No (soft-neutral) branches to Ask for approval (State=selected) and Approve automatically, merged into Post to #finance (State=error, fix in detail), add step Button Icon; "Rules in this workflow" with 2 Automation Rules (on, off); Side Panel 320 "Ask for approval" with 3 Fields + Selects (Approver, Due within, If nobody responds with hint), Switch "Require a comment to reject", footer Delete step / Save |
| Enterprise | `Block / Version History` | - | Show comparison, Versions (native slot); Page Header (Download, Restore v11) and Diff Viewer exposed. 1200: versions card 400 (header with soft-neutral count, 5 Version Items: v12 current, v11 selected, v10 to v8 past, Show all 12 versions) and comparison (Comparing v11 with v12 Badges, Diff Viewer "Master services agreement.docx" +3 −2 with 9 Diff Lines of contract text) |
| Enterprise | `Block / User Directory` | - | Show active filters, Show selection bar, Show pagination, Rows (native slot); Page Header (Export, Invite users) and Data Grid Toolbar exposed. 1200: Data Grid Toolbar (All users, Search by name or email, Filters 2, Columns, Group: Role, Export), 2 filter Chips + Clear filters, table card: Table Toolbar "3 selected" (Change role, Reset two-factor, destructive Deactivate), header Table Cells (Checkbox indeterminate, sortable labels), 10 rows of Table Cells: Checkbox, Table Cell User (photo or initials), role, Table Cell Status with soft Badges Active / Invited / Suspended / Deactivated and short notes (2 days ago, Locked out, On 30 Sep), Sign-in Badge (Okta SSO soft-neutral, Password outline), two-factor Status Dot, Table Cell Date with time, Table Cell Actions; 3 rows selected; Table Pagination "Showing 1-10 of 148 users" |
| Editor | `Selection Toolbar` | - | Floating bar over selected text: Bold, Italic, Link (Toggles) and Separator (Show formatting), primary Comment Button with message-square (Show comment); popover surface, radius/lg, shadow/md |
| Editor | `Comment Highlight` | State: open, active, selected, resolved | Text. Highlighter tint on a commented run drawn as a text decoration (Underline, thickness 100%, offset -80%, skip ink off) in `comment/highlight`, `comment/highlight-active`, `comment/selection`; resolved has none. Apply the same recipe to runs inside the Rich Text Editor Content slot |
| Editor | `Comment Thread` | State: default, active, resolved | Quote (2 lines, ellipsis), Resolve and More icon buttons (Reopen when resolved), Comment exposed (Show comments), Replies (native slot of Comment Type=reply, Show replies), Comment Composer (Show reply), Resolved by. 320 wide, works 280 to 400; active border/ring + shadow/md |
| Editor | `Comments Panel` | Content: threads, empty | Title, Count (Badge Count exposed), Show filter, Show close, Filter tabs (Toggle Group segmented exposed: Open / Resolved), Threads (native slot of Comment Thread); empty: Empty State sm "No comments yet. Select text to comment.". 360 x 900, border-left |
| Content | `Block / Document with Comments` | - | Editor family. 1440 (works from 1136): header with Breadcrumb (Show breadcrumb), Page Header exposed (Q4 launch brief, edited by, Presence Bar with photos, comment count Button "3", Share); Rich Text Editor exposed (max 800, Content: Owner / Reviewers Mention Chips, 5 h4 sections, 7 paragraphs and a list; 3 runs with Comment Highlight decoration, one active, one selected run) with a Selection Toolbar exposed over the selected run (Show selection toolbar); Comments Panel exposed (Show panel) with 3 Comment Threads from Sofia Barbu, Radu Marin (active, anchored next to its highlight, composer) and Mara Ionescu (2 replies, one mentioning @Elena Marin), Open 3 / Resolved 1 |
| Toolbar | `Toolbar` | Orientation: horizontal, vertical. Style: default, floating | Items (native slot: Toggle sm, Button Icon ghost sm, Button ghost sm, Select sm, Separators between groups), Show overflow (ellipsis Button Icon). default has no surface (inside editor, card and panel headers); floating is a popover surface over canvases and media. Used by Rich Text Editor and the Org Chart and Workflow Builder zoom groups |
| Toggle Group | `Toggle` | Variant: default, outline. Size: default 36, sm 32, lg 40. State: default, hover, pressed, focus, disabled | Label, Show label (off), Show icon (on) + Icon (swap, bold). One on/off button: bold, pin, mute, captions, favorite; icon-only is square |
| Button | `Copy Button` | Variant: ghost, outline. Size: default 36, sm 32, xs 28. State: default, copied | Nested Button Icon with copy icon; copied shows a check in background/success for 2 s. Code blocks, IDs and keys in tables and Description Lists |
| Table | `Bulk Action Bar` | - | Selection ("3 selected"), Show select all (link Button exposed, "Select all 48"), Actions (native slot: outline sm Buttons; Button Icons on phones), Show clear. Floating bottom bar for selection in grids, boards, galleries and inboxes |
| Chip | `Chip Group` | Layout: wrap, scroll | Chips (native slot) of Chips; Show more + "+N more" Chip (exposed). Single or multi select filters and scopes; fills its container, min 160 |
| Tooltip | `Info Tip` | Side: bottom, top | Title, Show title, Text, Link, Show link. 280 wide popover (background/popover, border, shadow/md, arrow) opened by click on an `Info Tip Trigger` |
| Tooltip | `Info Tip Trigger` | State: default, hover, focus, open | 20 px info icon button that opens an Info Tip; used by Field Show info |
| Input | `Field Counter` | Status: default, near, over | Count ("42 / 160"). Exposed in Field (Show counter) |
| Illustrations | `Spot Illustration` | Type: search, inbox, files, lock, success, error, upload, connection, calendar, chart, cart, team | 120 x 120 line drawings: background/muted disc, foreground/default 2 px lines, background/default surfaces, one background/primary accent. Every layer scales: resize to 80 (cards, panels) or 160. Decorative. New page Illustrations after Imagery |
| Alert | `Inline Message` | Type: default, info, success, warning, error, loading | Text. Icon and one line of status text, no box ("Saved 2 minutes ago", "Saving…"). Hugs up to 480, 2 lines then ellipsis; FILL in narrow columns. Status colors badge/soft-*-fg |
| Card | `Callout Card` | Layout: horizontal (560, min 320), stacked (280, min 220) | Title, Description, Show media, Show actions, Show close; Media (Icon Tile brand by default, or a Spot Illustration), Actions (native slots). Upgrade, tip and announcement card |
| Popover | `Popover Header` | - | Title, Description, Show description (off), Show close. First in the Popover Content slot; FILL, min 160 |
| Popover | `Popover Footer` | - | Show start (off); Start (Reset ghost sm), Actions (Cancel outline sm, Apply default sm) native slots. Last in the Popover Content slot; FILL, min 240 |
| Accordion | `Collapsible` | State: collapsed, expanded | Content (native slot, hidden but kept when collapsed). Trigger is an exposed Button link sm with a chevron: edit its Label ("Show advanced settings"). 400, FILL |
| Skeleton | `Skeleton Preset` | Type: list-row, card, table-row, stat, chart | Built from Skeleton shapes; each FILLs its column (min 240, 220, 480, 160, 320) |
| Dialog | `Scrim` | Tone: dialog, media, light | dialog/overlay, media/scrim, background/default at opacity/80. First layer of the frame it covers, stretched. Used by the App overlay blocks and Hero Full-bleed Image |
| Calendar | `Date Time Picker` | - | Calendar (exposed), Times (native slot of Time Slots in a scrolling column), Summary, Show footer (Cancel / Apply). Date and time in one popover (373); the trigger is a Date Picker showing "22 Oct 2026, 14:30" |
| Calendar | `Month Picker` | Type: month, quarter, year | Period ("2026"), Decade ("2020 to 2031"). Grid of Month Picker Cells (State: default, hover, focus, current, selected, disabled; Label) for report periods, statements and expiry; 250 wide, cells fill |
| Popover | `Mention Menu` | - | Header, Show header, Items (native slot of Mention Options: Type person, item; State default, highlighted; Match, Name, Description, Show description, Icon). The @ suggestion list, 280 wide, typed part in foreground/brand |
| Color Picker | `Color Input` | State: default, focus, error, disabled | Value ("#2563EB"), Opacity, Show opacity. Field with a color swatch (override its fill) and hex that opens Color Picker; 240, min 180 |
| Navigation | `App Header` | - | Logo (swap), Links (native slot of Nav Links, current page active), Show search (Search Field exposed, 256), Actions (native slot: bell, Avatar). 64 high, bottom border. Top navigation for apps without a sidebar (portals, simple admin, commerce admin) and Page Shell / App Layout=stacked; min width 768 |
| List | `List Group Header` | Variant: default, muted | Label, Show count (Badge Count exposed), Show action (link Button sm exposed). A label over a group of List Items (Today, Yesterday, A, B); muted is the sticky style for long lists |
| Progress | `Top Loading Bar` | Value: indeterminate, 30, 60, 90 | Show track. 2 px background/primary bar along the top of the page or a region while a route or region loads; FILL, indicator scales |
| Search | `Search Suggestions` | - | Recent, Suggestions, Records (native slots of Search Suggestion Items) with Recent label, Suggestions label, Records label and Show recent, Show suggestions, Show records; Hint + Show footer. Popover panel under a search field, min 280 |
| Search | `Search Suggestion Item` | Type: suggestion, recent, record. State: default, highlighted | suggestion: Match (typed part, ui/label) + Completion; recent: Query + remove x (exposed); record: Icon (swap), Title, Meta |
| Page Shells | `Page Shell / App` | Layout: sidebar, stacked | Page (native slot). sidebar: Sidebar and Top Bar exposed; stacked: App Header exposed. Hugs its content with a min height of 900: put a taller page in the Page slot, never resize the shell |
| Chart | `Radial Chart` | Type: single, concentric | Value, Label, Show label. Progress to a goal as one ring (chart/1) or three concentric rings (chart/1-3) on background/muted tracks, value in the middle; set each value arc per instance (Sweep = share x 360). Fixed 200 square |
| Chart | `Box Plot` | - | Show outliers. 5 groups: quartile box (badge/category-1-bg, chart/1 border), median 2 px, whiskers and caps, open outlier dots; y axis with unit, x group labels. Marks scale with the width, min 320 |
| File Upload | `File Type Icon` | Type: pdf, document, sheet, slides, image, video, audio, archive, code, generic. Size: default 40, sm 32 | Tile in the Badge category tint with the extension (PDF, DOC, XLS, PPT, JPG, MP4, MP3, ZIP, </>) in category-N-fg; generic shows a file icon. Edit the extension text per instance |
| Prose | `Prose` | Size: default, sm, lg | Content (native slot) with Prose parts in reading order: Prose Heading, Prose Paragraph, Prose List Item, Prose Blockquote, Code Block, Image Figure, Separator. Fill up to 672 (sm 576, lg 768), min 280. New page Prose (COMPONENTS, before Quote) |
| Prose | `Prose Heading` | Level: h2, h3, h4. Size: default, sm, lg | Text. Space above per level. Only inside Prose |
| Prose | `Prose Paragraph` | Size: default, sm, lg | Text. Links, inline code and marks are styled runs |
| Prose | `Prose List Item` | Type: bullet, number. Size: default, sm, lg | Text, Number (number type) |
| Prose | `Prose Blockquote` | Size: default, sm, lg | Text, Cite, Show cite. Left rule border/default |
| Prose | `Highlight` | Tone: default, ai | Text. Marked run drawn with the Comment Highlight recipe in `highlight/mark` (search matches) or `highlight/ai` (AI changes); apply the same recipe to runs in any text |
| Code Block | `Inline Code` | - | Code. Code style on background/muted, radius sm; hugs up to 320, 1 line with ellipsis |
| Code Block | `Code Highlight` | Line: 1-8 | The highlighted line band (code/line-highlight) of a Code Block; only inside Code Block (exposed as highlight) |
| Content | `Block / Article`, `Block / Legal Page` | - | Body now built on a Prose instance (Size default): Prose Headings, Paragraphs, List Items, plus Quote, Code Block and Alert in its Content slot |
| Image | `Thumbnail` | Size: default 48, xs 24, sm 32, lg 64, xl 80. Ratio: 1:1, 4:3 | Show image + Image (swap: Image / *), Icon (fallback swap, shown on background/muted when Show image is off). 1 px border over the image. Products, files and listings in rows and tables; people use Avatar |
| Table | `Table Cell Media` | - | Title, Meta, Show meta; Thumbnail (exposed, sm). Product, file or listing cell; min 160, title and meta truncate |
| Table | `Table Cell Tree` | Level: 0, 1, 2, 3. Expander: collapsed, expanded, none | Label, Show icon + Icon (swap, folder). First-column content of tree rows, indent 24 per level; min 120 to 192 |
| Table | `Column Settings` | - | Items (native slot of Column Settings Item), Show search, Show footer; Popover Header, Search Field, Popover Footer exposed. Opens from Columns in Data Grid Toolbar; 288, min 240 |
| Table | `Column Settings Item` | State: default, hover, dragging, locked | Label; Checkbox exposed; grip handle; locked shows a lock and a disabled checkbox |
| Chat | `Conversation Item` | State: default, hover, selected | Name, Message, Time, Show unread (Badge Count exposed), Show pinned, Show muted (bell-off); Avatar exposed. Inbox and chat lists; 360, min 240 |

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
moon, folder, send, receipt, reply, user-plus, palette, languages, hash, printer,
database, bookmark, headphones, podcast, bot, bell-off.

## Screens
The SCREENS group (after BLOCKS) holds complete screens and templates to copy whole: pages Account,
Auth, Documents, Emails, Settings. Each flow is a Figma section with `Screen / <Flow> / <Step> / Desktop` and `/ Mobile` frames
left to right in flow order (emails: `Screen / Email / <Name>`).

| Page | Flow | Screens | Built from |
|---|---|---|---|
| Account | My profile | Account menu, View, Edit, Validation errors, Saved (Desktop); View, Edit (Mobile) | Page Shell / App, Settings Page with Tabs relabeled as account tabs (Profile, Public profile, Activity, Connected accounts, Privacy and data), Account Menu, Cards with Avatar, Badges, Description List Items, Timeline Items; Block / Profile, Error Summary, Field error states, Toast; Page Shell / Mobile with Bottom Nav |
| Account | Public profile | Preview | Account tabs, Alert info, Block / Header Profile, Featured work Card with Image / Abstract, Screenshot, Office |
| Account | Notifications | Inbox (Desktop, Mobile), All caught up | Page Header, line Tabs with counts, Notification Items grouped by day in Cards (Reply, Approve / Review actions), Empty State; mobile Bottom Nav Inbox active |
| Account | Activity history | History | Account tabs, search Input + Selects + Export CSV, Timeline Items with Change Items, Load More |
| Account | Connected accounts | Accounts and devices | Account tabs, Cards of Setting Rows (sign-in methods, connected apps), Session Rows, Sign out of all other sessions |
| Account | Delete account | Danger zone, Confirm | Account tabs, Your data card (Export data, profile visibility Switch), Block / Danger Zone (Leave workspace, Delete account), Alert Dialog destructive with typed DELETE and password |
| Auth | Sign in | Default (Google + SSO buttons), Error: wrong password, SSO; each Desktop + Mobile, Light and Dark side by side | `Block / Sign In Split` (Form slot: `Block / Sign In`), `Page Shell / Mobile` + `Block / Sign In`, Alert destructive, `Logo / Orbitly` |
| Auth | Sign up | Default, Validation errors (email, password, Requirement List), Verify email (6-digit code) | `Block / Sign Up Split` (Form slot: Sign Up, then Two-Factor retitled), Requirement List, Password Strength, Input OTP, `Page Shell / Mobile` |
| Auth | Magic link | Request, Check your email | `Page Shell / Auth` + Forgot Password and Check Email (retitled), `Page Shell / Mobile` |
| Auth | Password reset | Forgot password, Check email, Set new password (Requirement List), Password updated | `Page Shell / Auth` + Forgot Password, Check Email, Reset Password, Check Email (success icon), `Page Shell / Mobile` |
| Auth | Two-factor | Authenticator code, Recovery code | `Page Shell / Auth` + Two-Factor (Input OTP; Field for the recovery code), `Page Shell / Mobile` |
| Auth | Accept invite | Accept invite (email fixed from the invite), Invite expired | `Page Shell / Auth` + Accept Invite, Check Email (clock icon), `Page Shell / Mobile` |
| Auth | Onboarding | Welcome: role and team size, Workspace (logo, name, URL, currency), Invite team (rows + invite link), Plan: start trial, Done | `Page Shell / Wizard` + `Block / Welcome Role Select`, Avatar Upload, Field + Input Group, Select, Input, Copy Field, Plan Card, Icon Tile, Check Item; mobile on `Page Shell / Mobile` with Progress and Option Cards |
| Documents | Commenting | Reading, Text selected, Writing a comment, Comment posted and replied (+ Dark), Resolved (Desktop); Text selected, Comment posted and replied (Mobile) | Page Shell / App (Orbitly sidebar, Documents active, breadcrumb Documents > Q4 launch brief) with Block / Document with Comments (Show breadcrumb off), Selection Toolbar, Comment Highlight states on runs, new Comment Thread active with Show comments off and a focused Textarea, Toast info "Ana Popescu replied to your comment" (View), Toast success "Thread resolved" (Undo), resolved Comment Threads under the Resolved filter; mobile: Page Shell / Mobile (no bottom nav) with Mobile Header comment count Button, Selection Toolbar over the selection, dialog/overlay + Drawer (Comments header, Open / Resolved Toggle Group, Comment Thread, Comment Composer footer) |
| Emails | Account | `Screen / Email / Welcome` (+ `/ Dark`), `Verify email`, `Sign-in link`, `Password reset` (+ `/ Dark`), `Password changed`, `Invitation` | Email / Header (Logo / Orbitly), Hero (image on Welcome), Content, Button, Code (Verify), Details (sign-in request, password change, invite), Callout (default, warning), Footer (security: no social, no unsubscribe) |
| Emails | Billing | `Screen / Email / Invoice`, `Payment receipt`, `Payment failed`, `Trial ending` | Email / Header, Hero, Details, Line Items (Line Item, Total Row), Callout warning (Payment failed), Stats (Trial ending), Content, Button, Footer |
| Emails | Marketing | `Screen / Email / Weekly summary` | Email / Header (View in browser on), Hero with eyebrow, Stats (3 Stat), Button, Divider, Hero with image (h3 title, feature), Content link, 3 Article, Footer with unsubscribe |
| Emails | Commerce | `Screen / Email / Order confirmation` | Email / Header (Logo / Tidewater), Hero, Details (order, delivery), Line Items with product photos (`Image / Product / 01, 03, 07`), Button, Content, Footer (Tidewater address) |
| Settings | General | Unsaved changes (Desktop, Mobile), Saved (Desktop, plus Dark and Corporate Light) | Page Shell / App (Orbitly sidebar), Block / Settings Page with Tabs, Block / Danger Zone, Save Bar, Toast success; mobile: Page Shell / Mobile detail, Form Section stacked, sticky Discard / Save changes bar |
| Settings | Members | Team, Invite (dialog) | Settings Page with Tabs, Block / Team Members, Roles card (Setting Rows + Badge), Dialog with Textarea emails, Role Select, Usage Meter near |
| Settings | Notifications | Preferences (Desktop with toast, Mobile) | Settings Page with Tabs, Block / Notification Preferences, Alert info (security emails always on), Toast; mobile Setting Rows with Switches grouped by topic |
| Settings | Security | Overview, Change password (dialog) | Settings Page with Tabs, Password Card, Block / Security (two-factor, sign-in alerts, SSO URL, sessions), Dialog with Password Strength |
| Settings | Billing | Plan and invoices | Settings Page with Tabs, Block / Billing (plan, usage meters, payment method, billing email, invoices) |
| Settings | API keys | Keys, Key created (shown once) | Settings Page with Tabs, Block / API Keys, Alert info; Dialog with Alert warning and Copy Field State=copied |
| Settings | Integrations | Directory | Settings Page with Tabs, Block / Integrations |
| Settings | Appearance | Theme and density | Settings Page with Tabs, Form Sections with Option Cards radio (Light, Dark, System; Comfortable, Compact), Language and Date format Selects, Toast (saves on change) |

Every template: 720 wide frame on `section/muted-background` (padding 40 top and bottom) holding a 600 wide "Email"
column: Header, a "Body" frame (`background/card`, radius/lg, padding 40 top and bottom, gap 24) with the parts, Footer.
Explicit modes Semantic and Components Light (Dark on the two Dark copies), Density Comfortable.

## Conventions used
- Variant values use the shadcn prop values (`Variant=outline`, `Size=sm`), so Figma maps 1:1 to code.
  The default variant is the default value (`Size=default`, `Tone=default`).
- Variant property names come from one list: Variant, Size, State, Type, Status, Layout, Level,
  Position, Side, Shape, Tone, Content, Ratio, Device, Provider, Step, Frequency, Method, Trend,
  Series, Key, Align, Mark, Marker, Control, Mode, Orientation, Value, Direction, Length, Spacing,
  Sort, Elevation, Media, Plans. Tab no longer uses `Style`: it is `Variant`, like Tabs.
  `Checked`, `Selected` and `Expanded` are variant properties only where a component has both a
  state axis and a selection axis (Checkbox `Checked` × State, Model Option `Selected` × State);
  otherwise selection is a State value.
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
`Imagery` (after Brand) holds the sample photos and product screenshots, with credits. `Brand` holds Logo Mark, Logo, Logo Tile, 12 fictional `Logo / *` marks for logo clouds and a
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
- Admin panel (`Page Shell / Admin Panel`, a grid): Navigation column hugs Sidebar or Sidebar
  Double, Header (Top Bar + Page Header), Body with Main (flex) and Aside (hugs a Side Panel),
  Actions bar fixed at the bottom; only the Body scrolls. Variants Aside on / off, Show actions.
- Mobile (< 768): Mobile Header + Page + Bottom Nav. The App Sidebar opens from the menu button
  as a left Sheet ("mobile menu open"); marketing pages use `Block / Navbar Mobile`. See
  `build-ui/patterns/mobile.md`.

## Pages
The file opens with Cover (1920 x 1080 thumbnail), Intro (getting started, credits, changelog),
Showcase (four full pages: SaaS in Showcase Light, enterprise in Corporate Light, AI product in
Showcase Dark, a store in Light), Foundations (tokens shown as swatches, type, spacing, radius,
elevation, motion, brand ramp and gradients), Brand and Imagery.
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
(enterprise) template, Trust Badge tones (Badge page), Check Item tones (Form Layout page).

Since 0.51.0 some former components are examples built from base components: "AI action",
"wishlist", "scroll to top" and "sign-in providers" (Button page), "theme switch", "view switch"
and "billing period" (Toggle Group page), "stock status" (Badge page), "welcome dialog" (Dialog
page) and "language switch" (Select page). Copy the example; there is no component to insert.

Full pages added in 0.58.0 (copy them whole): Hero showcase (all heroes) and Mobile landing page (390) on the Hero page; Pricing,
About, Contact, Case study, Careers and Blog index pages (Sections); AI search page (AI); Legal page (Content); SaaS metrics dashboard in Light and Dark,
Commerce admin, Team chat, Data table page and File manager (App); Storefront home, Category, Product, Cart and Order detail pages (Commerce); Agent run page (AI); User directory page in Corporate Light and Compact (Enterprise); and the
four showcase pages on Showcase (Orbitly SaaS, Meridian Enterprise, Lumora AI product, Tidewater
store and product page). Overlay blocks on App (Create Record Dialog, Delete Confirmation, Record
Preview Sheet, Command Palette, Upgrade Dialog) show the overlay over a dimmed app screen.

## Not built yet
Open gaps from the README roadmap: a Search Hero block, and examples in real screens for the 0.50.0 components
(their rows have generated stress tests). Icons: the 110 Lucide icons stay; the team may switch
to Phosphor (flatten each icon to one `Vector` layer so swaps keep their color). When something
is missing, compose from the components above, tokens and text styles, and flag it.
