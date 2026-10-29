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
| `Badge`, `Badge Count`, `Status Dot` | shadcn `Badge` (+ success, warning, info variants; soft-success, soft-warning, soft-destructive, soft-info, soft-neutral as cva variants `bg-[var(--badge-soft-X-bg)] text-[var(--badge-soft-X-fg)]`; category-1 to category-8 as `bg-[var(--badge-category-N-bg)] text-[var(--badge-category-N-fg)]`; size `sm` = `h-4 px-1.5`, `lg` = `h-6 px-2.5 text-sm`) | Status Dot: custom span + label. Soft = status color at 10% (Light) / 20% (Dark) with a darker or lighter text step; category = chart/N at the same opacities with hue 800 / 300 text; one style per table. Badge Count Type=dot: `<span class="size-2 rounded-full bg-primary" aria-hidden>` + `sr-only` "unread"; counts cap at "99+" |
| `Chip`, `Tag` | custom on `Badge` + remove `Button` | Chip sizes `h-6 px-2 text-xs` (sm), `h-8 px-3` (default), `h-10 px-4` (lg); Show avatar = shadcn `Avatar className="size-5 -ml-1.5"` (`size-6 -ml-2` on lg); Show count = `<span class="tabular-nums">`; label `min-w-0 truncate`, chip `max-w-80`, tag `max-w-48`; Tag sizes `h-5 px-1.5` (sm), `h-6 px-2`; Tone=category-N uses the Badge category classes |
| `Avatar`, `Avatar Group` | shadcn `Avatar` | `Type=image` = `AvatarImage` (the `Photo` swap is a sample face, use the person's photo URL); `Type=initials` = `AvatarFallback`; `Type=icon` = `AvatarFallback` with lucide `User` / `Bot` / `Users` (`size-1/2 text-muted-foreground`). Sizes `size-5` (xs) to `size-16` (2xl) and `size-24` (3xl). Status (`Avatar Status`): `absolute bottom-0 right-0 rounded-full ring-2 ring-background` with `bg-success`, `bg-warning`, `bg-destructive`, `bg-muted-foreground` + sr-only text; Show verified (`Avatar Verified`): lucide `BadgeCheck` or a check in `bg-info text-info-foreground` in the same corner. Group: negative margin + ring |
| `Byline` | shadcn `Avatar` + name and detail (`flex items-center gap-3`) | Name links to the profile; dates in `<time>` |
| `Separator` | shadcn `Separator` | |
| `Input`, `Field`, `Textarea` | shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) | Field = `FormItem` with label, description, message |
| `Input Group`, `Input Addon`, `Number Input` | shadcn `InputGroup` or custom | |
| `Input OTP`, `OTP Slot` | shadcn `InputOTP` (`InputOTPGroup`, `InputOTPSlot`) | |
| `Select`, `Combobox`, `Tag Input` | shadcn `Select`; `Popover` + `Command` | |
| `Checkbox`, `Radio`, `Switch` | shadcn `Checkbox`, `RadioGroup`, `Switch` | |
| `Calendar`, `Calendar Day`, `Date Picker`, `Date Range Picker` | shadcn `Calendar` (react-day-picker) in `Popover` | |
| `Time Picker` | custom `Select` of times | |
| `Slider`, `Progress` | shadcn `Slider`, `Progress` | Slider Value (0, 25, 50, 75, 100) = `value` as a percent of `max`. Progress Value (Type=default): 0 to 100 in steps of 10, plus 25 and 75 = `value` |
| `Tabs`, `Tab` | shadcn `Tabs` (`TabsList`, `TabsTrigger`) | Variant=line: `TabsList` with a bottom border (`border-b`); Variant=vertical: `orientation="vertical"`, `TabsList` as `flex-col`, a `Select` of sections on mobile |
| `Toggle Group`, `Toggle Group Item` | shadcn `ToggleGroup` (`type` single or multiple) | View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme` |
| `Accordion`, `Accordion Item` | shadcn `Accordion` (`AccordionItem`) | Size=sm: smaller padding |
| `Tooltip`, `Popover`, `Hover Card` | shadcn `Tooltip`, `Popover`, `HoverCard` | |
| `Menu`, `Menu Item`, `Menu Label` | shadcn `DropdownMenu`, `ContextMenu` (`DropdownMenuLabel`, `DropdownMenuSeparator`) | |
| `Command`, `Command Input`, `Command Dialog` | shadcn `Command`, `CommandInput`, `CommandDialog` | |
| `Dialog`, `Dialog Header`, `Dialog Footer`, `Alert Dialog` | shadcn `Dialog` (`DialogHeader`, `DialogFooter`), `AlertDialog` | |
| `Sheet`, `Drawer` | shadcn `Sheet`, `Drawer` (vaul) | |
| `Side Panel` | `<aside>` | expanded `min-w-60`, title `truncate`; collapsed rail title `max-h-[200px] truncate` (vertical writing mode) |
| `Alert`, `Toast` | shadcn `Alert`, `Sonner` | |
| `Card`, `Card Header`, `Card Footer`, `Stat Card` | shadcn `Card` (`CardHeader`, `CardFooter`) + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) | Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Card Header `Show icon` / `Icon` = optional Lucide icon (`size-5`, `aria-hidden`) before `CardTitle` in a `flex items-center gap-2` row. Stat Card: custom content |
| `Stat Card` | shadcn `Card` | trend text `max-w-[200px] truncate`, icon `shrink-0` |
| `Skeleton`, `Spinner`, `Kbd`, `Kbd Group` | shadcn `Skeleton`, `Spinner`, `Kbd` (`KbdGroup`) | Kbd text `text-foreground` (not `text-muted-foreground`): muted text on `bg-muted` is 4.35:1 in Light |
| `Pagination`, `Pagination Item`, `Breadcrumb`, `Breadcrumb Item` | shadcn `Pagination` (`PaginationItem`), `Breadcrumb` (`BreadcrumbItem`) | In tables use `Table Pagination` |
| `Pagination Compact` | shadcn `Pagination` with `PaginationPrevious`, a text item, `PaginationNext` | |
| `Pager Link` | `<a>` card (`rounded-xl border p-4 hover:bg-accent focus-visible:ring`) with lucide `ChevronLeft` / `ChevronRight`, two of them in a `<nav>` | Docs prev/next; for tables and lists use `Pagination` |
| `Sidebar`, `Sidebar Item`, `Sidebar Group`, `Sidebar Group Label`, `Sidebar Workspace`, `Sidebar User` | shadcn `Sidebar` (`SidebarMenuItem`, `SidebarGroup`, `SidebarGroupLabel`, `SidebarHeader`, `SidebarFooter`) | |
| `Sidebar Double` | shadcn `Sidebar` (rail + panel) | Expanded `min-w-72` |
| `Navigation Menu Panel`, `Navigation Menu Link`, `Nav Link` | shadcn `NavigationMenu` (`NavigationMenuContent`, `NavigationMenuLink`, `NavigationMenuTrigger`) | |
| `Stepper`, `Step` | custom (no shadcn stepper) | |
| `Description List Item`, `Timeline Item` | custom `dl` with `dt` / `dd` and a Tailwind grid; custom `ol` | No shadcn component |
| `Meta Item`, `Figure` | custom: icon + text (`text-sm text-muted-foreground`); `dl` with value and label | Figure has no trend; that is Stat Card |
| `Summary Row` | `<dl>` row, `flex justify-between`, `tabular-nums` | Discount keeps the minus sign; Separator above the total |
| `Setting Row` | custom row + shadcn `Switch`, `Select` or `Button` | Label and `aria-describedby` from the texts |
| `Carousel`, `Carousel Arrow`, `Carousel Indicator`, `Carousel Slide` | shadcn `Carousel` (Embla): `CarouselPrevious`, `CarouselNext`, dots from the Embla API | Autoplay plugin only with a pause control |
| `Carousel Gallery`, `Carousel Thumbnail` | Embla main + thumbs carousels | |
| `Carousel Hero` | Embla with Autoplay | `min-w-[768px]` (phones: static hero); content and controls in `mx-auto max-w-[1152px] px-6`; overline `truncate`, title and text `line-clamp-3` |
| `Lightbox` | Radix Dialog full screen | title `flex-1 min-w-0 truncate` |
| `People Picker`, `Person Option` | shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger | Server search by name, email, team; debounce 200 ms |
| `Transfer List` | custom | `grid grid-cols-[1fr_auto_1fr] min-w-[512px]`, lists `min-w-52`; titles `truncate` |
| `Inline Edit` | custom: text ↔ `Input` with save / cancel `Button Icon`s | Optimistic save, revert on error |
| `Signature Pad` | `signature_pad` (or `react-signature-canvas`) in a bordered canvas | Typed fallback; store PNG/SVG + timestamp |
| `Sortable List Item` | `@dnd-kit/sortable` with keyboard sensor and announcements | Drag handle = `useSortable` listeners |
| `Progress Ring` | SVG circle with `stroke-dasharray` (or Radix Progress) | `role="progressbar"`, `aria-valuenow` |
| `Scroll Area` | shadcn `ScrollArea`, `ScrollBar orientation="horizontal"` | The Content slot is the `ScrollArea` children |
| `File Preview` | `react-pdf` (pdf.js) for PDF, `<img>` for images, in `Sheet` or `Dialog` | Unsupported types: download link |
| `Image Cropper`, `Avatar Upload` | `react-easy-crop` in a `Dialog`; shadcn `Avatar` + file input | Crop on the client, upload the result. Shape=square is `Avatar` with `rounded-md` for workspace and company logos |
| `Menubar`, `Menubar Trigger` | shadcn `Menubar` (`MenubarMenu`, `MenubarTrigger`, `MenubarContent`) | |
| `Cookie Consent` | custom banner / card + shadcn `Dialog` with `Switch`es; or a CMP (Cookiebot, Osano) styled to match | Load scripts only after consent |
| `Copy Field` | shadcn `InputGroup` with a `readOnly` Input (`font-mono`) + Copy `Button`; `navigator.clipboard.writeText` | copied state 2 s, no toast; mask secrets until Reveal |
| `Search Field` | shadcn `InputGroup` (`type="search"`) + search icon, `Kbd`, clear `Button` | Debounce ~300 ms; global search opens `CommandDialog` |
| `Inline Form` | `<form class="flex gap-2">` with shadcn `Input` + `Button` (react-hook-form + zod) | Keep the value on error. Tone=on-primary: `Button variant="secondary"`, hint and messages `text-primary-foreground` |
| `Currency Input` | shadcn `InputGroup` with a `Select` of ISO codes + `Input`; react-number-format or `Intl.NumberFormat` | Store minor units + ISO code; one currency: Input Group prefix |
| `Phone Input` | react-phone-number-input (libphonenumber-js) + shadcn `Popover` + `Command` country list | Store E.164; `type="tel"`, `autocomplete="tel"` |
| `Date Input` | react-aria `DateField` + shadcn `Popover` with `Calendar` (react-day-picker) | Segments in locale order |
| `Duration Input` | custom: two shadcn `Input`s (`inputmode="numeric"`) with unit addons | Parse "1:30", "90", "1.5h" on blur; store minutes |
| `Range Input` | each field `min-w-0 flex-1`; unit `max-w-8 truncate shrink-0`; value `truncate` | |
| `Address Autocomplete` | shadcn `Popover` + `Command` (`shouldFilter={false}`) fed by a places API (Google Places, Mapbox) | Debounce, 3 characters minimum; fills the address Fields |
| `Select Option` | shadcn `CommandItem` / `SelectItem` with `Avatar` or icon, two text lines, check icon | Same Leading for every option in a list |
| `Recurrence Picker` | custom: `Number Input`, `Select`, `ToggleGroup` (multiple), `RadioGroup`; rrule | Summary from `rrule.toText()` or own strings; account time zone |
| `Option Card` | shadcn `RadioGroup` (Control=radio) or `Checkbox` (Control=checkbox) with a `Label` wrapping a `Card` (`has-[:checked]:ring-2`) | Whole card is the target; checkbox groups in a `<fieldset>` |
| `File Field` | custom: hidden `input type="file"` + shadcn `Button`, file name, remove `Button` | Several files: `File Dropzone` (react-dropzone) |
| `Swatch`, `Swatch Picker` | shadcn `RadioGroup` (or `ToggleGroup type="single"`) with custom items: a color dot (Type=color) or a label box (Type=label) | Color or option name as label; unavailable: `aria-disabled`, still focusable |
| `Form Section` | `Layout=side`: `@container` grid `@min-[640px]:grid-cols-[280px_1fr]`, stacked below 640 | Same component in code; the container query replaces the variant switch |
| `Fieldset` | `<fieldset>` + `<legend>`; shadcn `RadioGroup` or `Checkbox` items, `FormMessage` for the group | Error belongs to the group |
| `Error Summary` | list `w-full`; each link `line-clamp-2` | |
| `Requirement List` | custom `<ul>` of `Check Item`s, state from the zod schema of the field | `aria-live="polite"`; nothing red before submit |
| `Check Item` | `<li class="flex gap-2">` with lucide `CircleCheck`, `Minus` or `X` (`aria-hidden`) and an sr-only status | Mark=check, dash, x. Tone=on-primary: label and icon `text-primary-foreground`; Tone=inverted: `text-background`, dash `text-muted` |
| `Password Strength` | custom bars + text under the shadcn `Input` | Level in text, not only color |
| `Emoji Picker` | frimousse or emoji-mart in shadcn `Popover` | Search, recent first, 8 per row; skin tone stored per user |
| `App Launcher` | shadcn `Popover` with a `grid-cols-3` of links | Current app `aria-current="page"`; only 4+ apps |
| `Confirm Popover` | shadcn `Popover` (`role="alertdialog"`) + two `Button`s | Irreversible actions use `AlertDialog` |
| `Back Link` | `Link` with `ArrowLeft`, `text-sm text-muted-foreground` | Fixed URL to the list; restore its filters and scroll |
| `Skip Link` | `max-w-80 text-center` | |
| `Account Menu` | shadcn `DropdownMenu` with `DropdownMenuLabel` (Avatar, name, email) | Log out last after `DropdownMenuSeparator` |
| `Show More` | shadcn `Collapsible` or `line-clamp-3` + `Button variant="link"` | `aria-expanded` on the toggle |
| `Load More` | custom | Count `w-full text-center line-clamp-2` |
| `Shortcut Row` | custom `flex justify-between` + shadcn `Kbd` / `KbdGroup` | ⌘ on Mac, Ctrl elsewhere |
| `Resizable Panels` | shadcn `Resizable` | `min-w-[480px]`; end panel `flex-1 min-w-0` |
| `FAB` | shadcn `Button size="icon"` `rounded-full shadow-lg fixed bottom-20 right-4` | Mobile only; desktop uses a primary Button |
| `Action Sheet` | title `line-clamp-2`, description `line-clamp-3`, action labels `min-w-0 flex-1 truncate` | |
| `Countdown` | tile values and units `truncate text-center` | Tiles keep their width |
| `Loading Overlay` | custom overlay | Message `inset-x-6 text-center line-clamp-2` |
| `Presence Bar` | shadcn `Avatar` group + `HoverCard` | Presence from Liveblocks, Yjs awareness or your websocket |
| `List Item` | custom row (`ul` / `li`) with shadcn `Avatar` and `Badge` | Show leading and Show trailing map to optional children. `Show divider` = `border-b` on the `li` (or `divide-y` on the `ul`), off on the last row |
| `Tree Item` | custom tree (`role="tree"`) with shadcn `Checkbox` and `Badge` | Arrow keys expand and collapse |
| `Top Bar` | `min-w-80`; breadcrumb `min-w-0 flex-1` | |
| `Page Header` | `flex flex-wrap gap-3`; text `min-w-60 flex-1`; title and description `line-clamp-2` | Actions wrap under the text |
| `Mobile Header` | custom header with shadcn `Button size="icon"` and `Avatar`; Type=brand renders the product `Logo` (link to home) in place of the back button and title | Entry screens (sign in, sign up) use brand |
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
| `Table Toolbar` | custom | `flex flex-wrap gap-2`; selection `min-w-32 flex-1 truncate` |
| `Data Grid Toolbar`, `Table Group Row` | custom on TanStack Table (grouping, aggregation, visibility) | Saved views stored per user. Table Group Row State=expanded / collapsed = `row.getIsExpanded()`, chevron-down / chevron-right with `aria-expanded` |
| `Filter Condition`, `Filter Group` | custom: `Select`, `Combobox`, `Input`, `Button` | Serialize to the API filter format |
| `Filter Bar`, `Filter Chip`, `Faceted Filter`, `Facet Option` | shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) | Faceted values from `column.getFacetedUniqueValues()` (TanStack) |
| `Filter Section` | `Collapsible` + `Checkbox` list | |
| `Table Cell Amount`, `Table Cell Status`, `Table Cell Progress`, `Table Cell Actions` | cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` | Amounts with `Intl.NumberFormat`, `tabular-nums`; Table Cell Status note `min-w-0 truncate` so it fills the cell |
| `Table Cell Link`, `Table Cell Date`, `Table Cell File`, `Table Cell Badges`, `Table Cell Avatars` | cell renderers: `<a>`, `<time>`, icon + name, `Badge` list with a `Popover` for +N, `Avatar` group | One date format per column |
| `Table Pagination` | shadcn data-table pagination | Container `flex flex-wrap gap-y-3 min-w-[448px]`; range `min-w-40 flex-1 truncate` |
| `Table Cell Check` | cell renderer: lucide `Check` / `Minus` icon with `sr-only` "Included" / "Not included", or the text value; optional muted note | Plan comparison cells; excluded is a dash, never blank |
| `Entity Card`, `Progress Card` | shadcn `Card` with `size="sm"`; `Progress` | |
| `Person Card` | shadcn `Card` + `Avatar`, `Badge`, links (`mailto:`, `tel:`) | |
| `Event Card`, `Date Tile` | shadcn `Card` + `Badge`, `Button`; date tile as custom markup | `<time datetime>` for the date. `datePosition` prop (text, image) on vertical: image = tile `absolute top-3 left-3 bg-background` inside a `relative` image wrapper |
| `Empty State` | shadcn `Empty` (or a custom block: icon, title, description, actions) | |
| `Approval Step` | custom timeline item | role `line-clamp-2`, time `truncate` |
| `Change Item` | custom row | `flex flex-wrap gap-y-1`; old / new value chips `max-w-60 truncate`; field `line-clamp-2` |
| `Save Bar` | custom sticky footer | `flex flex-wrap gap-2`; message `min-w-40 flex-1 line-clamp-2` |
| `Org Switcher` | `DropdownMenu` content | `min-w-48`; names, roles and action labels `truncate` |
| `Bar Chart`, `Line Chart`, `Sparkline` | shadcn `Chart` (Recharts) | `var(--chart-N)` |
| `Chart Legend`, `Chart Legend Item` | shadcn `ChartLegend` with `ChartLegendContent` (Recharts) | Colors from `chartConfig` |
| `Chart Tooltip`, `Chart Tooltip Row` | shadcn `ChartTooltip` with `ChartTooltipContent` (Recharts) | |
| `Chart Card` | shadcn `Card` + shadcn `Chart` + `ToggleGroup` | header `flex flex-wrap gap-4 gap-y-3`, titles `flex-1 min-w-40`, title and description `line-clamp-2`; footer trend `flex gap-2` icon first then insight `line-clamp-2`; note `line-clamp-2`; omit the actions wrapper when empty |
| `Funnel Chart` | Recharts `FunnelChart`, or plain bars with widths from the data | |
| `Scatter Chart` | Recharts ScatterChart | axis titles `flex gap-4`, each `flex-1 min-w-0 truncate`, X title `text-right` |
| `Donut Chart`, `Bar Chart Horizontal` | Recharts `PieChart` (`innerRadius`), `BarChart layout="vertical"` | |
| `Heatmap` | CSS grid `grid-cols-[32px_repeat(12,minmax(0,1fr))]` | `min-w-[276px]`; cells stretch |
| `Gauge` | Recharts RadialBarChart (half circle) | `min-w-[240px]`; arc `mx-auto`; Min and Max `max-w-[72px] truncate`; target label `flex-1 min-w-0 truncate`; label `line-clamp-2` |
| `Waterfall Chart` | Recharts BarChart (stacked, invisible base) | `min-w-[500px]`; legend `flex flex-wrap` |
| `Combo Chart` | Recharts `ComposedChart`: `Bar yAxisId="left"` + `Line yAxisId="right"` | Two `YAxis`, both from 0 |
| `Treemap` | Recharts Treemap | tile label `truncate` inside the tile width (full label in the tooltip) |
| `Gantt Bar`, `Gantt Milestone`, Gantt block | SVAR Gantt, Frappe Gantt, or a custom grid with dnd-kit | |
| `Page Toolbar` | `flex flex-wrap gap-2`; start `min-w-64 flex-1`; search `min-w-32 max-w-80 flex-1` | End group wraps to a second line |
| `Trend Indicator` | custom: lucide `TrendingUp` / `TrendingDown` / `Minus` + `<span class="tabular-nums">`; Style=badge wraps both in a soft `Badge` | Direction from the data, tone from the meaning (`text-success`, `text-destructive`, `text-muted-foreground`, or the soft Badge of that tone); hidden "Up" / "Down" text |
| `Metric Strip`, `Metric Strip Item` | `<dl class="grid grid-cols-2 md:grid-cols-4 divide-x">` with `dt` / `dd` + `Trend Indicator` | 3-5 items; one period said once nearby |
| `Usage Meter` | top row `flex flex-wrap`; label `min-w-30 flex-1 line-clamp-2`; usage `truncate max-w-40`; hint `line-clamp-3` | |
| `Leaderboard Row` | rank `w-5 truncate`; name `min-w-20 flex-1 truncate`; value `max-w-22 truncate tabular-nums` | |
| `Dashboard Widget` | react-grid-layout (12 cols, `draggableHandle`) with shadcn `Card` per item | Sizes 3, 4, 6, 12 columns; save the layout per user |
| `Distribution Bar` | custom | total `max-w-[140px] truncate shrink-0`; title `flex-1 min-w-[120px]` |
| `Bullet Chart` | custom SVG / divs | `flex flex-wrap gap-4 gap-y-2`; label `w-[140px]` with `truncate` lines; track `flex-1 min-w-40`; values `max-w-[120px] truncate` |
| `Radar Chart` | Recharts RadarChart | `min-w-[288px]`, chart centered |
| `Sankey Chart` | Recharts `Sankey` with custom node and link renderers | Links colored by source with `var(--chart-N)`; under 12 nodes |
| `Choropleth Map` | custom SVG tile map | SVG `w-full` with viewBox (regions scale); `min-w-[240px]` |
| `Version Item` | custom list with shadcn `Avatar`, `Badge`, `Button`; preview in `Diff Viewer` | Restore creates a new version |
| `Automation Rule` | custom card | name `line-clamp-2`, meta `truncate`; sentence `flex flex-wrap`; chips `max-w-60 truncate` |
| `Workflow Node` | @xyflow/react custom node (`Handle` for ports), settings in shadcn `Sheet` | Edges 1.5 px `border/default`; keyboard and list view for steps |
| `Mapping Row` | shadcn `Select` (or `Combobox`) + lucide `ArrowRight` + status `Badge`; react-hook-form `useFieldArray` | Auto-match by name; save the mapping as a template |
| `Availability Row` | custom | `flex flex-wrap gap-y-2`; hours group `shrink-0` |
| `Time Slot` | shadcn `ToggleGroup type="single"` (or `RadioGroup`) of outline `Button`s | Times from the availability API; time zone above the grid |
| `Background Job` | custom row: shadcn `Progress` + `Button` | Status by polling or server-sent events; notify when done |
| `Task Item` | custom row: shadcn `Checkbox` + `Avatar` | Optimistic save with an Undo toast (Sonner) |
| `Saved View Item` | shadcn `SidebarMenuItem` + `SidebarMenuBadge` + `DropdownMenu` | View = serialized filters, sort and columns per user |

