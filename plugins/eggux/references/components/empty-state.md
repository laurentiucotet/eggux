# Empty State

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Empty State](#empty-state) | 2 | Actions |

On the Figma page: "Stress test / Empty State"

## Empty State

Component set · 2 variants · default size 400 × 286

What to show when there is nothing: first use (explain and offer the first action), no results (say why and offer "Clear filters"), no access (say who can grant it), error (say what failed and offer Retry). Size default for pages and large cards, sm inside tables, cards and panels. Icon matches the object; never an illustration that hides the message.

| Variant property | Values |
|---|---|
| Size | default, sm |

| Property | Type | Default |
|---|---|---|
| Title | text | No invoices yet |
| Description | text | Create your first invoice or import them from your accounting system. |
| Icon | instance swap | Icon/inbox |
| Show actions | boolean | true |
| Show description | boolean | true |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`. Icons: inbox

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/12`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`
- Text styles: `body/default`, `body/small`, `heading/h4`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md), [empty-state](../../skills/build-ui/patterns/empty-state.md)

Code: shadcn `Empty` (or a custom block: icon, title, description, actions)
