# Rating

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Rating](#rating) | 24 | - |
| [Review Item](#review-item) | 1 | - |
| [Rating Summary](#rating-summary) | 1 | - |

On the Figma page: "Example / Rating styles", "Example / in reviews", "Stress test / Rating", "Stress test / Rating Summary", "Stress test / Review Item"

## Rating

Component set · 24 variants · default size 116 × 20

Star rating, display (reviews, products) or input (feedback). Filled stars in background/warning; always show the number too ("4.7 (128)"), color is not the only signal. As input: radio group of 5, hover previews, half stars only for display.


Style: default (five stars, display or input), badge (one star and the numeric score in a soft amber badge, e.g. "4.8"; display only, for dense cards, search results, tables and map pins). In Style=badge type the score in Score (one decimal) and Value has no effect; Show count adds "(128)".


Usage: eggux build-ui/components/rating.md

**Use for**

- Average rating on a product or a review summary: "4.7 (128)"
- Rating input in a review or feedback form
- Size=sm in cards and lists, Size=default in detail pages and forms
- Style=badge: the score in tight places: product cards, search results, tables, map pins

**Not for**

- Satisfaction surveys: thumbs up / down or a labeled 1-5 scale often reads better
- NPS: 0-10 buttons
- Status or priority: use Badge
- Style=badge as input: it is display only

**Anatomy**

1. Style=default: five stars, filled in background/warning, empty in border/input
2. Style=badge: one star and the score in a soft amber badge (badge/soft-warning-bg, star and text badge/soft-warning-fg, radius/md)
3. Value: the number (Show value; always shown in Style=badge)
4. Score: the number in Style=badge (TEXT, one decimal)
5. Count: number of ratings (Show count, Count)

**Content and behavior**

- Always show the number too; color is never the only signal
- Half stars only when displaying averages; input is whole stars
- As input, hover previews the value; a second click on the same star does not clear it
- Offer a Clear link only when zero is allowed
- Ask for a comment after a low rating, not before
- Style=badge: type the score in Score; Value has no effect there

**Accessibility**

- Display: one element with aria-label="Rated 4.7 out of 5"
- Input: a radio group of 5, each labeled "4 of 5 stars"; arrow keys change the value
- Empty star outlines meet 3:1 against the background
- Style=badge: one element with aria-label="Rated 4.8 out of 5, 128 reviews"; the star is aria-hidden

| Variant property | Values |
|---|---|
| Size | sm, default |
| Value | 0, 1, 2, 3, 4, 5 |
| Style | default, badge |

| Property | Type | Default |
|---|---|---|
| Show value | boolean | false |
| Show count | boolean | false |
| Count | text | (128) |
| Score | text | 4.8 |

Tokens and styles:
- Colors: `background/warning`, `badge/soft-warning-bg`, `badge/soft-warning-fg`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/3_5`, `spacing/5`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`, `ui/label-small`

Guides: [rating](../../skills/build-ui/components/rating.md)

Code: custom `RadioGroup`

## Review Item

Component · 1 variant · default size 560 × 195

One customer review: who, verified purchase, date, stars, a title and the text, Helpful votes. Long text cuts with Show More. Sort by most helpful by default, with filters by stars. Never edit what customers wrote; replies from the company sit under the review.

**Use for**

- Reviews on a product page under Rating Summary
- Reviews of an app, a course or a service
- A review queue in moderation tools

**Not for**

- Quotes chosen for marketing: use Testimonial Card
- Discussion threads: use Comment
- Asking for satisfaction: use CSAT Rating

**Anatomy**

1. Header: Avatar, name, Verified Badge soft-success (Show verified), date
2. Rating sm
3. Title
4. Text
5. Helpful (Show helpful): "Helpful?" with Yes and No Buttons

**Content and behavior**

- Long text cuts with Show More
- Sort by most helpful by default, with filters by stars
- Never edit what customers wrote; company replies sit under the review
- Verified only when the purchase is confirmed
- Dates as day, month, year ("3 Oct 2026")

**Accessibility**

- Code as an <article>; the title is a heading
- Rating has aria-label="Rated 4 out of 5"
- Helpful buttons use aria-pressed and include the count in their name
- Show More uses aria-expanded

| Property | Type | Default |
|---|---|---|
| Name | text | Mark Schulz |
| Date | text | 3 Oct 2026 |
| Title | text | Good fit, thin fabric |
| Text | text | Fits true to size and the color is exactly as in the photos. The linen is thinner than I expected, so it creases quickly. Washed twice without shrinking. |
| Show verified | boolean | true |
| Show helpful | boolean | true |

Built from: `Avatar`, `Badge`, `Button`, `Rating`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [rating](../../skills/build-ui/components/rating.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: `<article>` + `Avatar`, `Badge`, `Rating`, ghost `Button`s (Helpful: `aria-pressed`)

## Rating Summary

Component · 1 variant · default size 480 × 104

Average rating with the split across 1-5 stars, above the reviews. Bar fills are the share of all reviews and scale with the instance width. Each row filters the list to that rating; under 5 reviews show the count only.


Usage: eggux build-ui/components/rating.md

**Use for**

- Above the reviews on a product page
- App and service rating pages
- Course or venue pages with reviews

**Not for**

- A rating next to a name or a price: use Rating with value and count
- Survey results: use Distribution Bar or Bar Chart Horizontal
- One score without the split: use Figure

**Anatomy**

1. Average: the number, Rating and count ("128 reviews")
2. Distribution: 5 rows of stars, bar and count; each bar fill scales with the instance width

**Content and behavior**

- Each bar row filters the list to that rating
- Count says how many reviews it comes from
- Under 5 reviews, show the count only
- Bars show the share of all reviews (92 of 128 = 72% of the track); resize the fill layer to set it, it keeps the proportion when the card resizes

**Accessibility**

- The average reads "4.6 out of 5, 128 reviews"
- Each row is a button named by stars and count ("5 stars, 92 reviews") with aria-pressed when filtering
- Bars are aria-hidden; the counts are text

| Property | Type | Default |
|---|---|---|
| Average | text | 4.6 |
| Count | text | 128 reviews |

Built from: `Rating`

Tokens and styles:
- Colors: `background/muted`, `background/warning`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/8`
- Radius: `radius/full`
- Text styles: `display`, `ui/caption`

Guides: [rating](../../skills/build-ui/components/rating.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: custom: `Rating` + rows of shadcn `Progress` in `Button`s (Rows set the star filter)