## Content, communication, AI
| Figma | Code | Notes |
|---|---|---|
| `Rich Text Editor` | footer `flex gap-2`; hint `min-w-0 flex-1 line-clamp-2`; count `shrink-0 tabular-nums` | |
| `Post Card` | shadcn `Card` | meta `flex min-w-0`, date `truncate`; author name `truncate` |
| `Code Block` | Shiki or Prism + copy `Button` | |
| `Quote` | custom `<figure>` | Name `max-w-48 truncate`; role `line-clamp-2`; quote text never clamped |
| `Section Heading` | custom | `flex flex-wrap gap-3`; text column `min-w-48 flex-1`; title `line-clamp-2`, description `line-clamp-3` |
| `Feature Item` | custom: `Icon Tile` (lucide icon in a `size-10 rounded-md` tile, Style neutral `bg-muted` by default) + `<h3>` + `<p>` | Icon `aria-hidden`; grid of 3 or 4. Tile Style follows the nested Icon Tile (brand: `bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)]`). Layout=card: wrap in shadcn `Card` (`rounded-xl border bg-card p-6 gap-4`); link as `Button variant="link"`. Marker=number: an `<ol>`, number circle `rounded-full bg-primary text-primary-foreground`, `aria-hidden` |
| `Badge List` | `Badge` list | `flex flex-wrap gap-1`; +N `shrink-0` |
| `Table of Contents`, `Table of Contents Item` | custom with scroll spy | |
| `Comment`, `Comment Composer` | custom + `Textarea` | |
| `Chat Message`, `Chat Composer`, `Typing Indicator` | custom | Chat Message Size=default `max-w-[440px]`, Size=compact `max-w-[300px]` (panels under 480); text wraps, no manual breaks |
| `Prompt Input`, `User Message`, `Assistant Message`, `Reasoning`, `Tool Call`, `Sources`, `Source Item`, `Citation`, `Prompt Suggestion` | Vercel AI SDK + AI Elements, or assistant-ui | Prompt Input Content=placeholder or filled follows the textarea value; Send enabled only when filled |
| `Model Picker`, `Model Option`, `Context Chip`, `Agent Plan`, `Plan Step`, `Artifact Card` | AI Elements (model select, task, artifact) or custom on `DropdownMenu`, `Badge`, `Card` | Plan steps from the agent's tool events |
| `Voice Recorder` | MediaRecorder + speech-to-text API; custom UI | Ask for the microphone on first tap |
| `Chat History Item` | shadcn `SidebarMenuItem` + `DropdownMenu` | |
| `Response Feedback` | `Popover` or inline `Card` with `ToggleGroup` (multiple) and `Textarea` | Send with the message id |
| `AI Summary`, `AI Suggestion`, `AI Notice` | custom on `Card`, `Input`, `Badge` | Store who accepted an AI value and when |
| `File Dropzone`, `File Item`, `Attachment` | react-dropzone + custom | |
| `Resource Item` | custom row + `Button` (ghost icon) with `<a download>` | Label names the file, format and size |
| `Rating` | custom `RadioGroup` | Score is the shown number (one decimal), Value the filled stars. Size=lg: stars `size-8`, value `text-lg font-semibold`, for review forms |
| `Color Picker` | react-colorful + Input Group | `min-w-[240px]`, parts `w-full` |
| `Coachmark`, `Hotspot` | Driver.js, Shepherd or `Popover` anchored to the target | |
| `Video Player` | native `video` or Vidstack | Size=lg: play button `size-24` (96 px) for hero and full-width players |
| `Kanban Card`, `Kanban Column` | card `min-w-56`, labels `flex flex-wrap`, title `line-clamp-3`, due `truncate max-w-20`; column `min-w-64 shrink-0`, title `min-w-0 flex-1 truncate` | Board scrolls horizontally (`overflow-x-auto`) |
| `Calendar Event`, scheduler blocks | custom grid, or FullCalendar themed with tokens | |
| Help center and docs blocks | page sections composed from `Input`, `Card`, `Breadcrumb`, `Button` | Search: shadcn `Command` (⌘K) or Algolia DocSearch; docs content: MDX (Nextra, Fumadocs) |
| `Block / Status Page` uptime bars | custom flex of 90 spans with `title` and an uptime % in text | Data from your status provider (Instatus, Better Stack, Atlassian Statuspage) |
| `Block / Navbar Mega Menu` | shadcn `NavigationMenu` with `NavigationMenuContent` | |
| `Notification Item`, `Notification Center` | shadcn `Popover` + `Tabs` + `ScrollArea`; custom rows with `Avatar` | Bell `Button` + `Badge`; opening an item marks it read |
| `Search Result Item` | custom | Path, meta and detail rows `min-w-0`, texts `truncate` (path `max-w-40`), badges `max-w-32`; title and snippet `line-clamp-2` |
| `Annotation Pin` | custom | `inline-flex min-w-7 px-1.5 rounded-full` (grows into a pill) |
| `Social Share` | shadcn `Button size="icon"`; `navigator.clipboard`, `mailto:`, `navigator.share`, network share URLs | Copy link confirms with Sonner; official network logos |
| `Command Snippet` | `<pre><code>` on `bg-muted` + shadcn `Button size="icon"` (`navigator.clipboard.writeText`) | Prompt `$` is `select-none aria-hidden`, never copied |
| `Endpoint Row` | `<a>` row | `flex flex-wrap gap-3 gap-y-1`; path `flex-1 min-w-[120px] truncate`; summary `max-w-[200px] truncate` |
| `Log Row` | virtualized list (`@tanstack/react-virtual`) of mono rows | `role="log"` for live tails; level as text |
| `Diff Viewer`, `Diff Line` | jsdiff (`diffLines`) + custom rows; `react-diff-viewer-continued` for side by side | 3 lines of context, rest collapsed; hidden "added" / "removed" text |
| `JSON Viewer` | custom tree | each line `truncate` (no wrap); full value on expand or copy |
| `Release Note Item` | `<article>` with shadcn `Badge`, `<time>`, optional `<img>`, `Button variant="link"` | New info, Improved secondary, Fixed success |
| `Release Note Line` | `<li>` with shadcn `Badge` + text, in a `<ul>` | Part of `Release Note Item` (Changes slot); New info, Improved secondary, Fixed success |
| `Footnote` | custom `<ol>` with ids; `<sup><a href="#fn-1">` in the text | Back link to `#fnref-1` |
| `Link Preview` | `<a>` card | domain `truncate min-w-0` |
| `Location Card` | shadcn `Card` + `<address>`, `tel:` link, maps link | Show map: a static map image or embed on top |
| `Image Compare Slider` | react-compare-slider, or `clip-path` + `<input type="range">` | Handle `role="slider"`, arrow keys |
| `Video Thumbnail` | `<button>` + `<img>` poster, lucide `Play`, `Badge` | Opens `Video Player` in place or in a `Dialog` |
| `Audio Player` | native `<audio>` + custom controls (shadcn `Button`, `Slider`), or Vidstack | Space play / pause, arrows seek 5 s |
| `Agenda Item`, `Meeting Card` | custom `<li>` with `<time>` pairs; shadcn `Card` + `Meta Item`, `Avatar` group, `Button` | Join is an `<a>` to the meeting URL; live from 5 min before the start |
| `Feedback Widget`, `NPS Survey`, `CSAT Rating` | shadcn `Button`, `ToggleGroup` (or `RadioGroup`) + `Textarea` | Send with page or ticket id, version and date; throttle per person |
| `Service Status Row` | custom row | head `flex flex-wrap gap-y-1`; service `min-w-32 flex-1 truncate`; uptime `max-w-40 truncate` |
| `Uptime Bars`, `Uptime Day` | flex row of 90 bars (`flex-1 h-7 rounded-sm`, `bg-success` / `bg-warning` / `bg-destructive` / `bg-info` / `bg-border` by state) with a shadcn `Tooltip` per day; caption "90 days ago" / "Today" | Each day has an accessible label with date and state |
| `Mention Chip` | Tiptap `Mention` extension + `Command` list; rendered as `<a>` | Mention notifies once; reader mentions use the warning tint |
| `Reaction Bar`, `Reaction` | custom flex of shadcn `Toggle` (`aria-pressed`) + `Popover` emoji picker (emoji-mart or frimousse) |  |
| `Thread Summary` | `<button>` row | `flex flex-wrap gap-x-2 gap-y-1`; texts `max-w-[120px] truncate` |
| `Job Listing` | row `flex flex-wrap gap-3`; body `min-w-60 flex-1`; title and meta `line-clamp-2`; salary `truncate max-w-56` | End group wraps under the body |
| `AI Loading`, `Confidence Indicator`, `AI Review Bar` | shadcn `Skeleton`, `Tooltip`, `Button` + custom; Vercel AI SDK for streaming; review bar on Tiptap track changes or a diff of the form state | Never apply low-confidence values automatically; store who accepted an AI value |

