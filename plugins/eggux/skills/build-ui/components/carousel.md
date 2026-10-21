# Carousel

Usage guidelines only. Visual specs live in the Figma component (Carousel page).

## When
- Galleries (product images), testimonials, related or recommended items, onboarding slides.
- Never for content the user must see: most people do not go past the first slide. Put key
  content in a grid or list instead.

## Rules
- Previous / next buttons (outline `Button Icon`), dots or a counter ("2 / 5") for position.
- The next slide shows partly (`Type=multiple`) so users see there is more.
- No autoplay. If required (marketing hero), pause on hover and focus, and show a pause button.
- Swipe on touch, arrow keys when focused. Buttons disabled at the ends unless it loops.
- Product gallery: thumbnails under or beside the main image instead of dots.
- Slides keep the same size; images use one ratio (`Image Placeholder` 16:9, 4:3 or 1:1).

## Which one
| Need | Component |
|---|---|
| A row of cards or images users browse | `Carousel` (single or multiple) |
| Images of one product, property or asset | `Carousel Gallery` (thumbnails, counter, open in Lightbox) |
| Rotating homepage or campaign banner | `Carousel Hero` (only when slides are equally important) |
| Look at images full screen | `Lightbox` |

## Parts
- `Carousel Arrow`: outline under the slides, overlay on images (16 from the edge, centered).
- `Carousel Indicator`: dots up to ~8 slides (active is wider), counter for galleries and many
  slides, bars for timed slides (always with Pause). Overlay tone on images.
- `Carousel Thumbnail`: active has a 2 px ring; thumbnails are buttons labelled with the image alt.
- `Carousel Slide`: caption (text under the image) or overlay (headline, text and action on a
  scrim; white text on `video/scrim` keeps 4.5:1 on any photo).
- Media surfaces (Lightbox, scrims, overlay indicators) use `video/*` tokens, the same in every mode.

## Figma
`Carousel`: Type single (720), multiple (1152); Slides (native slot). Replace the slot content
with Image Placeholders, Carousel Slides, Product Cards, Post Cards or testimonial Cards. The
viewport clips on purpose. Put photos as fill on the `image` layer (Gallery, Hero) or on the
nested Image Placeholder. `Stress test / Carousel` covers long headlines, big counters and no
thumbnails.

## Code
shadcn `Carousel` (Embla); thumbnails with Embla's thumbs pattern; Lightbox as a `Dialog`
(yet-another-react-lightbox or PhotoSwipe). Each slide `role="group"` with `aria-roledescription="slide"` and a
label "2 of 5".
