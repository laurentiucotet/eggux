# Badge

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Badge](#badge) | 14 | - |
| [Badge Count](#badge-count) | 4 | - |
| [Status Dot](#status-dot) | 5 | - |

## Badge

Component set · 14 variants · default size 53 × 20

shadcn Badge plus EGG status variants. Shape: rounded (default) or pill. Options: Icon, Dot (status dot), Count (number after the label). Text carries the meaning; map each status to one variant. Usage: eggux build-ui/components/badge.md

| Variant property | Values |
|---|---|
| Variant | default, secondary, destructive, outline, success, warning, info |
| Shape | rounded, pill |

| Property | Type | Default |
|---|---|---|
| Label | text | Badge |
| Icon | boolean | false |
| Icon type | instance swap | Icon/check |
| Dot | boolean | false |
| Count | boolean | false |
| Count value | text | 3 |

Icons: check

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/primary`, `background/secondary`, `background/success`, `background/warning`, `border/default`, `foreground/default`, `foreground/destructive`, `foreground/info`, `foreground/primary`, `foreground/secondary`, `foreground/success`, `foreground/warning`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/full`, `radius/md`
- Text styles: `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md), [card](../../skills/build-ui/components/card.md), [indicators](../../skills/build-ui/components/indicators.md), [table](../../skills/build-ui/components/table.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Badge` (+ success, warning, info variants) (Status Dot: custom span + label)

## Badge Count

Component set · 4 variants · default size 20 × 20

Numeric counter (notifications, unread, items in a nav entry). Use "99+" above 99. Place on an icon button corner or at the end of a sidebar item.

| Variant property | Values |
|---|---|
| Variant | default, secondary, destructive, outline |

| Property | Type | Default |
|---|---|---|
| Count | text | 3 |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/default`, `foreground/default`, `foreground/destructive`, `foreground/primary`, `foreground/secondary`
- Spacing and size: `spacing/1_5`, `spacing/5`
- Radius: `radius/full`
- Text styles: `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md), [drawer](../../skills/build-ui/components/drawer.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: shadcn `Badge` (+ success, warning, info variants) (Status Dot: custom span + label)

## Status Dot

Component set · 5 variants · default size 58 × 20

State of a system, service or person in text flow and tables (Online, Down, Syncing). Always with a label; dot alone only where the label is right next to it (avatar status). For a label inside a pill use Badge with Dot.

| Variant property | Values |
|---|---|
| Status | success, warning, error, info, neutral |

| Property | Type | Default |
|---|---|---|
| Label | text | Online |
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/success`, `background/warning`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [indicators](../../skills/build-ui/components/indicators.md)

Code: shadcn `Badge` (+ success, warning, info variants) (Status Dot: custom span + label)
