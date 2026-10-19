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
| `Alert`, `Toast` | shadcn `Alert`, `Sonner` | |
| `Card`, `Stat Card` | shadcn `Card` | Stat Card: custom content |
| `Skeleton`, `Spinner`, `Kbd` | shadcn `Skeleton`, `Spinner`, `Kbd` | |
| `Pagination`, `Breadcrumb` | shadcn `Pagination`, `Breadcrumb` | |
| `Sidebar` and parts | shadcn `Sidebar` | |
| `Navigation Menu` parts | shadcn `NavigationMenu` | |
| `Stepper`, `Step` | custom (no shadcn stepper) | |
| `Description List`, `Timeline` | custom `dl` / `ol` | |
| `Carousel` | shadcn `Carousel` (Embla) | |

## Data and enterprise
| Figma | Code | Notes |
|---|---|---|
| Table template, `Table Cell` and parts | shadcn `Table` + TanStack Table | Grid columns → column defs |
| `Data Grid Toolbar`, `Table Group Row` | custom on TanStack Table (grouping, aggregation, visibility) | Saved views stored per user |
| `Filter Condition`, `Filter Group` | custom: `Select`, `Combobox`, `Input`, `Button` | Serialize to the API filter format |
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
| `File Dropzone`, `File Item`, `Attachment` | react-dropzone + custom | |
| `Rating` | custom `RadioGroup` | |
| `Color Picker` | react-colorful in `Popover` | |
| `Coachmark`, `Hotspot` | Driver.js, Shepherd or `Popover` anchored to the target | |
| `Video Player` | native `video` or Vidstack | |
| `Kanban` parts | dnd-kit + custom | |
| `Calendar Event`, scheduler blocks | custom grid, or FullCalendar themed with tokens | |
