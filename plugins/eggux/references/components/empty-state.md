# Empty State

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Empty State](#empty-state) | 2 | Actions |

On the Figma page: "Example / first invoice", "Stress test / Empty State"

## Empty State

Component set · 2 variants · default size 400 × 286

What to show when there is nothing: first use (explain and offer the first action), no results (say why and offer "Clear filters"), no access (say who can grant it), error (say what failed and offer Retry). Size default for pages and large cards, sm inside tables, cards and panels. Icon matches the object; never an illustration that hides the message.

**Use for**

- First use: explain and offer the first action ("Create invoice")
- No results: say what was searched and offer "Clear filters"
- No access: say who can grant it
- Error: say what failed and offer Retry
- Size=default for pages and large cards, sm inside tables, cards and panels

**Not for**

- Loading: use Skeleton in the shape of the content
- A whole page that failed or is forbidden: use a result page
- Field errors: inline message under the field

**Anatomy**

1. Icon (swap) that matches the object
2. Title ("No invoices yet")
3. Description, one sentence (Show description)
4. Actions slot (Show actions)

**Content and behavior**

- Every list and table has one
- Action only when the user may create; use the object's create label
- Centered in the area the content would occupy, not the whole page
- Never an illustration that hides the message
- Inside a table: Size=sm under the header row
- Cleared (inbox zero): a short positive line, no action

**Accessibility**

- The title is a heading at the right level
- The icon is decorative (aria-hidden)
- Actions are buttons reachable by keyboard
- Description in foreground/muted keeps 4.5:1

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
