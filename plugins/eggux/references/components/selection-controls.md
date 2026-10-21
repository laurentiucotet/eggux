# Selection controls

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Checkbox](#checkbox) | 12 | - |
| [Radio](#radio) | 8 | - |
| [Switch](#switch) | 6 | - |

## Checkbox

Component set · 12 variants · default size 198 × 20

shadcn Checkbox with label. Inside forms that save on submit. Indeterminate only for "select all" over a partial selection. Usage: eggux build-ui/components/select.md

| Variant property | Values |
|---|---|
| Checked | false, true, indeterminate |
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Send me product updates |
| Show label | boolean | true |

Icons: check, minus

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `border/input`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/4`
- Radius: `radius/sm`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [select](../../skills/build-ui/components/select.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md)

Code: shadcn `Checkbox`, `RadioGroup`, `Switch`

## Radio

Component set · 8 variants · default size 87 × 20

shadcn RadioGroup item with label. 2-5 options worth seeing, single choice. Usage: eggux build-ui/components/select.md

| Variant property | Values |
|---|---|
| Checked | false, true |
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | In person |
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `border/input`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/4`
- Radius: `radius/full`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Checkbox`, `RadioGroup`, `Switch`

## Switch

Component set · 6 variants · default size 167 × 20

shadcn Switch with label. Applies immediately and shows the result; inside a form that saves on submit use Checkbox. Usage: eggux build-ui/components/select.md

| Variant property | Values |
|---|---|
| Checked | false, true |
| State | default, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Email notifications |
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/default`, `background/primary`, `border/input`, `foreground/default`, `switch/thumb-unchecked`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/4`, `spacing/5`, `spacing/9`
- Radius: `radius/full`
- Text styles: `ui/label`
- Effects: `shadow/sm`, `shadow/xs`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Checkbox`, `RadioGroup`, `Switch`