## Commerce
| Figma | Code | Notes |
|---|---|---|
| `Product Card` | shadcn `Card` | name `line-clamp-2`; variant `truncate` |
| `Line Item` | custom `<li class="flex gap-4">`: `<img>`, text, `Number Input` (Size=sm), amount, ghost `Button` | `tabular-nums`; Undo in `Sonner` toast |
| `Mini Cart` | shadcn `Popover` (`Sheet` on mobile) + `Line Item`s, `Summary Row`, `Button`s | Auto-open 4 s without moving focus |
| `Order Row` | `<a>` row + shadcn `Badge` | `flex flex-wrap gap-4 gap-y-2`; order `flex-1 min-w-40`, number and meta `truncate`; total `min-w-24 text-right whitespace-nowrap` |
| `Shipment Tracker` | custom + `Step` | `min-w-[560px]`; header `flex flex-wrap`, text `flex-1 min-w-40`, eta and carrier `truncate` |
| `Address Card` | radio card | name row `flex flex-wrap gap-2 gap-y-1`; name `max-w-[200px] truncate` |
| `Payment Method Card` | radio card | brand mark `w-11 truncate text-center` |
| `Review Item` | custom | Name `min-w-0 flex-1 truncate`; badge and date `max-w-32 truncate shrink-0`; title `line-clamp-2`; text `line-clamp-4` with a Read more link |
| `Rating Summary` | custom `flex flex-wrap gap-x-8 gap-y-4` | Average column `max-w-40`, value `truncate`, count `line-clamp-2`; distribution `flex-1 min-w-48` |

## Marketing
| Figma | Code | Notes |
|---|---|---|
| `Price` | custom flex row | Amount `whitespace-nowrap shrink-0`; period `min-w-0 truncate` |
| `Plan Card` | shadcn `Card` + `Price`, `Button`, `<ul>` of `Check Item` | Variant=featured: `ring-2 ring-primary`, primary `Button` |
| `Announcement Pill` | `<a>` (`rounded-full border`) + shadcn `Badge` + lucide `ArrowRight` | One at a time |
| `Trust Badge` | custom | name and detail `line-clamp-2` |
| `Testimonial Card` | custom | Quote `line-clamp-6` |
| `Logo Tile` | `<li>` with `<img alt>` or inline SVG in `currentColor` (`text-foreground`, `opacity-70` for Style=plain) | Logo is an instance swap; `<a>` only when it links to a case study or integration; alt = company name |
| `Logo`, `Logo Mark` | inline SVG in `currentColor` (or `<img alt>` with the product name) | Logo Mark is the symbol alone |
| `Map` | pin label `max-w-48`, title and address `truncate` | |
| `Device Frame` | address `min-w-0 flex-1 truncate` | |
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
| `Email / Button` | `Button` with `maxWidth: 240`, `whiteSpace: nowrap`, `overflow: hidden`, `textOverflow: ellipsis` | Keep labels short; the template is at least 320 wide |
| `Email / Content` | `Section` with optional `Heading as="h2"` and `Text` (16/28); links with `Link` | Fallback URL under a button goes here as plain text + `Link` |
| `Email / Code` | `Section` (background muted, borderRadius 12, padding 24, textAlign center) with `Text` label and `Text` (fontFamily monospace, fontSize 36, letterSpacing 10) | Code also in the subject line; never an image |
| `Email / Details`, `Email / Details Row` | `Section` (border, borderRadius 8, padding "12px 20px") with one `Row` per line: `Column` `Text` label + `Column align="right"` `Text` value | Tables carry `role="presentation"` (React Email adds it) |
| `Email / Line Items`, `Email / Line Item`, `Email / Total Row` | `Section` with `Row` per item: `Column` `Img` (64 x 64), `Column` `Text` name + meta, `Column align="right"` `Text` amount; `Hr`; `Row` per total | Total row bold 18; amounts formatted with `Intl.NumberFormat` and the currency |
| `Email / Callout` | `Section` (backgroundColor tone tint as solid hex, borderRadius 8, padding 16) with `Row`: `Column` `Img` icon 20 + `Column` `Text` title and `Text` body | Use solid hex tints (rgba is unreliable in Outlook); icon PNG, `alt=""` |
| `Email / Divider` | `Hr` (borderColor border, margin "0 40px") | |
| `Email / Stats`, `Email / Stat` | Cells stack under 480 (media query), 2 per row where the client supports it | Min width 320; stat cell min 112 |
| `Email / Article` | `Row` with two `Column`s; stack under 480 with a media query in `Head` (`.stack td { display:block; width:100% }`) | Min width 320; title `line-clamp-2`, text `line-clamp-3` are not reliable in mail clients: keep copy short instead |
| `Email / Footer` | `Section` (textAlign center) with `Row` of `Link` + `Img` social icons (20 px), `Text` address, `Text` reason, `Link` preferences, `Link` unsubscribe | Also send the `List-Unsubscribe` and `List-Unsubscribe-Post` headers for marketing mail |

