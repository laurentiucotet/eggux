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
| `Button` | shadcn `Button` (`variant`, `size`) | `Show leading icon` → icon child before the label; State=loading → spinner + `disabled` |
| `Icon/database`, `Icon/bookmark`, `Icon/headphones`, `Icon/podcast` | lucide-react `Database`, `Bookmark`, `Headphones`, `Podcast` | Same as every `Icon/*`: `size-4`/`size-6`, `aria-hidden` unless it carries meaning |
| `Icon/brand/apple-podcasts`, `Icon/brand/spotify`, `Icon/brand/linkedin`, `Icon/brand/youtube`, `Icon/brand/github`, `Icon/brand/x` | `simple-icons` (CC0) paths in an inline `<svg viewBox="0 0 24 24" fill="currentColor">`, or `react-icons/si` (`SiApplepodcasts`, `SiSpotify`, `SiLinkedin`, `SiYoutube`, `SiGithub`, `SiX`) | Filled, single color via `currentColor`; the link carries `aria-label` ("Acme on LinkedIn"), the svg is `aria-hidden`. lucide-react has no brand logos (its `Linkedin`, `Youtube`, `Github` are deprecated) |
| `Button` (Variant=link) | shadcn `Button variant="link"` with `text-brand` instead of `text-primary` | Patch the shadcn `buttonVariants` link entry: `link: "text-brand underline-offset-4 hover:underline"` |
| `Button Icon` | shadcn `Button size="icon"` with `aria-label`, wrapped in `Tooltip` | Same `variant` values as Button; tooltip text = aria-label |
| `Button Group`, `Button Group Item`, `Split Button` | shadcn `ButtonGroup` or custom flex + `DropdownMenu` | |
| `Action Bar` | `<div class="flex gap-2 justify-end">` of shadcn `Button` (justify-start, justify-center) | Leading button with `mr-auto`; one primary |
| `Badge`, `Badge Count`, `Status Dot` | shadcn `Badge` (+ success, warning, info variants; soft-success, soft-warning, soft-destructive, soft-info, soft-neutral as cva variants `bg-[var(--badge-soft-X-bg)] text-[var(--badge-soft-X-fg)]`) | Status Dot: custom span + label. Soft = status color at 10% (Light) / 20% (Dark) with a darker or lighter text step; one style per table |
| `Chip`, `Tag` | custom on `Badge` + remove `Button` | |
| `Avatar`, `Avatar Group` | shadcn `Avatar` | `Type=image` = `AvatarImage` (the `Photo` swap is a sample face, use the person's photo URL); `Type=initials` = `AvatarFallback`. Group: negative margin + ring |
| `Byline` | shadcn `Avatar` + name and detail (`flex items-center gap-3`) | Name links to the profile; dates in `<time>` |
| `Separator` | shadcn `Separator` | |
| `Input`, `Field`, `Textarea` | shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) | Field = `FormItem` with label, description, message |
| `Input Group`, `Input Addon`, `Number Input` | shadcn `InputGroup` or custom | |
| `Input OTP`, `OTP Slot` | shadcn `InputOTP` (`InputOTPGroup`, `InputOTPSlot`) | |
| `Select`, `Combobox`, `Tag Input` | shadcn `Select`; `Popover` + `Command` | |
| `Checkbox`, `Radio`, `Switch` | shadcn `Checkbox`, `RadioGroup`, `Switch` | |
| `Calendar`, `Calendar Day`, `Date Picker`, `Date Range Picker` | shadcn `Calendar` (react-day-picker) in `Popover` | |
| `Time Picker` | custom `Select` of times | |
| `Slider`, `Progress` | shadcn `Slider`, `Progress` | |
| `Tabs`, `Tab` | shadcn `Tabs` (`TabsList`, `TabsTrigger`) | Variant=line: `TabsList` with a bottom border (`border-b`); Variant=vertical: `orientation="vertical"`, `TabsList` as `flex-col`, a `Select` of sections on mobile |
| `Toggle Group`, `Toggle Group Item` | shadcn `ToggleGroup` (`type` single or multiple) | View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme` |
| `Accordion`, `Accordion Item` | shadcn `Accordion` (`AccordionItem`) | Size=sm: smaller padding |
| `Tooltip`, `Popover`, `Hover Card` | shadcn `Tooltip`, `Popover`, `HoverCard` | |
| `Menu`, `Menu Item`, `Menu Label` | shadcn `DropdownMenu`, `ContextMenu` (`DropdownMenuLabel`, `DropdownMenuSeparator`) | |
| `Command`, `Command Input`, `Command Dialog` | shadcn `Command`, `CommandInput`, `CommandDialog` | |
| `Dialog`, `Dialog Header`, `Dialog Footer`, `Alert Dialog` | shadcn `Dialog` (`DialogHeader`, `DialogFooter`), `AlertDialog` | |
| `Sheet`, `Drawer` | shadcn `Sheet`, `Drawer` (vaul) | |
| `Side Panel` | `<aside>` in the page grid + shadcn `Collapsible` | Right `Sheet` below 1024 px; persist the collapsed state |
| `Alert`, `Toast` | shadcn `Alert`, `Sonner` | |
| `Card`, `Card Header`, `Card Footer`, `Stat Card` | shadcn `Card` (`CardHeader`, `CardFooter`) + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) | Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Card Header `Show icon` / `Icon` = optional Lucide icon (`size-5`, `aria-hidden`) before `CardTitle` in a `flex items-center gap-2` row. Stat Card: custom content |
| `Stat Card` | shadcn `Card` + custom content; change = `Badge` soft variant by direction; optional sparkline = Recharts `LineChart` without axes, `var(--chart-1)` | Up soft-success, down soft-destructive, flat soft-neutral; swap on the instance when up is bad; sparkline `aria-hidden` |
| `Skeleton`, `Spinner`, `Kbd`, `Kbd Group` | shadcn `Skeleton`, `Spinner`, `Kbd` (`KbdGroup`) | |
| `Pagination`, `Pagination Item`, `Breadcrumb`, `Breadcrumb Item` | shadcn `Pagination` (`PaginationItem`), `Breadcrumb` (`BreadcrumbItem`) | In tables use `Table Pagination` |
| `Pagination Compact` | shadcn `Pagination` with `PaginationPrevious`, a text item, `PaginationNext` | |
| `Pager Link` | `<a>` card (`rounded-xl border p-4 hover:bg-accent focus-visible:ring`) with lucide `ChevronLeft` / `ChevronRight`, two of them in a `<nav>` | Docs prev/next; for tables and lists use `Pagination` |
| `Sidebar`, `Sidebar Item`, `Sidebar Group`, `Sidebar Group Label`, `Sidebar Workspace`, `Sidebar User` | shadcn `Sidebar` (`SidebarMenuItem`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarFooter`) | |
| `Sidebar Double` | shadcn `Sidebar` `collapsible="icon"` (rail) + a second `Sidebar` (panel) | Panel opens as a left `Sheet` on mobile |
| `Navigation Menu Panel`, `Navigation Menu Link`, `Nav Link` | shadcn `NavigationMenu` (`NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuTrigger`) | |
| `Stepper`, `Step` | custom (no shadcn stepper) | |
| `Description List Item`, `Timeline Item` | custom `dl` with `dt` / `dd` and a Tailwind grid; custom `ol` | No shadcn component |
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
| `Scroll Area` | shadcn `ScrollArea`, `ScrollBar orientation="horizontal"` | The Content slot is the `ScrollArea` children |
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
| `Range Input` | custom: two shadcn `InputGroup`s in a `<fieldset>`; zod `refine` min <= max | Either side may be empty |
| `Address Autocomplete` | shadcn `Popover` + `Command` (`shouldFilter={false}`) fed by a places API (Google Places, Mapbox) | Debounce, 3 characters minimum; fills the address Fields |
| `Select Option` | shadcn `CommandItem` / `SelectItem` with `Avatar` or icon, two text lines, check icon | Same Leading for every option in a list |
| `Recurrence Picker` | custom: `Number Input`, `Select`, `ToggleGroup` (multiple), `RadioGroup`; rrule | Summary from `rrule.toText()` or own strings; account time zone |
| `Option Card` | shadcn `RadioGroup` (Control=radio) or `Checkbox` (Control=checkbox) with a `Label` wrapping a `Card` (`has-[:checked]:ring-2`) | Whole card is the target; checkbox groups in a `<fieldset>` |
| `File Field` | custom: hidden `input type="file"` + shadcn `Button`, file name, remove `Button` | Several files: `File Dropzone` (react-dropzone) |
| `Swatch`, `Swatch Picker` | shadcn `RadioGroup` (or `ToggleGroup type="single"`) with custom items: a color dot (Type=color) or a label box (Type=label) | Color or option name as label; unavailable: `aria-disabled`, still focusable |
| `Form Section` | `<section class="grid gap-6 lg:grid-cols-[280px_1fr]">` with heading, description and `FormField`s | Stacked below 1024 px; `Separator` between sections |
| `Fieldset` | `<fieldset>` + `<legend>`; shadcn `RadioGroup` or `Checkbox` items, `FormMessage` for the group | Error belongs to the group |
| `Error Summary` | shadcn `Alert` (destructive) with anchor links from react-hook-form `formState.errors` | Focus moves here on submit; links focus the field |
| `Requirement List` | custom `<ul>` of `Check Item`s, state from the zod schema of the field | `aria-live="polite"`; nothing red before submit |
| `Check Item` | `<li class="flex gap-2">` with lucide `CircleCheck`, `Minus` or `X` (`aria-hidden`) and an sr-only status | Mark=check, dash, x |
| `Password Strength` | custom bars + text under the shadcn `Input` | Level in text, not only color |
| `Emoji Picker` | frimousse or emoji-mart in shadcn `Popover` | Search, recent first, 8 per row; skin tone stored per user |
| `App Launcher` | shadcn `Popover` with a `grid-cols-3` of links | Current app `aria-current="page"`; only 4+ apps |
| `Confirm Popover` | shadcn `Popover` (`role="alertdialog"`) + two `Button`s | Irreversible actions use `AlertDialog` |
| `Back Link` | `Link` with `ArrowLeft`, `text-sm text-muted-foreground` | Fixed URL to the list; restore its filters and scroll |
| `Skip Link` | `<a href="#main" class="sr-only focus:not-sr-only">` | Target has `tabindex="-1"` |
| `Account Menu` | shadcn `DropdownMenu` with `DropdownMenuLabel` (Avatar, name, email) | Log out last after `DropdownMenuSeparator` |
| `Show More` | shadcn `Collapsible` or `line-clamp-3` + `Button variant="link"` | `aria-expanded` on the toggle |
| `Load More` | shadcn `Button variant="outline"` + count; TanStack Query `useInfiniteQuery` | Focus the first new item; count in `aria-live` |
| `Shortcut Row` | custom `flex justify-between` + shadcn `Kbd` / `KbdGroup` | ⌘ on Mac, Ctrl elsewhere |
| `Resizable Panels` | shadcn `Resizable` (react-resizable-panels) | `autoSaveId` remembers the split; one panel at a time on mobile |
| `FAB` | shadcn `Button size="icon"` `rounded-full shadow-lg fixed bottom-20 right-4` | Mobile only; desktop uses a primary Button |
| `Action Sheet` | shadcn `Drawer` (vaul) with a list of `Button`s and a separate Cancel | Desktop: `DropdownMenu` |
| `Countdown` | custom tiles from a `useCountdown` hook (1 s interval, server end time) | `role="timer"`, `aria-live="off"`; end time in `<time datetime>` |
| `Loading Overlay` | custom: `absolute inset-0 bg-background/60` layer + shadcn `Spinner` | `aria-busy` on the region; label in `role="status"` |
| `Presence Bar` | shadcn `Avatar` group + `HoverCard` | Presence from Liveblocks, Yjs awareness or your websocket |
| `List Item` | custom row (`ul` / `li`) with shadcn `Avatar` and `Badge` | Show leading and Show trailing map to optional children. `Show divider` = `border-b` on the `li` (or `divide-y` on the `ul`), off on the last row |
| `Tree Item` | custom tree (`role="tree"`) with shadcn `Checkbox` and `Badge` | Arrow keys expand and collapse |
| `Top Bar` | shadcn site header: `SidebarTrigger`, `Breadcrumb`, `Button` | |
| `Page Header` | custom `<header>` with a heading, text and shadcn `Button` | One per page |
| `Mobile Header` | custom header with shadcn `Button size="icon"` and `Avatar` | |
| `Bottom Nav`, `Bottom Nav Item` | custom `<nav>` of links with `env(safe-area-inset-bottom)` | Current item `aria-current="page"` |
| `Image Placeholder` | `<img>` or `next/image` with `aspect-ratio` and `object-cover` | `Show image` = render the image; off = muted box with a dot background and lucide `Image` icon (loading or missing image). The `Image` swap picks a sample photo: replace with the real `src` and alt |
| `Logo / *` (Northwind, Lumora, Orbitly, Fieldstone, Kestrel, Quintra, Halcyon, Brightpath, Corvid, Meridian, Tidewater, Vireo) | inline SVG (`fill="currentColor"`, height 32, `role="img"` + `aria-label="<Name>"`) exported from the Brand page | Fictional sample logos for mockups only; ship real customer logos with permission |
| `Image / Person / *`, `Image / Product / *`, `Image / Office / *`, `Image / Cover / *`, `Image / Abstract / *`, `Image / City / *` | none: sample content | Unsplash License sample photos on the Imagery page, not part of the CC BY 4.0 file license. Replace with project images (`src` + alt); never ship them |
| `Image Figure` | `<figure>` with `<img>` or `next/image` (`aspect-*`, `object-cover`, `rounded-lg`) + `<figcaption className="text-sm text-muted-foreground">` | Credit in a `<small>` inside the figcaption |
| `Field Preset` | `Field` (`FormItem`) + shadcn `Input` or `Select` with `type`, `inputmode` and `autocomplete` set per preset | See `skills/build-ui/patterns/form-presets.md` |

