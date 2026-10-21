# Progress

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Progress](#progress) | 5 | - |

## Progress

Component set · 5 variants · default size 320 × 8

Determinate progress (shadcn Progress): uploads, imports, multi-step completion. Indicator width = value; resize the indicator for other values. Show the number or "3 of 5" next to it. Unknown duration: use a Spinner or Skeleton instead.

| Variant property | Values |
|---|---|
| Value | 0, 25, 50, 75, 100 |

Tokens and styles:
- Colors: `background/muted`, `background/primary`
- Spacing and size: `spacing/2`
- Radius: `radius/full`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Slider`, `Progress`
