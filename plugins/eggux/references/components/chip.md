# Chip

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chip](#chip) | 21 | - |

On the Figma page: "Example / Chip styles", "Example / filter chips", "Stress test / Chip"

## Chip

Component set · 21 variants · default size 91 × 32

Chip (pill) for filters, multi-selection and tags. Tone=default: neutral outline, State=selected marks an active filter (check icon when Leading icon is on). Tone=soft-info, soft-success, soft-warning, soft-neutral: tinted tags and categories with the Badge soft tokens (states default, hover, focus, disabled; selected stays on Tone=default). Remove shows an x to clear it; in code the x is a button labelled "Remove <value>". Usage: eggux build-ui/components/badge.md, patterns/search-and-filter.md

**Use for**

- Quick filters above a list ("This week", "Unpaid")
- Multi-select options shown as toggles
- Active filter values that can be cleared with Remove
- Tone=soft-info, soft-success, soft-warning, soft-neutral: tags and categories on cards and records ("Design", "Approved")

**Not for**

- A status or category that is not clickable: use Badge
- A field filter with several values in a Filter Bar: use Filter Chip
- One choice among a few options: use Toggle Group
- A tone that means a status nobody can change: use Badge Variant=soft-*

**Anatomy**

1. Tone: default, soft-info, soft-success, soft-warning, soft-neutral (badge/soft-*-bg fill, badge/soft-*-fg text and icons)
2. Leading icon (Show leading icon): calendar, or check when selected
3. Label
4. Remove x (Show remove)
5. State: default, hover, focus, selected, disabled (soft tones: default, hover, focus, disabled)

**Content and behavior**

- Label is one or two words in sentence case
- State=selected marks an active filter; with Show leading icon on, the icon becomes a check
- Selected is shown by the check and fill, not by color alone
- Show "Clear all" when more than one filter is active
- Soft tones are for tags and categories, not for filter state: a selected filter stays Tone=default, State=selected
- Use the tone by meaning (success = done or approved, warning = needs attention, info = type or topic, neutral = other), and keep it the same for the same tag everywhere

**Accessibility**

- A selectable chip is a toggle button with aria-pressed
- The remove x is a separate button labelled "Remove <value>"
- Focus state is visible (border/ring)
- Touch targets at least 44 x 44 on mobile

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected, disabled |
| Tone | default, soft-info, soft-success, soft-warning, soft-neutral |

| Property | Type | Default |
|---|---|---|
| Label | text | This week |
| Show leading icon | boolean | false |
| Show remove | boolean | false |

Icons: calendar, check, x

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `badge/soft-info-bg`, `badge/soft-info-fg`, `badge/soft-neutral-bg`, `badge/soft-neutral-fg`, `badge/soft-success-bg`, `badge/soft-success-fg`, `badge/soft-warning-bg`, `badge/soft-warning-fg`, `border/input`, `foreground/accent`, `foreground/default`, `foreground/primary`
- Spacing and size: `spacing/1_5`, `spacing/3`, `spacing/8`
- Radius: `radius/full`
- Text styles: `ui/label`

Guides: [badge](../../skills/build-ui/components/badge.md)

Code: custom on `Badge` + remove `Button`
