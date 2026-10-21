# Save Bar

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Save Bar](#save-bar) | 3 | - |

## Save Bar

Component set · 3 variants · default size 720 × 54

Sticky bar at the bottom of a long form or settings page while there are unsaved changes. Discard asks first when changes are large; Save validates and scrolls to the first error. Leaving the page triggers patterns/unsaved-changes.

| Variant property | Values |
|---|---|
| State | default, saving, error |

Built from: `Button`, `Spinner`. Icons: circle-alert

Tokens and styles:
- Colors: `background/destructive`, `background/popover`, `border/default`, `foreground/popover`
- Spacing and size: `spacing/2`, `spacing/2_5`, `spacing/4`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [common-flows](../../skills/build-ui/patterns/common-flows.md), [record-page](../../skills/build-ui/patterns/record-page.md), [unsaved-changes](../../skills/build-ui/patterns/unsaved-changes.md)

Code: custom sticky footer (Listen to form dirty state)
