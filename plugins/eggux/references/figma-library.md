# EGG UI v2: what exists in Figma

Inventory of the master library (`BufvaVkSh9vMWPye117Ucd`). Client files start as a duplicate,
so the same names exist there. Use instances of these; build something new only when nothing
fits, and say so. When this list and the file disagree, the file wins: update this list.

EGG UI is a generalist design system: complete enough for any product (SaaS, e-commerce, fintech,
booking, content, internal tools). Component names, descriptions and props stay domain-neutral;
example content varies across domains. Default texts in components and blocks use a neutral
product ("Acme": projects, customers, invoices); domain content lives in examples only.
Domain-specific needs become Field Presets or Blocks.

## Foundations
- Variables: `Primitives` (Value), `Semantic` (Light, Dark), `Components` (Light, Dark), `Density`
  (Comfortable, Compact). Chart palette `chart/1..8`, motion `motion/*`. See `tokens.md`.
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
| Button | `Button` | Variant: default, secondary, outline, ghost, destructive, link. Size: sm, default, lg. State: default, hover, focus, disabled | Label; Leading icon, Trailing icon (boolean + swap) |
| Button | `Button Icon` | Variant: default, secondary, outline, ghost, destructive. State: as Button | Icon (swap) |
| Button | `Button Group Item` | Position: first, middle, last. State: default, hover, focus, disabled | Label, Show label, Icon + Icon type |
| Button | `Button Group` | - | Items (native slot) |
| Button | `Split Button` | Variant: default, outline | Label; chevron opens a Menu |
| Badge | `Badge` | Variant: default, secondary, destructive, outline, success, warning, info. Shape: rounded, pill | Label; Icon (boolean + swap); Dot; Count + Count value |
| Badge | `Badge Count` | Variant: default, secondary, destructive, outline | Count (numeric bubble for nav items and icon buttons) |
| Badge | `Status Dot` | Status: success, warning, error, info, neutral | Label, Show label |
| Chip | `Chip` | State: default, hover, focus, selected, disabled | Label, Leading icon, Remove |
| Avatar | `Avatar` | Type: initials, image. Size: sm 24, default 32, lg 40, xl 48 | Initials, Status (online dot). Photo = image fill on the `image` layer |
| Avatar | `Avatar Group` | Size: sm, default, lg | Avatars (native slot), overlap with a 2 px background ring, "+N" as last avatar |
| Separator | `Separator` | Orientation: horizontal, vertical. Spacing: none, sm (4), md (8) | Use anywhere: menus, cards, toolbars, sidebars |
| Input | `Input` | State: default, focus, error, disabled. Content: placeholder, filled | Value; Leading icon (boolean + swap); Trailing (native slot) + Show trailing |
| Input | `Password Strength` | Strength: empty, weak, fair, good, strong | Meter + message under a new-password field |
| Input | `Field` | State: default, error, disabled | Label, Hint, Show hint, Error. Control (native slot, default Input) |
| Input | `Textarea` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Min height 64, grows with content; put it in a Field |
| Input | `Input Addon` | Position: start, end | Text |
| Input | `Input Group` | State: default, focus, error, disabled | Value, Show start, Show end; Start, End (native slots) |
| Input | `Number Input` | State: default, focus, error, disabled | Value; − / + steppers |
| Input OTP | `OTP Slot` | Position: first, middle, last. State: empty, filled, active, error | Digit |
| Input OTP | `Input OTP` | Length: 4, 6 | Groups of OTP Slots (3 + 3 with separator) |
| Kbd | `Kbd` | - | Key |
| Kbd | `Kbd Group` | - | Keys (native slot) |
| Spinner | `Spinner` | Size: sm 16, default 20, lg 32. Tone: muted, default | Loader icon; rotate in code |
| File Upload | `File Dropzone` | State: default, drag-over, error, disabled | Hint; Browse button exposed |
| File Upload | `File Item` | State: uploading, complete, error | File name; Progress, cancel/remove, Retry |
| Progress | `Progress` | Value: 0, 25, 50, 75, 100 | Resize the indicator for other values |
| Slider | `Slider` | Type: single, range. State: default, focus, disabled | Move range and thumbs for other values |
| Selection controls | `Checkbox` | Checked: false, true, indeterminate. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Radio` | Checked: false, true. State: default, focus, error, disabled | Label, Show label |
| Selection controls | `Switch` | Checked: false, true. State: default, focus, disabled | Label, Show label |
| Select | `Select` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Open state = Select (focus) + Menu with Checked on the selected item |
| Popover | `Combobox` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Searchable select trigger (chevrons-up-down); opens a Command |
| Popover | `Popover` | - | Content (native slot). 288 wide, popover tokens, shadow/md |
| Popover | `Command Input` | - | Value. Search field with bottom divider |
| Popover | `Command` | - | Command Input (exposed), Items (native slot), Empty, Show items. Base for Combobox and ⌘K |
| Popover | `Tag` | State: default, disabled | Label, Remove |
| Popover | `Tag Input` | State: default, focus, error, disabled | Tags (native slot), Chevron |
| Popover | `Hover Card` | - | Content (native slot), 320 wide |
| Popover | `Command Dialog` | - | Command Input (exposed), Items (native slot), footer with key hints. 560 wide |
| Calendar | `Calendar Day` | State: default, hover, focus, today, selected, outside, disabled, range-start, range-middle, range-end | Day |
| Calendar | `Calendar` | - | Month. Monday-first month grid, prev/next ghost Button Icons |
| Calendar | `Date Picker` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Calendar icon; opens Calendar in a popover |
| Calendar | `Time Picker` | State: default, focus, error, disabled. Content: placeholder, filled | Value. Clock icon; opens a Menu of times |
| Calendar | `Date Range Picker` | - | Presets (native slot), Summary, Show presets; two Calendars; Cancel / Apply |
| Chart | `Bar Chart` | Type: single, grouped, stacked | Bars ≤ 24, 4 px data-end radius, 2 px gaps; y axis, grid, x labels |
| Chart | `Line Chart` | Type: line, area | 2 px lines, end dots with surface ring, area at opacity/10 |
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
| Rating | `Rating` | Size: sm, default. Value: 0-5 | Show value, Show count, Count. Value text edited per instance |
| Carousel | `Carousel` | Type: single (720), multiple (1152) | Slides (native slot); previous / next outline Button Icons, dots |
| Color Picker | `Color Picker` | - | Saturation area, hue slider, hex Input Group with opacity; Swatches (native slot) |
| Kanban | `Kanban Card` | State: default, hover, dragging | Title, Due date, Show labels, Show meta; assignee exposed |
| Kanban | `Kanban Column` | - | Title, Cards (native slot); count exposed |
| Scheduler | `Calendar Event` | Size: default, compact. Category: 1-4 | Title, Time |
| Pagination | `Pagination Item` | Type: page, previous, next, ellipsis. State: default, hover, active, focus, disabled | Label (page) |
| Pagination | `Pagination` | - | Items (native slot) |
| Stepper | `Step` | Orientation: horizontal, vertical. State: completed, current, upcoming, error | Title, Description, Show description, Number, Connector |
| Stepper | `Stepper` | - | Steps (native slot) |
| Description List | `Description List Item` | Orientation: horizontal, vertical | Label, Divider; Value (native slot) |
| Timeline | `Timeline Item` | Tone: default, primary, success, warning, destructive | Title, Time, Description, Show description, Icon (swap), Connector; Content (native slot) + Show content |
| Menu | `Menu Item` | Variant: default, destructive. State: default, highlighted, disabled | Label, Leading icon, Shortcut + Shortcut text, Checked |
| Menu | `Menu Label` | - | Label |
| Menu | `Menu` | - | Items (native slot). Base for Dropdown menu, Select options and context menus |
| Mobile | `Mobile Header` | Type: app, detail | Title; Leading, Trailing (native slots) |
| Mobile | `Bottom Nav Item` | State: default, active | Label, Icon (swap) |
| Mobile | `Bottom Nav` | - | Items (native slot), 3-5 items, safe-area padding |
| Tabs | `Tab` | Style: pill, line. State: default, active, focus, disabled | Label |
| Tabs | `Tabs`, `Tabs Line` | - | Tabs (native slot of Tab instances) |
| Toggle Group | `Toggle Group Item` | State: off, hover, on, focus, disabled | Label, Show label, Icon + Icon type |
| Toggle Group | `Toggle Group` | Variant: default, outline | Items (native slot). Sets a value; Tabs switch panels |
| List & Tree | `List Item` | State: default, hover, selected, focus, disabled | Title, Description, Show description. Leading, Trailing (native slots) |
| List & Tree | `Tree Item` | Type: collapsed, expanded, leaf. State: default, hover, selected. Level: 0-3 | Label, Checkbox (exposed), Icon + Icon type, Count |
| Tooltip | `Tooltip` | Side: top, bottom, left, right | Label |
| Skeleton | `Skeleton` | Shape: text, circle, block | Resize instances to the real layout |
| Alert | `Alert` | Variant: default, destructive, success, warning, info. Layout: inline, banner | Title, Description, Show description, Actions (native slot) + Show actions, Dismiss |
| Toast | `Toast` | Type: default, success, error, warning, info, loading | Show description, Action (nested Button exposed), Close button (off by default). Text edited per instance |
| Dialog | `Dialog Header` | - | Title, Description, Show description, Close. Media (native slot) + Show media |
| Dialog | `Dialog Footer` | - | Actions (native slot) |
| Dialog | `Dialog` | - | Header, Content, Footer (native slots); Show header, Show content, Show footer |
| Dialog | `Alert Dialog` | Type: confirm, destructive, acknowledge | Header, Footer (native slots). Status icon in the header Media slot |
| Drawer | `Sheet` | Side: right, left | Side drawer, full height, 384 wide. Header, Content, Footer (native slots) from Dialog Header/Footer |
| Drawer | `Drawer` | - | Bottom drawer, top radius xl. Handle; Header (no close), Content, Footer (native slots, stacked full-width buttons) |
| Card | `Card Header` | - | Title, Description, Show description, Show action. Action (native slot) |
| Card | `Card Footer` | - | Actions (native slot) |
| Card | `Card` | - | Header, Content, Footer (native slots); Show header, Show content, Show footer |
| Card | `Stat Card` | Trend: up, down, neutral | Label, Value, Footnote, Show footer. Change badge and trend line edited per instance |
| Card | `Option Card` | State: default, hover, focus, selected, disabled | Title, Description, Show description, Icon + Icon type. Selectable card with a radio |
| Card | `Post Card` | Layout: vertical, horizontal | Title, Excerpt, Date, Author, Show author, Show excerpt; category Badge exposed |
| Table | `Table Cell` | header: default, hover, resizing, dragging. body: default, hover, selected, editing, error. expanded | Content (native slot). Header hover/resizing show the resize handle |
| Table | `Table Header Label` | Sort: off, sortable, ascending, descending. Align: left, right | Label |
| Table | `Table Cell Text` | Style: default, strong, muted. Align: left, right | Text |
| Table | `Table Cell Stack` | - | Title, Description |
| Table | `Table Cell User` | - | Name, Email, Show email. Avatar exposed |
| Table | `Table Toolbar` | - | Selection ("2 selected"), Actions (native slot) |
| Sidebar | `Sidebar Item` | Mode: expanded, collapsed. State: default, hover, active, disabled | Label, Icon (swap), Badge (Badge Count, exposed), Chevron |
| Sidebar | `Sidebar Group Label` | - | Label |
| Sidebar | `Sidebar Group` | Mode: expanded, collapsed | Items (native slot), Show label |
| Sidebar | `Sidebar Workspace`, `Sidebar User` | Mode: expanded, collapsed | Title, Subtitle |
| Sidebar | `Sidebar` | Mode: expanded (256), collapsed (48) | Header, Content, Footer (native slots) |
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
| Image | `Image Placeholder` | Ratio: 16:9, 4:3, 1:1, 3:4 | Show caption. Put the photo as image fill on the instance |
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
| App | `Block / Kanban Board`, `/ Scheduler Week` | - | Board with columns and a dragged card; week view with toolbar, events, now line |
| App | `Block / Scheduler Month` | - | Month grid, up to 3 events per day + "+N more", today marked |
| App | `Block / Comments`, `/ Conversation` | - | Comment thread with replies, resolved comment and composer; chat with header, day separator, grouped messages, typing, composer |
| Content | `Block / Blog List`, `/ Article` | - | Featured + grid of Post Cards + pagination; reading column with prose and TOC |
| Sections (blocks) | `Block / Logo Cloud`, `/ Team`, `/ Contact`, `/ Newsletter`, `/ Comparison Table` | - | Marketing sections, 1440 wide, 1152 container |
| Navigation (blocks) | `Block / Navbar Mobile` | - | Logo + menu button, 390 wide. Opens the full-screen "mobile nav open" panel |
| Forms | `Block / Multi-step Form` | - | Stepper + Card with Combobox, Date Picker, Select, Textarea; Back / Continue |
| Forms | `Block / Forgot Password`, `/ Check Email`, `/ Reset Password`, `/ Two-Factor`, `/ Accept Invite` | - | Auth flow cards, 384 wide |
| Results | `Block / Result` | Type: not-found, server-error, no-access, maintenance, success | Show code; Actions (native slot) |
| Commerce | `Product Card` | State: default, sale, sold-out | Name, Variant text, Show action, Show wishlist |
| Commerce | `Block / Product Detail` | - | Gallery, options (Toggle Group), quantity, add to cart, details accordion |
| Commerce | `Block / Order Summary` | - | Lines, discount code, totals, pay button, trust line |
| AI | `Block / AI Chat Empty`, `/ AI Conversation` | - | Welcome with input and starter prompts; conversation with reasoning, tool calls, citations, sources, approval, input |
| AI | `Block / AI Assistant Panel`, `/ Inline AI` | - | 400-wide copilot panel with context; inline popover with actions and a result to accept |

Icons available: plus, minus, check, x, search, chevron-down, chevron-up, chevron-left,
chevron-right, chevrons-up-down, arrow-up-down, info, circle-alert, triangle-alert, circle-check,
loader-circle, mail, trash-2, ellipsis, pencil, copy, archive, user, users, settings, log-out,
calendar, clock, trending-up, trending-down, map-pin, phone, building, inbox, house, file-text,
chart-column, panel-left, bell, menu, upload, heart, shopping-bag, bold, italic, underline,
list, text-quote, link, heading, sparkles, thumbs-up, thumbs-down, refresh-cw, square, arrow-up,
paperclip, globe, wrench, mic, message-square, square-pen, play, pause, volume-2, maximize,
captions, lightbulb (68).

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
- Mobile (< 768): Mobile Header + Page + Bottom Nav. The App Sidebar opens from the menu button
  as a left Sheet ("mobile menu open"); marketing pages use `Block / Navbar Mobile`. See
  `build-ui/patterns/mobile.md`.

## Pages
The file opens with Cover (1920 x 1080 thumbnail), Intro (getting started, credits, changelog),
Foundations (tokens shown as swatches, type, spacing, radius, elevation, motion) and Brand.
Then two sections, each sorted A-Z: COMPONENTS (layer 1 and Form Presets) and BLOCKS (block
categories and Page Shells). Block pages have no prefix. `Navigation` exists in both sections:
the first holds the components (Breadcrumb, Top Bar), the second the Navbar and Footer blocks.
Keep new pages in A-Z order inside their section.

## Four layers
1. Primitives and components (Button, Input, Field, Card...): no business meaning.
2. Field Presets: a component with a purpose (email, phone, card number) built from layer 1.
3. Blocks: whole compositions (navigation, hero, sections, forms, app sections) built from
   layers 1 and 2, one page per category under the BLOCKS divider (AI, App, Commerce, Content,
   Forms, Hero, Navigation, Results, Sections).
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
field, AI chat app, product tour.

## Not built yet
More charts (pie, donut, heatmap). Icons: the 68 Lucide icons stay; the team may switch to
Phosphor (flatten each icon to one `Vector` layer so swaps keep their color).
Until they exist, compose from the components above, tokens and text styles, and flag it.
