# Figma to code mapping

Which code component implements each Figma component, for projects on shadcn/ui (Tailwind,
Radix). Variant and property names in Figma follow the shadcn props, so `Variant=outline,
Size=sm` is `<Button variant="outline" size="sm">`. Tokens map through the WEB code syntax of
each variable (`background/primary` → `var(--primary)`, `bg-primary`).

Use this table when building UI in code (`/eggux:build-ui`) and when wiring Figma Code Connect
later. "custom" means compose it from the listed primitives in the project.

## Core
| Figma | Code | Notes |
|---|---|---|
| `Button`, `Button Icon` | shadcn `Button` (`size="icon"`) | `Leading icon` → icon child before the label |
| `Button Group`, `Split Button` | shadcn `ButtonGroup` or custom flex + `DropdownMenu` | |
| `Action Bar` | `<div class="flex gap-2 justify-end">` of shadcn `Button` (justify-start, justify-center) | Leading button with `mr-auto`; one primary |
| `Badge`, `Badge Count`, `Status Dot` | shadcn `Badge` (+ success, warning, info variants) | Status Dot: custom span + label |
| `Chip`, `Tag` | custom on `Badge` + remove `Button` | |
| `Avatar`, `Avatar Group` | shadcn `Avatar` | Group: negative margin + ring |
| `Byline` | shadcn `Avatar` + name and detail (`flex items-center gap-3`) | Name links to the profile; dates in `<time>` |
| `Separator` | shadcn `Separator` | |
| `Input`, `Field`, `Textarea` | shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) | Field = `FormItem` with label, description, message |
| `Input Group`, `Input Addon`, `Number Input` | shadcn `InputGroup` or custom | |
| `Input OTP` | shadcn `InputOTP` | |
| `Select`, `Combobox`, `Tag Input` | shadcn `Select`; `Popover` + `Command` | |
| `Checkbox`, `Radio`, `Switch` | shadcn `Checkbox`, `RadioGroup`, `Switch` | |
| `Calendar`, `Date Picker`, `Date Range Picker` | shadcn `Calendar` (react-day-picker) in `Popover` | |
| `Time Picker` | custom `Select` of times | |
| `Slider`, `Progress` | shadcn `Slider`, `Progress` | |
| `Tabs`, `Toggle Group` | shadcn `Tabs`, `ToggleGroup` | |
| `Tabs Vertical` | shadcn `Tabs` with `orientation="vertical"`, `TabsList` as `flex-col` | Mobile: a `Select` of sections |
| `Accordion` | shadcn `Accordion` | |
| `Tooltip`, `Popover`, `Hover Card` | shadcn `Tooltip`, `Popover`, `HoverCard` | |
| `Menu`, `Menu Item` | shadcn `DropdownMenu`, `ContextMenu` | |
| `Command`, `Command Dialog` | shadcn `Command`, `CommandDialog` | |
| `Dialog`, `Alert Dialog` | shadcn `Dialog`, `AlertDialog` | |
| `Sheet`, `Drawer` | shadcn `Sheet`, `Drawer` (vaul) | |
| `Side Panel` | `<aside>` in the page grid + shadcn `Collapsible` | Right `Sheet` below 1024 px; persist the collapsed state |
| `Alert`, `Toast` | shadcn `Alert`, `Sonner` | |
| `Card`, `Stat Card` | shadcn `Card` + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) | Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Stat Card: custom content |
| `Skeleton`, `Spinner`, `Kbd` | shadcn `Skeleton`, `Spinner`, `Kbd` | |
| `Pagination`, `Breadcrumb` | shadcn `Pagination`, `Breadcrumb` | |
| `Pagination Compact` | shadcn `Pagination` with `PaginationPrevious`, a text item, `PaginationNext` | |
| `Sidebar` and parts | shadcn `Sidebar` | |
| `Sidebar Double` | shadcn `Sidebar` `collapsible="icon"` (rail) + a second `Sidebar` (panel) | Panel opens as a left `Sheet` on mobile |
| `Navigation Menu` parts | shadcn `NavigationMenu` | |
| `Stepper`, `Step` | custom (no shadcn stepper) | |
| `Description List`, `Timeline` | custom `dl` / `ol` | |
| `Meta Item`, `Figure` | custom: icon + text (`text-sm text-muted-foreground`); `dl` with value and label | Figure has no trend; that is Stat Card |
| `Summary Row` | `<dl>` row, `flex justify-between`, `tabular-nums` | Discount keeps the minus sign; Separator above the total |
| `Setting Row` | custom row + shadcn `Switch`, `Select` or `Button` | Label and `aria-describedby` from the texts |
| `Carousel`, `Carousel Arrow`, `Carousel Indicator`, `Carousel Slide` | shadcn `Carousel` (Embla): `CarouselPrevious`, `CarouselNext`, dots from the Embla API | Autoplay plugin only with a pause control |
| `Carousel Gallery`, `Carousel Thumbnail` | Embla main + thumbs carousels | |
| `Carousel Hero` | Embla with Autoplay plugin, pause on hover and focus | |
| `Lightbox` | yet-another-react-lightbox or PhotoSwipe, or a `Dialog` | Esc, arrows, focus trap |
| `People Picker`, `Person Option` | shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger | Server search by name, email, team; debounce 200 ms |
| `Transfer List` | custom: two lists of `Checkbox` rows + move `Button`s | Or `@dnd-kit` when order matters |
| `Inline Edit` | custom: text ↔ `Input` with save / cancel `Button Icon`s | Optimistic save, revert on error |
| `Signature Pad` | `signature_pad` (or `react-signature-canvas`) in a bordered canvas | Typed fallback; store PNG/SVG + timestamp |
| `Sortable List Item` | `@dnd-kit/sortable` with keyboard sensor and announcements | Drag handle = `useSortable` listeners |
| `Progress Ring` | SVG circle with `stroke-dasharray` (or Radix Progress) | `role="progressbar"`, `aria-valuenow` |
| `Scroll Area` | shadcn `ScrollArea`, `ScrollBar orientation="horizontal"` | |
| `File Preview` | `react-pdf` (pdf.js) for PDF, `<img>` for images, in `Sheet` or `Dialog` | Unsupported types: download link |
| `Image Cropper`, `Avatar Upload` | `react-easy-crop` in a `Dialog`; shadcn `Avatar` + file input | Crop on the client, upload the result |
| `Menubar`, `Menubar Trigger` | shadcn `Menubar` (`MenubarMenu`, `MenubarTrigger`, `MenubarContent`) | |
| `Cookie Consent` | custom banner / card + shadcn `Dialog` with `Switch`es; or a CMP (Cookiebot, Osano) styled to match | Load scripts only after consent |
| `Copy Field` | shadcn `InputGroup` with a `readOnly` Input (`font-mono`) + Copy `Button`; `navigator.clipboard.writeText` | copied state 2 s, no toast; mask secrets until Reveal |
| `Search Field` | shadcn `InputGroup` (`type="search"`) + search icon, `Kbd`, clear `Button` | Debounce ~300 ms; global search opens `CommandDialog` |
| `Inline Form` | `<form class="flex gap-2">` with shadcn `Input` + `Button` (react-hook-form + zod) | Keep the value on error |
| `Currency Input` | shadcn `InputGroup` with a `Select` of ISO codes + `Input`; react-number-format or `Intl.NumberFormat` | Store minor units + ISO code; one currency: Input Group prefix |
| `Phone Input` | react-phone-number-input (libphonenumber-js) + shadcn `Popover` + `Command` country list | Store E.164; `type="tel"`, `autocomplete="tel"` |
| `Date Input` | react-aria `DateField` + shadcn `Popover` with `Calendar` (react-day-picker) | Segments in locale order |
| `Duration Input` | custom: two shadcn `Input`s (`inputmode="numeric"`) with unit addons | Parse "1:30", "90", "1.5h" on blur; store minutes |
| `Range Fields` | custom: two shadcn `InputGroup`s in a `<fieldset>`; zod `refine` min <= max | Either side may be empty |
| `Address Autocomplete` | shadcn `Popover` + `Command` (`shouldFilter={false}`) fed by a places API (Google Places, Mapbox) | Debounce, 3 characters minimum; fills the address Fields |
| `Select Option` | shadcn `CommandItem` / `SelectItem` with `Avatar` or icon, two text lines, check icon | Same Leading for every option in a list |
| `Recurrence Picker` | custom: `Number Input`, `Select`, `ToggleGroup` (multiple), `RadioGroup`; rrule | Summary from `rrule.toText()` or own strings; account time zone |
| `Language Switcher` | shadcn `DropdownMenu` + `DropdownMenuRadioGroup` (or `Select`) | Names in their own language, `lang` on each; no flags |
| `Checkbox Card` | shadcn `Checkbox` in a `Label` styled as a `Card` | Whole card toggles; group in a `<fieldset>` |
| `File Field` | custom: hidden `input type="file"` + shadcn `Button`, file name, remove `Button` | Several files: `File Dropzone` (react-dropzone) |
| `Swatch`, `Swatch Picker` | shadcn `RadioGroup` (or `ToggleGroup` single) of round items with chart token backgrounds | Color name as label |
| `Form Section` | `<section class="grid gap-6 lg:grid-cols-[280px_1fr]">` with heading, description and `FormField`s | Stacked below 1024 px; `Separator` between sections |
| `Fieldset` | `<fieldset>` + `<legend>`; shadcn `RadioGroup` or `Checkbox` items, `FormMessage` for the group | Error belongs to the group |
| `Error Summary` | shadcn `Alert` (destructive) with anchor links from react-hook-form `formState.errors` | Focus moves here on submit; links focus the field |
| `Requirement List`, `Requirement Item` | custom `<ul>` of lucide icon + text, state from the zod schema | `aria-live="polite"`; nothing red before submit |
| `View Switcher` | shadcn `ToggleGroup type="single"` with icons; view in a URL search param | Remember per person; filters survive the switch |
| `Theme Toggle` | shadcn `ToggleGroup type="single"` + next-themes `setTheme` | System by default; no flash on load |
| `Emoji Picker` | frimousse or emoji-mart in shadcn `Popover` | Search, recent first, 8 per row; skin tone stored per user |
| `App Launcher` | shadcn `Popover` with a `grid-cols-3` of links | Current app `aria-current="page"`; only 4+ apps |
| `Confirm Popover` | shadcn `Popover` (`role="alertdialog"`) + two `Button`s | Irreversible actions use `AlertDialog` |
| `Back Link` | `Link` with `ArrowLeft`, `text-sm text-muted-foreground` | Fixed URL to the list; restore its filters and scroll |
| `Skip Link` | `<a href="#main" class="sr-only focus:not-sr-only">` | Target has `tabindex="-1"` |
| `Scroll To Top` | shadcn `Button size="icon" variant="outline"`, `fixed bottom-6 right-6` | Shown after two screens of scroll; moves focus to the top |
| `Account Menu` | shadcn `DropdownMenu` with `DropdownMenuLabel` (Avatar, name, email) | Log out last after `DropdownMenuSeparator` |
| `Show More` | shadcn `Collapsible` or `line-clamp-3` + `Button variant="link"` | `aria-expanded` on the toggle |
| `Load More` | shadcn `Button variant="outline"` + count; TanStack Query `useInfiniteQuery` | Focus the first new item; count in `aria-live` |
| `Shortcut Row` | custom `flex justify-between` + shadcn `Kbd` / `KbdGroup` | ⌘ on Mac, Ctrl elsewhere |
| `Welcome Dialog` | shadcn `Dialog` with a step state | Shown once per user; Skip and Esc close it |
| `Resizable Panels` | shadcn `Resizable` (react-resizable-panels) | `autoSaveId` remembers the split; one panel at a time on mobile |
| `FAB` | shadcn `Button size="icon"` `rounded-full shadow-lg fixed bottom-20 right-4` | Mobile only; desktop uses a primary Button |
| `Action Sheet` | shadcn `Drawer` (vaul) with a list of `Button`s and a separate Cancel | Desktop: `DropdownMenu` |
| `Countdown` | custom tiles from a `useCountdown` hook (1 s interval, server end time) | `role="timer"`, `aria-live="off"`; end time in `<time datetime>` |
| `Loading Overlay` | custom: `absolute inset-0 bg-background/60` layer + shadcn `Spinner` | `aria-busy` on the region; label in `role="status"` |
| `Presence Bar` | shadcn `Avatar` group + `HoverCard` | Presence from Liveblocks, Yjs awareness or your websocket |