## Data and enterprise
| Figma | Code | Notes |
|---|---|---|
| Table template, `Table Cell`, `Table Header Label`, `Table Cell Text`, `Table Cell Stack`, `Table Cell User` | shadcn `Table` + TanStack Table | Grid columns → column defs |
| `Table Toolbar` | custom bar on shadcn `Table` + TanStack Table row selection | Shows "N selected" and the bulk actions |
| `Data Grid Toolbar`, `Table Group Row` | custom on TanStack Table (grouping, aggregation, visibility) | Saved views stored per user |
| `Filter Condition`, `Filter Group` | custom: `Select`, `Combobox`, `Input`, `Button` | Serialize to the API filter format |
| `Filter Bar`, `Filter Chip`, `Faceted Filter`, `Facet Option` | shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) | Faceted values from `column.getFacetedUniqueValues()` (TanStack) |
| `Filter Section` | `Collapsible` + `Checkbox` list | |
| `Table Cell Amount`, `Table Cell Status`, `Table Cell Progress`, `Table Cell Actions` | cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` | Amounts with `Intl.NumberFormat`, `tabular-nums` |
| `Table Cell Link`, `Table Cell Date`, `Table Cell File`, `Table Cell Badges`, `Table Cell Avatars` | cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group | One date format per column |
| `Table Pagination` | shadcn data-table pagination (`Select` for page size + `Pagination`) | |
| `Table Cell Check` | cell renderer: lucide `Check` / `Minus` icon with `sr-only` "Included" / "Not included", or the text value; optional muted note | Plan comparison cells; excluded is a dash, never blank |
| `Entity Card`, `Progress Card` | shadcn `Card` with `size="sm"`; `Progress` | |
| `Person Card` | shadcn `Card` + `Avatar`, `Badge`, links (`mailto:`, `tel:`) | |
| `Event Card`, `Date Tile` | shadcn `Card` + `Badge`, `Button`; date tile as custom markup | `<time datetime>` for the date. `datePosition` prop (text, image) on vertical: image = tile `absolute top-3 left-3 bg-background` inside a `relative` image wrapper |
| `Empty State` | shadcn `Empty` (or a custom block: icon, title, description, actions) | |
| `Approval Step` | custom on the Timeline layout | |
| `Change Item` | custom | |
| `Save Bar` | custom sticky footer | Listen to form dirty state |
| `Org Switcher` | `DropdownMenu` or `Popover` + `Command` | |
| `Bar Chart`, `Line Chart`, `Sparkline` | shadcn `Chart` (Recharts) | `var(--chart-N)` |
| `Chart Legend`, `Chart Legend Item` | shadcn `ChartLegend` with `ChartLegendContent` (Recharts) | Colors from `chartConfig` |
| `Chart Tooltip`, `Chart Tooltip Row` | shadcn `ChartTooltip` with `ChartTooltipContent` (Recharts) | |
| `Chart Card` | shadcn `Card` + shadcn `Chart` (Recharts) + `ToggleGroup` for the time range | |
| `Funnel Chart` | Recharts `FunnelChart`, or plain bars with widths from the data | |
| `Scatter Chart` | Recharts `ScatterChart` with `XAxis` and `YAxis` `type="number"` | |
| `Donut Chart`, `Bar Chart Horizontal` | Recharts `PieChart` (`innerRadius`), `BarChart layout="vertical"` | |
| `Heatmap` | custom CSS grid or nivo `HeatMap` | |
| `Gauge` | Recharts `RadialBarChart` (half circle) or custom SVG arc | |
| `Waterfall Chart` | Recharts `BarChart` with a transparent offset bar per step | Increase `color/blue/600`, decrease `color/red/600`, totals `color/neutral/400` |
| `Combo Chart` | Recharts `ComposedChart`: `Bar yAxisId="left"` + `Line yAxisId="right"` | Two `YAxis`, both from 0 |
| `Treemap` | Recharts `Treemap` with a custom cell renderer | |
| `Gantt Bar`, `Gantt Milestone`, Gantt block | SVAR Gantt, Frappe Gantt, or a custom grid with dnd-kit | |
| `Page Toolbar` | custom flex: `Input`, `Button` + `Badge`, `ToggleGroup`, primary `Button` | Swapped for Table Toolbar while rows are selected; state in the URL |
| `Trend Indicator` | custom: lucide `TrendingUp` / `TrendingDown` / `Minus` + `<span class="tabular-nums">`; Style=badge wraps both in a soft `Badge` | Direction from the data, tone from the meaning (`text-success`, `text-destructive`, `text-muted-foreground`, or the soft Badge of that tone); hidden "Up" / "Down" text |
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
| `Background Job` | custom row: shadcn `Progress` + `Button` | Status by polling or server-sent events; notify when done |
| `Task Item` | custom row: shadcn `Checkbox` + `Avatar` | Optimistic save with an Undo toast (Sonner) |
| `Saved View Item` | shadcn `SidebarMenuItem` + `SidebarMenuBadge` + `DropdownMenu` | View = serialized filters, sort and columns per user |

## Content, communication, AI
| Figma | Code | Notes |
|---|---|---|
| `Rich Text Editor` | Tiptap (or Lexical) + shadcn `Toggle` toolbar | |
| `Post Card` | shadcn `Card` with image, `Badge` and `Avatar`, wrapped in one link | `size` prop (default, sm) via `cva`: sm = smaller gaps, `h4` title class, horizontal image `basis-1/3 min-w-[120px] max-w-[240px]` instead of half, compact image `size-12` |
| `Code Block` | Shiki or Prism + copy `Button` | |
| `Quote` | `<figure><blockquote>` + `<figcaption>` | Default: `border-l-2`; pull: centered, larger type |
| `Section Heading` | `<header>` with `<h2>`/`<h3>`/`<h4>` + `<p>`, actions in `flex justify-between` | Heading level follows the page outline. Optional icon before the title (`size-6` lg, `size-5` default and sm, `aria-hidden`) |
| `Feature Item` | custom: lucide icon in a `bg-muted rounded-md` tile + `<h3>` + `<p>` | Icon `aria-hidden`; grid of 3 or 4. Marker=number: an `<ol>`, number circle `rounded-full bg-muted`, `aria-hidden` |
| `Badge List` | `<ul class="flex gap-1.5">` of shadcn `Badge`; "+N" as a `Popover` trigger | |
| `Table of Contents`, `Table of Contents Item` | custom with scroll spy | |
| `Comment`, `Comment Composer` | custom + `Textarea` | |
| `Chat Message`, `Chat Composer`, `Typing Indicator` | custom | |
| `Prompt Input`, `User Message`, `Assistant Message`, `Reasoning`, `Tool Call`, `Sources`, `Source Item`, `Citation`, `Prompt Suggestion` | Vercel AI SDK + AI Elements, or assistant-ui | |
| `Model Picker`, `Model Option`, `Context Chip`, `Agent Plan`, `Plan Step`, `Artifact Card` | AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` | Plan steps from the agent's tool events |
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
| `Kanban Card`, `Kanban Column` | dnd-kit + custom | |
| `Calendar Event`, scheduler blocks | custom grid, or FullCalendar themed with tokens | |
| Help center and docs blocks | page sections composed from `Input`, `Card`, `Breadcrumb`, `Button` | Search: shadcn `Command` (⌘K) or Algolia DocSearch; docs content: MDX (Nextra, Fumadocs) |
| `Block / Status Page` uptime bars | custom flex of 90 spans with `title` and an uptime % in text | Data from your status provider (Instatus, Better Stack, Atlassian Statuspage) |
| `Block / Navbar Mega Menu` | shadcn `NavigationMenu` with `NavigationMenuContent` | |
| `Notification Item`, `Notification Center` | shadcn `Popover` + `Tabs` + `ScrollArea`; custom rows with `Avatar` | Bell `Button` + `Badge`; opening an item marks it read |
| `Search Result Item` | custom `<li>` with a `type` switch (page, record, person, file, media, product, event, answer): page = breadcrumb, `<a>` heading, `line-clamp-2` snippet, `Badge`; others = leading `Avatar`, icon tile, video poster, image or date tile, a `line-clamp-2` title, one details line; `Badge`, `Button`, Price, `Rating`; answer = muted `Card` with source links | Matched terms in `<mark>`; one `type` per result; at most one answer, first; Figma text props are per type (Record, Name, File name, Product, Event, Question...) |
| `Annotation Pin` | custom absolutely positioned `Button` + shadcn `Popover` | Store positions as percentages of the image |
| `Social Share` | shadcn `Button size="icon"`; `navigator.clipboard`, `mailto:`, `navigator.share`, network share URLs | Copy link confirms with Sonner; official network logos |
| `Command Snippet` | `<pre><code>` on `bg-muted` + shadcn `Button size="icon"` (`navigator.clipboard.writeText`) | Prompt `$` is `select-none aria-hidden`, never copied |
| `Endpoint Row` | `<a>` row with shadcn `Badge` (method variant) + `<code>` path | GET info, POST success, PUT / PATCH warning, DELETE destructive |
| `Log Row` | virtualized list (`@tanstack/react-virtual`) of mono rows | `role="log"` for live tails; level as text |
| `Diff Viewer`, `Diff Line` | jsdiff (`diffLines`) + custom rows; `react-diff-viewer-continued` for side by side | 3 lines of context, rest collapsed; hidden "added" / "removed" text |
| `JSON Viewer` | custom tree on `<pre>`, or `react-json-view-lite` themed with tokens | `role="tree"`; collapsed after the first level for large payloads |
| `Release Note Item` | `<article>` with shadcn `Badge`, `<time>`, optional `<img>`, `Button variant="link"` | New info, Improved secondary, Fixed success |
| `Release Note Line` | `<li>` with shadcn `Badge` + text, in a `<ul>` | Part of `Release Note Item` (Changes slot); New info, Improved secondary, Fixed success |
| `Footnote` | custom `<ol>` with ids; `<sup><a href="#fn-1">` in the text | Back link to `#fnref-1` |
| `Link Preview` | shadcn `Card` in `<a target="_blank" rel="noopener">` | Open Graph metadata fetched on the server |
| `Location Card` | shadcn `Card` + `<address>`, `tel:` link, maps link | Show map: a static map image or embed on top |
| `Image Compare Slider` | react-compare-slider, or `clip-path` + `<input type="range">` | Handle `role="slider"`, arrow keys |
| `Video Thumbnail` | `<button>` + `<img>` poster, lucide `Play`, `Badge` | Opens `Video Player` in place or in a `Dialog` |
| `Audio Player` | native `<audio>` + custom controls (shadcn `Button`, `Slider`), or Vidstack | Space play / pause, arrows seek 5 s |
| `Agenda Item`, `Meeting Card` | custom `<li>` with `<time>` pairs; shadcn `Card` + `Meta Item`, `Avatar` group, `Button` | Join is an `<a>` to the meeting URL; live from 5 min before the start |
| `Feedback Widget`, `NPS Survey`, `CSAT Rating` | shadcn `Button`, `ToggleGroup` (or `RadioGroup`) + `Textarea` | Send with page or ticket id, version and date; throttle per person |
| `Service Status Row` | custom row with `Status Dot`, `flex justify-between` | Data from your status provider; link non-operational states to the incident |
| `Uptime Bars`, `Uptime Day` | flex row of 90 bars (`flex-1 h-7 rounded-sm`, `bg-success` / `bg-warning` / `bg-destructive` / `bg-info` / `bg-border` by state) with a shadcn `Tooltip` per day; caption "90 days ago" / "Today" | Each day has an accessible label with date and state |
| `Mention Chip` | Tiptap `Mention` extension + `Command` list; rendered as `<a>` | Mention notifies once; reader mentions use the warning tint |
| `Reaction Bar`, `Reaction` | custom flex of shadcn `Toggle` (`aria-pressed`) + `Popover` emoji picker (emoji-mart or frimousse) |  |
| `Thread Summary` | custom button + `Avatar` group; `Collapsible` or `Sheet` | `aria-expanded` when it opens in place |
| `Job Listing` | custom `<li>` with a stretched `<a>` + `Badge` + `Button asChild` | Salary range with currency and period |
| `AI Loading`, `Confidence Indicator`, `AI Review Bar` | shadcn `Skeleton`, `Tooltip`, `Button` + custom; Vercel AI SDK for streaming; review bar on Tiptap track changes or a diff of the form state | Never apply low-confidence values automatically; store who accepted an AI value |