## Style alternatives
New style values added to existing components in 0.58.0 (the default value keeps the shadcn look).

| Figma | Code | Notes |
|---|---|---|
| `Gauge Target` | part of `Gauge`: the target tick, a short line at angle 180° + 180° x target on the arc (SVG line or a Recharts `ReferenceDot`) | Target 50-95; not used alone |
| `Distribution Segment` | part of `Distribution Bar`: one `<div>` in the flex row, `flex-grow: share` (or `width: share%`), `min-width: 4px`, background `var(--chart-N)` | Color chart-1..chart-8 |
| `QR Code` | `qrcode.react` `<QRCodeSVG value={url} size={128} marginSize={2} />` (or a generated SVG) in a `rounded-xl bg-card p-3` tile | Size=sm 96, default 128, lg 160; the Figma pattern is sample art; keep the real code dark on light in every theme; alt text names the destination |
| `Comparison Table` | `<table>` with shadcn `Table` parts, wrapped in `min-w-[768px]` (Plans=3) or `min-w-[1024px]` (Plans=4) | Plan columns `min-w-48`; feature labels wrap; below `md` render stacked Plan Cards instead (`hidden md:table` / `md:hidden`) |
| `Figure` | `<figure>` | value `line-clamp-2`, label `line-clamp-3`, source `line-clamp-2` |
| `Alert` (Style=soft) | shadcn `Alert` with a cva `style: "soft"`: `border-0 bg-[var(--badge-soft-X-bg)] [&>svg]:text-[var(--badge-soft-X-fg)]`, title `text-[var(--badge-soft-X-fg)]`, description `text-foreground` (X = neutral for default, destructive, success, warning, info) | Same tint tokens as Badge soft; one Style per product |
| `Alert` (Style=accent) | shadcn `Alert` with `style: "accent"`: `bg-card border border-l-4 border-l-X` (`border-l-muted-foreground`, `border-l-destructive`, `border-l-success`, `border-l-warning`, `border-l-info`); icon and title `text-X`, warning title `text-[var(--badge-soft-warning-fg)]` | Banner: `border-0 border-b border-l-4 rounded-none` |
| `Toast` (Style=inverted) | Sonner `<Toaster invert />`, or `toastOptions={{ classNames: { toast: "bg-foreground text-background border-0", description: "text-background/80" } }}` | Icons take `currentColor` (monochrome); flips to a light toast in dark mode |
| `Spinner` (Type=dots) | `<span role="status" class="inline-flex gap-1">` of three `<span class="size-1 rounded-full bg-current animate-pulse [animation-delay:0ms|200ms|400ms]">` (`size-2` at lg); `text-muted-foreground` for Tone=muted | Hidden text "Loading" or "Acme Assistant is writing"; `motion-reduce:animate-none` |
| `Accordion` (Style=card), `Accordion Item` (Style=card) | shadcn `Accordion className="space-y-3"`, `AccordionItem className="rounded-xl border bg-background px-4 last:border-b"` (border on all sides instead of `border-b`) | `rounded-xl` = `radius/base` (theme radius). Use on marketing FAQs and help pages |
| `Accordion Item` (Icon=plus) | shadcn `AccordionTrigger` with lucide `Plus` / `Minus` instead of `ChevronDown`: `<Plus className="size-4 group-data-[state=open]:hidden" /><Minus className="size-4 hidden group-data-[state=open]:block" />` (trigger `className="group [&>svg]:rotate-0"`) | Icons `aria-hidden`; state comes from `aria-expanded` |
| `Pagination` (Style=simple) | shadcn `Pagination` with `PaginationPrevious`, `<span className="text-sm text-muted-foreground">Page 2 of 10</span>`, `PaginationNext` | Disabled ends: `aria-disabled="true" className="pointer-events-none opacity-50"` |
| `Pagination` (Style=dots) | shadcn `Carousel` dots: one `<button aria-label="Go to slide n" aria-current>` per position, `size-2 rounded-full bg-muted-foreground/30`, active `w-5 bg-primary` | Same part as `Carousel Indicator` Type=dots; onboarding and carousels only |
| `Breadcrumb` (Style=background) | shadcn `Breadcrumb` with `BreadcrumbList className="w-fit rounded-[var(--button-radius)] bg-[var(--card-muted-background)] px-3 py-1.5"` | Track token `card/muted-background` (gray-50): `bg-muted` gives only 4.35:1 for the muted links in Light. Use on `background`, not on muted sections |
| `Top Bar` (Style=floating) | `<header className="sticky top-0 z-40 p-3"><div className="flex h-14 items-center gap-2 rounded-[var(--button-radius)] border bg-background px-2.5 shadow-sm">` with `SidebarTrigger`, `Breadcrumb`, actions | Page content gets `pt-20` (bar + inset) when the header overlays it |
| `Bottom Nav` (Style=floating) | `<nav className="fixed inset-x-4 bottom-[calc(env(safe-area-inset-bottom)+8px)] flex rounded-[var(--button-radius)] border bg-background px-2 py-1 shadow-md">` of links | Scroll area gets bottom padding of bar + inset; `aria-current="page"` on the active link |
| `Avatar Group` (Show names) | shadcn `Avatar` group + `<span className="truncate text-sm font-medium max-w-60">Ana, Mihai and 3 others</span>` | Label: `truncate text-sm text-muted-foreground max-w-60`; sm uses `text-xs`, `max-w-[200px]`; full list in `Tooltip` |
| `Timeline Item` (Layout=card) | custom `ol` item: dot rail + `<div className="rounded-xl border bg-background p-4">` with title, time, description, content | `mb-4` between cards |
| `Timeline Item` (Layout=alternating-left, alternating-right) | custom `ol className="grid grid-cols-[1fr_auto_1fr] gap-x-4"`; odd items: content `text-right` in column 1, time in column 3; even items mirrored | Below `md`: fall back to Layout=default (single column) |
| `Chip` (Tone=soft-info, soft-success, soft-warning, soft-neutral) | custom on `Badge`: `className="h-8 rounded-full px-3 border border-transparent bg-[var(--badge-soft-info-bg)] text-[var(--badge-soft-info-fg)] hover:border-current"` (same for success, warning, neutral) | Tags and categories; selected filter state stays on Tone=default |
| `Swatch` (Show name) | shadcn `RadioGroupItem` inside `<label className="flex flex-col items-center gap-1.5">` with the dot and `<span className="text-xs text-muted-foreground">Sand</span>` | The name is the radio's accessible label |
| `Price` (Size=xl) | custom Price: amount `text-6xl font-extrabold tracking-tight tabular-nums`, period and old price `text-base text-muted-foreground` | Once per page, pricing hero or single-offer section |
| `Button` (Variant=soft) | shadcn `Button variant="soft"`; add to `buttonVariants`: `soft: "bg-primary/10 text-brand hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30"` | Tokens `button/soft-bg` = `var(--button-soft-bg)`, `button/soft-hover` = `var(--button-soft-hover)`; text `text-brand`, never `text-primary`. No shadow |
| `Button Icon` (Variant=soft) | shadcn `Button variant="soft" size="icon"` with `aria-label`, wrapped in `Tooltip` | Same `buttonVariants.soft` entry as Button |
| `Input` (Style=filled) | shadcn `Input className="bg-muted border-transparent shadow-none focus-visible:border-ring"` | Placeholder `placeholder:text-[var(--input-filled-muted-foreground)]` (neutral-600 in light). Error keeps `aria-invalid:border-destructive` |
| `Input` (Style=floating) | custom: `relative` wrapper, `Input className="peer h-12 pt-5 px-4" placeholder=" "` + `Label className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground transition-all peer-focus:top-3 peer-focus:text-xs peer-focus:text-brand peer-[:not(:placeholder-shown)]:top-3 peer-[:not(:placeholder-shown)]:text-xs"` | Label stays the accessible name (`htmlFor`). In a `FormItem` without `FormLabel` (Field Show label off), keep `FormDescription` and `FormMessage` |
| `Field` (Show label=false) | `FormItem` without `FormLabel` | Only with a control that has its own visible label (Input Style=floating) |
| `Select` (Style=filled) | shadcn `SelectTrigger className="bg-muted border-transparent shadow-none focus-visible:border-ring"` | Same placeholder token as Input filled (`data-[placeholder]:text-[var(--input-filled-muted-foreground)]`) |
| `Search Field` (Size=lg) | shadcn `InputGroup className="h-12 text-base max-w-[480px]"` (`type="search"`), search and clear icons `size-5` | Heroes and help centers; Kbd unchanged |
| `Toggle Group` (Variant=segmented), `Toggle Group Item` (Variant=segmented) | shadcn `ToggleGroup type="single" className="bg-muted p-1 rounded-full gap-1"`, items `className="h-7 px-3 rounded-full data-[state=on]:bg-background data-[state=on]:shadow-xs hover:bg-background/50"` | Hover token `toggle-group/segmented-hover` = `var(--toggle-group-segmented-hover)` (background at 50%). Sets a value; panels use Tabs |
| `Tabs` (Variant=pills), `Tab` (Variant=pills) | shadcn `TabsList className="bg-transparent p-0 gap-2"`, `TabsTrigger className="h-8 rounded-full px-3 text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"` | Use on background or card surfaces only |
| `Tabs` (Variant=boxed), `Tab` (Variant=boxed) | shadcn `TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0"`, `TabsTrigger className="-mb-px h-9 rounded-none rounded-t-md border border-transparent px-4 text-muted-foreground data-[state=active]:border-border data-[state=active]:border-b-background data-[state=active]:bg-background data-[state=active]:text-foreground"`, `TabsContent className="mt-0 rounded-b-md border border-t-0 p-4"` | Panel slot = `TabsContent` |
| `Switch` (Size, Show description) | shadcn `Switch`; sm `className="h-4 w-7 [&>span]:size-3 [&>span]:data-[state=checked]:translate-x-3"`, lg `className="h-6 w-11 [&>span]:size-5 [&>span]:data-[state=checked]:translate-x-5"`; description `<p id=… className="text-sm text-muted-foreground">` with `aria-describedby` | Wrapper `flex items-start gap-2`; sm description `text-xs` |
| `Slider` (Show value, Show marks) | shadcn `Slider`; value: `Tooltip` (open while dragging) or an absolutely positioned span at `left: {pct}%` over each thumb; marks: `<div className="flex justify-between text-xs text-muted-foreground">` under the track | `aria-valuetext` carries the unit; the bubble repeats it |
| `Card` | shadcn `Card` + `cva`: `variant` (default, outline, muted, inverted), `size` (default, sm), `elevated` | Variant=inverted: `bg-foreground text-background border-foreground`; secondary text `text-background/70`; Buttons inside `variant="secondary"` or `"outline"`, never default. One inverted card per view |
| `Plan Card` | shadcn `Card` + `Price`, `Button`, `<ul>` of `Check Item` | Variant=featured: `ring-2 ring-primary`, primary `Button`. Variant=inverted: `bg-foreground text-background`, description and checks `text-background/70`, `Button variant="secondary"`. Variant=compact: `flex items-center gap-6 px-6 py-4` (name + description `flex-1`, Price, outline Button), no feature list |
| `Testimonial Card` | shadcn `Card` + `<figure><blockquote>` + `Byline` in `<figcaption>`; `cva` `variant` (default, featured, logo, minimal) | featured: `grid md:grid-cols-[280px_1fr] overflow-hidden p-0`, `<img class="h-full object-cover">`, quote `text-2xl font-semibold`, logo `<img class="h-8">`; logo: logo `<img class="h-8">` above the quote; minimal: no Card, bare `<figure>` with `text-lg` quote |
| `Quote` | `<figure><blockquote>` + `<figcaption>` | Default: `border-l-2`; pull: centered, `text-2xl`; large: centered `text-5xl font-extrabold tracking-tight max-w-3xl mx-auto`, decorative quote mark `aria-hidden` |
| `Feature Item` | custom: `Icon Tile` (lucide icon in a `size-10 rounded-md` tile, Style neutral `bg-muted` by default) + `<h3>` + `<p>` | Icon `aria-hidden`; grid of 3 or 4. Tile Style follows the nested Icon Tile (brand: `bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)]`). Layout=card: wrap in shadcn `Card` (`rounded-xl border bg-card p-6 gap-4`); link as `Button variant="link"`. Marker=number: an `<ol>`, number circle `rounded-full bg-primary text-primary-foreground`, `aria-hidden` |
| `Post Card` | shadcn `Card` with image, `Badge` and `Avatar`, wrapped in one link | Layout=overlay: `relative aspect-[4/5] overflow-hidden rounded-xl`, `<img class="absolute inset-0 size-full object-cover">`, text panel `absolute inset-x-0 bottom-0 bg-black/60 text-white p-6` with a `h-16 bg-gradient-to-b from-transparent to-black/60` strip above it (tokens `media/scrim`, `media/scrim-fade`, `media/foreground`) |
| `Product Card` | shadcn `Card` with an `<a>` stretched over the card, `Badge`, `Button` (icon) for wishlist | Layout=horizontal: `flex gap-4`, image `size-30 shrink-0 rounded-lg`, no wishlist; Layout=overlay: `relative aspect-[3/4] overflow-hidden rounded-lg`, info panel `absolute bottom-0 inset-x-0 bg-black/60 text-white p-4` with a gradient strip, no action button |
| `Person Card` | shadcn `Card` + `Avatar`, `Badge`, links (`mailto:`, `tel:`) | Layout=photo: no Card surface; `<img class="aspect-[4/5] w-full rounded-xl object-cover" alt="">` above the name (`h3`), role and organization |
| `Stat Card` | shadcn `Card` + custom content; change = `Badge` soft variant by direction; sparkline = Recharts `LineChart` without axes, `var(--chart-1)` | Layout=compact: `flex items-center gap-3 p-4` with an Icon Tile (`size-10 rounded-md bg-primary/10 text-primary`), value `text-2xl`, no footer; Layout=horizontal: `flex items-end justify-between gap-4`, sparkline `w-30 h-12 aria-hidden` right of the value, footer below |
| `Progress` (Type=segmented), `Progress Segment` | `<div class="flex gap-1" role="progressbar" aria-valuenow={done} aria-valuemax={total}>` of `total` × `<div class="h-2 flex-1 rounded-full bg-primary">` (complete; `bg-success`, `bg-warning`, `bg-destructive` by tone) or `bg-muted` (upcoming) | 4 to 10 segments; label "Step 2 of 4" next to it. Circular progress is `Progress Ring` |
| `Empty State` (Media=image) | shadcn `Empty` with `EmptyMedia variant="default"` holding an `<img class="aspect-video w-full rounded-lg object-cover" alt="">` instead of the icon | Decorative image, empty alt; title and action stay |
| `Tooltip` (Variant=light) | shadcn `TooltipContent className="bg-popover text-popover-foreground border shadow-md"` and `TooltipArrow className="fill-popover stroke-border"` (or `[&_svg]:fill-popover`) | Same Side, title and Kbd as default |
| `Rating` (Style=badge) | `<span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium bg-[var(--badge-soft-warning-bg)] text-[var(--badge-soft-warning-fg)]" aria-label="Rated 4.8 out of 5, 128 reviews">` with lucide `Star class="size-3 fill-current" aria-hidden` and the score | Size=default: `text-sm py-1`, `size-3.5`; display only |
| `Countdown` (Style=default, boxed, inline) | default tiles `bg-[var(--card-muted-background)] rounded-md px-3 py-2`; boxed `bg-card border shadow-xs rounded-lg p-3 text-3xl`; inline `flex items-start gap-3` with `:` separators `text-muted-foreground` | Same `useCountdown` hook; `tabular-nums` on digits |
| `Stepper`, `Step` (Orientation=vertical) | custom `<ol class="flex flex-col">` of steps: rail (`flex flex-col items-center` with indicator and `w-px flex-1 bg-border` connector) + text | Side column or checklist |
| `Stepper`, `Step` (Style=dots) | horizontal: `<ol class="flex items-center gap-2">` of `<li class="size-2 rounded-full bg-primary">` (current `w-6`, upcoming `bg-muted-foreground`, error `bg-destructive`); vertical: dot `size-2` on the rail, current `ring-2 ring-primary bg-background` | Each dot `aria-label="Step 2 of 4, current"`; `aria-current="step"` |

