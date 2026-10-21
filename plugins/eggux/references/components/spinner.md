# Spinner

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Spinner](#spinner) | 6 | - |

On the Figma page: "Example / button loading", "Stress test / Spinner"

## Spinner

Component set · 6 variants · default size 16 × 16

Indeterminate loading (shadcn Spinner). Rotates linear, 1 s per turn (motion/ease/linear). Use for waits under ~3 s or inside buttons ("Saving…" + disabled); content loads use Skeleton, known progress uses Progress. Respect prefers-reduced-motion (pulse opacity instead).

**Use for**

- Waits under ~3 s
- Inside a button while it works: "Saving…" + disabled
- One row, field or small area that is loading

**Not for**

- Content loading: use Skeleton
- Known progress: use Progress
- Long jobs: run in the background and notify when done

**Anatomy**

1. loader-circle icon, rotating linear, 1 s per turn
2. Size: sm, default, lg; Tone: muted, default
3. Optional text next to it: "Saving…"

**Content and behavior**

- Show it after ~300 ms to avoid flicker
- One spinner per region, never several at once
- Size: sm 16 for inline and buttons, default 20, lg 32 for an empty region
- Tone=muted on quiet surfaces, Tone=default next to body text
- Reduced motion: pulse the opacity instead of rotating

**Accessibility**

- role="status" with hidden text: "Loading invoices"
- A busy button is disabled and keeps its accessible name

| Variant property | Values |
|---|---|
| Size | sm, default, lg |
| Tone | muted, default |

Icons: loader-circle

Tokens and styles:
- Spacing and size: `spacing/4`, `spacing/5`, `spacing/8`

Guides: [indicators](../../skills/build-ui/components/indicators.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md)

Code: shadcn `Skeleton`, `Spinner`, `Kbd`