## Commerce
| Figma | Code | Notes |
|---|---|---|
| `Product Card` | shadcn `Card` with an `<a>` stretched over the card, `Badge`, `Button` (icon) for wishlist | Whole card is one link; Add to cart opens the `Mini Cart` |
| `Line Item` | custom `<li class="flex gap-4">`: `<img>`, text, `Number Input` (Size=sm), amount, ghost `Button` | `tabular-nums`; Undo in `Sonner` toast |
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
| `Plan Card` | shadcn `Card` + `Price`, `Button`, `<ul>` of `Check Item` | Variant=featured: `ring-2 ring-primary`, primary `Button` |
| `Announcement Pill` | `<a>` (`rounded-full border`) + shadcn `Badge` + lucide `ArrowRight` | One at a time |
| `Trust Badge` | custom: lucide icon + name and detail, `<a>` to the trust page | Only current claims |
| `Testimonial Card` | shadcn `Card` + `<figure><blockquote>` + `Byline` in `<figcaption>` |  |
| `Logo Tile` | `<li>` with `<img alt>` or inline SVG in `currentColor` (`text-foreground`, `opacity-70` for Style=plain) | Logo is an instance swap; `<a>` only when it links to a case study or integration; alt = company name |
| `Logo`, `Logo Mark` | inline SVG in `currentColor` (or `<img alt>` with the product name) | Logo Mark is the symbol alone |
| `Map` | static map image or an embedded map (Mapbox, Google) | Address in text next to it |
| `Device Frame` | custom `<figure>`: border, top bar (dots, URL), `<img>` or live component | Screenshot at 1:1 |
| `Icon Tile` | custom `<div class="flex size-10 items-center justify-center rounded-md">` + lucide icon (`size-5`, `aria-hidden`) | Size: sm `size-8` + `size-4` icon, default `size-10` + `size-5`, lg `size-12 rounded-lg` + `size-6`. Style: neutral `bg-muted text-foreground`; brand `bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)]`; gradient `bg-linear-to-br from-[var(--icon-tile-gradient-start)] to-[var(--icon-tile-gradient-end)] text-primary-foreground`; outline `border text-muted-foreground`. Decorative |
| `Background / Grid` | custom absolutely positioned `div` (`absolute inset-0 -z-10 pointer-events-none`, `aria-hidden`) | `bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:40px_40px] opacity-60`; `Fade` = `[mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]` |
| `Background / Dots` | custom absolutely positioned `div` (`aria-hidden`) | `bg-[radial-gradient(var(--muted-foreground)_0.75px,transparent_0.75px)] bg-[size:24px_24px] opacity-50`; `Fade` = same radial mask as Grid |
| `Background / Glow` | custom absolutely positioned `div` (`aria-hidden`) | `rounded-full blur-3xl bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_35%,transparent),transparent)]`; Position: top `left-1/2 -top-[560px] w-[1240px] h-[800px] -translate-x-1/2`, center centered `w-[1000px] h-[640px]`, bottom-right `-right-[200px] -bottom-[340px] w-[1000px] h-[760px]` |
| `Background / Beam` | custom `overflow-hidden` wrapper with 3 rotated `div`s (`aria-hidden`) | Each beam `rotate-[35deg] bg-linear-to-b from-primary/20 to-transparent blur-2xl`, widths 64-160 px, opacity 12-22% |


