# Select

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Select](#select) | 8 | - |
| [Combobox](#combobox) | 8 | - |
| [Tag](#tag) | 2 | - |
| [Tag Input](#tag-input) | 4 | Tags |

On the Figma page: "Example / combobox open", "Example / multi-select open", "Example / select open"

## Select

Component set · 8 variants · default size 240 × 36

shadcn Select trigger. 6-15 options, single choice. Open state: Select (focus) + Menu with Checked on the selected item. Use inside Field for label and errors. Usage: eggux build-ui/components/select.md

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select a location |

Icons: chevron-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`
- Effects: `shadow/xs`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [select](../../skills/build-ui/components/select.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Select`; `Popover` + `Command`

## Combobox

Component set · 8 variants · default size 240 × 36

Searchable select (shadcn Combobox = Popover + Command). Use instead of Select when there are more than ~10 options or users know what to type (country, customer, product). Open state: Combobox (focus) + Command below, 4 px gap.

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select country… |

Icons: chevrons-up-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Select`; `Popover` + `Command`

## Tag

Component set · 2 variants · default size 72 × 24

Removable value inside Tag Input and multi-select (secondary bg, 24 high). For filters outside a field use Chip.

| Variant property | Values |
|---|---|
| State | default, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Design |
| Remove | boolean | true |

Icons: x

Tokens and styles:
- Colors: `background/secondary`, `foreground/secondary`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `radius/sm`
- Text styles: `ui/label-small`

Guides: [select](../../skills/build-ui/components/select.md)

Code: custom on `Badge` + remove `Button`

## Tag Input

Component set · 4 variants · default size 360 × 38

Several values in one field: multi-select from a list (Chevron on, opens Command with checkboxes) or free tags (Chevron off, Enter adds). Show at most ~5 tags, then "+3 more".

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Chevron | boolean | true |

Slots (fill them in the instance, never detach): `Tags`

Built from: `Tag`. Icons: chevrons-up-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Select`; `Popover` + `Command`
