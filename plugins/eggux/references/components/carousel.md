# Carousel

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Carousel](#carousel) | 2 | Slides |
| [Carousel Arrow](#carousel-arrow) | 16 | - |
| [Carousel Indicator](#carousel-indicator) | 6 | - |
| [Carousel Slide](#carousel-slide) | 2 | - |
| [Carousel Gallery](#carousel-gallery) | 1 | Thumbnails |
| [Carousel Thumbnail](#carousel-thumbnail) | 3 | - |
| [Carousel Hero](#carousel-hero) | 1 | - |
| [Lightbox](#lightbox) | 1 | - |

On the Figma page: "Example / hero on a marketing page", "Example / image viewer over a page", "Example / office gallery on a location page", "Example / product gallery", "Stress test / Carousel", "Stress test / Carousel Gallery", "Stress test / Carousel Hero", "Stress test / Lightbox"

## Carousel

Component set · 2 variants · default size 720 × 457

Horizontal set of slides (shadcn Carousel / Embla): galleries, product images, testimonials, related items. Previous / next buttons and dots; swipe on touch; no autoplay (or pause on hover and a pause button). Do not hide important content behind slide 2+. The viewport clips on purpose: slides outside it are hidden. Uses Carousel Arrow and Carousel Indicator; for galleries use Carousel Gallery, for banners Carousel Hero.

**Use for**

- A row of cards or images users browse, such as related projects or testimonials
- Type=multiple: the next slide shows partly, so users see there is more
- Type=single: one slide at a time, 720 wide
- Testimonials past six; fewer read better in a grid

**Not for**

- Content everyone must see: most people never pass slide 1, use a grid or list
- Images of one product, property or asset: use Carousel Gallery
- Rotating homepage banner: use Carousel Hero, or one static hero
- Full-screen image viewing: use Lightbox

**Anatomy**

1. Viewport, clips slides outside it on purpose
2. Slides slot: Carousel Slide, Image Placeholder, Product Card or Card
3. Carousel Arrow previous and next: outline under the slides, overlay on images
4. Carousel Indicator: dots up to ~8 slides, counter ("2 / 8") for more

**Content and behavior**

- No autoplay; if required, pause on hover and focus and show a Pause button
- Arrows disabled at the first and last slide unless it loops; hidden when everything fits
- Slides keep one size; images use one ratio (16:9, 4:3 or 1:1)
- Active dot is wider, not only a different color
- Never hide important content behind slide 2 or later
- Fill the Slides slot in the instance; never detach

**Accessibility**

- Arrows labelled "Previous slide" and "Next slide"; arrow keys move when the carousel has focus
- Each slide is role="group" with aria-roledescription="slide" and a label "2 of 5"
- Dots are buttons labelled "Go to slide 3"
- Swipe on touch; every image has alt text

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
- Spacing and size: `density/control-height`
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

**Use for**

- Product, property or asset pages with several photos of one item
- Users compare details across images and jump to a specific one
- Show thumbnails off when space is tight; the counter still shows position

**Not for**

- A row of different items: use Carousel
- Rotating campaign banner: use Carousel Hero
- Full-screen viewing: open the image in Lightbox

**Anatomy**

1. Stage with the main image (fill on the "image" layer), clipped to its corners
2. Carousel Arrow, overlay, previous and next
3. Carousel Indicator counter ("2 / 8"), overlay tone
4. Open in Lightbox button
5. Thumbnails slot: Carousel Thumbnail per image, active = image shown (Show thumbnails)

**Content and behavior**

- Thumbnails replace dots in a product gallery
- Active thumbnail has a 2 px ring, not color alone
- More than 8 images: the strip scrolls, the counter stays
- All images share one ratio
- Fill the Thumbnails slot in the instance; never detach

**Accessibility**

- Arrows and thumbnails are reachable by keyboard; swipe on touch
- Thumbnails are buttons labelled with the image alt text
- Icon-only buttons (arrows, open in Lightbox) have accessible labels

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

## Carousel Hero

Component · 1 variant · default size 1440 × 560

Full-width rotating banner (homepages, campaigns): image (fill on the "image" layer) with scrim, overline, headline, text, one action; bars show timing with Pause; overlay arrows. Use only when slides are equally important; one strong static hero converts better. Auto-advance 6-8 s, pause on hover and focus, no auto-advance with reduced motion. Clips the image on purpose.

**Use for**

- Homepage or campaign banner with 2 or more slides of equal importance
- Each slide has its own message and one action
- Timed slides, with bars that show progress and a Pause button

**Not for**

- One main message: use one strong static hero, it converts better
- Browsing items: use Carousel
- Product images: use Carousel Gallery

**Anatomy**

1. Image (fill on the "image" layer) with video/scrim
2. Content area: auto layout, padding 64 top, 128 bottom, 144 sides, content up to 640 wide
3. Overline (Show overline)
4. Title: display/lg, 1-2 lines
5. Text
6. One action Button
7. Carousel Indicator bars with Pause
8. Carousel Arrow, overlay, previous and next

**Content and behavior**

- Auto-advance every 6-8 s; pause on hover and on focus
- No auto-advance with reduced motion
- Bars always come with Pause
- One action per slide
- Title in 2 lines at most; the content area keeps 64 above and clears the bars below
- White text on video/scrim keeps 4.5:1 on any photo
- The image clips on purpose; never detach

**Accessibility**

- Pause is always visible and reachable by keyboard
- Focus inside the hero stops the rotation
- Each slide is role="group" with aria-roledescription="slide" and a label "2 of 4"
- Images have alt text; decorative images use empty alt

| Property | Type | Default |
|---|---|---|
| Overline | text | NEW · OCTOBER 2026 |
| Title | text | Close the month in days, not weeks |
| Text | text | Invoices, approvals and reports in one place, for finance teams of every size. |
| Show overline | boolean | true |

Built from: `Button`, `Carousel Arrow`, `Carousel Indicator`

Tokens and styles:
- Colors: `background/muted`, `video/foreground`, `video/scrim`
- Spacing and size: `spacing/16`, `spacing/3`, `spacing/32`, `spacing/36`, `spacing/6`
- Text styles: `body/lead`, `display/lg`, `ui/overline`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: Embla with Autoplay plugin, pause on hover and focus

## Lightbox

Component · 1 variant · default size 1280 × 800

Full-screen viewer for images (gallery, attachments, documents as images): counter, title or caption, download, close; image fits the screen; arrows; thumbnail strip. Esc closes, arrow keys move, focus stays inside (a dialog). Pinch and double tap zoom on touch. Colors from video/* tokens, the same in every mode.

**Use for**

- Open a Carousel Gallery image full screen
- Preview image attachments on a record, such as a scanned invoice
- Inspect details with zoom on touch

**Not for**

- PDFs and other files: use File Preview
- Browsing a row of items: use Carousel
- A task with fields or a decision: use Dialog

**Anatomy**

1. Counter ("3 / 12")
2. Title or caption
3. Download and Close buttons
4. Image, fit to the screen
5. Carousel Arrow previous and next
6. Thumbnail strip of Carousel Thumbnail (Show thumbnails)

**Content and behavior**

- The image fits the screen; never cropped
- Colors from video/* tokens, the same in every mode
- Pinch and double tap zoom on touch
- Arrows disabled at the first and last image unless it loops

**Accessibility**

- It is a modal dialog: focus moves in and stays inside, Esc closes
- Focus returns to the image or thumbnail that opened it
- Arrow keys move between images
- Download, Close and arrows have accessible labels; images keep their alt text

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