Default, Corporate and Showcase themes in `globals.css` (EGG default: blue primary, pill controls, 12 px cards,
Plus Jakarta Sans; Corporate keeps Inter and 4 px):

```css
:root {
  --primary: var(--color-blue-600);
  --primary-foreground: var(--color-white);
  --ring: var(--color-blue-600);
  --brand: var(--color-blue-700);
  --accent: var(--color-blue-50);
  --sidebar-primary: var(--color-blue-600);
  --sidebar-primary-foreground: var(--color-white);
  --button-primary-hover: var(--color-blue-700);
  --radius: 0.75rem;              /* 12 px, Figma radius/base */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: var(--radius);
  --radius-xl: var(--radius);     /* cards 12 px */
  --button-radius: 9999px;        /* pill */
  --input-radius: 9999px;
  --font-sans: var(--font-jakarta), ui-sans-serif, system-ui, sans-serif;
}
.dark {
  --primary: var(--color-blue-600);
  --primary-foreground: var(--color-white);
  --ring: var(--color-blue-500);
  --brand: var(--color-blue-400);
  --accent: var(--color-neutral-800);   /* dark accent stays neutral */
  --sidebar-primary: var(--color-blue-600);
  --sidebar-primary-foreground: var(--color-white);
  --button-primary-hover: color-mix(in oklab, var(--primary) 90%, transparent);
}
/* Corporate: keep the existing slate block, plus: */
.theme-corporate {
  --primary: var(--color-blue-700);
  --primary-foreground: var(--color-white);
  --ring: var(--color-blue-600);
  --brand: var(--color-blue-700);
  --accent: var(--color-blue-50);
  --sidebar-primary: var(--color-blue-700);
  --sidebar-primary-foreground: var(--color-white);
  --button-primary-hover: color-mix(in oklab, var(--primary) 90%, transparent);
  --radius: 0.25rem;              /* 4 px */
  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: var(--radius);
  --radius-xl: 6px;
  --button-radius: var(--radius-md);
  --input-radius: var(--radius-md);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
}
.dark.theme-corporate {
  --primary: var(--color-blue-600);
  --ring: var(--color-blue-500);
  --brand: var(--color-blue-400);
  --accent: var(--color-slate-800);
  --sidebar-primary: var(--color-blue-600);
}
/* Showcase: existing block, change --radius-xl and the hover; pill and font come from :root */
.theme-showcase {
  /* ...existing violet values... */
  --radius: 0.75rem;
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: var(--radius);
  --radius-xl: var(--radius);     /* was 16px */
  --button-primary-hover: color-mix(in oklab, var(--primary) 90%, transparent);
}
@theme inline {
  --color-brand: var(--brand);
  --radius-button: var(--button-radius);   /* rounded-button */
  --radius-input: var(--input-radius);     /* rounded-input */
}
/* --font-sans is set per theme above; do not also define it in @theme inline (that would be circular).
   Tailwind's font-sans and the body font read it from :root, .theme-corporate. */
```

