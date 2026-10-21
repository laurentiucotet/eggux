# Input

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Input](#input) | 8 | Trailing |
| [Field](#field) | 3 | Control |
| [Password Strength](#password-strength) | 5 | - |
| [Textarea](#textarea) | 8 | - |
| [Input Addon](#input-addon) | 2 | - |
| [Input Group](#input-group) | 4 | Start, End |
| [Number Input](#number-input) | 4 | - |

On the Figma page: "Example / input groups"

## Input

Component set · 8 variants · default size 320 × 36

shadcn Input. Content=placeholder shows an example value in foreground/muted, never the label. Use inside Field for label, hint and error. Usage: eggux build-ui/components/input.md

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | name@example.com |
| Leading icon | boolean | false |
| Leading icon type | instance swap | Icon/search |
| Show trailing | boolean | false |

Slots (fill them in the instance, never detach): `Trailing`

Icons: search

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/xs`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Field

Component set · 3 variants · default size 320 × 88

Label + Control (native slot, default Input) + hint or error. Label always visible. Error text uses background/destructive with an icon. Usage: eggux build-ui/patterns/form-validation.md

| Variant property | Values |
|---|---|
| State | default, error, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Email |
| Hint | text | We send receipts and account notices here. |
| Show hint | boolean | true |
| Error | text | Enter an email address like name@example.com |

Slots (fill them in the instance, never detach): `Control`

Built from: `Input`. Icons: circle-alert

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `ui/caption`, `ui/label`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Password Strength

Component set · 5 variants · default size 288 × 42

Strength meter under a new-password Field. Message says what is missing; the level is in text and bar count, not only color. Fair uses foreground/default because amber fails as a thin bar on white.

| Variant property | Values |
|---|---|
| Strength | empty, weak, fair, good, strong |

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/muted`, `background/success`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/72`
- Radius: `radius/full`
- Text styles: `ui/caption`

## Textarea

Component set · 8 variants · default size 320 × 64

Multi-line text input (shadcn Textarea). Min height 64, grows with content; in code set rows or max height with scroll. Put it in a Field for label, hint and error. Character count goes in the Field hint ("120/500").

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Add a note… |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Input Addon

Component set · 2 variants · default size 74 × 36

Text or icon attached to an Input Group: protocol, domain, unit, currency, @. Muted background, divider toward the field.

| Variant property | Values |
|---|---|
| Position | start, end |

| Property | Type | Default |
|---|---|---|
| Text | text | https:// |

Tokens and styles:
- Colors: `background/muted`, `border/input`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputGroup` or custom

## Input Group

Component set · 4 variants · default size 360 × 36

Input with attached addons (shadcn Input Group). Use when a fixed prefix/suffix is part of the value format (https://, .com, EUR, kg, %). For icons inside the field, use Input with Leading icon / Trailing slot instead.

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Value | text | egg-ux |
| Show start | boolean | true |
| Show end | boolean | true |

Slots (fill them in the instance, never detach): `Start`, `End`

Built from: `Input Addon`

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md), [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputGroup` or custom

## Number Input

Component set · 4 variants · default size 140 × 36

Number with − / + steppers for small integer quantities (guests, seats, items). Typing stays possible; min/max disable the buttons; long press repeats. For money or decimals use Input Group with a unit.

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Value | text | 2 |

Icons: minus, plus

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputGroup` or custom
