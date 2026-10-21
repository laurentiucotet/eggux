# Toggle Group

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toggle Group](#toggle-group) | 2 | Items |
| [Toggle Group Item](#toggle-group-item) | 5 | - |
| [View Switcher](#view-switcher) | 6 | - |
| [Theme Toggle](#theme-toggle) | 3 | - |

On the Figma page: "Stress test / Theme Toggle", "Stress test / Toggle Group", "Stress test / View Switcher"

## Toggle Group

Component set · 2 variants · default size 176 × 36

shadcn ToggleGroup: sets a value (view mode, period, text style). For switching content panels use Tabs. Usage: eggux build-ui/components/tabs.md

**Use for**

- View mode: list / board
- Period: day / week / month
- Formatting in a Rich Text Editor toolbar
- Product options such as size on a product page

**Not for**

- Switching panels of content: use Tabs
- Independent actions (Archive, zoom): use Button Group
- Many options: use Select

**Anatomy**

1. Group (Variant: default or outline)
2. Items slot: Toggle Group Item instances
3. Item: Label and/or icon (Show label, Icon, Icon type)
4. Selected item: State=on

**Content and behavior**

- It sets a value; if the content below changes panels, use Tabs
- Single choice for view mode or period; multiple for formatting
- Icon-only items: Show label off, Icon on, with a tooltip
- Choosing a value is a Toggle Group, not a Button Group

**Accessibility**

- Arrow keys move between items; Space or Enter toggles
- Selected state is exposed (aria-checked for single, aria-pressed for multiple)
- Icon-only items have an aria-label that matches the tooltip

| Variant property | Values |
|---|---|
| Variant | default, outline |

Slots (fill them in the instance, never detach): `Items`

Built from: `Toggle Group Item`

Tokens and styles:
- Colors: `border/input`
- Spacing and size: `spacing/1`
- Radius: `radius/md`
- Effects: `shadow/xs`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `Tabs`, `ToggleGroup`

## Toggle Group Item

Component set · 5 variants · default size 58 × 36

shadcn ToggleGroupItem. on = pressed (selected value). Icon-only: Show label off, Icon on, and an accessible label in code.

| Variant property | Values |
|---|---|
| State | off, hover, on, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Week |
| Show label | boolean | true |
| Icon | boolean | false |
| Icon type | instance swap | Icon/info |

Icons: info

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/muted`, `foreground/accent`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/2_5`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

## View Switcher

Component set · 6 variants · default size 276 × 46

Switch how one set of records is shown: list, board, calendar (add map or gallery when the data has it). Lives in the Page Toolbar, right side. Icon-only (Labels=false) in dense toolbars, with tooltips. The chosen view is remembered per person and kept in the URL; filters and selection survive the switch.

**Use for**

- Tasks, deals or projects shown as a list, a board or a calendar
- Records with places or images (add map or gallery)
- The right side of a page toolbar

**Not for**

- Switching between different content (Overview, Invoices): use Tabs
- Density or columns of one table: use Data Grid Toolbar
- Other values such as a period: use Toggle Group

**Anatomy**

1. Toggle Group with Toggle Group Items: List, Board, Calendar, each with an icon
2. Labels=false: icons only, with tooltips

**Content and behavior**

- View: list, board, calendar; Labels: true, false
- Icon-only (Labels=false) in dense toolbars, with tooltips
- The chosen view is remembered per person and kept in the URL
- Filters, search and selection survive the switch
- Offer only views the data supports

**Accessibility**

- A radiogroup (ToggleGroup type single) with aria-label="View"
- Arrow keys move between views; Space or Enter selects
- Icon-only items have an aria-label that matches the tooltip

| Variant property | Values |
|---|---|
| View | list, board, calendar |
| Labels | true, false |

Built from: `Toggle Group`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md), [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `ToggleGroup type="single"` with icons; view in a URL search param (Remember per person; filters survive the switch)

## Theme Toggle

Component set · 3 variants · default size 126 × 46

Light, dark or follow the system: three icon buttons with tooltips, in the Account Menu or appearance settings. System is the default. The change applies at once, without a reload, and is saved per person.

**Use for**

- The Account Menu
- Appearance settings
- The footer of a docs or content site

**Not for**

- A brand or theme color: use Color Picker
- Density or other appearance options: use Select or Toggle Group

**Anatomy**

1. Toggle Group with three icon Toggle Group Items: light, dark, system

**Content and behavior**

- Value: light, dark, system
- System is the default
- The change applies at once, without a reload
- Saved per person; set before first paint so the page does not flash

**Accessibility**

- A radiogroup with aria-label="Theme"; items labelled "Light", "Dark", "System"
- Tooltips match the aria-labels
- Both themes meet contrast on every token

| Variant property | Values |
|---|---|
| Value | light, dark, system |

Built from: `Toggle Group`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `ToggleGroup type="single"` + next-themes `setTheme` (System by default; no flash on load)