Pill buttons in code (one place each, never per instance):
- `components/ui/button.tsx`: in the cva base and in the `sm`, `lg`, `icon*` sizes replace `rounded-md` with `rounded-button`; default variant `hover:bg-primary/90` -> `hover:bg-[var(--button-primary-hover)]`. Pagination, Calendar nav and anything built on `buttonVariants` follow.
- `toggle.tsx`, `toggle-group.tsx`: `rounded-md` -> `rounded-button` (group outer corners: `first:rounded-l-button last:rounded-r-button`).
- `tabs.tsx` (default list only): TabsList `rounded-lg` -> `rounded-button`, TabsTrigger `rounded-md` -> `rounded-button`.
- `input.tsx`, `select.tsx` (SelectTrigger), `input-group.tsx` (add `overflow-hidden`), Combobox and Date Picker triggers: `rounded-md` -> `rounded-input`. Textarea keeps `rounded-md`.
- Card keeps `rounded-xl` (= 12 px through `--radius-xl`).

Section bands: `--section-muted-background` is `var(--color-neutral-50)` in `:root`, `var(--muted)` in `.dark`
and the Corporate theme; add `--color-section-muted: var(--section-muted-background)` to `@theme inline`
and use `bg-section-muted` on full-width sections (never `bg-muted`, muted text fails 4.5:1 on it in Light).

