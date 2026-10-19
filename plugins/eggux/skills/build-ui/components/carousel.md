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

## Figma
`Carousel`: Type single (720), multiple (1152); Slides (native slot). Replace the slot content
with Image Placeholders, Product Cards, Post Cards or testimonial Cards.

## Code
shadcn `Carousel` (Embla). Each slide `role="group"` with `aria-roledescription="slide"` and a
label "2 of 5".
