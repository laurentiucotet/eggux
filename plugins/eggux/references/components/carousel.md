# Carousel

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Carousel](#carousel) | 2 | Slides |
| [Carousel Arrow](#carousel-arrow) | 16 | - |
| [Carousel Indicator](#carousel-indicator) | 6 | - |
| [Carousel Thumbnail](#carousel-thumbnail) | 3 | - |
| [Carousel Slide](#carousel-slide) | 2 | - |
| [Carousel Gallery](#carousel-gallery) | 1 | Thumbnails |
| [Carousel Hero](#carousel-hero) | 1 | - |
| [Lightbox](#lightbox) | 1 | - |

On the Figma page: "Stress test / Carousel"

## Carousel

Component set · 2 variants · default size 720 × 457

Horizontal set of slides (shadcn Carousel / Embla): galleries, product images, testimonials, related items. Previous / next buttons and dots; swipe on touch; no autoplay (or pause on hover and a pause button). Do not hide important content behind slide 2+. The viewport clips on purpose: slides outside it are hidden. Uses Carousel Arrow and Carousel Indicator; for galleries use Carousel Gallery, for banners Carousel Hero.

| Variant property | Values |
|---|---|
| Type | single, multiple |

Slots (fill them in the instance, never detach): `Slides`

Built from: `Carousel Arrow`, `Carousel Indicator`, `Image Placeholder`, `Product Card`

Tokens and styles:
- Spacing and size: `spacing/4`, `spacing/6`
- Radius: `radius/xl`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: shadcn `Carousel` (Embla): `CarouselPrevious`, `CarouselNext`, dots from the Embla API (Autoplay plugin only with a pause control)

## Carousel Arrow

Component set · 16 variants · default size 36 × 36

Previous / next control. outline: under or beside the slides; overlay: on top of images, centered vertically 16 from the edge. Disabled at the first and last slide (no loop) or hidden when everything fits. aria-label "Previous slide" / "Next slide"; arrow keys move when the carousel has focus.

| Variant property | Values |
|---|---|
| Variant | outline, overlay |
| Direction | previous, next |
| State | default, hover, focus, disabled |

Icons: chevron-left, chevron-right

Tokens and styles:
- Colors: `background/accent`, `background/default`, `border/default`, `border/input`
- Spacing and size: `spacing/10`, `spacing/9`
- Radius: `radius/full`
- Effects: `shadow/md`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: shadcn `Carousel` (Embla): `CarouselPrevious`, `CarouselNext`, dots from the Embla API (Autoplay plugin only with a pause control)

## Carousel Indicator

Component set · 6 variants · default size 76 × 8

Where the user is. dots: up to ~8 slides, the active one is wider (not only a color change). bars: timed slides (hero), the active bar fills; always with Pause. counter: "2 / 8" for galleries and many slides. Overlay tone sits on images over a scrim. Dots are buttons with aria-label "Go to slide 3".

| Variant property | Values |
|---|---|
| Type | dots, bars, counter |
| Tone | default, overlay |

| Property | Type | Default |
|---|---|---|
| Counter | text | 2 / 8 |

Built from: `Button Icon`

Tokens and styles:
- Colors: `background/primary`, `border/input`, `foreground/muted`, `video/foreground`, `video/scrim`, `video/track`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/1_5`, `spacing/2`, `spacing/5`
- Radius: `radius/full`
- Text styles: `ui/label`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: shadcn `Carousel` (Embla): `CarouselPrevious`, `CarouselNext`, dots from the Embla API (Autoplay plugin only with a pause control)

## Carousel Thumbnail

Component set · 3 variants · default size 64 × 64

Small preview in a gallery strip. Put the image as fill on the nested Image Placeholder. active = the slide shown (2 px ring, not color alone). Thumbnails are buttons with the image alt as label. Clips its image on purpose (image crop).

| Variant property | Values |
|---|---|
| State | default, hover, active |

Built from: `Image Placeholder`

Tokens and styles:
- Colors: `border/default`, `border/ring`
- Spacing and size: `spacing/16`
- Radius: `radius/md`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: Embla main + thumbs carousels

## Carousel Slide

Component set · 2 variants · default size 720 × 461

One slide. caption: image with Title and Description under it (galleries, case studies). overlay: Headline, Text and an action on a scrim at the bottom of the image (hero banners); white text on video/scrim keeps 4.5:1 on any photo. Put the image as fill on the nested Image Placeholder; write alt text for every image. Clips the image to the rounded corners on purpose.

| Variant property | Values |
|---|---|
| Type | caption, overlay |

| Property | Type | Default |
|---|---|---|
| Title | text | Warehouse in Berlin |
| Description | text | 4,200 m², opened in 2024 |
| Show description | boolean | true |
| Show action | boolean | true |
| Headline | text | Close the month in days, not weeks |
| Text | text | Invoices, approvals and reports in one place. |

Built from: `Button`, `Image Placeholder`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`, `video/foreground`, `video/scrim`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/8`
- Radius: `radius/xl`
- Text styles: `body/default`, `body/small`, `heading/h3`, `ui/label`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: shadcn `Carousel` (Embla): `CarouselPrevious`, `CarouselNext`, dots from the Embla API (Autoplay plugin only with a pause control)

## Carousel Gallery

Component · 1 variant · default size 560 × 496

Image gallery for a product, property or asset page: main image (put the photo as fill on the "image" layer), overlay arrows, counter, open in Lightbox, thumbnail strip (Thumbnails slot, active = shown image). Arrows and thumbnails keyboard reachable; swipe on touch. More than 8 images: the strip scrolls, the counter stays. The stage clips the image to its corners on purpose.

| Property | Type | Default |
|---|---|---|
| Show thumbnails | boolean | true |

Slots (fill them in the instance, never detach): `Thumbnails`

Built from: `Button Icon`, `Carousel Arrow`, `Carousel Indicator`, `Carousel Thumbnail`

Tokens and styles:
- Colors: `background/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/xl`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: Embla main + thumbs carousels

## Carousel Hero

Component · 1 variant · default size 1440 × 560

Full-width rotating banner (homepages, campaigns): image (fill on the "image" layer) with scrim, overline, headline, text, one action; bars show timing with Pause; overlay arrows. Use only when slides are equally important; one strong static hero converts better. Auto-advance 6-8 s, pause on hover and focus, no auto-advance with reduced motion. Clips the image on purpose.

| Property | Type | Default |
|---|---|---|
| Overline | text | NEW · OCTOBER 2026 |
| Headline | text | Close the month in days, not weeks |
| Text | text | Invoices, approvals and reports in one place, for finance teams of every size. |
| Show overline | boolean | true |

Built from: `Button`, `Carousel Arrow`, `Carousel Indicator`

Tokens and styles:
- Colors: `background/muted`, `video/foreground`, `video/scrim`
- Spacing and size: `spacing/3`, `spacing/6`
- Text styles: `body/lead`, `heading/h1`, `ui/overline`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: Embla with Autoplay plugin, pause on hover and focus

## Lightbox

Component · 1 variant · default size 1280 × 800

Full-screen viewer for images (gallery, attachments, documents as images): counter, title or caption, download, close; image fits the screen; arrows; thumbnail strip. Esc closes, arrow keys move, focus stays inside (a dialog). Pinch and double tap zoom on touch. Colors from video/* tokens, the same in every mode.

| Property | Type | Default |
|---|---|---|
| Counter | text | 3 / 12 |
| Title | text | Warehouse in Berlin · loading dock |
| Show thumbnails | boolean | true |

Built from: `Button Icon`, `Carousel Arrow`, `Carousel Thumbnail`, `Image Placeholder`

Tokens and styles:
- Colors: `video/background`, `video/foreground`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Text styles: `body/small`, `ui/label`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: yet-another-react-lightbox or PhotoSwipe, or a `Dialog` (Esc, arrows, focus trap)