## Data and enterprise
| Figma | Code | Notes |
|---|---|---|
| Table template, `Table Cell` and parts | shadcn `Table` + TanStack Table | Grid columns → column defs |
| `Data Grid Toolbar`, `Table Group Row` | custom on TanStack Table (grouping, aggregation, visibility) | Saved views stored per user |
| `Filter Condition`, `Filter Group` | custom: `Select`, `Combobox`, `Input`, `Button` | Serialize to the API filter format |
| `Filter Bar`, `Filter Chip`, `Faceted Filter`, `Facet Option` | shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) | Faceted values from `column.getFacetedUniqueValues()` (TanStack) |
| `Filter Section` | `Collapsible` + `Checkbox` list | |
| `Table Cell Amount`, `Status`, `Progress`, `Actions` | cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` | Amounts with `Intl.NumberFormat`, `tabular-nums` |
| `Table Cell Link`, `Date`, `File`, `Tags`, `Avatars` | cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group | One date format per column |
| `Table Pagination` | shadcn data-table pagination (`Select` for page size + `Pagination`) | |
| `Entity Card`, `Progress Card` | shadcn `Card` with `size="sm"`; `Progress` | |
| `Person Card` | shadcn `Card` + `Avatar`, `Badge`, links (`mailto:`, `tel:`) | |
| `Event Card`, `Date Tile` | shadcn `Card` + `Badge`, `Button`; date tile as custom markup | `<time datetime>` for the date |
| `Empty State` | shadcn `Empty` (or a custom block: icon, title, description, actions) | |
| `Approval Step` | custom on the Timeline layout | |
| `Change Item` | custom | |
| `Save Bar` | custom sticky footer | Listen to form dirty state |
| `Org Switcher` | `DropdownMenu` or `Popover` + `Command` | |
| `Bar Chart`, `Line Chart`, `Sparkline` | shadcn `Chart` (Recharts) | `var(--chart-N)` |
| `Donut Chart`, `Bar Chart Horizontal` | Recharts `PieChart` (`innerRadius`), `BarChart layout="vertical"` | |
| `Heatmap` | custom CSS grid or nivo `HeatMap` | |
| `Gauge` | Recharts `RadialBarChart` (half circle) or custom SVG arc | |
| `Waterfall Chart` | Recharts `BarChart` with a transparent offset bar per step | Increase `color/blue/600`, decrease `color/red/600`, totals `color/neutral/400` |
| `Combo Chart` | Recharts `ComposedChart`: `Bar yAxisId="left"` + `Line yAxisId="right"` | Two `YAxis`, both from 0 |
| `Treemap` | Recharts `Treemap` with a custom cell renderer | |
| `Gantt Bar`, `Gantt Milestone`, Gantt block | SVAR Gantt, Frappe Gantt, or a custom grid with dnd-kit | |
| `Page Toolbar` | custom flex: `Input`, `Button` + `Badge`, `ToggleGroup`, primary `Button` | Swapped for Table Toolbar while rows are selected; state in the URL |
| `Trend Indicator` | custom: lucide `TrendingUp` / `TrendingDown` / `Minus` + `<span class="tabular-nums">` | Direction from the data, tone from the meaning (`text-success`, `text-destructive`, `text-muted-foreground`); hidden "Up" / "Down" text |
| `Metric Strip`, `Metric Strip Item` | `<dl class="grid grid-cols-2 md:grid-cols-4 divide-x">` with `dt` / `dd` + `Trend Indicator` | 3-5 items; one period said once nearby |
| `Usage Meter` | shadcn `Progress` with a tone class + label row | `role="meter"`, `aria-valuenow`, `aria-valuemax`; near from 80%, over above 100% |
| `Leaderboard Row` | `<ol>` of rows with shadcn `Avatar`, `tabular-nums` value | Current row `aria-current="true"` and `bg-accent` |
| `Dashboard Widget` | react-grid-layout (12 cols, `draggableHandle`) with shadcn `Card` per item | Sizes 3, 4, 6, 12 columns; save the layout per user |
| `Distribution Bar` | flex row of segments (width from the share) + legend `<ul>`; or Recharts `BarChart layout="vertical"` stacked to 100% | `var(--chart-N)` per entity; 2-6 segments |
| `Bullet Chart` | Recharts `BarChart layout="vertical"`: stacked range bars, thin value `Bar`, `ReferenceLine` for the target; or custom SVG | Same scale for stacked bullets |
| `Radar Chart` | shadcn `Chart` (Recharts) `RadarChart` with `PolarGrid`, `PolarAngleAxis`, `Radar` per series | 1-3 series, 5-8 axes; `var(--chart-N)` |
| `Sankey Chart` | Recharts `Sankey` with custom node and link renderers | Links colored by source with `var(--chart-N)`; under 12 nodes |
| `Choropleth Map` | react-simple-maps + d3-scale `scaleQuantize` (5 steps, one hue); tile layout as a CSS grid | Muted for no data; table view lists every region |
| `Version Item` | custom list with shadcn `Avatar`, `Badge`, `Button`; preview in `Diff Viewer` | Restore creates a new version |
| `Automation Rule` | custom on shadcn `Card` + `Switch` + `DropdownMenu` | Sentence: When trigger, and condition, then action |
| `Workflow Node` | @xyflow/react custom node (`Handle` for ports), settings in shadcn `Sheet` | Edges 1.5 px `border/default`; keyboard and list view for steps |
| `Mapping Row` | shadcn `Select` (or `Combobox`) + lucide `ArrowRight` + status `Badge`; react-hook-form `useFieldArray` | Auto-match by name; save the mapping as a template |
| `Availability Row` | custom row: shadcn `Switch` + two `Select` of times + `Button size="icon"` | Ranges with `useFieldArray` (react-hook-form); merge overlaps on save |
| `Time Slot` | shadcn `ToggleGroup type="single"` (or `RadioGroup`) of outline `Button`s | Times from the availability API; time zone above the grid |
| `Job Item` | custom row: shadcn `Progress` + `Button` | Status by polling or server-sent events; notify when done |
| `Checklist Item` | custom row: shadcn `Checkbox` + `Avatar` | Optimistic save with an Undo toast (Sonner) |
| `Saved View Item` | shadcn `SidebarMenuItem` + `SidebarMenuBadge` + `DropdownMenu` | View = serialized filters, sort and columns per user |

## Content, communication, AI
| Figma | Code | Notes |
|---|---|---|
| `Rich Text Editor` | Tiptap (or Lexical) + shadcn `Toggle` toolbar | |
| `Code Block` | Shiki or Prism + copy `Button` | |
| `Quote` | `<figure><blockquote>` + `<figcaption>` | Default: `border-l-2`; pull: centered, larger type |
| `Section Heading` | `<header>` with `<h2>`/`<h3>`/`<h4>` + `<p>`, actions in `flex justify-between` | Heading level follows the page outline |
| `Feature Item` | custom: lucide icon in a `bg-muted rounded-md` tile + `<h3>` + `<p>` | Icon `aria-hidden`; grid of 3 or 4 |
| `Tag List` | `<ul class="flex gap-1.5">` of shadcn `Badge`; "+N" as a `Popover` trigger | |
| `Table of Contents`, `TOC Item` | custom with scroll spy | |
| `Comment`, `Comment Composer` | custom + `Textarea` | |
| `Chat Message`, `Chat Composer`, `Typing Indicator` | custom | |
| `Prompt Input`, `User Message`, `Assistant Message`, `Reasoning`, `Tool Call`, `Sources`, `Citation`, `Suggestion` | Vercel AI SDK + AI Elements, or assistant-ui | |
| `Model Selector`, `Model Option`, `Context Chip`, `Agent Plan`, `Plan Step`, `Artifact Card` | AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` | Plan steps from the agent's tool events |
| `Voice Recorder` | MediaRecorder + speech-to-text API; custom UI | Ask for the microphone on first tap |
| `Chat History Item` | shadcn `SidebarMenuItem` + `DropdownMenu` | |
| `Response Feedback` | `Popover` or inline `Card` with `ToggleGroup` (multiple) and `Textarea` | Send with the message id |
| `AI Summary`, `AI Suggestion`, `AI Notice` | custom on `Card`, `Input`, `Badge` | Store who accepted an AI value and when |
| `File Dropzone`, `File Item`, `Attachment` | react-dropzone + custom | |
| `Resource Item` | custom row + `Button` (ghost icon) with `<a download>` | Label names the file, format and size |
| `Rating` | custom `RadioGroup` | |
| `Color Picker` | react-colorful in `Popover` | |
| `Coachmark`, `Hotspot` | Driver.js, Shepherd or `Popover` anchored to the target | |
| `Video Player` | native `video` or Vidstack | |
| `Kanban` parts | dnd-kit + custom | |
| `Calendar Event`, scheduler blocks | custom grid, or FullCalendar themed with tokens | |
| Help center and docs blocks | page sections composed from `Input`, `Card`, `Breadcrumb`, `Button` | Search: shadcn `Command` (⌘K) or Algolia DocSearch; docs content: MDX (Nextra, Fumadocs) |
| `Block / Status Page` uptime bars | custom flex of 90 spans with `title` and an uptime % in text | Data from your status provider (Instatus, Better Stack, Atlassian Statuspage) |
| `Block / Navbar Mega Menu` | shadcn `NavigationMenu` with `NavigationMenuContent` | |
| `Notification Item`, `Notification Center` | shadcn `Popover` + `Tabs` + `ScrollArea`; custom rows with `Avatar` | Bell `Button` + `Badge`; opening an item marks it read |
| `Search Result Item` | custom `<li>`: path, `<a>` heading, `line-clamp-2` snippet, `Badge` | Matched terms in `<mark>` |
| `Annotation Pin` | custom absolutely positioned `Button` + shadcn `Popover` | Store positions as percentages of the image |
| `Social Share` | shadcn `Button size="icon"`; `navigator.clipboard`, `mailto:`, `navigator.share`, network share URLs | Copy link confirms with Sonner; official network logos |
| `Command Snippet` | `<pre><code>` on `bg-muted` + shadcn `Button size="icon"` (`navigator.clipboard.writeText`) | Prompt `$` is `select-none aria-hidden`, never copied |
| `Endpoint Row` | `<a>` row with shadcn `Badge` (method variant) + `<code>` path | GET info, POST success, PUT / PATCH warning, DELETE destructive |
| `Log Row` | virtualized list (`@tanstack/react-virtual`) of mono rows | `role="log"` for live tails; level as text |
| `Diff Viewer`, `Diff Line` | jsdiff (`diffLines`) + custom rows; `react-diff-viewer-continued` for side by side | 3 lines of context, rest collapsed; hidden "added" / "removed" text |
| `JSON Viewer` | custom tree on `<pre>`, or `react-json-view-lite` themed with tokens | `role="tree"`; collapsed after the first level for large payloads |
| `Release Note Item` | `<article>` with shadcn `Badge`, `<time>`, optional `<img>`, `Button variant="link"` | New info, Improved secondary, Fixed success |
| `Footnote` | custom `<ol>` with ids; `<sup><a href="#fn-1">` in the text | Back link to `#fnref-1` |
| `Link Preview` | shadcn `Card` in `<a target="_blank" rel="noopener">` | Open Graph metadata fetched on the server |
| `Location Card` | shadcn `Card` + `<address>`, `tel:` link, maps link |  |
| `Image Compare Slider` | react-compare-slider, or `clip-path` + `<input type="range">` | Handle `role="slider"`, arrow keys |
| `Video Thumbnail` | `<button>` + `<img>` poster, lucide `Play`, `Badge` | Opens `Video Player` in place or in a `Dialog` |
| `Audio Player` | native `<audio>` + custom controls (shadcn `Button`, `Slider`), or Vidstack | Space play / pause, arrows seek 5 s |
| `Agenda Item`, `Meeting Card` | custom `<li>` with `<time>` pairs; shadcn `Card` + `Meta Item`, `Avatar` group, `Button` | Join is an `<a>` to the meeting URL; live from 5 min before the start |
| `Feedback Widget`, `NPS Survey`, `CSAT Rating` | shadcn `Button`, `ToggleGroup` (or `RadioGroup`) + `Textarea` | Send with page or ticket id, version and date; throttle per person |
| `Service Status Row` | custom row with `Status Dot`, `flex justify-between` | Data from your status provider; link non-operational states to the incident |
| `Mention Chip` | Tiptap `Mention` extension + `Command` list; rendered as `<a>` | Mention notifies once; reader mentions use the warning tint |
| `Reaction Bar`, `Reaction` | custom flex of shadcn `Toggle` (`aria-pressed`) + `Popover` emoji picker (emoji-mart or frimousse) |  |
| `Thread Summary` | custom button + `Avatar` group; `Collapsible` or `Sheet` | `aria-expanded` when it opens in place |
| `Job Listing` | custom `<li>` with a stretched `<a>` + `Badge` + `Button asChild` | Salary range with currency and period |
| `AI Button`, `AI Loading`, `Confidence Indicator`, `Suggestion Review Bar` | shadcn `Button`, `Skeleton`, `Tooltip` + custom; Vercel AI SDK for streaming | Never apply low-confidence values automatically; store who accepted an AI value |

