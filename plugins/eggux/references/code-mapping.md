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
| `Badge`, `Badge Count`, `Status Dot` | shadcn `Badge` (+ success, warning, info variants) | Status Dot: custom span + label |
| `Chip`, `Tag` | custom on `Badge` + remove `Button` | |
| `Avatar`, `Avatar Group` | shadcn `Avatar` | Group: negative margin + ring |
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
| `Sidebar` and parts | shadcn `Sidebar` | |
| `Sidebar Double` | shadcn `Sidebar` `collapsible="icon"` (rail) + a second `Sidebar` (panel) | Panel opens as a left `Sheet` on mobile |
| `Navigation Menu` parts | shadcn `NavigationMenu` | |
| `Stepper`, `Step` | custom (no shadcn stepper) | |
| `Description List`, `Timeline` | custom `dl` / `ol` | |
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

## Data and enterprise
| Figma | Code | Notes |
|---|---|---|
| Table template, `Table Cell` and parts | shadcn `Table` + TanStack Table | Grid columns → column defs |
| `Data Grid Toolbar`, `Table Group Row` | custom on TanStack Table (grouping, aggregation, visibility) | Saved views stored per user |
| `Filter Condition`, `Filter Group` | custom: `Select`, `Combobox`, `Input`, `Button` | Serialize to the API filter format |
| `Filter Bar`, `Filter Chip`, `Faceted Filter`, `Facet Option` | shadcn data-table toolbar: `Input`, `Popover` + `Command` with `CommandItem` checkboxes, `Button variant="outline"` (dashed) | Faceted values from `column.getFacetedUniqueValues()` (TanStack) |
| `Filter Section` | `Collapsible` + `Checkbox` list | |
| `Table Cell Amount`, `Status`, `Progress`, `Actions` | cell renderers in TanStack column defs; `Badge`, `Progress`, `DropdownMenu` | Amounts with `Intl.NumberFormat`, `tabular-nums` |
| `Table Pagination` | shadcn data-table pagination (`Select` for page size + `Pagination`) | |
| `Entity Card`, `Progress Card` | shadcn `Card` with `size="sm"`; `Progress` | |
| `Empty State` | shadcn `Empty` (or a custom block: icon, title, description, actions) | |
| `Approval Step` | custom on the Timeline layout | |
| `Change Item` | custom | |
| `Save Bar` | custom sticky footer | Listen to form dirty state |
| `Org Switcher` | `DropdownMenu` or `Popover` + `Command` | |
| `Bar Chart`, `Line Chart`, `Sparkline` | shadcn `Chart` (Recharts) | `var(--chart-N)` |
| `Donut Chart`, `Bar Chart Horizontal` | Recharts `PieChart` (`innerRadius`), `BarChart layout="vertical"` | |
| `Heatmap` | custom CSS grid or nivo `HeatMap` | |
| `Gauge` | Recharts `RadialBarChart` (half circle) or custom SVG arc | |
| `Treemap` | Recharts `Treemap` with a custom cell renderer | |
| `Gantt Bar`, `Gantt Milestone`, Gantt block | SVAR Gantt, Frappe Gantt, or a custom grid with dnd-kit | |

## Content, communication, AI
| Figma | Code | Notes |
|---|---|---|
| `Rich Text Editor` | Tiptap (or Lexical) + shadcn `Toggle` toolbar | |
| `Code Block` | Shiki or Prism + copy `Button` | |
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
| `Rating` | custom `RadioGroup` | |
| `Color Picker` | react-colorful in `Popover` | |
| `Coachmark`, `Hotspot` | Driver.js, Shepherd or `Popover` anchored to the target | |
| `Video Player` | native `video` or Vidstack | |
| `Kanban` parts | dnd-kit + custom | |
| `Calendar Event`, scheduler blocks | custom grid, or FullCalendar themed with tokens | |
| Help center and docs blocks | page sections composed from `Input`, `Card`, `Breadcrumb`, `Button` | Search: shadcn `Command` (⌘K) or Algolia DocSearch; docs content: MDX (Nextra, Fumadocs) |
| `Block / Status Page` uptime bars | custom flex of 90 spans with `title` and an uptime % in text | Data from your status provider (Instatus, Better Stack, Atlassian Statuspage) |
| `Block / Navbar Mega Menu` | shadcn `NavigationMenu` with `NavigationMenuContent` | |
