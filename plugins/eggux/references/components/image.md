# Image

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Image Placeholder](#image-placeholder) | 4 | - |
| [Map](#map) | 1 | - |

## Image Placeholder

Component set · 4 variants · default size 640 × 360

Image area with a fixed ratio. Put the photo or screenshot as an image fill on the instance (Fill) and turn the caption off. Resize keeps the ratio.

| Variant property | Values |
|---|---|
| Ratio | 16:9, 4:3, 1:1, 3:4 |

| Property | Type | Default |
|---|---|---|
| Show caption | boolean | true |

Tokens and styles:
- Colors: `background/muted`, `foreground/muted`
- Radius: `radius/lg`
- Text styles: `ui/caption`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

## Map

Component · 1 variant · default size 720 × 405

Map placeholder for contact, offices and store locators. Resize freely; roads scale, the pin stays centered. In production put a static map image (Mapbox, Google) as fill on the component or embed an interactive map; keep the pin, label and attribution. Always pair a map with the written address.

| Property | Type | Default |
|---|---|---|
| Label | text | Acme HQ |
| Address | text | Strada Exemplu 12, Bucharest |
| Show label | boolean | true |
| Show controls | boolean | true |
| Show pin | boolean | true |

Icons: map-pin, minus, plus

Tokens and styles:
- Colors: `background/default`, `background/info`, `background/muted`, `background/popover`, `background/primary`, `background/success`, `border/default`, `foreground/muted`, `foreground/popover`
- Spacing and size: `spacing/0_5`, `spacing/10`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/8`
- Radius: `radius/full`, `radius/md`, `radius/sm`, `radius/xl`
- Text styles: `ui/caption`, `ui/label`
- Effects: `shadow/md`
