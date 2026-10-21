# Image

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Image Placeholder](#image-placeholder) | 5 | - |
| [Map](#map) | 1 | - |
| [Image Cropper](#image-cropper) | 2 | - |
| [Avatar Upload](#avatar-upload) | 4 | - |
| [Image Compare Slider](#image-compare-slider) | 1 | - |
| [Device Frame](#device-frame) | 2 | Screen |

On the Figma page: "Example / cropping a profile photo", "Example / in map section", "Example / in product card", "Example / profile settings", "Stress test / Device Frame", "Stress test / Image Compare Slider", "Stress test / Image Cropper", "Stress test / Image Cropper and Avatar Upload", "Stress test / Image Placeholder", "Stress test / Map"

## Image Placeholder

Component set · 5 variants · default size 640 × 360

Image area with a fixed ratio. Put the photo or screenshot as an image fill on the instance (Fill) and turn the caption off. Resize keeps the ratio. Ratio 21:9 for wide banners. The ratio is locked: set the instance to FILL and the height follows.

**Use for**

- Photos, screenshots and covers in cards, carousels and marketing sections
- Layouts where the final image is not ready yet
- Product, post and testimonial cards with one image ratio

**Not for**

- People or organizations: use Avatar
- Locations: use Map
- Icons and illustrations: use the icon set

**Anatomy**

1. Image area (image as Fill on the instance)
2. Muted background (background/muted) until the image is set
3. Caption (Show caption)

**Content and behavior**

- Ratio: 21:9, 16:9, 4:3, 1:1, 3:4; the ratio is locked, so FILL keeps the height in proportion
- Put the real image as an image fill and turn the caption off
- One ratio per carousel or grid; 21:9 for wide banners and page header images

**Accessibility**

- Meaningful images have alt text; decorative ones have empty alt
- Text over an image keeps 4.5:1 contrast

| Variant property | Values |
|---|---|
| Ratio | 16:9, 4:3, 1:1, 3:4, 21:9 |

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

**Use for**

- Contact and office pages where people visit in person
- Store or branch locators
- Event pages that give a venue address

**Not for**

- Contact pages where nobody visits: use Contact Cards with the address
- Decoration: use Image Placeholder

**Anatomy**

1. Map area
2. Pin (Show pin)
3. Label with Address (Show label)
4. Zoom controls (Show controls)
5. Attribution

**Content and behavior**

- Always pair the map with the written address
- Resize freely; roads scale and the pin stays centered
- Production: a static map image (Mapbox, Google) as fill or an interactive embed, with pin, label, attribution

**Accessibility**

- The written address is the accessible content; the map has a title or alt
- Interactive maps keep zoom buttons reachable by keyboard

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

Guides: [card](../../skills/build-ui/components/card.md)

## Image Cropper

Component set · 2 variants · default size 480 × 420

Crop and zoom an image before upload (avatars, logos, covers): put the image as fill on the "image" layer; the selection keeps the target ratio (circle for avatars, square or the cover ratio otherwise); drag to move, slider or scroll to zoom, rotate. Arrow keys move the selection, +/- zoom. Save uploads the cropped result; show the final size. The crop area clips on purpose. The selection stays centered at any width; min width 320.

**Use for**

- Avatars and logos after Avatar Upload
- Covers and banners with a fixed ratio
- Any upload where the server needs one exact ratio or size

**Not for**

- Documents and attachments: use File Dropzone
- Editing photos beyond crop and zoom: use a dedicated editor

**Anatomy**

1. Crop area (image as fill on the "image" layer)
2. Selection: square or circle
3. Zoom Slider with minus / plus
4. Rotate
5. Final size
6. Cancel and Save

**Content and behavior**

- Shape: circle for avatars, square for logos or the cover ratio
- Drag to move, slider or scroll to zoom
- Save uploads the cropped result and shows the final size
- The crop area clips on purpose; min width 320, selection stays centered

**Accessibility**

- Arrow keys move the selection, + and - zoom
- Opens in a Dialog: focus moves in, Esc cancels, focus returns
- Zoom Slider and buttons have labels

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

**Use for**

- Profile picture in account settings
- Organization or project logo
- Team, customer or workspace pictures edited by an admin

**Not for**

- Several files or documents: use File Dropzone
- Showing a person or organization without editing: use Avatar

**Anatomy**

1. Avatar (initials when empty)
2. Hint: type, minimum size, maximum weight
3. Upload or Change Button
4. Remove Button
5. Progress and Cancel while uploading
6. Error message

**Content and behavior**

- State: empty, filled, uploading, error
- Upload opens the file picker, then the Image Cropper
- Errors say what to fix: "Choose an image under 5 MB"
- Remove asks no confirmation and offers Undo in a toast
- Hint wraps within 280 px

**Accessibility**

- Buttons say what they do: "Upload photo", "Remove photo"
- Upload progress and errors are announced
- The avatar image has alt text with the name

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

## Image Compare Slider

Component · 1 variant · default size 640 × 360

Two images of the same view, before and after, with a handle to drag between them: redesigns, photo edits, document versions, site changes. Drag or arrow keys move the handle; labels say which side is which. Put the images as fills on "before" and "after"; both use the same ratio and framing.

**Use for**

- Redesigns and site changes
- Photo edits
- Document versions

**Not for**

- Many images: use Carousel Gallery
- Text or code changes: use Diff Viewer
- One image to view large: use Lightbox

**Anatomy**

1. Before image: fill on "before"
2. After image: fill on "after", in a crop
3. Divider and handle with chevrons
4. Before and After labels: Badges

**Content and behavior**

- Both images use the same ratio and framing
- The handle starts in the middle
- Labels say which side is which
- Drag or arrow keys move the handle; on touch only the handle drags, so the page still scrolls
- A caption says what changed

**Accessibility**

- The handle is role="slider" with aria-valuenow 0-100 and aria-label="Before and after comparison"
- Arrow keys move 5%, Home and End go to the ends
- Both images have alt text

Built from: `Badge`. Icons: chevron-left, chevron-right, image

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/muted`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`
- Effects: `shadow/md`

Code: react-compare-slider, or `clip-path` + `<input type="range">` (Handle `role="slider"`, arrow keys)

## Device Frame

Component set · 2 variants · default size 960 × 582

A browser window or a phone around a product screenshot for marketing pages, docs and case studies. Put a real screen (a block or an image) in the Screen slot at 1:1; never stretch it. One frame style per page. Inside the product, show the UI itself, not a frame.

**Use for**

- Block / Hero with Screenshot
- Feature rows in Block / Features Split
- Docs and case studies

**Not for**

- Photos and illustrations: use Image Placeholder
- A product demo with motion: use Video Thumbnail
- Inside the product: use the real block or component

**Anatomy**

1. Chrome: three dots and the address bar with lock icon (Device=browser)
2. Address: "app.acme.com/invoices"
3. Screen slot: a block or an image at 1:1
4. Device: browser, phone

**Content and behavior**

- A real screen at 1:1; never stretch it
- One frame style per page
- The address matches the screen
- Realistic content (Acme, invoices), no placeholder text

**Accessibility**

- The screenshot has alt text that says what it shows
- The frame chrome is decorative (aria-hidden)
- Text inside the screenshot is never the only place for information

| Variant property | Values |
|---|---|
| Device | browser, phone |

| Property | Type | Default |
|---|---|---|
| Address | text | app.acme.com/invoices |

Slots (fill them in the instance, never detach): `Screen`

Built from: `Image Placeholder`. Icons: lock

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`
- Effects: `shadow/lg`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom `<figure>`: border, top bar (dots, URL), `<img>` or live component (Screenshot at 1:1)
