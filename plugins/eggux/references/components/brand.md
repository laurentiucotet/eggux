# Brand

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Logo Mark](#logo-mark) | 1 | - |
| [Logo](#logo) | 3 | - |
| [Logo Tile](#logo-tile) | 2 | - |

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

Component set · 2 variants · default size 160 × 72

A customer or partner logo in a tile for logo clouds, integration grids and case study lists. Replace the placeholder with the logo as an image fill or vector, single color (foreground/muted) so the row reads as one. Same height for every logo; link only when the tile leads to a case study or an integration.

**Use for**

- Block / Logo Cloud right after the Hero
- Integration and partner grids
- Case study lists by customer

**Not for**

- Your own brand in the Navbar: use Logo
- An integration people connect, with status and actions: use Integration Card
- Certifications: use Trust Badge

**Anatomy**

1. Logo: image fill or vector in place of the placeholder icon
2. Name: text fallback ("Northwind")
3. Style: bordered, plain

**Content and behavior**

- Single color (foreground/muted) so the row reads as one
- Same height for every logo; adjust wide and tall logos by eye
- Real customers or partners with permission only
- Link only when the tile leads to a case study or an integration
- 4-8 per row on desktop, 2-3 on mobile

**Accessibility**

- The logo image has the company name as alt
- A linked tile names the destination ("Northwind case study")
- The row is a <ul> under a heading ("Trusted by finance teams at")

| Variant property | Values |
|---|---|
| Style | bordered, plain |

| Property | Type | Default |
|---|---|---|
| Name | text | Northwind |

Icons: building

Tokens and styles:
- Colors: `border/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Radius: `radius/lg`
- Text styles: `heading/h4`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<li>` with `<img alt>` or inline SVG in `currentColor` (`<a>` only when it links to a case study or integration)
