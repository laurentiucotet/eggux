# Popover

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Popover](#popover) | 1 | Content |
| [Command](#command) | 1 | Items |
| [Command Input](#command-input) | 1 | - |
| [Command Dialog](#command-dialog) | 1 | Items |
| [Hover Card](#hover-card) | 1 | Content |
| [Emoji Picker](#emoji-picker) | 1 | - |
| [App Launcher](#app-launcher) | 1 | - |
| [Confirm Popover](#confirm-popover) | 2 | - |

On the Figma page: "Example / app launcher from the top bar", "Example / command palette over the app", "Example / confirm before archiving invoices", "Example / emoji picker in a comment", "Example / person preview", "Example / quick edit from a header button", "Example / search with suggestions", "Stress test / App Launcher", "Stress test / Command", "Stress test / Command Dialog", "Stress test / Confirm Popover", "Stress test / Emoji Picker", "Stress test / Hover Card", "Stress test / Popover"

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
- Effects: `shadow/md`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md), [date-picker](../../skills/build-ui/components/date-picker.md), [popover](../../skills/build-ui/components/popover.md), [tooltip](../../skills/build-ui/components/tooltip.md), [tour](../../skills/build-ui/components/tour.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Tooltip`, `Popover`, `HoverCard`

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
| Show empty | boolean | false |
| Show items | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Command Input`, `Menu Item`, `Menu Label`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/6`
- Radius: `radius/md`
- Text styles: `body/small`
- Effects: `shadow/md`

Guides: [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Command`, `CommandInput`, `CommandDialog`

## Command Input

Component · 1 variant · default size 288 × 36

Search field at the top of a Command list. Borderless with a bottom divider.

| Property | Type | Default |
|---|---|---|
| Value | text | Search country… |

Icons: search

Tokens and styles:
- Colors: `border/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Text styles: `body/small`

Guides: [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `Command`, `CommandInput`, `CommandDialog`

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

Code: shadcn `Command`, `CommandInput`, `CommandDialog`

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
- Effects: `shadow/md`

Guides: [popover](../../skills/build-ui/components/popover.md)

Code: shadcn `Tooltip`, `Popover`, `HoverCard`

## Emoji Picker

Component · 1 variant · default size 320 × 192

Pick an emoji for reactions, status or a workspace icon: search, categories, recently used first, a grid of 8 per row. Opens in a Popover from a smiley Button Icon; Enter picks the highlighted one. Skin tone remembered per person. Reactions use Reaction Bar.

**Use for**

- Picking an emoji for a status or a workspace icon
- The + button at the end of a Reaction Bar
- Inserting an emoji in a Comment or Chat Composer

**Not for**

- Adding a reaction from a short fixed set: use Reaction Bar
- Picking a product icon or a color: use Swatch Picker
- Rating or feedback faces: use CSAT Rating

**Anatomy**

1. Search: Command Input
2. Categories: icon tabs (Recent, Smileys, Hearts, Objects, Ideas, World)
3. Section label: the current category
4. Grid: emoji cells, 8 per row

**Content and behavior**

- Opens in a Popover from a smiley Button Icon; picking an emoji closes it
- Recently used first, then categories in a fixed order
- Search matches names and keywords ("check", "party"); no results shows "No emoji found"
- Skin tone is remembered per person
- Enter picks the highlighted emoji; the search keeps focus while arrows move in the grid

**Accessibility**

- The grid has role="grid" (or listbox) with arrow-key navigation and one tab stop
- Each emoji has an accessible name ("thumbs up"), not only the character
- Category tabs are buttons with aria-label and aria-pressed for the current one
- Escape closes the picker and returns focus to the trigger

Built from: `Command Input`. Icons: globe, heart, history, lightbulb, smile, sparkles

Tokens and styles:
- Colors: `background/accent`, `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2`
- Radius: `radius/md`, `radius/sm`
- Text styles: `body/lead`, `ui/caption`
- Effects: `shadow/md`

Guides: [popover](../../skills/build-ui/components/popover.md)

Code: frimousse or emoji-mart in shadcn `Popover` (Search, recent first, 8 per row; skin tone stored per user)

## App Launcher

Component · 1 variant · default size 320 × 214

Grid of the products in a suite, opened from a layout-grid Button Icon in the top bar. Current app highlighted; 3 per row; names of one or two words. Only for suites with 4 or more apps; two apps fit in the Org Switcher or a link.

**Use for**

- Suites with 4 or more apps under one sign-in (Invoices, Payroll, CRM)
- Jumping between apps from the Top Bar
- Showing which app people are in

**Not for**

- Two or three apps: use Org Switcher or a link in the Top Bar
- Switching workspaces or tenants: use Org Switcher
- Navigation inside one app: use Sidebar

**Anatomy**

1. Title: "Apps", ui/label, muted
2. Grid of apps, 3 per row: icon tile and app name
3. Current app: highlighted tile

**Content and behavior**

- Only for suites with 4 or more apps
- App names of one or two words, below the tile, never truncated
- Same order for everyone; the current app is highlighted, not moved to the start
- Apps the person has no access to are hidden
- An app that opens in a new tab shows an external-link icon

**Accessibility**

- The trigger is a Button Icon with aria-label="Apps" and aria-expanded
- Each app is a link; the current one has aria-current="page"
- Arrows move in the grid, Escape closes and returns focus to the trigger

Icons: archive, calendar, chart-column, credit-card, file-text, users

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `background/popover`, `border/default`, `foreground/popover`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/3`
- Radius: `radius/lg`, `radius/md`
- Text styles: `ui/caption`, `ui/label`
- Effects: `shadow/md`

Guides: [popover](../../skills/build-ui/components/popover.md)

Code: shadcn `Popover` with a `grid-cols-3` of links (Current app `aria-current="page"`; only 4+ apps)

## Confirm Popover

Component set · 2 variants · default size 288 × 122

A small check next to the button that triggered it, for actions with some cost that do not need a full dialog: archive, remove a person, discard a draft. Title as a question with the object, one line on the consequence, Cancel and the action verb. Irreversible loss of data uses Alert Dialog; reversible actions with Undo need no confirmation.

**Use for**

- Archive, remove a person from a project, discard a draft
- Row actions in a table where a dialog would hide the context
- Bulk actions on a few items ("Archive 3 invoices?")

**Not for**

- Irreversible loss of data: use Alert Dialog
- Reversible actions: use a Toast with Undo, no confirmation
- A choice with several options or a form: use Dialog

**Anatomy**

1. Title: a question with the object, ui/label
2. Description: one line on the consequence, body/small, muted
3. Actions: Cancel (Button outline sm) and confirm (Button sm, destructive for Tone=destructive)

**Content and behavior**

- Title is a question that names the action and the object: "Archive 3 invoices?"
- Description says what happens next or how to undo it, in one line
- The confirm button repeats the verb ("Archive"); never "OK" or "Yes"
- Tone=destructive for remove and discard; default for archive and similar
- Opens next to the trigger; clicking outside or Escape cancels

**Accessibility**

- Focus moves to Cancel when it opens and returns to the trigger when it closes
- role="alertdialog" with aria-labelledby on the title and aria-describedby on the description
- Escape cancels; Enter on the confirm button runs the action

| Variant property | Values |
|---|---|
| Tone | default, destructive |

| Property | Type | Default |
|---|---|---|
| Title | text | Archive 3 invoices? |
| Description | text | You can restore them from Archived. |

Built from: `Button`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`, `foreground/popover`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/md`

Guides: [popover](../../skills/build-ui/components/popover.md)

Code: shadcn `Popover` (`role="alertdialog"`) + two `Button`s (Irreversible actions use `AlertDialog`)
