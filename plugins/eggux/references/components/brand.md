# Brand

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Logo Mark](#logo-mark) | 1 | - |
| [Logo](#logo) | 3 | - |
| [Logo Tile](#logo-tile) | 2 | - |
| [Logo / Northwind](#logo-northwind) | 1 | - |
| [Logo / Lumora](#logo-lumora) | 1 | - |
| [Logo / Orbitly](#logo-orbitly) | 1 | - |
| [Logo / Fieldstone](#logo-fieldstone) | 1 | - |
| [Logo / Kestrel](#logo-kestrel) | 1 | - |
| [Logo / Quintra](#logo-quintra) | 1 | - |
| [Logo / Halcyon](#logo-halcyon) | 1 | - |
| [Logo / Brightpath](#logo-brightpath) | 1 | - |
| [Logo / Corvid](#logo-corvid) | 1 | - |
| [Logo / Meridian](#logo-meridian) | 1 | - |
| [Logo / Tidewater](#logo-tidewater) | 1 | - |
| [Logo / Vireo](#logo-vireo) | 1 | - |

On the Figma page: "Example / language comparison"

## Logo Mark

Component · 1 variant · default size 32 × 32

Brand mark. Replace the "glyph" layer with the client logo (vector, fills bound to tokens) here once; Logo, Sidebar Workspace and every page follow.

Tokens and styles:
- Colors: `background/primary`, `foreground/primary`
- Spacing and size: `spacing/8`
- Radius: `radius/lg`
- Text styles: `body/large`

Guides: [navigation](../../skills/build-ui/components/navigation.md)

Code: inline SVG in `currentColor` (or `<img alt>` with the product name) (Logo Mark is the symbol alone)

## Logo

Component set · 3 variants · default size 32 × 32

Product or client logo. mark = square symbol (sidebar collapsed, favicon), wordmark = name only, full = both. Edit the symbol in Logo Mark.

| Variant property | Values |
|---|---|
| Type | mark, wordmark, full |

| Property | Type | Default |
|---|---|---|
| Name | text | Acme |

Built from: `Logo Mark`

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`
- Text styles: `body/large`

Guides: [navigation](../../skills/build-ui/components/navigation.md)

Code: inline SVG in `currentColor` (or `<img alt>` with the product name) (Logo Mark is the symbol alone)

## Logo Tile

Component set · 2 variants · default size 184 × 72

A customer or partner logo in a tile for logo clouds, integration grids and case study lists. Swap Logo to one of the Logo / * components (fictional sample logos) or the client logo as a component. Every logo is 32 high in foreground/default; Style=plain dims it to 70% so a cloud reads as one muted row, Style=bordered shows it at full strength in a bordered tile. Use a different logo in every tile of a row.


Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Block / Logo Cloud right after the Hero
- Partner and customer grids
- Case study lists by customer

**Not for**

- Your own brand in the Navbar: use Logo
- An integration people connect, with status and actions: use Integration Card
- Certifications: use Trust Badge

**Anatomy**

1. Logo (Logo): instance swap, default Logo / Northwind, preferred Logo / * (12 fictional sample logos on the Brand page)
2. Style: bordered (tile with border, logo at full strength), plain (no border, logo at 70% opacity)
3. Tile: 72 high, hugs the logo with spacing/6 side padding, at least 160 wide, logo centered

**Content and behavior**

- Logo / * are fictional sample logos for mockups; replace them with real client or customer logos (with permission) before launch
- Add a client logo as a component ("Logo / <Company>", 32 high, fills in foreground/default) and swap it in; never paste a raster into the tile
- Keep one height (32) for every logo; adjust very wide or tall logos by eye, not by stretching
- Grayscale in clouds: one color (foreground/default) dimmed by Style=plain, never brand colors per logo
- Every tile in a row shows a different logo
- Link only when the tile leads to a case study or an integration
- 4-8 per row on desktop, 2-3 on mobile

**Accessibility**

- The logo has the company name as alt (the name after "Logo / "); there is no visible name text
- A linked tile names the destination ("Northwind case study")
- The row is a <ul> under a heading ("Trusted by finance teams at")

| Variant property | Values |
|---|---|
| Style | bordered, plain |

| Property | Type | Default |
|---|---|---|
| Logo | instance swap | Logo / Northwind |

Built from: `Logo / Northwind`

Tokens and styles:
- Colors: `border/default`
- Spacing and size: `spacing/2`, `spacing/6`
- Radius: `radius/lg`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<li>` with `<img alt>` or inline SVG in `currentColor` (`text-foreground`, `opacity-70` for Style=plain) (Logo is an instance swap; `<a>` only when it links to a case study or integration; alt = company name)

## Logo / Northwind

Component · 1 variant · default size 134 × 32

Fictional sample logo "Northwind" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`

## Logo / Lumora

Component · 1 variant · default size 110 × 32

Fictional sample logo "Lumora" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2_5`

## Logo / Orbitly

Component · 1 variant · default size 100 × 32

Fictional sample logo "Orbitly" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`

## Logo / Fieldstone

Component · 1 variant · default size 139 × 32

Fictional sample logo "Fieldstone" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2_5`

## Logo / Kestrel

Component · 1 variant · default size 156 × 32

Fictional sample logo "Kestrel" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2_5`

## Logo / Quintra

Component · 1 variant · default size 104 × 32

Fictional sample logo "Quintra" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`

## Logo / Halcyon

Component · 1 variant · default size 120 × 32

Fictional sample logo "Halcyon" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2_5`

## Logo / Brightpath

Component · 1 variant · default size 132 × 32

Fictional sample logo "Brightpath" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`

## Logo / Corvid

Component · 1 variant · default size 99 × 32

Fictional sample logo "Corvid" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2_5`

## Logo / Meridian

Component · 1 variant · default size 135 × 32

Fictional sample logo "Meridian" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/3`

## Logo / Tidewater

Component · 1 variant · default size 129 × 32

Fictional sample logo "Tidewater" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`

## Logo / Vireo

Component · 1 variant · default size 87 × 32

Fictional sample logo "Vireo" for logo clouds, testimonials and case studies. Mark and wordmark are outlined vectors in foreground/default, 32 high; dim with layer opacity, never recolor one logo. Replace with real customer logos (with permission) before launch.


Usage: eggux build-ui/patterns/marketing-pages.md

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/2`
