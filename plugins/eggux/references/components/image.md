# Image

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Image Placeholder](#image-placeholder) | 5 | - |
| [Map](#map) | 1 | - |
| [Image Cropper](#image-cropper) | 2 | - |
| [Avatar Upload](#avatar-upload) | 8 | - |
| [Image Compare Slider](#image-compare-slider) | 1 | - |
| [Device Frame](#device-frame) | 2 | Screen |
| [Image Figure](#image-figure) | 1 | - |

On the Figma page: "Example / before and after in a case study", "Example / cropping a profile photo", "Example / in gallery grid", "Example / in map section", "Example / in product card", "Example / profile settings", "Stress test / Device Frame", "Stress test / Image Compare Slider", "Stress test / Image Cropper", "Stress test / Image Cropper and Avatar Upload", "Stress test / Image Figure", "Stress test / Image Placeholder", "Stress test / Map"

## Image Placeholder

Component set · 5 variants · default size 640 × 360

Image area with a fixed ratio (Ratio 16:9, 4:3, 1:1, 3:4, 21:9) for photos, covers and screenshots in cards, carousels and marketing sections. Show image on shows the photo picked in the Image swap (any Image / * component from the Imagery page; it covers and crops to the ratio). Off: muted background with a dot pattern and a centered image icon (Show caption toggles the icon). Sample photos are placeholders: replace them with your own images and give meaningful images alt text. Height follows width: a transparent ratio layer at Fill width with a locked aspect ratio sets the height, so a fixed width, Fill or a resize keeps the Ratio. For a crop of another height, pick another Ratio (21:9 for banners) rather than resizing the height. Usage: eggux build-ui/components/carousel.md

**Use for**

- Photos, screenshots and covers in cards, carousels, galleries and marketing sections
- Team photos, product shots and blog covers with one ratio per grid
- Layouts where the final image is not ready yet (Show image off)

**Not for**

- People next to their name in lists, comments and bylines: use Avatar
- Locations: use Map
- Icons and illustrations: use the icon set

**Anatomy**

1. Ratio: 16:9, 4:3, 1:1, 3:4, 21:9 (variant); the ratio is also in the hint layer name
2. Image (Show image, off by default): nested Image / * instance that covers the whole area and crops to the ratio
3. Image swap (Image): any component from the Imagery page (Image / Person, Product, Office, Cover, Abstract, City); default Image / Office / 01
4. Pattern: dot grid on background/muted, dots in border/default, shown when there is no image
5. Hint (Show caption): centered Lucide image icon in foreground/muted
6. Corner radius and clipping come from the placeholder, not from the image
7. ratio: a transparent layer at Fill width with a locked aspect ratio; it sets the height, so the height follows any width (fixed, Fill or resized)

**Content and behavior**

- Turn Show image on and pick the photo in the Image swap; never paste a raster fill over the instance
- The Image / * photos are sample content (Unsplash License, not covered by the CC BY 4.0 license of the file): replace them with your own images before shipping
- Pick photos that match the content next to them: Person for team cards, Product for shop cards, Office, Cover or City for posts, events and galleries
- No two cards in one grid use the same photo; one ratio per carousel or grid; 21:9 for wide banners and page header images
- Show image off is the loading or missing-image state: keep the dot pattern and the icon, no fake text
- Text over a photo needs a scrim or a solid surface behind it
- Change the width only; the height follows the Ratio. For a different crop pick another Ratio (21:9 for banners); a fixed height crops the image and is only for full-bleed media that must cover a box

**Accessibility**

- Meaningful images have alt text that says what the photo shows; decorative ones have empty alt
- Text over an image keeps 4.5:1 contrast
- The no-image hint icon is decorative (aria-hidden)

| Variant property | Values |
|---|---|
| Ratio | 16:9, 4:3, 1:1, 3:4, 21:9 |

| Property | Type | Default |
|---|---|---|
| Show caption | boolean | true |
| Show image | boolean | false |
| Image | instance swap | Image / Office / 01 |

Built from: `Image / Office / 01`. Icons: image

Tokens and styles:
- Colors: `background/muted`, `border/default`
- Radius: `radius/lg`

Guides: [carousel](../../skills/build-ui/components/carousel.md)

Code: `<img>` or `next/image` with `aspect-ratio` and `object-cover` (`Show image` = render the image; off = muted box with a dot background and lucide `Image` icon (loading or missing image). The `Image` swap picks a sample photo: replace with the real `src` and alt)

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
- Resize: the pin stays centered; its label hugs up to 192 and title and address stay on 1 line with ellipsis

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

Code: pin label `max-w-48`, title and address `truncate`

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

Code: `react-easy-crop` in a `Dialog`; shadcn `Avatar` + file input (Crop on the client, upload the result. Shape=square is `Avatar` with `rounded-md` for workspace and company logos)

## Avatar Upload

Component set · 8 variants · default size 344 × 100

Profile or logo picture in settings: the avatar, a Label (Show label), a Hint with the upload rules, Upload or Change (exposed Button, set its Label, e.g. "Upload photo") and Remove (Show remove, empty and filled). Shape: circle (a person) or square (a workspace or company logo; empty shows muted initials, filled shows the logo (drawn as initials on the brand color, replace with the real mark); set Label to "Workspace logo"). State: empty (initials), filled, uploading (progress and Cancel), error (says what to fix). Upload opens the file picker, then the Image Cropper; Remove offers Undo in a toast.


Usage: eggux build-ui/components/file-upload.md

**Use for**

- Profile picture in account settings (Shape=circle)
- Organization, workspace or project logo (Shape=square)
- Team, customer or workspace pictures edited by an admin

**Not for**

- Several files or documents: use File Dropzone
- Showing a person or organization without editing: use Avatar

**Anatomy**

1. Avatar: Shape circle (a person) or square (a workspace or company logo); initials when empty
2. Label (Show label): "Profile photo", "Company logo"
3. Hint: type, minimum size, maximum weight (empty and filled)
4. Upload or Change: Button outline sm, exposed (set its Label, e.g. "Upload photo")
5. Remove (Show remove): Button ghost sm, empty and filled
6. Progress and Cancel while uploading
7. Error message (State=error)

**Content and behavior**

- Shape: circle for people, square for workspaces and companies; square filled shows the logo (drawn as initials on background/primary until replaced)
- Square: set Label to "Workspace logo" or "Company logo" and the Hint to the logo rules (PNG or SVG, square)
- State: empty, filled, uploading, error
- Upload opens the file picker, then the Image Cropper
- Show remove only when there is something to remove (a photo, or initials people may reset)
- Errors say what to fix: "Choose an image under 5 MB"
- Remove asks no confirmation and offers Undo in a toast
- Hide the Label when the section title already names the picture
- Hint wraps within 280 px

**Accessibility**

- Buttons say what they do: "Upload photo", "Remove photo"
- Upload progress and errors are announced
- The avatar image has alt text with the name

| Variant property | Values |
|---|---|
| State | empty, filled, uploading, error |
| Shape | circle, square |

| Property | Type | Default |
|---|---|---|
| Label | text | Profile photo |
| Show label | boolean | true |
| Hint | text | JPG or PNG, at least 256 × 256 px, up to 5 MB. |
| Show remove | boolean | false |

Built from: `Avatar`, `Button`, `Spinner`

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: `react-easy-crop` in a `Dialog`; shadcn `Avatar` + file input (Crop on the client, upload the result. Shape=square is `Avatar` with `rounded-md` for workspace and company logos)

## Image Compare Slider

Component · 1 variant · default size 640 × 360

Two images of the same view, before and after, with a handle to drag between them: redesigns, photo edits, document versions, site changes. Drag or arrow keys move the handle; labels say which side is which. Put the images as fills on "before" and "after"; both use the same ratio and framing. Resize the instance freely: both halves, hints, handle and labels scale with it.


Usage: eggux build-ui/components/content.md

**Use for**

- Redesigns and site changes
- Photo edits
- Document versions

**Not for**

- Many images: use Carousel Gallery
- Text or code changes: use Diff Viewer
- One image to view large: use Lightbox

**Anatomy**

1. Before image: fill on "before" (stretches with the component)
2. After image: fill on "after", inside "after crop" (the right half); both scale with the component
3. Hints: "Before image" and "After image" placeholders, centered in their half
4. Divider and handle with chevrons, centered
5. Before and After labels: Badges pinned to the top corners

**Content and behavior**

- Both images use the same ratio and framing
- Resize the instance to any size; halves, handle and labels keep their places (constraints scale)
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
- Spacing and size: `spacing/2`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`
- Effects: `shadow/md`

Guides: [content](../../skills/build-ui/components/content.md)

Code: react-compare-slider, or `clip-path` + `<input type="range">` (Handle `role="slider"`, arrow keys)

## Device Frame

Component set · 2 variants · default size 960 × 582

A browser window or a phone around a product screenshot for marketing pages, docs and case studies. Address sets the URL; Screen (native slot) holds the screen. Put an Image / Screenshot / * in Screen at Fill width: its height follows the image ratio, so swapping to another screenshot or resizing the frame never crops it. A photo or a live screen (Page Shell / Mobile) works too. Do not resize the screen by hand; resize the Device Frame.


Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Block / Hero with Screenshot, Hero Centered, Hero Split, Hero Prompt
- Feature rows in Block / Features Split and the media panel of Block / CTA Split
- Docs and case studies

**Not for**

- Photos and illustrations: use Image Placeholder
- A product demo with motion: use Video Thumbnail
- Inside the product: use the real block or component

**Anatomy**

1. Chrome: three dots and the address bar with lock icon (Device=browser)
2. Address: "app.acme.com/invoices"
3. Screen slot: an Image / Screenshot / ... instance at Fill width; its height hugs the image ratio (inner ratio layer), or a live block at 1:1
4. Device: browser, phone

**Content and behavior**

- A real screen, never stretched or cropped: Image / Screenshot / * hug their height from the image ratio, so a swap or a new frame width keeps the whole screen
- Resize the Device Frame, never the screen inside it; set a fixed screen height only to crop on purpose
- One frame style per page
- The address matches the screen
- Realistic content (Acme, invoices), no placeholder text
- Prefer an Image / Screenshot component on marketing pages; a live block only when it must stay editable
- Resize: the browser address fills the bar and stays on 1 line with ellipsis; the screen fills

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
- Effects: `shadow/xl`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: address `min-w-0 flex-1 truncate`

## Image Figure

Component · 1 variant · default size 480 × 388

An image with a caption under it (HTML figure and figcaption) for galleries, articles and docs. The Image Placeholder is exposed: set its Ratio (16:9, 4:3, 1:1, 3:4, 21:9) and put the photo as an image fill on it. Caption says what or where it is in one line, body/small muted; Show credit adds the photographer or source. Keep one caption style per gallery; use Image Placeholder alone when there is no caption. Usage: eggux build-ui/patterns/content-and-docs.md

**Use for**

- Gallery grids of photos with captions (Block / Gallery Grid)
- Screenshots and photos in articles and docs that need a caption
- Press and case study pages that credit the photographer

**Not for**

- An image without caption: use Image Placeholder
- A number with a label: use Figure
- A product or post with a title and actions: use Product Card or Post Card

**Anatomy**

1. Image: exposed Image Placeholder, set its Ratio (16:9, 4:3, 1:1, 3:4, 21:9); Show caption off
2. Caption: what or where it is, body/small, muted
3. Credit (Show credit): "Photo: Acme", ui/caption, muted

**Content and behavior**

- Set the ratio on the nested Image Placeholder; put the photo as an image fill on it
- One caption style and one line length per gallery; captions are short phrases without a period
- Credit only when the source must be named (stock, press, a photographer)
- In masonry galleries mix 4:3 and 3:4 per column; keep column widths equal

**Accessibility**

- Use <figure> and <figcaption>; the image still has alt text that says what it shows
- Do not repeat the caption word for word in the alt text
- Caption contrast is at least 4.5:1

| Property | Type | Default |
|---|---|---|
| Caption | text | The Bucharest office kitchen, where the team meets for lunch. |
| Show credit | boolean | false |
| Credit | text | Photo: Acme |

Built from: `Image Placeholder`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`, `ui/caption`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<figure>` with `<img>` or `next/image` (`aspect-*`, `object-cover`, `rounded-lg`) + `<figcaption className="text-sm text-muted-foreground">` (Credit in a `<small>` inside the figcaption)
