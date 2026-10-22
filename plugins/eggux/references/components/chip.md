# Chip

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chip](#chip) | 5 | - |

On the Figma page: "Example / filter chips", "Stress test / Chip"

## Chip

Component set · 5 variants · default size 94 × 32

Chip (pill) for filters and multi-selection. selected = active filter (check icon when Leading icon is on). Remove shows an x to clear it; in code the x is a button labelled "Remove <value>". Usage: eggux build-ui/components/badge.md, patterns/search-and-filter.md

**Use for**

- Quick filters above a list ("This week", "Unpaid")
- Multi-select options shown as toggles
- Active filter values that can be cleared with Remove

**Not for**

- A status or category that is not clickable: use Badge
- A field filter with several values in a Filter Bar: use Filter Chip
- One choice among a few options: use Toggle Group

**Anatomy**

1. Leading icon (Show leading icon): calendar, or check when selected
2. Label
3. Remove x (Show remove)

**Content and behavior**

- Label is one or two words in sentence case
- State=selected marks an active filter; with Show leading icon on, the icon becomes a check
- Selected is shown by the check and fill, not by color alone
- Show "Clear all" when more than one filter is active

**Accessibility**

- A selectable chip is a toggle button with aria-pressed
- The remove x is a separate button labelled "Remove <value>"
- Focus state is visible (border/ring)
- Touch targets at least 44 x 44 on mobile

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | This week |
| Show leading icon | boolean | false |
| Show remove | boolean | false |

Icons: calendar, check, x

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `border/input`, `foreground/accent`, `foreground/default`, `foreground/primary`
- Spacing and size: `spacing/1_5`, `spacing/3`, `spacing/8`
- Radius: `radius/full`
- Text styles: `ui/label`

Guides: [badge](../../skills/build-ui/components/badge.md)

Code: custom on `Badge` + remove `Button`