## Commerce
| Figma | Code | Notes |
|---|---|---|
| `Quantity Selector` | two shadcn `Button size="icon"` + `Input type="number" inputMode="numeric"` | min and max from stock |
| `Stock Indicator` | `Status Dot` + text `<span>` | Per selected variant; `aria-live="polite"` on change |
| `Wishlist Button` | shadcn `Button size="icon" variant="ghost"` + lucide `Heart` (`fill-current` when saved) | Optimistic toggle; aria-label names state and product |
| `Variant Swatch` | shadcn `RadioGroup` (or `ToggleGroup type="single"`) with custom items | Unavailable: `aria-disabled`, still focusable |
| `Product Card` | shadcn `Card` with an `<a>` stretched over the card, `Badge`, `Button` (icon) for wishlist | Whole card is one link; Add to cart opens the `Mini Cart` |
| `Line Item` | custom `<li class="flex gap-4">`: `<img>`, text, `Quantity Selector`, amount, ghost `Button` | `tabular-nums`; Undo in `Sonner` toast |
| `Mini Cart` | shadcn `Popover` (`Sheet` on mobile) + `Line Item`s, `Summary Row`, `Button`s | Auto-open 4 s without moving focus |
| `Order Row` | `<a>` row + shadcn `Badge`, `<time>` | Status names from one shared list |
| `Shipment Tracker` | custom header + `<ol>` of `Step` | `aria-current="step"`; carrier tracking URL |
| `Address Card` | shadcn `RadioGroup` + `Card` items (`Label` wraps the card), `<address>` |  |
| `Payment Method Card` | shadcn `Card` + `Badge` + `DropdownMenu` | Data from the payment provider (Stripe `PaymentMethod`); last 4 digits only |
| `Review Item` | `<article>` + `Avatar`, `Badge`, `Rating`, ghost `Button`s | Helpful: `aria-pressed` |
| `Rating Summary` | custom: `Rating` + rows of shadcn `Progress` in `Button`s | Rows set the star filter |

