# Spinner

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Spinner](#spinner) | 6 | - |
| [Loading Overlay](#loading-overlay) | 1 | - |

On the Figma page: "Example / button loading", "Stress test / Loading Overlay", "Stress test / Spinner"

## Spinner

Component set · 6 variants · default size 20 × 20

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

Guides: [indicators](../../skills/build-ui/components/indicators.md)

Code: shadcn `Skeleton`, `Spinner`, `Kbd` (`KbdGroup`)

## Loading Overlay

Component · 1 variant · default size 480 × 240

Covers one region while its content reloads (a table after a filter change, a chart after a period change), keeping the old content faded underneath so the layout does not jump. Spinner and a short label. First loads use Skeleton instead; actions that run long use Background Job. Resize to the region it covers.

**Use for**

- A table after a filter, sort or page change
- A chart after a period change
- A card that refreshes its data

**Not for**

- First load of a page or a card: use Skeleton
- Work that runs longer than about 10 seconds: use Background Job
- One button or row that is busy: use Spinner
- An upload with a known length: use Progress

**Anatomy**

1. Content: the region underneath, faded
2. Scrim: background at partial opacity
3. Message: Spinner and Label (Show label), body/small

**Content and behavior**

- Keep the old content in place so the layout does not jump; resize the overlay to the region it covers, never the whole page
- Show it after about 300 ms; quicker loads need nothing
- The label says what loads ("Loading invoices…")
- The covered region is not interactive; the rest of the page stays usable
- A failed load replaces it with an error Empty State in the same area, with "Try again"

**Accessibility**

- The region gets aria-busy="true" while loading
- The label is in a role="status" element (aria-live="polite"); the Spinner is aria-hidden when the label shows
- Content underneath is inert; the label meets 4.5:1 over the scrim

| Property | Type | Default |
|---|---|---|
| Label | text | Loading invoices… |
| Show label | boolean | true |

Built from: `Skeleton`, `Spinner`

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `body/small`

Guides: [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: custom: `absolute inset-0 bg-background/60` layer + shadcn `Spinner` (`aria-busy` on the region; label in `role="status"`)