Showcase theme (`Showcase Light`, `Showcase Dark` modes) in `globals.css`:

```css
/* Showcase theme: violet brand ramp = Tailwind violet (color/brand/* in Figma) */
.theme-showcase {
  --primary: var(--color-violet-600);
  --primary-foreground: var(--color-white);
  --ring: var(--color-violet-600);
  --brand: var(--color-violet-700);
  --accent: var(--color-violet-50);
  --chart-1: var(--color-violet-600);
  --chart-7: var(--color-blue-600);
  --sidebar-primary: var(--color-violet-600);
  --sidebar-primary-foreground: var(--color-white);
  --icon-tile-gradient-start: var(--color-violet-500);
  --icon-tile-gradient-end: var(--color-violet-700);
  --radius: 0.75rem;   /* 12 px */
  --radius-sm: 6px;    /* Figma radius/sm in Showcase */
  --radius-md: 8px;
  --radius-lg: var(--radius);
  --radius-xl: var(--radius);
}
.dark.theme-showcase {
  --primary: var(--color-violet-600);
  --primary-foreground: var(--color-white);
  --ring: var(--color-violet-500);
  --brand: var(--color-violet-400);
  --accent: var(--color-neutral-800); /* dark accent stays neutral */
  --chart-1: var(--color-violet-400);
  --chart-7: var(--color-blue-500);
  --sidebar-primary: var(--color-violet-600);
  --sidebar-primary-foreground: var(--color-white);
}
```

