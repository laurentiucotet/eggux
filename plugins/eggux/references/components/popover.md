# Popover

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Popover](#popover) | 1 | Content |
| [Command Input](#command-input) | 1 | - |
| [Command](#command) | 1 | Items |
| [Hover Card](#hover-card) | 1 | Content |
| [Command Dialog](#command-dialog) | 1 | Items |

On the Figma page: "Example / command palette over the app", "Example / person preview", "Example / quick edit from a header button", "Example / search with suggestions", "Stress test / Command", "Stress test / Command Dialog", "Stress test / Hover Card", "Stress test / Popover"

## Popover

Component · 1 variant · default size 288 × 82

Floating panel anchored to a trigger (shadcn Popover). 288 wide, popover tokens, shadow/md. Rich content that is not a menu: quick edit, details, filters. Closes on outside click and Escape.

**Use for**

- Quick edit of one value or a small form tied to its trigger
- Details or a share link next to the element they belong to
- Filter options with few choices, a date picker, a color picker
- A Select or Combobox inside the panel is fine

**Not for**

- A label or one-line hint: use Tooltip
- A list of actions or one choice from a short list: use Menu
- A searchable list: use Command or Combobox
- Content that needs more room or blocks the page: use Sheet or Dialog

**Anatomy**

1. Trigger the panel is anchored to
2. Panel: background/popover, border/default, shadow/md, 288 wide
3. Content slot: title, short text, fields and actions

**Content and behavior**

- Opens on click, never on hover
- Closes on outside click, on Escape and after its action is done
- Keep it small: 288 wide, up to ~400; more content belongs in a Sheet
- Never nest popovers
- Fill the Content slot in the instance; never detach

**Accessibility**

- Focus moves into the popover on open and returns to the trigger on close
- The trigger exposes aria-expanded (Radix sets it)
- Escape closes it from anywhere inside

Slots (fill them in the instance, never detach): `Content`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/4`, `spacing/72`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md), [date-picker](../../skills/build-ui/components/date-picker.md), [popover](../../skills/build-ui/components/popover.md), [tooltip](../../skills/build-ui/components/tooltip.md), [tour](../../skills/build-ui/components/tour.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Tooltip`, `Popover`, `HoverCard`

## Command Input

Component · 1 variant · default size 288 × 36

Search field at the top of a Command list. Borderless with a bottom divider.

| Property | Type | Default |
|---|---|---|
| Value | text | Search country… |

Icons: search

Tokens and styles:
- Colors: `border/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/9`
- Text styles: `body/small`

Guides: [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md)

## Command

Component · 1 variant · default size 288 × 206

Searchable list (shadcn Command / cmdk). Base for Combobox, command palette (⌘K) and mention pickers. Turn on Empty and off Show items for the no-results state.

**Use for**

- Picking from a long list by typing, inside a Combobox
- Mention pickers and quick switchers
- Filter options in a popover opened from a filter chip
- Command palette: use Command Dialog, which is built on it

**Not for**

- A short list of actions without search: use Menu
- 6-15 options in a form field: use Select
- Rich content that is not a list: use Popover

**Anatomy**

1. Command Input: search icon and the query (Value)
2. Items slot: Menu Label group headings and Menu Item rows
3. Empty state: "No results found." (Empty on, Show items off)

**Content and behavior**

- Before typing, show recent or suggested items
- Group results with Menu Label; highlight the first match
- No match: turn on Empty and off Show items, and offer a next step when possible
- In a Combobox, the selected Menu Item shows Checked
- Long lists load asynchronously with a loading row, never an empty list

**Accessibility**

- Arrow keys move the highlight, Enter picks, Escape closes
- The input has an accessible label; the active option is announced
- "No results" is announced, not only shown

| Property | Type | Default |
|---|---|---|
| Empty | boolean | false |
| Show items | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Command Input`, `Menu Item`, `Menu Label`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/6`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Command`, `CommandDialog`

## Hover Card

Component · 1 variant · default size 320 × 142

Preview on hover or focus of a link (shadcn Hover Card): people, links, items. Read-only: no actions that cannot also be reached elsewhere. Opens after ~500 ms, never on touch (tap goes to the page).

**Use for**

- Preview a person from a name or avatar link
- Preview a linked record (project, invoice) before opening it
- Link previews in comments and documents

**Not for**

- Naming an icon button or a one-line hint: use Tooltip
- Interactive content or actions: use Popover
- Touch devices: no hover card, a tap opens the target

**Anatomy**

1. Trigger: a link
2. Panel: 320 wide, background/popover, border/default
3. Content slot: Avatar, name and a short detail
4. Meta line with the calendar icon and a date

**Content and behavior**

- Opens after ~500 ms on hover or focus
- Read-only: anything actionable must also be reachable on the target page
- Never the only way to get the information
- Never on touch: a tap goes to the page

**Accessibility**

- Opens on keyboard focus of the trigger, not only on hover
- The trigger is a real link, so the target is reachable without the card
- Screen reader users get the same information on the target page

Slots (fill them in the instance, never detach): `Content`

Built from: `Avatar`. Icons: calendar

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/4`, `spacing/80`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [popover](../../skills/build-ui/components/popover.md)

Code: shadcn `Tooltip`, `Popover`, `HoverCard`

## Command Dialog

Component · 1 variant · default size 560 × 360

Command palette (shadcn Command Dialog), opened with ⌘K / Ctrl K from anywhere. Search pages, records and actions; recent items before typing; groups; shortcuts on the right; footer with keys. Centered at ~20% from the top over dialog/overlay.

**Use for**

- Global search and navigation in apps with many pages or records
- Running actions by name, for frequent users
- Together with a visible search button in the Top Bar

**Not for**

- Searching inside one list or table: use a search Input with the Filter Bar
- Picking a value for a field: use Combobox
- The only way to reach a feature: keep it in the navigation too

**Anatomy**

1. Overlay: dialog/overlay; panel centered ~20% from the top
2. Command Input with the query
3. Items slot: groups (Pages, Records, Actions, Settings) under Menu Label headings
4. Menu Item rows with the shortcut on the right as Kbd
5. Separator, then a footer with the keys ↑ ↓ ↵ esc

**Content and behavior**

- Opens with ⌘K on Mac, Ctrl K on Windows and Linux, and from a visible search button
- Before typing: recent items and suggested actions
- Results grouped by type; Enter opens or runs the highlighted item
- No results: say so and offer "Search everywhere for …" or a create action
- Show only shortcuts that are implemented

**Accessibility**

- Modal dialog: focus goes to the input, Escape closes, focus returns to where it was
- Arrow keys move through results; the active option is announced
- Shortcut keys are platform-aware: ⌘ on Mac, Ctrl elsewhere

Slots (fill them in the instance, never detach): `Items`

Built from: `Command Input`, `Kbd`, `Menu Item`, `Menu Label`, `Separator`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`
- Effects: `shadow/lg`

Guides: [popover](../../skills/build-ui/components/popover.md)

Code: shadcn `Command`, `CommandDialog`
