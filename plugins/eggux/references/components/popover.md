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

On the Figma page: "Example / search with suggestions"

## Popover

Component · 1 variant · default size 288 × 82

Floating panel anchored to a trigger (shadcn Popover). 288 wide, popover tokens, shadow/md. Rich content that is not a menu: quick edit, details, filters. Closes on outside click and Escape.

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
