# Mobile

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Mobile Header](#mobile-header) | 2 | Leading, Trailing |
| [Bottom Nav Item](#bottom-nav-item) | 2 | - |
| [Bottom Nav](#bottom-nav) | 1 | Items |

## Mobile Header

Component set · 2 variants · default size 390 × 56

Top bar on mobile (< 768). app: menu + page title + notifications/avatar. detail: back + object title + actions. Title is the page or object name, truncated to one line. 56 high; add the safe-area inset on top in code.

| Variant property | Values |
|---|---|
| Type | app, detail |

| Property | Type | Default |
|---|---|---|
| Title | text | Customers |

Slots (fill them in the instance, never detach): `Leading`, `Trailing`

Built from: `Avatar`, `Button Icon`

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/14`, `spacing/2`
- Text styles: `heading/h4`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)

## Bottom Nav Item

Component set · 2 variants · default size 78 × 56

One destination in the bottom navigation. Icon 20 + label, active = foreground, others muted. Touch target is the whole cell (min 48 x 48).

| Variant property | Values |
|---|---|
| State | default, active |

| Property | Type | Default |
|---|---|---|
| Label | text | Home |
| Icon | instance swap | Icon/house |

Icons: house

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/14`
- Text styles: `ui/caption`, `ui/label-small`

## Bottom Nav

Component · 1 variant · default size 390 × 81

Bottom navigation for mobile apps with 3-5 top-level destinations used daily. Padding bottom = home-indicator safe area. Hide it on detail pages and while typing.

Slots (fill them in the instance, never detach): `Items`

Built from: `Bottom Nav Item`

Tokens and styles:
- Colors: `background/default`, `border/default`
- Spacing and size: `spacing/2`, `spacing/6`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md)
