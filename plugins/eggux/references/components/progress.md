# Progress

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Progress](#progress) | 5 | - |
| [Progress Ring](#progress-ring) | 15 | - |

On the Figma page: "Example / in onboarding checklist", "Example / uploads in progress", "Stress test / Progress", "Stress test / Progress Ring"

## Progress

Component set · 5 variants · default size 320 × 8

Determinate progress (shadcn Progress): uploads, imports, multi-step completion. Indicator width = value; resize the indicator for other values. Show the number or "3 of 5" next to it. Unknown duration: use a Spinner or Skeleton instead.

**Use for**

- Uploads, imports and exports of known size
- Completion of a profile or setup ("3 of 5")
- Bulk actions that run longer than ~2 s
- A value per row, inside Table Cell Progress

**Not for**

- Unknown duration under ~3 s: use Spinner
- Content loading: use Skeleton
- Steps people move through: use Stepper
- Picking a value: use Slider

**Anatomy**

1. Track: background/muted, radius/full
2. Indicator: background/primary, width = value
3. Value text next to it: percent or "3 of 5"

**Content and behavior**

- Determinate only: the share must be known
- Always show the number or the remaining count next to the bar; never only color
- Value variants are 0, 25, 50, 75, 100; resize the indicator for other values
- Jobs over ~10 s run in the background, with a toast or notification when done

**Accessibility**

- role="progressbar" with aria-valuenow, aria-valuemin and aria-valuemax
- The accessible name says what is progressing ("Uploading invoices.csv")
- Announce completion when it matters

| Variant property | Values |
|---|---|
| Value | 0, 25, 50, 75, 100 |

Tokens and styles:
- Colors: `background/muted`, `background/primary`
- Spacing and size: `spacing/2`
- Radius: `radius/full`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Slider`, `Progress`

## Progress Ring

Component set · 15 variants · default size 32 × 32

Circular progress for compact places: uploads in a list, profile or setup completion, a quota in a card. sm (32) has no label, so put the number next to it; default (48) and lg (80) show the percent inside. Same rules as Progress: known progress only; unknown duration uses Spinner.

**Use for**

- An upload in a list row
- Profile or setup completion in a card
- A quota next to its label

**Not for**

- Unknown duration: use Spinner
- Wide areas with room for a bar: use Progress

**Anatomy**

1. Track ring: background/muted
2. Progress arc: background/primary
3. Percent inside for default and lg (Show label)
4. Number next to the ring for sm

**Content and behavior**

- Known progress only; unknown duration uses Spinner
- sm (32) has no label: put the number next to it
- default (48) and lg (80) show the percent inside
- Value variants are 0, 25, 50, 75, 100
- Color is never the only signal

**Accessibility**

- role="progressbar" with aria-valuenow, aria-valuemin and aria-valuemax
- The accessible name says what it measures ("Setup 75% complete")
- Label text meets 4.5:1 contrast

| Variant property | Values |
|---|---|
| Size | sm, default, lg |
| Value | 0, 25, 50, 75, 100 |

| Property | Type | Default |
|---|---|---|
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/muted`, `background/primary`, `foreground/default`
- Spacing and size: `spacing/12`, `spacing/20`, `spacing/8`
- Text styles: `heading/h4`, `ui/label-small`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md)

Code: SVG circle with `stroke-dasharray` (or Radix Progress) (`role="progressbar"`, `aria-valuenow`)
