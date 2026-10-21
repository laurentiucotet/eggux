# Spinner

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Spinner](#spinner) | 6 | - |

## Spinner

Component set · 6 variants · default size 16 × 16

Indeterminate loading (shadcn Spinner). Rotates linear, 1 s per turn (motion/ease/linear). Use for waits under ~3 s or inside buttons ("Saving…" + disabled); content loads use Skeleton, known progress uses Progress. Respect prefers-reduced-motion (pulse opacity instead).

| Variant property | Values |
|---|---|
| Size | sm, default, lg |
| Tone | muted, default |

Icons: loader-circle

Tokens and styles:
- Spacing and size: `spacing/4`, `spacing/5`, `spacing/8`

Guides: [indicators](../../skills/build-ui/components/indicators.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md)

Code: shadcn `Skeleton`, `Spinner`, `Kbd`
