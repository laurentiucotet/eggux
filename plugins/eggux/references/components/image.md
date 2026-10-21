# Image

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Image Placeholder](#image-placeholder) | 4 | - |
| [Map](#map) | 1 | - |
| [Image Cropper](#image-cropper) | 2 | - |
| [Avatar Upload](#avatar-upload) | 4 | - |

On the Figma page: "Stress test / Image Cropper and Avatar Upload"

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

## Image Cropper

Component set · 2 variants · default size 480 × 420

Crop and zoom an image before upload (avatars, logos, covers): put the image as fill on the "image" layer; the selection keeps the target ratio (circle for avatars, square or the cover ratio otherwise); drag to move, slider or scroll to zoom, rotate. Arrow keys move the selection, +/- zoom. Save uploads the cropped result; show the final size. The crop area clips on purpose. The selection stays centered at any width; min width 320.

| Variant property | Values |
|---|---|
| Shape | square, circle |

Built from: `Button`, `Button Icon`, `Slider`. Icons: minus, plus

Tokens and styles:
- Colors: `background/muted`, `video/foreground`, `video/scrim`, `video/track`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/md`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: `react-easy-crop` in a `Dialog`; shadcn `Avatar` + file input (Crop on the client, upload the result)

## Avatar Upload

Component set · 4 variants · default size 344 × 100

Profile or logo picture in settings: current avatar (initials when empty), rules (type, size), Upload or Change, Remove. Upload opens the file picker, then the Image Cropper; uploading shows progress and Cancel; errors say what to fix. Remove asks no confirmation but offers Undo in a toast. Hint wraps within 280 px.

| Variant property | Values |
|---|---|
| State | empty, filled, uploading, error |

Built from: `Avatar`, `Button`, `Spinner`

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: `react-easy-crop` in a `Dialog`; shadcn `Avatar` + file input (Crop on the client, upload the result)
