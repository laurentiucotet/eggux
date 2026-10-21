# Rating

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Rating](#rating) | 12 | - |

On the Figma page: "Example / in testimonial carousel", "Stress test / Rating"

## Rating

Component set · 12 variants · default size 78 × 14

Star rating, display (reviews, products) or input (feedback). Filled stars in background/warning; always show the number too ("4.7 (128)"), color is not the only signal. As input: radio group of 5, hover previews, half stars only for display.

**Use for**

- Average rating on a product or a review summary: "4.7 (128)"
- Rating input in a review or feedback form
- Size=sm in cards and lists, Size=default in detail pages and forms

**Not for**

- Satisfaction surveys: thumbs up / down or a labeled 1-5 scale often reads better
- NPS: 0-10 buttons
- Status or priority: use Badge

**Anatomy**

1. Five stars: filled in background/warning, empty in border/input
2. Value: the number (Show value)
3. Count: number of ratings (Show count, Count)

**Content and behavior**

- Always show the number too; color is never the only signal
- Half stars only when displaying averages; input is whole stars
- As input, hover previews the value; a second click on the same star does not clear it
- Offer a Clear link only when zero is allowed
- Ask for a comment after a low rating, not before

**Accessibility**

- Display: one element with aria-label="Rated 4.7 out of 5"
- Input: a radio group of 5, each labeled "4 of 5 stars"; arrow keys change the value
- Empty star outlines meet 3:1 against the background

| Variant property | Values |
|---|---|
| Size | sm, default |
| Value | 0, 1, 2, 3, 4, 5 |

| Property | Type | Default |
|---|---|---|
| Show value | boolean | false |
| Show count | boolean | false |
| Count | text | (128) |

Tokens and styles:
- Colors: `background/warning`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/3_5`, `spacing/5`
- Text styles: `ui/caption`, `ui/label`

Guides: [rating](../../skills/build-ui/components/rating.md)

Code: custom `RadioGroup`