## Resize behavior
How components that changed for narrow widths behave in code (from `/eggux:responsive`). The main row
above still maps the component; these rows add the resize classes.

| Figma | Code | Notes |
|---|---|---|
| `Email / Details Row` | `Column` label + `Column align="right"` value; under 480 the value column drops under the label (media query) | Value never wraps (`whiteSpace: nowrap`) |
| `Comment` | header `flex flex-wrap gap-x-2`; name `truncate max-w-60`; time `truncate max-w-40 shrink-0` | Body `min-w-0` |
| `Selection Toolbar` | Tiptap `BubbleMenu` (`@tiptap/react`, shown when `!selection.empty`) or a Lexical floating toolbar, positioned with Floating UI (`offset(8)`, `flip()`, `shift()`); shadcn `Toggle` for Bold / Italic / Link and a shadcn `Button size="sm"` with lucide `MessageSquare` (or `MessageSquarePlus`) for Comment; container `rounded-lg border bg-popover shadow-md p-1 flex items-center gap-0.5` | `role="toolbar"`; Show formatting / Show comment map to permissions (`canEdit`, `canComment`); Comment calls `editor.chain().setComment(threadId).run()` and opens the new thread |
| `Comment Highlight` | Tiptap custom `Mark` (`comment`, attrs `threadId`, `resolved`) rendering `<mark data-thread-id>`; CSS `bg-[var(--comment-highlight)]`, active `bg-[var(--comment-highlight-active)]`, selection `::selection { background: var(--comment-selection) }`; resolved threads drop the class (or the mark) | Tokens `--comment-highlight`, `--comment-highlight-active`, `--comment-selection`; Liveblocks `@liveblocks/react-tiptap` and Velt provide the same mark plus storage; keep `text-foreground` on the run |
| `Comment Thread` | custom card (`rounded-lg border bg-card p-3 flex flex-col gap-3`, active `border-ring shadow-md`, resolved `bg-card-muted`) with a `<blockquote className="border-l-2 border-warning pl-2 text-sm text-muted-foreground line-clamp-2">`, `Comment` list, `Comment Composer`; header actions shadcn `Button variant="ghost" size="icon"` (Check, Ellipsis in a `DropdownMenu`) | Keyed by the mark's `threadId`; click sets the active thread and scrolls the mark into view (`editor.commands.setTextSelection`); resolve sets `resolved` on the mark; Liveblocks `Thread` or Velt `VeltCommentsSidebar` are drop-in alternatives |
| `Comments Panel` | `<aside className="w-[360px] h-full border-l bg-background flex flex-col">` with header (`h4`, shadcn `Badge`), shadcn `ToggleGroup type="single"` (Open / Resolved), shadcn `ScrollArea` holding `Comment Thread`s, shadcn empty state when none | Threads sorted by mark position (`editor.state.doc.descendants`); optional anchoring: each thread `top` = its mark's `getBoundingClientRect().top`, pushed down to avoid overlap; below `lg` render in shadcn `Sheet`, on phones in a `Drawer` (vaul) opened from a count `Button` |
| `File Dropzone` | title and hint `text-center line-clamp-2` | |
| `Filter Condition` (in `Filter Group`) | row `flex flex-wrap gap-2`; field and operator `shrink-0`; value `flex-1 min-w-36` | Below about 760 the operator and value wrap |
| `Date Input`, `Duration Input` | `min-w-40`; segments fixed `w-[2ch]`/`w-[4ch]`, `overflow-hidden text-ellipsis` | |
| `Phone Input`, `Currency Input` | picker `max-w-28` / `max-w-24 shrink-0`, code `truncate`; value `min-w-0 flex-1 truncate` | Currency Input `min-w-40` |
| `Input Group` | input `min-w-0 flex-1 truncate`; addons `shrink-0` | |
| `Navigation Menu Panel` | `min-w-[640px]`; links `grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))]`; featured `w-60 shrink-0` | On phones use a `Sheet` |
| `Metric Strip`, `Metric Strip Item`, `Trend Indicator` | strip `grid grid-cols-[repeat(auto-fit,minmax(128px,1fr))]`; trend `flex flex-wrap gap-x-1` | |
| `Kbd` | `min-w-5 px-1` (width hugs) | |
| `Store Badge` | fixed size image, `shrink-0` | Stack badges in narrow columns |
| `Breadcrumb` | list `flex flex-wrap` (shadcn default) | Use `BreadcrumbEllipsis` for deep paths |
| `Calendar` | shadcn `Calendar` (react-day-picker) | `min-w-[250px]`; caption label `truncate` |
| `Date Range Picker` | shadcn `Calendar` `numberOfMonths={2}` + presets in `Popover` | `min-w-[658px]`; under `@container` 658 render one month and presets as a `Select` |
| `Sources`, `Source Item` | custom `Collapsible` + list | items `flex flex-wrap gap-2`, each `basis-60 grow max-w-96 min-w-0`; title, domain and header label `truncate` |
| `AI Review Bar` | custom toolbar | `flex flex-wrap gap-x-2 gap-y-2`; count `min-w-32 flex-1 truncate`; buttons `shrink-0` |
| `Chat History Item`, `AI Loading`, `Agent Plan` | custom rows | time / status / progress line `min-w-0 truncate`; buttons `shrink-0` |
| `AI Suggestion` | custom field | label `truncate` |
| `AI Summary`, `AI Notice` | custom card | content `line-clamp-6`; disclaimer `w-full` and wraps (no clamp) |
| `Reasoning` | shadcn `Collapsible` | trigger `max-w-60 min-w-0`, label `truncate`, chevron `shrink-0` |
| `Prompt Suggestion` | shadcn `Button` variant=outline | label `truncate` (chip), `line-clamp-2` (card); `max-w-full` |
| `API Key Row`, `Session Row` | custom row | `flex flex-wrap gap-y-2`; text column `min-w-40 flex-1`; name `truncate`, meta `line-clamp-2`; scope / current `Badge` `max-w-40`/`max-w-32`; key `max-w-48 truncate`; buttons `shrink-0` |
| `Uptime Bars` | custom | end label `max-w-24 truncate`, start label `truncate` |
| `Version Item`, `Release Note Item` | custom | version `min-w-0 flex-1 truncate`, badge `shrink-0 max-w-32`; title `line-clamp-2`, text `line-clamp-4`, date `truncate` |
| `Avatar` | shadcn `Avatar` | `AvatarFallback` shows at most 2 letters (`slice(0, 2)`), `overflow-hidden` |
| `Byline`, `Avatar Group`, `Presence Bar`, `Announcement Pill`, `Social Share` | custom inline groups | text `min-w-0 truncate`; avatars, icons and buttons `shrink-0` |
| `Badge` | shadcn `Badge` | `max-w-64` with label `min-w-0 truncate`; parents can set a smaller `max-w-*` |
| `Button Group`, `Button Group Item` | shadcn `ButtonGroup` | items `shrink-0`; label `truncate` inside the fixed item width |
| `User Message` | custom bubble | `max-w-[576px]` stays; in narrow panels use `max-w-[80%]` (container relative) |
| `Donut Chart` | Recharts PieChart in a `flex flex-wrap gap-8` row | legend `min-w-40 flex-1`; legend name `truncate min-w-0`; value `max-w-24 truncate`; center total `w-[120px] truncate text-center` |
| `Chart Legend` | Recharts Legend / custom | `flex flex-wrap gap-x-4 gap-y-2 w-full` |
| `Chart Tooltip` | Recharts Tooltip content | title `truncate` |
| `Progress Card` | shadcn `Card` + `Progress` | value row `flex flex-wrap items-baseline gap-2`; target `flex-1 min-w-20 truncate` |
| `Chat Message` | custom | Size=default `max-w-[440px]`, row `min-w-[472px]`; Size=compact bubble `max-w-[244px]` with avatar (`max-w-[276px]` outgoing), fits a 276 column |
| `Reaction Bar` | custom | reactions `flex flex-wrap gap-1 flex-1`; add button `shrink-0` |
| `Diff Viewer` | custom | file `flex-1 min-w-[120px] truncate`; counts `max-w-16 truncate shrink-0` |
| `Description List Item` | `<dt>`/`<dd>` | horizontal `grid-cols-[160px_1fr]`, value `min-w-0 break-words` |
| `Meta Item` | `<span>` inline | label `max-w-[280px] truncate` |
| `Swatch Picker` | radio group | swatches `flex flex-wrap gap-1`; name `truncate` |
| `Sheet` | shadcn `Sheet` | `min-w-[320px]` (`w-full` on phones) |
| `Data Grid Toolbar` | custom toolbar | `flex flex-wrap justify-between gap-y-2 min-w-[512px]` |
| `Table Group Row` | `<tr>` group header | Label `min-w-12 flex-1 truncate`; subtotal `max-w-40 truncate shrink-0` |
| `Pagination` | shadcn `Pagination` | `shrink-0`, never squeezed; under 400 use `Pagination Compact` or Style=simple (container query `@max-sm`) |
| `Notification Item` | custom | Text column `min-w-32 flex-1`; message `line-clamp-3`; meta `truncate` |
| `Notification Center` | `Popover` content | `min-w-72`; full width `Sheet` on mobile; title `truncate` |
| `Sidebar` | shadcn `Sidebar` | Expanded `min-w-60`, collapsed `w-12` |
| `Access Row` | custom | `min-w-80`; who column `min-w-32 flex-1`, name and email `truncate`; avatar and Select `shrink-0` |
| `Combobox` | shadcn `Combobox` | Trigger value `truncate` |
| `Checkbox` | shadcn `Checkbox` + `Label` | Label wraps (`min-w-0`); box `shrink-0` |
| `Switch` | shadcn `Switch` + `Label` | Text column `min-w-0 flex-1`; label `line-clamp-2`, description `line-clamp-3`; switch `shrink-0` |
| `Calendar Event` | custom event block | `overflow-hidden`; title `truncate`; time `truncate` (default) or `shrink-0 whitespace-nowrap` (sm) |
| `Meeting Card` | custom `Card` | `min-w-60`; title `line-clamp-2` |
| `Coachmark` | `Popover` anchored to the target | `w-80 min-w-60`; step `min-w-0 flex-1 truncate`; buttons `shrink-0` |
| `Timeline Item` | custom | Title `min-w-24 flex-1 line-clamp-2`; time `max-w-32 truncate shrink-0`; description `line-clamp-3` |
| `Slider` | shadcn `Slider` | Min label `text-left`, max label `text-right` at the track ends |
| `Feedback Widget` | custom | Question and thanks text `line-clamp-2` |

