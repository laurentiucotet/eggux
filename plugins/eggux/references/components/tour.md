# Tour

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Coachmark](#coachmark) | 4 | Media |
| [Hotspot](#hotspot) | 1 | - |

On the Figma page: "Example / filter panel", "Example / product tour"

## Coachmark

Component set · 4 variants · default size 320 × 165

One step of a product tour or a single feature tip, anchored to the element it explains. Side = where it sits relative to the target; the arrow points at the target. Title says the benefit, description one or two lines, step counter, Back / Next (last step: Done). Always closable.

| Variant property | Values |
|---|---|
| Side | bottom, top, right, left |

| Property | Type | Default |
|---|---|---|
| Title | text | Save this filter as a view |
| Description | text | Views keep your filters and columns. Find them again in the sidebar under Projects. |
| Step | text | 2 of 4 |
| Show media | boolean | false |
| Show close | boolean | true |
| Show back | boolean | true |

Slots (fill them in the instance, never detach): `Media`

Built from: `Button`, `Image Placeholder`. Icons: x

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`, `foreground/popover`
- Spacing and size: `border-width/DEFAULT`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/md`
- Text styles: `body/large`, `body/small`, `ui/caption`

Guides: [tour](../../skills/build-ui/components/tour.md)

Code: Driver.js, Shepherd or `Popover` anchored to the target

## Hotspot

Component · 1 variant · default size 24 × 24

Beacon on a new or unused feature. Click opens its Coachmark. The ring pulses (motion/duration/slow, stops with reduced motion). One hotspot per screen at most; remove it after it was opened.

Tokens and styles:
- Colors: `background/default`, `background/primary`
- Spacing and size: `border-width/2`

Guides: [tour](../../skills/build-ui/components/tour.md)

Code: Driver.js, Shepherd or `Popover` anchored to the target