## Marketing
| Figma | Code | Notes |
|---|---|---|
| `Price` | custom: amount, `<s>` old price and period (`text-muted-foreground`) | `Intl.NumberFormat` with currency; sr-only "Was ... now ..." |
| `Check List Item` | `<li class="flex gap-2">` with lucide `Check` or `Minus` | Icon `aria-hidden`; sr-only "Not included" |
| `Pricing Toggle` | shadcn `ToggleGroup type="single"` + `Badge` | Period in state and URL; all prices update without reload |
| `Plan Card` | shadcn `Card` + `Price`, `Button`, `<ul>` of `Check List Item` | Featured: `ring-2 ring-primary`, primary `Button` |
| `Announcement Pill` | `<a>` (`rounded-full border`) + shadcn `Badge` + lucide `ArrowRight` | One at a time |
| `Trust Badge` | custom: lucide icon + name and detail, `<a>` to the trust page | Only current claims |
| `Testimonial Card` | shadcn `Card` + `<figure><blockquote>` + `Byline` in `<figcaption>` |  |
| `Step Item` | `<ol>` of `<li>`: number circle (`rounded-full bg-muted`), `<h3>`, `<p>` | Number circle `aria-hidden` |
| `Logo Tile` | `<li>` with `<img alt>` or inline SVG in `currentColor` | `<a>` only when it links to a case study or integration |
| `Device Frame` | custom `<figure>`: border, top bar (dots, URL), `<img>` or live component | Screenshot at 1:1 |