## Components wave 2026-10
Components and variants added from the 2026-10 gap audit.

| Figma | Code | Notes |
|---|---|---|
| `Toolbar` | Radix `Toolbar` (`@radix-ui/react-toolbar`): `Toolbar.Root`, `Toolbar.ToggleItem` / shadcn `Toggle size="sm"`, `Toolbar.Button` with shadcn `Button variant="ghost" size="icon-sm"`, `Toolbar.Separator`; overflow `DropdownMenu` | Style default: no surface (parent draws `border-b`); floating: `rounded-lg border bg-popover shadow-md p-1 gap-0.5`. `orientation="vertical"` for tool columns. Overflow: ResizeObserver moves trailing groups into the menu; resize contract `flex items-center justify-between` when it fills |
| `Toggle` | shadcn `Toggle` (`variant` default, outline; `size` sm, default, lg) | State=pressed = `data-state="on"` (`pressed`, `onPressedChange`); icon-only needs `aria-label` + `Tooltip`; `shrink-0` |
| `Copy Button` | custom: shadcn `Button variant="ghost" size="icon"` (or `outline`, `icon-sm`, `icon-xs`) + `Tooltip`; `navigator.clipboard.writeText(value)` | State=copied for 2 s: lucide `Check` with `text-success` in place of `Copy`, tooltip "Copied", `role="status"` live region; no toast |
| `Bulk Action Bar` | custom (Chakra ActionBar pattern): `fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-lg border bg-popover px-4 py-2 shadow-lg` with shadcn `Button variant="outline" size="sm"` and a ghost `Button size="icon-sm"` to clear | `role="toolbar"`, count in `aria-live="polite"`; under `sm` the actions are icon buttons with tooltips; selection from TanStack `rowSelection` or local state |
| `Button` (Size=xs, xl) | shadcn `Button size="xs"` / `size="xl"`: add to `buttonVariants.size` `xs: "h-7 gap-1 rounded-full px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5"`, `xl: "h-12 rounded-full px-8"` | Radius follows `button/radius` (`rounded-[var(--button-radius)]`); one size per group |
| `Button Icon` (Size=xs, State=loading) | shadcn `Button size="icon-xs"` (`size-7 [&_svg]:size-3.5`); loading = `disabled` + `aria-busy` + lucide `LoaderCircle className="animate-spin"` in place of the icon | Tooltip says the running action ("Refreshing") |
| `Action Bar` (Style=sticky-mobile) | `<div class="sticky bottom-0 z-10 border-t bg-background px-4 pt-3 pb-[max(2rem,env(safe-area-inset-bottom))]">` with a summary row (`flex justify-between`, label `truncate text-muted-foreground`, value `font-semibold shrink-0`) and `flex gap-2` of `Button size="xl" className="flex-1"` | Mobile only (`md:hidden`); page gets matching bottom padding; min width 320 |
| `Toggle Group Item` (Size=sm, lg), `Toggle Group` | shadcn `ToggleGroup size="sm" | "lg"` (size passes to items via context) | segmented: sm items `h-6`, lg items `h-8` inside `p-1` track |
| `Chip Group` | `div role="group"` with `flex flex-wrap gap-2` (wrap) or shadcn `ScrollArea` + `flex w-max gap-2` (scroll); shadcn `ToggleGroup type="single" \| "multiple"` for selection | "+N more" is a `Popover` trigger (or expands the list); single select is a radiogroup, multi select uses `aria-pressed` toggles |
| `Info Tip` | shadcn `Popover` + ghost icon `Button` trigger (`Info` size-4); `PopoverContent side="bottom" className="w-70 p-3 text-sm"` with title, muted text and one link | Click and touch, never hover only. Trigger `aria-label="More about <label>"`, `aria-expanded` from Radix |
| `Info Tip Trigger` | `Button variant="ghost" size="icon" className="size-5 rounded-full text-muted-foreground data-[state=open]:bg-muted data-[state=open]:text-brand"` | 24 px hit area (`after:absolute after:-inset-0.5`) |
| `Field Counter` | `span className="text-xs tabular-nums text-muted-foreground"`; near `font-medium text-foreground`; over `font-medium text-destructive` | In the label row (`flex justify-between`); `aria-describedby` on the control, `aria-live="polite"` near and over only |
| `Field` (Show required, Show optional, Show info, Show counter) | `FormLabel` with `<span aria-hidden className="text-destructive">*</span>` and `required` on the control; optional `<span className="font-normal text-muted-foreground">Optional</span>`; Info Tip after the label; counter span | Mark the minority per form; explain the asterisk once |
| `Field` (Layout=horizontal) | `FormItem className="grid grid-cols-[160px_1fr] items-start gap-4"`, `FormLabel className="pt-2"`; control, description and message in the second column | Use vertical below 400 px (`@container` + `@max-[400px]:grid-cols-1`) |
| `Input` (Size=sm, lg) | `Input className="h-8"` (sm), `className="h-10 px-4 text-base"` (lg) | Default stays `h-9` (density control height) |
| `Input`, `Textarea` (State=read-only) | `readOnly` + `className="read-only:bg-muted read-only:shadow-none read-only:focus-visible:ring-0"` | Never `disabled` for locked values; text stays selectable |
| `Input` (Show clear) | `InputGroup` end slot with a ghost icon `Button` (`X` size-4, `aria-label="Clear"`) shown when the value is not empty | Keep focus in the input after clearing |
| `Input`, `Input Group` (Show loading) | `Loader2 className="size-4 animate-spin text-muted-foreground"` in the end slot; `aria-busy` on the input | Result goes in `FormDescription` or `FormMessage` |
| `Select`, `Combobox`, `Date Picker`, `Time Picker` (Size=sm, lg) | `SelectTrigger size="sm"` (h-8); lg `className="h-10 text-base"`; Combobox, Date and Time trigger `Button` same classes | Match the Buttons in the same row |
| `Select`, `Combobox`, `Date Picker` (State=read-only) | Render the value in a `div className="flex h-9 items-center rounded-input border bg-muted px-3 text-sm"` (no trigger, no chevron) | Or a `readOnly` Input with the formatted value |
| `Select`, `Combobox` (Show clear) | ghost icon `Button` (`X`) before the chevron that resets the value | `aria-label="Clear <label>"` |
| `Tag Input` (Size=sm, lg) | container `min-h-8 py-0.5` (sm), `min-h-10 py-1.5` (lg) | Tags stay 24 high |
| `Checkbox`, `Radio` (Show description) | `div className="flex items-start gap-2"` with the control `mt-0.5` and a text column: `Label` + `p className="text-sm text-muted-foreground"` linked with `aria-describedby` | Same pattern as Switch description |
| `Field Preset` (url, time-zone, currency, language, date-of-birth, tax-id, iban) | url: `InputGroup` "https://" + `Input type="url" autoComplete="url"`; time-zone, currency, language: `Select` or `Combobox` (long lists); date-of-birth: Date Input with `autoComplete="bday-day"`, `"bday-month"`, `"bday-year"`; tax-id: `Input autoComplete="off"` uppercase + Info Tip; iban: `Input` formatted in groups of 4 | See `skills/build-ui/patterns/form-presets.md` |
| `Inline Message` | custom: `<p role="status" className="flex items-start gap-2 text-sm">` + lucide icon (`size-4 mt-0.5 shrink-0`) or `Spinner`, text `min-w-0 line-clamp-2` | Type default/loading `text-muted-foreground`; info/success/warning/error use the soft badge tokens: `text-[var(--badge-soft-success-fg)]` etc. (icons and text). Errors that block the goal: `role="alert"`. `max-w-[480px]` when it hugs |
| `Progress` (Size, Show label, Value=indeterminate) | shadcn `Progress`; Size sm `className="h-1"`, default `h-2`, lg `h-3`; label row `<div className="flex items-center gap-3"><span className="flex-1 min-w-0 truncate font-medium">…</span><span className="text-sm text-muted-foreground tabular-nums">40%</span></div>` | Indeterminate: indicator `w-2/5 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]` (translateX -100% to 250%), omit `value`, keep `aria-busy`; `motion-reduce:animate-none` |
| `Callout Card` | shadcn `Card` with `flex gap-4 p-5` (Layout=horizontal) or `flex-col` (stacked, close `absolute right-3 top-3`); `CardTitle` `line-clamp-2`, description `text-sm text-muted-foreground line-clamp-3`, actions `flex flex-wrap gap-2` | Dismissal stored per user (localStorage or a user setting); media is `IconTile` or a spot illustration SVG `size-20` with `aria-hidden` |
| `Popover Header` | custom in `PopoverContent`: `<div className="flex items-start gap-2"><div className="flex-1 min-w-0"><h3 className="text-sm font-medium line-clamp-2">…</h3><p className="text-sm text-muted-foreground">…</p></div><PopoverClose asChild><Button variant="ghost" size="icon" className="size-5" aria-label="Close"><X className="size-4" /></Button></PopoverClose></div>` | `aria-labelledby` on `PopoverContent` points at the title |
| `Popover Footer` | custom: `<div className="flex items-center gap-2"><Button variant="ghost" size="sm">Reset</Button><div className="flex-1" /><Button variant="outline" size="sm">Cancel</Button><Button size="sm">Apply</Button></div>` | min width 240 |
| `Collapsible` | shadcn `Collapsible`: `CollapsibleTrigger asChild` → `Button variant="link" size="sm"` with `ChevronDown` (`data-[state=open]:rotate-180`), `CollapsibleContent className="space-y-4 pt-3"` | Label switches Show/Hide by state; `aria-expanded` comes from Radix |
| `Skeleton Preset` | shadcn `Skeleton` composed per type: list-row `flex items-center gap-4 px-4 py-3` (`size-10 rounded-full`, lines `h-4 w-full`, `h-3 w-32`); card `Card p-4 space-y-3` (`aspect-video`); table-row `TableRow` of `Skeleton` cells; stat `Card p-5 space-y-3` (`h-8 w-36`); chart `Card p-5` with `flex items-end gap-3 h-40` bars | Wrap the region in `aria-busy="true"`; repeat 3 to 5 rows |
| `Spot Illustration` | one inline SVG React component per Type (`viewBox="0 0 120 120"`): disc `fill="var(--muted)"`, lines `stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"` (`text-foreground`), surfaces `fill="var(--background)"`, accent `fill="var(--primary)"` (faded parts `fillOpacity={0.2}`) | `aria-hidden`, `className="size-30"` (80: `size-20`). Export the SVGs from the Illustrations page |
| `Scrim` | the shadcn `DialogOverlay` / `SheetOverlay` (`fixed inset-0 bg-black/50`); over media `absolute inset-0` with `bg-[var(--media-scrim)]`; light `absolute inset-0 bg-background/80` | Content behind a modal is `inert` |
| `Dialog` (Size) | shadcn `DialogContent` `className`: sm `sm:max-w-sm`, default `sm:max-w-lg`, lg `sm:max-w-2xl`, xl `sm:max-w-4xl`, fullscreen `max-sm:inset-0 max-sm:h-dvh max-sm:max-w-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0 flex flex-col` with the body `flex-1 overflow-y-auto` | Header and footer stay fixed; the body scrolls |
| `Toast` (Show avatar, Show progress) | Sonner `toast.custom()` (or `toast(…, { icon: <Avatar className="size-6" /> })`) with shadcn `Avatar` and `Progress className="h-1"` under the description | Undo countdown: progress from 100 to 0 over the toast duration; pause with the timer on hover and focus |
| `Empty State` (Media=illustration, Tone=error) | shadcn `Empty`: `EmptyMedia` with the spot illustration SVG (`size-30`, sm `size-20`); Tone=error `EmptyMedia variant="icon" className="bg-destructive/10 text-destructive"` + `TriangleAlert`, action `Button variant="outline"` with `RefreshCw` | Error copy says what failed; `role="alert"` when it replaces loading content |
| `Date Picker` (Type=range) | shadcn Date Range Picker recipe: `Popover` + `Button variant="outline"` trigger (`CalendarIcon`, `format(from,"d MMM")` to `format(to,"d MMM yyyy")`) + `Calendar mode="range" numberOfMonths={2}` | Trigger value `truncate`, `min-w-[240px]`; opens the Date Range Picker panel; one month in a Drawer under `md` |
| `Select` (Style=ghost) | `SelectTrigger className="w-auto gap-1 border-transparent bg-transparent px-2 shadow-none hover:bg-accent"` with `<span className="text-muted-foreground">Sort by:</span><SelectValue />` | Value `font-medium truncate max-w-[200px]`; focus ring kept (`focus-visible:ring-[3px]`); never inside a form |
| `Select`, `Combobox` (Show leading icon, Show avatar, Show status dot) | In `SelectValue` / the trigger `Button`: lucide icon `size-4 text-muted-foreground`, `Avatar className="size-5"`, or `span className="size-2 rounded-full bg-success"`, then the label | Same leading in each `SelectItem` / `CommandItem`; `shrink-0` on the leading part |
| `Select Option` (Type=create) | `CommandItem value={query} onSelect={create}` with lucide `Plus` and `Create label "{query}"`, rendered last when no item matches exactly | `CommandGroup` separator above; after create select the new value and close |
| `Calendar` (Caption=dropdown, Months=2, Show week numbers) | shadcn `Calendar captionLayout="dropdown" formatters={{ formatMonthDropdown: d => d.toLocaleString(locale,{month:"short"}) }}`, `numberOfMonths={2}`, `showWeekNumber` | `startMonth` / `endMonth` bound the dropdown years; two months `min-w-[500px]`, else one |
| `Calendar Day` (Show dot, Show note, State=booked) | Custom `components={{ DayButton }}`: dot `after:absolute after:bottom-1 after:size-1 after:rounded-full after:bg-primary`; note `<span className="text-xs text-muted-foreground">€89</span>` under the number; `modifiers={{ booked }}` + `modifiersClassNames={{ booked: "line-through text-muted-foreground" }}` and `disabled={booked}` | Notes 4 characters max; aria-label carries the note and "booked" |
| `Time Picker` (Type=range) | Two time `Select`s (start, end) in an `InputGroup` styled as one trigger, `Clock` icon, duration `<span className="ml-auto text-muted-foreground shrink-0">1 h 30 min</span>` | `min-w-[220px]`; end options filtered to after the start |
| `Date Time Picker` | `Popover` with `Calendar mode="single"` + `ScrollArea className="h-[246px] w-24"` of time `Button`s (`variant={selected ? "default" : "outline"}`), footer `Button variant="outline"` Cancel and Apply | Value is one `Date`; scroll the selected time into view on open; Drawer on phones |
| `Month Picker`, `Month Picker Cell` | Custom: `Popover` + `grid grid-cols-3 gap-2` (quarters `grid-cols-2`) of `Button variant="ghost"` (selected `variant="default"`, current `bg-accent`), caption with ghost icon Buttons | `min-w-[250px]`; value is the first day of the period (`startOfMonth`, `startOfQuarter`, `startOfYear`) |
| `Mention Menu`, `Mention Option` | Tiptap `Mention` suggestion (or `textarea` + caret-anchored `Popover`) rendering `Command` / `CommandItem` with `Avatar size-8` or an icon tile, `<mark className="bg-transparent font-medium text-brand">An</mark>na Berg` and a muted second line | `w-[280px]`; `aria-activedescendant` from the editor; insert a `Mention Chip` on select |
| `Color Input` | `InputGroup`: `PopoverTrigger` swatch (`size-5 rounded-sm border` with `style={{ background: value }}`) + `HexColorInput` (react-colorful) `className="uppercase"` + optional muted `60%`; `Color Picker` in the `Popover` | `min-w-[180px]`, `w-full` in forms; invalid hex sets `aria-invalid` |
| `App Header` | custom `<header className="flex h-16 items-center gap-6 border-b bg-background px-6">`: Logo link, links in shadcn `NavigationMenu` (`className="flex-1"`, active link `aria-current="page"` with `bg-accent`), search `InputGroup className="w-64"` opening `CommandDialog`, `Button variant="ghost" size="icon"` and `Avatar` in a `DropdownMenu` | `min-w-[768px]`; under `lg` hide the search field (`hidden lg:flex`) and show a search icon button; under `md` render `Mobile Header` |
| `List Group Header` | custom `<div role="heading" aria-level={3} className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-muted-foreground">` with label `truncate max-w-40`, shadcn `Badge variant="secondary"` count and `Button variant="link" size="sm" className="ml-auto"` | Variant=muted: `sticky top-0 z-10 border-y bg-muted text-foreground` |
| `Search Suggestions`, `Search Suggestion Item` | shadcn `Popover` anchored to the search `InputGroup` (`PopoverContent className="w-[var(--radix-popover-trigger-width)] min-w-70 p-1"`) with `Command shouldFilter={false}`: `CommandList`, `CommandGroup heading="Recent searches"`, `CommandItem` (suggestion `<span className="font-medium">{typed}</span>{rest}`, recent with `History` icon and a remove `Button size="icon-xs" variant="ghost"`, record with its icon and `<span className="ml-auto text-xs text-muted-foreground">Invoice</span>`); footer `border-t px-2 pt-2 pb-1 text-xs text-muted-foreground` | Combobox a11y: input `role="combobox" aria-expanded aria-controls`; highlighted row = `data-[selected=true]:bg-accent`; rows `truncate` |
| `Top Loading Bar` | custom `<div role="progressbar" aria-label="Loading page" className="fixed inset-x-0 top-0 z-50 h-0.5">` with indicator `h-full bg-primary` (indeterminate `w-2/5 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]`, determinate `style={{ width: `${value}%` }} transition-[width]`), track `bg-muted` when Show track | Driven by the router loading state (Next.js `loading`/`useLinkStatus`, NProgress); `motion-reduce:animate-none`; skip for loads under 300 ms |
| `Page Header` (Show back link, Show badge, Show meta, Show pager) | back link `<Link className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground"><ArrowLeft className="size-4"/>All invoices</Link>`; meta `<div className="flex items-center gap-3"><Badge/><div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">…</div></div>`; pager `<div className="flex items-center gap-2"><span className="text-sm text-muted-foreground">3 of 24</span><Button variant="outline" size="icon-sm" aria-label="Previous invoice"><ChevronLeft/></Button><Button variant="outline" size="icon-sm" aria-label="Next invoice"><ChevronRight/></Button></div>` | Pager and actions wrap under the text with the header's `flex-wrap` |
| `Separator` (Show label, Show start line) | `<div className="flex items-center gap-3"><Separator className="flex-1"/><span className="text-xs text-muted-foreground">or continue with</span><Separator className="flex-1"/></div>`; Show start line off drops the first `Separator` | A button label is `Button variant="ghost" size="sm"` in place of the span |
| `Tabs` (Show overflow), `Tab` (Size=sm) | overflow: a `DropdownMenu` whose trigger is styled like a `TabsTrigger` ("More", `Ellipsis` icon) after the visible triggers; a `ResizeObserver` moves triggers that do not fit into the menu; Size=sm: `TabsTrigger className="h-6 px-2.5"` (line `h-8`, pills and vertical `h-7`, boxed `h-8`) | Picking a tab from the menu activates it and swaps it into the row |
| `Sidebar` (Variant=floating, inset), `Sidebar Group Label`, `Sidebar Item` (Show action) | shadcn `Sidebar variant="floating"` / `variant="inset"` (page in `SidebarInset`); group action `SidebarGroupAction` (`Plus`, title "Add project"); item action `SidebarMenuAction showOnHover` (`Ellipsis`) opening a `DropdownMenu` | One variant per product; inset page = `SidebarInset` with `m-2 rounded-xl shadow-sm` |
| `Mobile Header` (Type=search, Size=large) | Type=search: `<header className="flex h-14 items-center gap-2 border-b px-2">` with back `Button size="icon" variant="ghost"`, `InputGroup type="search" className="flex-1"` (autofocus) and `Button variant="ghost" size="sm">Cancel</Button>`; Size=large: bar plus `<h1 className="px-4 pb-3 text-3xl font-semibold tracking-tight line-clamp-2">` that collapses into the bar title on scroll (IntersectionObserver) | Safe-area inset on top in code |
| `Page Shell / App` (Layout=stacked) | `<div className="min-h-screen"><AppHeader/><main className="p-6">…</main></div>` (Tailwind Plus stacked shell); Layout=sidebar stays `SidebarProvider` + `AppSidebar` + `SidebarInset` | Text-heavy pages put content in `mx-auto max-w-6xl` |
| `Chart Card` (State) | shadcn `Card` + `Chart`; loading: chart area `aria-busy="true"` with `Skeleton` bars (`flex items-end gap-3 h-60`, bars `flex-1 rounded-sm`); empty: shadcn `Empty` with the chart spot SVG (`size-20`); error: `Empty` with `TriangleAlert` on `bg-destructive/10` and `Button variant="outline"` Try again | Keep the header and the period `ToggleGroup` in every state; chart area keeps `h-60` so the grid does not shift |
| `Line Chart` (Series, comparison, stacked-area, step) | Recharts `LineChart` / `AreaChart`; series 3: a third `<Line stroke="var(--chart-3)">`; comparison: `<Line dataKey="previous" stroke="var(--muted-foreground)" strokeDasharray="4 4" dot={false}>`; stacked-area: `<Area stackId="a" fillOpacity={0.2}>` per series; step: `type="stepAfter"` | Legend item for the comparison uses the line key ("Previous period") |
| `Radial Chart` | shadcn Chart (Recharts) `RadialBarChart` `startAngle={90} endAngle={-270} innerRadius` with `RadialBar background cornerRadius={0}` and `PolarAngleAxis type="number" domain={[0,100]} tick={false}`; center `<Label>` value `text-3xl font-semibold` and label `text-muted-foreground text-xs` | Concentric: one `RadialBar` per measure, `fill="var(--chart-N)"`; `size-[200px]` |
| `Box Plot` | no Recharts primitive: `ComposedChart` with a stacked transparent + `Bar` (q1 to q3, `fill="var(--badge-category-1-bg)" stroke="var(--chart-1)"`), `ErrorBar` whiskers, median `ReferenceLine` segments and `Scatter` outliers; or visx `BoxPlot`, ECharts `boxplot` | Provide a table view with min, q1, median, q3, max |
| `File Item` (Type, Layout) | row as today; Type=image thumbnail `<img className="size-10 rounded-md object-cover">` from `URL.createObjectURL(file)`; Layout=tile `w-40 rounded-lg border p-2 space-y-2`, media `h-28 rounded-md overflow-hidden`, remove `Button variant="outline" size="icon" className="absolute right-3 top-3 size-8"` | Tiles in `grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3`; name `truncate` |
| `File Dropzone` (Size sm) | `flex items-center gap-3 rounded-lg border border-dashed p-3`, icon tile `size-8`, text `flex-1 min-w-0` with title and hint `truncate`, `Button variant="outline" size="sm"` Browse | Whole row is the drop target and focusable |
| `File Type Icon` | `<span className="inline-flex size-10 items-center justify-center rounded-md bg-[var(--badge-category-N-bg)] text-[var(--badge-category-N-fg)] text-xs font-medium">PDF</span>` (sm `size-8 rounded-sm`); code and generic `bg-[var(--badge-soft-neutral-bg)]`, generic shows lucide `FileText` | Map MIME type or extension to the type: pdf 8, document 1, sheet 6, slides 2, image 7, video 5, audio 3, archive 4; `aria-hidden` |
| `Image Placeholder` (Ratio 3:2, 2:3, 9:16; State) | `aspect-[3/2]`, `aspect-[2/3]`, `aspect-[9/16]`; loading `bg-accent animate-pulse` until `onLoad`; error (`onError`) `bg-muted grid place-items-center` with lucide `Image` and `text-xs` "Image unavailable" | Keep `alt` on the wrapper (`role="img" aria-label`) in the error state |
| `Prose` | Tailwind Typography `<article className="prose prose-neutral dark:prose-invert max-w-prose">` (Size sm `prose-sm`, default `prose-base`, lg `prose-lg`), or shadcn/typeset | Override `prose-a:text-primary prose-code:bg-muted prose-code:rounded-sm prose-code:px-1 prose-code:before:content-none prose-code:after:content-none` |
| `Prose Heading`, `Prose Paragraph`, `Prose List Item`, `Prose Blockquote` | plain `h2`-`h4`, `p`, `ul`/`ol` > `li`, `blockquote` + `cite` inside `Prose` | Styled by the prose classes; no component in code |
| `Highlight` | `<mark className="bg-[var(--highlight-mark)] text-foreground rounded-[2px]">`; Tone=ai `bg-[var(--highlight-ai)]` | Tokens `--highlight-mark` (= comment highlight), `--highlight-ai` (= primary/10, dark /20) |
| `Inline Code` | `<code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm">` | `max-w-80 truncate` for long IDs (middle truncation helper for keys) |
| `Code Block` (Show tabs, Show line numbers, Show highlight) | Shiki: tabs = shadcn `Tabs` line variant over one `<pre>` per tab; line numbers via `[counter-reset:line] .line::before{counter-increment:line;content:counter(line)}` in `text-muted-foreground`; highlight via `transformerNotationHighlight` with `.highlighted{background:var(--code-line-highlight)}` | Token `--code-line-highlight` (= primary/10, dark /20) |
| `Code Highlight` | the `.highlighted` line class above | Helper of Code Block |
| `Audio Player` (Variant compact, State) | compact: `flex items-center gap-3 rounded-full border bg-card py-2 pl-2 pr-4 w-70`, `Button size="icon" className="size-8 rounded-full"`, waveform `flex flex-1 items-center justify-between h-7` of `w-0.5 rounded-full` bars (`bg-primary` played, `bg-muted-foreground` rest), duration `text-xs text-muted-foreground tabular-nums` | Play button label follows State ("Play", "Pause"); waveform `aria-hidden`, the hidden slider carries the value |
| `Product Card` (Show swatches, Size sm) | swatches `flex gap-1` of `button.size-4.rounded-full` with `style={{background}}` and `ring-2 ring-offset-1` when selected; Size=sm `w-45 min-w-35`, name `text-xs font-medium line-clamp-2`, wishlist `size-8` | Swatch `aria-label` is the color name, `aria-pressed` on the selected one |
| `Assistant Message` (Show branch, State stopped) | AI Elements `Branch`, `BranchPrevious`, `BranchNext`, `BranchPage` ("2 of 3") before the `Actions`; stopped: `<p className="flex items-center gap-1.5 text-xs text-muted-foreground"><Square className="size-3.5" />You stopped this answer</p>` above the actions | Branch buttons `aria-label="Previous answer"` / `"Next answer"` |
| `Thumbnail` | `<img className="size-12 rounded-md border object-cover" alt="">` (xs `size-6 rounded-sm`, sm `size-8 rounded-sm`, lg `size-16`, xl `size-20 rounded-lg`); Ratio 4:3 `w-12 aspect-[4/3]`; fallback `div className="grid place-items-center bg-muted text-muted-foreground"` + lucide icon | `shrink-0`; alt="" when the item name is next to it |
| `Table Cell Media` | `div className="flex min-w-40 items-center gap-3"` + Thumbnail sm + `div className="min-w-24 flex-1"` with title `truncate text-sm font-medium` and meta `truncate text-xs text-muted-foreground` | Products, files, listings; people use Table Cell User |
| `Table Cell Tree` | first-column cell `div style={{ paddingLeft: row.depth * 24 }} className="flex items-center gap-1.5"`: expander ghost Button (`ChevronRight` / `ChevronDown`, `aria-expanded`) or a `size-5` spacer, lucide icon, `truncate` label | TanStack `getSubRows`, `row.getToggleExpandedHandler()`; table `role="treegrid"`, rows `aria-level`; min width 120 + 24 per level |
| `Table Header Label` (Show info, Show menu) | Info Tip after the label; `DropdownMenu` on `Button variant="ghost" size="icon" className="size-7 opacity-0 group-hover:opacity-100 focus-visible:opacity-100"` (`Ellipsis`) with Sort asc, Sort desc, Filter, Pin, Hide | `th className="group"`; Align=right label `truncate text-right` |
| `Table Cell` (Type=footer, Style=striped) | `TableFooter` row `bg-muted/50 border-t font-medium`; striped `TableBody className="[&_tr:nth-child(even)]:bg-muted/50"` | Stripes only on read-only tables |
| `Column Settings`, `Column Settings Item` | `Popover` with header, `Input` search, dnd-kit `SortableContext` list of rows (`GripVertical` handle, `Checkbox` bound to `column.getIsVisible()` / `toggleVisibility`, label `truncate`; locked row `Lock` icon and disabled checkbox), footer Reset / Cancel / Apply | `table.setColumnOrder`; Alt + Arrow keys reorder; keep one column visible |
| `Description List Item` (Style=bordered, Show action) | bordered: `dl className="divide-y rounded-md border"`, row `grid grid-cols-[minmax(6rem,12rem)_1fr]`, `dt className="border-r bg-muted/50 px-4 py-3"`, `dd className="px-4 py-3"`; action: Copy Button `size="xs"` in the dd | Vertical below 276 (`@container`) |
| `Timeline Item` (Layout=horizontal, Size=sm) | horizontal: `ol className="flex"`, `li className="w-[200px]"` with dot + `flex-1 border-t` connector, time above title; sm: `size-4` dot, `text-xs` title and description `line-clamp-2` | Switch horizontal to the vertical list below 640 |
| `Calendar Event` (State, Status) | selected `ring-2 ring-ring`; dragging `shadow-lg`; tentative `border border-dashed border-[--event-color] bg-background`; cancelled `bg-muted/50` + title `line-through opacity-70` | Status in the accessible name |
| `Card` (State=hover, focus; Media=top) | wrap in a link: `className="transition-shadow hover:shadow-md hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-ring"`; media `img className="aspect-video w-full rounded-t-xl object-cover"` first, `pt-0` on the Card | Only cards with one destination get hover and focus |
| `Option Card` (Layout=media, compact) | media: label Card `w-70` with `img aspect-video rounded-md` above the title row; compact: `p-3 items-center`, icon tile `size-8`, description `truncate` | `has-[:checked]:ring-2` as before |
| `Conversation Item` | `button/a className="flex w-full min-w-60 items-center gap-3 rounded-md p-3 hover:bg-muted aria-[current=page]:bg-accent"`: Avatar lg, `div className="min-w-0 flex-1"` (name `truncate font-medium` + `Pin` / `BellOff` size-3.5 + time `text-xs shrink-0`; message `truncate text-sm text-muted-foreground` + Badge count) | Name includes unread count for screen readers |
| `Kanban Card` (Show cover, Show priority) | cover `img aspect-video rounded-md object-cover`; priority `Badge size="sm"` (soft-destructive High, soft-warning Medium, soft-neutral Low) | |
| `Kanban Column` (State, Show limit) | limit `span className="text-xs text-muted-foreground"` "Limit 5" after the count; drop-target `bg-accent outline-dashed outline-2 outline-ring` (dnd-kit `isOver`); collapsed `w-12` button with `[writing-mode:vertical-rl]` title | Count Badge destructive over the limit |
| `Icon/bell-off` | lucide `BellOff` | Muted conversations and notification settings |

