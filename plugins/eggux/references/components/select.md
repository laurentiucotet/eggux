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
| [Person Option](#person-option) | 4 | - |
| [People Picker](#people-picker) | 2 | Selected, Results |
| [Transfer List](#transfer-list) | 1 | Available, Selected |

On the Figma page: "Example / combobox open", "Example / multi-select open", "Example / select open", "Stress test / People Picker and Transfer List"

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

## Person Option

Component set · 4 variants · default size 288 × 54

One person in a People Picker list: checkbox (multi-select), avatar (exposed: initials or photo), name, role and email. Disambiguate people with the same name by email or team.

| Variant property | Values |
|---|---|
| Selected | false, true |
| State | default, hover |

| Property | Type | Default |
|---|---|---|
| Name | text | Ana Popescu |
| Detail | text | Finance manager · ana.popescu@acme.com |
| Show detail | boolean | true |

Built from: `Avatar`, `Checkbox`

Tokens and styles:
- Colors: `background/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger (Server search by name, email, team; debounce 200 ms)

## People Picker

Component set · 2 variants · default size 360 × 38

Choose one or more people (assignee, approvers, share with): selected people as chips in the field (Selected slot), search by name, email or team, results with avatar, role and email (Results slot of Person Options), invite by email when nobody matches. Recent and suggested people first. Over ~4 selected: "+3" in the field. Placeholder truncates on one line; chips wrap to new rows.

| Variant property | Values |
|---|---|
| State | closed, open |

| Property | Type | Default |
|---|---|---|
| Placeholder | text | Add people… |

Slots (fill them in the instance, never detach): `Selected`, `Results`

Built from: `Button`, `Command Input`, `Context Chip`, `Person Option`, `Separator`

Tokens and styles:
- Colors: `background/default`, `background/popover`, `border/default`, `border/input`, `border/ring`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/md`
- Text styles: `body/small`
- Effects: `shadow/md`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger (Server search by name, email, team; debounce 200 ms)

## Transfer List

Component · 1 variant · default size 628 × 291

Move items between two lists (permissions to a role, columns to a view, members to a group): each side has a count, search and checkboxes; arrows move the checked items. Keyboard: Space checks, the buttons move. For under ~10 items a list of checkboxes is simpler.

| Property | Type | Default |
|---|---|---|
| Left title | text | Available |
| Right title | text | Selected |

Slots (fill them in the instance, never detach): `Available`, `Selected`

Built from: `Button Icon`, `Facet Option`, `Input`, `Separator`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md)

Code: custom: two lists of `Checkbox` rows + move `Button`s (Or `@dnd-kit` when order matters)