## Email (React Email)
New table section for references/code-mapping.md: "## Email (React Email)". Emails are built with
`@react-email/components` (table-based HTML with inline styles), not shadcn. Tokens are resolved to hex at build time
(email clients do not support CSS variables); one theme object per brand (Light, plus a `prefers-color-scheme: dark`
style block for clients that support it).

| Figma | Code | Notes |
|---|---|---|
| Template frame `Screen / Email / *` (muted canvas + 600 body) | `Html`, `Head`, `Preview`, `Body` (background section/muted-background), `Container` (maxWidth 600) | `Preview` holds the preheader text (inbox preview, 40 to 90 characters); `Tailwind` wrapper optional |
| `Email / Header` | `Section` + `Row` with `Column` `Img` (logo, `alt` = company name, height 32) and `Column` `Link` "View in browser" | Logo as a hosted PNG at 2x; SVG is not supported in Gmail and Outlook |
| `Email / Hero` | `Section` with optional `Img` (width 520, rounded), `Text` eyebrow, `Heading as="h1"`, `Text` | One h1 per email; same words as the subject |
| `Email / Button` | `Button` (`href`, padding 12px 24px, borderRadius 9999, background primary, color primary-foreground, fontWeight 600) | Renders a bulletproof padded link (works with images off, MSO padding hack included); Align=center: wrap in `Section` with `textAlign: "center"` |
| `Email / Content` | `Section` with optional `Heading as="h2"` and `Text` (16/28); links with `Link` | Fallback URL under a button goes here as plain text + `Link` |
| `Email / Code` | `Section` (background muted, borderRadius 12, padding 24, textAlign center) with `Text` label and `Text` (fontFamily monospace, fontSize 36, letterSpacing 10) | Code also in the subject line; never an image |
| `Email / Details`, `Email / Details Row` | `Section` (border, borderRadius 8, padding "12px 20px") with one `Row` per line: `Column` `Text` label + `Column align="right"` `Text` value | Tables carry `role="presentation"` (React Email adds it) |
| `Email / Line Items`, `Email / Line Item`, `Email / Total Row` | `Section` with `Row` per item: `Column` `Img` (64 x 64), `Column` `Text` name + meta, `Column align="right"` `Text` amount; `Hr`; `Row` per total | Total row bold 18; amounts formatted with `Intl.NumberFormat` and the currency |
| `Email / Callout` | `Section` (backgroundColor tone tint as solid hex, borderRadius 8, padding 16) with `Row`: `Column` `Img` icon 20 + `Column` `Text` title and `Text` body | Use solid hex tints (rgba is unreliable in Outlook); icon PNG, `alt=""` |
| `Email / Divider` | `Hr` (borderColor border, margin "0 40px") | |
| `Email / Stats`, `Email / Stat` | `Row` with up to three `Column` cells (background muted, border, borderRadius 8, padding 16): `Text` value, `Text` label, `Text` change | Cells stack under 480 px with a media query in `Head` |
| `Email / Article` | `Row`: `Column` `Img` (160 x 120) + `Column` `Heading as="h3"`, `Text`, `Link` | Whole title links to the article too |
| `Email / Footer` | `Section` (textAlign center) with `Row` of `Link` + `Img` social icons (20 px), `Text` address, `Text` reason, `Link` preferences, `Link` unsubscribe | Also send the `List-Unsubscribe` and `List-Unsubscribe-Post` headers for marketing mail |

