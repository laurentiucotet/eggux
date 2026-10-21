# Button

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Button](#button) | 72 | - |
| [Button Icon](#button-icon) | 20 | - |
| [Button Group Item](#button-group-item) | 12 | - |
| [Button Group](#button-group) | 1 | Items |
| [Split Button](#split-button) | 2 | - |

On the Figma page: "Example / split button open"

## Button

Component set · 72 variants · default size 69 × 32

shadcn Button. One "default" (primary) per view; "destructive" only inside a confirmation step. Label is a verb. Usage: eggux build-ui/components/button.md

| Variant property | Values |
|---|---|
| Variant | default, secondary, outline, ghost, destructive, link |
| Size | sm, default, lg |
| State | default, hover, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Button |
| Leading icon | boolean | false |
| Leading icon type | instance swap | Icon/plus |
| Trailing icon | boolean | false |
| Trailing icon type | instance swap | Icon/chevron-right |

Icons: chevron-right, plus

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/input`, `button/destructive-hover`, `button/primary-hover`, `button/secondary-hover`, `foreground/accent`, `foreground/default`, `foreground/destructive`, `foreground/primary`, `foreground/secondary`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/8`
- Radius: `radius/md`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [button](../../skills/build-ui/components/button.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [ai-chat](../../skills/build-ui/patterns/ai-chat.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Button` (`size="icon"`) (`Leading icon` → icon child before the label)

## Button Icon

Component set · 20 variants · default size 36 × 36

Icon-only button, 36x36 (shadcn size="icon"). Always needs an accessible label in code and a tooltip with the same text. Usage: eggux build-ui/components/button.md, tooltip.md

| Variant property | Values |
|---|---|
| Variant | default, secondary, outline, ghost, destructive |
| State | default, hover, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Icon | instance swap | Icon/ellipsis |

Icons: ellipsis

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/input`, `button/destructive-hover`, `button/primary-hover`, `button/secondary-hover`
- Spacing and size: `density/control-height`
- Radius: `radius/md`
- Effects: `shadow/xs`

Guides: [button](../../skills/build-ui/components/button.md), [carousel](../../skills/build-ui/components/carousel.md)

Code: shadcn `Button` (`size="icon"`) (`Leading icon` → icon child before the label)

## Button Group Item

Component set · 12 variants · default size 80 × 36

One segment of a Button Group: first (left radius), middle, last (right radius). active = pressed/selected (bg accent). Icon-only: Show label off + Icon on, with a tooltip.

| Variant property | Values |
|---|---|
| Position | first, middle, last |
| State | default, hover, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Edit |
| Show label | boolean | true |
| Icon | boolean | false |
| Icon type | instance swap | Icon/pencil |

Icons: pencil

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/input`, `foreground/accent`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [button](../../skills/build-ui/components/button.md)

## Button Group

Component · 1 variant · default size 240 × 36

Related actions joined in one control (shadcn Button Group): Edit / Duplicate / Archive, prev / next, zoom - / +. For choosing a value use Toggle Group; for one main action + options use Split Button.

Slots (fill them in the instance, never detach): `Items`

Built from: `Button Group Item`

Guides: [button](../../skills/build-ui/components/button.md)

Code: shadcn `ButtonGroup` or custom flex + `DropdownMenu`

## Split Button

Component set · 2 variants · default size 98 × 36

One main action + a menu of variants (Save / Save as draft, Save and close). The main part runs the most common choice; the chevron opens a Menu. Do not hide unrelated actions here.

| Variant property | Values |
|---|---|
| Variant | default, outline |

| Property | Type | Default |
|---|---|---|
| Label | text | Save |

Icons: chevron-down

Tokens and styles:
- Colors: `background/default`, `background/primary`, `border/input`, `foreground/default`, `foreground/primary`
- Spacing and size: `border-width/DEFAULT`, `density/control-height`, `spacing/3`, `spacing/4`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [button](../../skills/build-ui/components/button.md)

Code: shadcn `ButtonGroup` or custom flex + `DropdownMenu`