## Paywalls and subscriptions
Paywall, gate and subscription components (see patterns/monetization.md).

| Figma | Code | Notes |
|---|---|---|
| `Plan Option Row` | shadcn `RadioGroupItem` inside a `<label>` card + `Badge` | `flex items-center gap-3 p-4 rounded-lg border min-w-60`; text `flex-1 min-w-20` with name and Badge in `flex flex-wrap gap-2`; price stack `shrink-0 text-right whitespace-nowrap`; `data-[state=checked]:border-2 data-[state=checked]:border-primary shadow-xs` |
| `Meter Banner` | custom fixed bar + shadcn `Button` | `fixed inset-x-0 bottom-0 border-t bg-card shadow-lg px-6 py-4`; inner `max-w-6xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-3`; message `flex-1 min-w-60`; title `line-clamp-2`, description `line-clamp-3`; `role="region" aria-label="Free articles"` |
| `Paywall Card` | shadcn `Card` + `Check Item`, `RadioGroup` of `Plan Option Row`, `Button`, `Inline Form`, `Separator` | `w-full max-w-[560px] min-w-80 mx-auto p-8 rounded-xl shadow-xl`; Type maps to which parts render (plans + Subscribe, or email form + Google); fine print `text-xs text-muted-foreground text-center` right under the action |
| `Block / Article Paywall` | custom: article header + `Prose` + fade + `Paywall Card` | Column `max-w-[672px] mx-auto px-4`; preview wrapper `relative`, fade `absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none`; render only the preview paragraphs server side, not the hidden rest |
| `Block / Mobile Paywall` | React Native / SwiftUI screen or web `Dialog` fullscreen | 390 x 844: close top left, scroll body, sticky footer with the xl Button, fine print and Restore purchases, Terms, Privacy links; prices and renewal text from StoreKit / Play Billing |

## Admin
| Figma | Code | Notes |
|---|---|---|
| `Access Row`, `Invite Row`, `Share Link Row` | shadcn `Avatar`, `Select`, `Popover` + `Command` (combobox with chips), `Button` | Copy with `navigator.clipboard.writeText`; validate emails with zod |
| `Integration Card` | shadcn `Card` | name, category `truncate`; description `line-clamp-3` |
| `Permission Row` | table row | `min-w-[448px]` (+96 per extra role); permission cell `min-w-40`; title `truncate`, description `line-clamp-2` |
| `API Key Row` | custom row + `Badge`, `Button size="icon"`, `DropdownMenu`; `AlertDialog` for revoke | Full key shown once at creation, then only the last 4 characters |
| `Session Row` | custom row + `Badge` and `Button` | Sessions from your auth provider (Auth.js, Clerk, WorkOS); the current device cannot sign itself out |
| `Org Chart Node` | custom card | `min-w-40`; name `line-clamp-2`, role and reports `truncate`, centered |

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
