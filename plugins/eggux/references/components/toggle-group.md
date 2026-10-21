# Toggle Group

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toggle Group Item](#toggle-group-item) | 5 | - |
| [Toggle Group](#toggle-group) | 2 | Items |

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

## Toggle Group

Component set · 2 variants · default size 176 × 36

shadcn ToggleGroup: sets a value (view mode, period, text style). For switching content panels use Tabs. Usage: eggux build-ui/components/tabs.md

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