## Admin
| Figma | Code | Notes |
|---|---|---|
| `Access Row`, `Invite Row`, `Share Link Row` | shadcn `Avatar`, `Select`, `Popover` + `Command` (combobox with chips), `Button` | Copy with `navigator.clipboard.writeText`; validate emails with zod |
| `Integration Card` | shadcn `Card size="sm"` + `Button`, `Switch`, `Badge` | Connect opens the provider OAuth flow; letter tile = square `Avatar` fallback; Learn more = `Button variant="link"` |
| `Permission Row` | shadcn `Table`: header `th scope="col"`, group rows `th colSpan`, `Checkbox` cells | Form state in react-hook-form; save with `Save Bar`; selected role column `bg-muted`; log changes |
| `API Key Row` | custom row + `Badge`, `Button size="icon"`, `DropdownMenu`; `AlertDialog` for revoke | Full key shown once at creation, then only the last 4 characters |
| `Session Row` | custom row + `Badge` and `Button` | Sessions from your auth provider (Auth.js, Clerk, WorkOS); the current device cannot sign itself out |
| `Org Chart Node` | @xyflow/react with a dagre layout (or react-d3-tree); custom node with `Avatar` | `role="tree"` semantics for keyboard use |

## Built from base components
These have no component of their own since 0.51.0. Build them from the base component; the
example frame on the named Figma page shows the composition.

| Figma example | Code | Notes |
|---|---|---|
| "AI action" (Button page) | shadcn `Button` with lucide `Sparkles` before the label | A verb, never just "AI" |
| "wishlist" (Button page) | shadcn `Button size="icon" variant="ghost"` + lucide `Heart` (`fill-current` when saved) | Optimistic toggle; aria-label names state and product |
| "scroll to top" (Button page) | shadcn `Button size="icon" variant="outline"`, `fixed bottom-6 right-6` | Shown after two screens of scroll; moves focus to the top |
| "sign-in providers" (Button page) | shadcn `Button variant="outline"` `w-full` + provider mark | `signIn(provider)` in Auth.js, Clerk or WorkOS |
| "theme switch" (Toggle Group page) | shadcn `ToggleGroup type="single"` + next-themes `setTheme` | System by default; no flash on load |
| "view switch" (Toggle Group page) | shadcn `ToggleGroup type="single"` with icons; view in a URL search param | Remember per person; filters survive the switch |
| "billing period" (Toggle Group page) | shadcn `ToggleGroup type="single"` + `Badge` | Period in state and URL; all prices update without reload |
| "stock status" (Badge page) | `Status Dot` + text `<span>` | Per selected variant; `aria-live="polite"` on change |
| "welcome dialog" (Dialog page) | shadcn `Dialog` with a step state | Shown once per user; Skip and Esc close it |
| "language switch" (Select page) | shadcn `DropdownMenu` + `DropdownMenuRadioGroup` (or `Select`) | Names in their own language, `lang` on each; no flags |

Variants added in 0.49.0 map to props: Button `loading` (spinner + `disabled`), Button Icon `size` (sm, default, lg), Avatar `shape` (rounded-md for square) and xs (`size-5`), Sidebar Item level 2 (`SidebarMenuSub`), Tab with icon, Menu Item description and submenu (`DropdownMenuSub`), rich Tooltip with `Kbd`, Progress tone (indicator color class), Image Placeholder 21:9 (`aspect-[21/9]`).

Property renames in 0.51.0 do not change the code. Booleans are now `Show <part>`: `Show leading
icon` is still the icon child before the label, `Show close` the close button, `Show remove` the
remove button. Icon swaps are named `Leading icon`, `Trailing icon` and `Icon`. Tab `Variant`
(default, line, vertical) maps to the Tabs row above. Accordion Item and Calendar Event
`Size=sm` replace `compact`. Toggle Group Item `selected` is `data-state="on"`. Plan Card
`Variant=featured` is the ring and the primary Button. Notification Item `State=unread`, Address
Card `State=selected` and Filter Section `State=expanded` (`Collapsible open`) replace the old
booleans. Trend Indicator `Trend`, Password Strength `Level`, Calendar Event `Series`
(`var(--chart-N)`) and `Type` on Select Option, Access Row and Share Link Row are renames only.
Outcome values are `done` and `error` (no `complete`, no `failed`); status values use hyphens
(`on-track`, `at-risk`, `off-track`, `in-progress`).