## Admin
| Figma | Code | Notes |
|---|---|---|
| `Access Row`, `Invite Row`, `Share Link Row` | shadcn `Avatar`, `Select`, `Popover` + `Command` (combobox with chips), `Button` | Copy with `navigator.clipboard.writeText`; validate emails with zod |
| `Integration Card` | shadcn `Card size="sm"` + `Button`, `Switch`, `Badge` | Connect opens the provider OAuth flow |
| `Permission Row` | shadcn `Table` with `Checkbox` cells | Form state in react-hook-form; save with `Save Bar`; log changes |
| `API Key Row`, `Session Row` | custom row + `Badge`, `Button size="icon"`, `DropdownMenu`, `AlertDialog` | Full key shown once at creation; sessions from your auth provider |
| `SSO Button` | shadcn `Button variant="outline"` `w-full` + provider mark | `signIn(provider)` in Auth.js, Clerk or WorkOS |
| `Org Chart Node` | @xyflow/react with a dagre layout (or react-d3-tree); custom node with `Avatar` | `role="tree"` semantics for keyboard use |

Variants added in 0.49.0 map to props: Button `loading` (spinner + `disabled`), Button Icon `size` (sm, default, lg), Avatar `shape` (rounded-md for square) and xs (`size-5`), Sidebar Item level 2 (`SidebarMenuSub`), Tab with icon, Menu Item description and submenu (`DropdownMenuSub`), rich Tooltip with `Kbd`, Progress tone (indicator color class), Image Placeholder 21:9 (`aspect-[21/9]`).
