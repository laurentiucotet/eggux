# File Upload

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [File Dropzone](#file-dropzone) | 8 | - |
| [File Item](#file-item) | 12 | - |
| [File Preview](#file-preview) | 3 | - |
| [Resource Item](#resource-item) | 1 | Actions |
| [File Field](#file-field) | 3 | - |
| [File Type Icon](#file-type-icon) | 20 | - |

On the Figma page: "Example / File Item tiles, File Dropzone sm and File Type Icon", "Example / attach documents", "Example / downloads", "Example / invoice preview over a list", "Example / supplier onboarding documents", "Example / upload documents", "Stress test / File Dropzone", "Stress test / File Field", "Stress test / File Item", "Stress test / File Preview", "Stress test / File Type Icon", "Stress test / Resource Item"

## File Dropzone

Component set · 8 variants · default size 480 × 186

Drop area + "Browse files" button for uploads. The whole area is clickable and keyboard-focusable. Hint states accepted types and max size. drag-over while dragging; error after a rejected drop. Each file then appears as a File Item below.


Size: default (the drop area of an upload page or dialog) or sm (one line: icon, title and hint on 1 line each with ellipsis, Browse at the end, 480 wide and Fill) for a file field inside a Form Section, comment and chat attachments and the first step of an import.


Usage: eggux build-ui/components/file-upload.md

**Use for**

- Several documents or images attached to a record: invoices, contracts, exports
- Upload step inside a form, under a Field label
- Imports where the user drags a file from the desktop
- Size=sm: a file field inside a Form Section, comment and chat attachments, the first step of an import

**Not for**

- One image such as an avatar or logo: use Avatar Upload
- Picking an existing file already in the product: use a Select or Combobox

**Anatomy**

1. Upload icon
2. Instruction text
3. Browse files Button
4. Hint: accepted types and max size
5. File Item list below, one per file
6. Size: default (centered stack) or sm (one row: 32 icon tile, title and hint 1 line each, Browse at the end)

**Content and behavior**

- Hint states accepted types and max size before the user picks a file (default "PDF, JPG or PNG · up to 10 MB each")
- Validate type, size and count on selection; the error says the fix: "Upload PDF, JPG or PNG"
- State drag-over while a file is dragged over; error after a rejected drop; disabled when no upload is allowed
- Upload starts on selection; submit waits for uploads or says what is pending
- With a limit, show the total: "3 of 5 files"
- Resize: title and hint fill the width, centered, up to 2 lines each with ellipsis
- Size=sm: 480 wide by default, Fill in forms; title and hint 1 line with ellipsis; keep the hint short

**Accessibility**

- The whole area is clickable and keyboard-focusable; Browse files is the keyboard path
- Rejected files are announced with the reason, not shown in red only
- On mobile it opens the system picker, camera allowed for photos

| Variant property | Values |
|---|---|
| State | default, drag-over, error, disabled |
| Size | default, sm |

| Property | Type | Default |
|---|---|---|
| Hint | text | PDF, JPG or PNG · up to 10 MB each |
| Error | text | Only PDF, JPG or PNG files are accepted. |
| Title | text | Drag and drop files here |

Built from: `Button`. Icons: upload

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/3`, `spacing/6`, `spacing/8`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: react-dropzone + custom

## File Item

Component set · 12 variants · default size 480 × 78

One selected or uploaded file. uploading: progress + cancel (X). done: size + remove (trash). error: reason in destructive text + Retry + cancel. Name truncates in the middle in code; full name in a tooltip.


Type: file shows a file icon; image shows a thumbnail of the photo (Image Placeholder 1:1 inside, set its Image). Layout: row (default, full-width list under a File Dropzone) or tile (160 wide, for photo grids: review photos, product images, gallery and avatar uploads). In a tile, remove or cancel sits on the thumbnail corner, the name is 1 line and Retry moves under the error text. Error keeps the alert icon in both types.


Usage: eggux build-ui/components/file-upload.md

**Use for**

- Each file added through a File Dropzone
- Files already attached to a record, in edit mode
- Type=image: photos and images being uploaded, with a thumbnail
- Layout=tile: photo grids (review photos, product images, gallery and avatar uploads)

**Not for**

- Attachments in a read-only record or a message: use a List Item or an attachment chip
- Background imports with many rows: use Progress with a status message

**Anatomy**

1. Type: file (file icon) or image (thumbnail: Image Placeholder 1:1 inside, set its Image)
2. Layout: row (480, Fill) or tile (160: media 112 high, name, meta)
3. File icon
4. File name
5. Progress (uploading) or size (complete) or reason (error)
6. Actions: cancel (X), remove (trash), Retry
7. Tile: remove or cancel is a Button Icon outline sm on the media corner; Retry sits under the error text

**Content and behavior**

- State uploading: Progress and cancel (X)
- State done: size and remove (trash)
- State error: reason in destructive text, Retry and cancel; Retry only for network or server errors
- File name truncates in the middle in code so the extension stays visible; full name in a Tooltip
- Files are listed in the order added
- Error keeps the alert icon in both types, even for images
- One Layout per list or grid; tiles sit in a wrapping row with 12 gap
- Resize: row name 1 line with ellipsis (middle truncation in code), meta wraps; tile is a fixed 160, name 1 line, error text 2 lines

**Accessibility**

- Cancel, remove and Retry are Button Icons with labels that name the file: "Remove q3-financials.pdf"
- Progress and completion are announced in a live region
- Error reason is text with an icon (circle-alert), never color alone

| Variant property | Values |
|---|---|
| State | uploading, done, error |
| Type | file, image |
| Layout | row, tile |

| Property | Type | Default |
|---|---|---|
| File name | text | q3-financials.pdf |

Built from: `Button`, `Button Icon`, `Image Placeholder`, `Progress`. Icons: circle-alert, file-text

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/2`, `spacing/28`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: react-dropzone + custom

## File Preview

Component set · 3 variants · default size 960 × 647

Look at a document without downloading it (invoices, contracts, attachments): file name and meta, zoom, download, close; page thumbnails; the page; "Page 1 of 3". Loading shows a spinner; unsupported types say so and offer Download. Opens in a Sheet, a Dialog or its own page; Esc closes. Clips the page area on purpose. File name and meta truncate on one line; the full name shows in a tooltip.

**Use for**

- Checking an invoice or contract from a list without leaving it
- Attachments on a record or a message
- Review steps where the user compares a file with form data

**Not for**

- Editing the document: open it in its own editor
- Image galleries: use Lightbox or Carousel

**Anatomy**

1. Toolbar: File name and Meta
2. Zoom, Download and close
3. Page thumbnails
4. Page
5. Page indicator: "Page 1 of 3"

**Content and behavior**

- State ready shows the page; loading shows a Spinner; unavailable says the type is not supported and offers Download
- File name and Meta truncate on one line; the full name shows in a Tooltip
- Opens in a Sheet beside a list, a Dialog or its own page
- The page area clips on purpose; multi-page files show thumbnails

**Accessibility**

- Esc closes and focus returns to the trigger
- Zoom, Download and close are labeled buttons
- Page indicator is text, read by screen readers when the page changes

| Variant property | Values |
|---|---|
| State | ready, loading, unavailable |

| Property | Type | Default |
|---|---|---|
| File name | text | INV-1041 Northwind Traders.pdf |
| Meta | text | PDF · 3 pages · 240 KB |

Built from: `Button`, `Button Icon`, `Spinner`. Icons: file-text

Tokens and styles:
- Colors: `background/card`, `background/default`, `background/muted`, `border/default`, `border/ring`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`, `radius/sm`
- Text styles: `body/small`, `ui/caption`, `ui/label`
- Effects: `shadow/sm`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: `react-pdf` (pdf.js) for PDF, `<img>` for images, in `Sheet` or `Dialog` (Unsupported types: download link)

## Resource Item

Component · 1 variant · default size 560 × 65

A file or link people download or open: type icon, name, meta (format · size · updated), action (download, open, copy link). Stack in a card or a section ("Data samples and dictionaries", "Downloads"); Divider off on the last row. Name says what it is, not the file name; meta gives format and size so people know before they click. Files people upload use File Item.

**Use for**

- Downloads on a product, dataset or report page
- Attachments people take away: templates, guides, brand assets
- Links to documents stored elsewhere

**Not for**

- Files people upload: use File Item
- Previewing a file: use File Preview
- Navigation to pages: use List Item or links

**Anatomy**

1. Icon tile (Icon swap): the file type
2. Name: what it is, not the file name
3. Meta: format · size · updated or pages
4. Actions slot: download, open or copy link
5. Divider (off on the last row)

**Content and behavior**

- Meta gives format and size before people click
- A Download all button under the list when there are 3 or more, with the total size
- Gated files say so in the meta ("Sign in to download")
- Same icon per file type across the product

**Accessibility**

- The action's label names the file ("Download Sample data, XLSX, 2.4 MB")
- Opening in a new tab is announced
- The icon tile is decorative

| Property | Type | Default |
|---|---|---|
| Icon | instance swap | Icon/file-text |
| Name | text | Sample data |
| Meta | text | XLSX · 2.4 MB · Updated 12 Oct 2026 |
| Show divider | boolean | true |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button Icon`, `Separator`. Icons: file-text

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom row + `Button` (ghost icon) with `<a download>` (Label names the file, format and size)

## File Field

Component set · 3 variants · default size 360 × 36

One file as a form field (contract, logo, CSV to import): Choose file, then the name and size, with remove. Use inside forms where a Dropzone is too big. Accepted types and size in the field hint; the error says what to change. Several files or drag and drop: File Dropzone with File Items.

**Use for**

- One document in a form: a contract, a certificate
- A logo or a CSV to import, where a dropzone is too big
- Dense forms and Sheets

**Not for**

- Several files or drag and drop: use File Dropzone with File Items
- An avatar or a logo with a preview: use Avatar Upload
- A file already in the product: use Select or Combobox

**Anatomy**

1. Choose: Button "Choose file"
2. Empty text "No file chosen" or the file name and size
3. Remove (x), once a file is chosen
4. Error under the field (State=error)

**Content and behavior**

- State: empty, selected, error
- Accepted types and max size go in the Field hint
- The error says what to change: "Choose a PDF under 10 MB."
- Long file names truncate in the middle and keep the extension
- Choosing a new file replaces the old one

**Accessibility**

- A native input type="file" with a visible label through Field
- Remove has an aria-label with the file name ("Remove contract-northwind.pdf")
- Errors are linked with aria-describedby and announced

| Variant property | Values |
|---|---|
| State | empty, selected, error |

| Property | Type | Default |
|---|---|---|
| File name | text | contract-northwind.pdf · 240 KB |
| Error | text | Choose a PDF under 10 MB. |

Built from: `Button`. Icons: x

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: custom: hidden `input type="file"` + shadcn `Button`, file name, remove `Button` (Several files: `File Dropzone` (react-dropzone))

## File Type Icon

Component set · 20 variants · default size 40 × 40

A tile per file type with its extension in the type color: pdf (rose), document (blue), sheet (green), slides (orange), image (violet), video (fuchsia), audio (cyan), archive (amber), code (neutral, </>), generic (neutral, file icon). Size default 40, sm 32. Colors are the Badge category tints (category-N-bg and -fg, 5.67:1 or more in every mode), so a type keeps its color everywhere. Edit the extension text in the instance for a different extension of the same type (CSV in sheet, PNG in image). Use it in File Item, Resource Item, attachments, Table Cell File, Search Result Item Type=file and Context Chip Type=file instead of a generic icon.


Usage: eggux build-ui/components/file-upload.md

**Use for**

- File Item, Resource Item and attachment lists
- Table Cell File and Search Result Item Type=file
- Context Chip Type=file and email attachments

**Not for**

- A file preview with content: use File Preview or an Image Placeholder thumbnail
- Folders and other objects: use an icon in Icon Tile

**Anatomy**

1. Type: pdf, document, sheet, slides, image, video, audio, archive, code, generic
2. Size: default 40, sm 32
3. Tile: Badge category tint (category-N-bg), radius md (sm: radius sm)
4. Extension: ui/label-small in category-N-fg (PDF, DOC, XLS, PPT, JPG, MP4, MP3, ZIP, </>); generic shows a file icon

**Content and behavior**

- Colors: pdf rose (8), document blue (1), sheet green (6), slides orange (2), image violet (7), video fuchsia (5), audio cyan (3), archive amber (4), code and generic neutral
- Edit the extension text for other extensions of the same type (CSV in sheet, PNG in image); 3 letters, 4 at most in default
- Do not use it for a single file type everywhere; it helps only when types mix
- Resize: fixed size, never stretched

**Accessibility**

- Decorative next to the file name (aria-hidden); the name includes the extension
- Extension text keeps 5.67:1 or more on its tint in every mode

| Variant property | Values |
|---|---|
| Type | pdf, document, sheet, slides, image, video, audio, archive, code, generic |
| Size | default, sm |

Icons: file-text

Tokens and styles:
- Colors: `badge/category-1-bg`, `badge/category-1-fg`, `badge/category-2-bg`, `badge/category-2-fg`, `badge/category-3-bg`, `badge/category-3-fg`, `badge/category-4-bg`, `badge/category-4-fg`, `badge/category-5-bg`, `badge/category-5-fg`, `badge/category-6-bg`, `badge/category-6-fg`, `badge/category-7-bg`, `badge/category-7-fg`, `badge/category-8-bg`, `badge/category-8-fg`, `badge/soft-neutral-bg`, `foreground/default`
- Spacing and size: `spacing/10`, `spacing/8`
- Radius: `radius/md`, `radius/sm`
- Text styles: `ui/label-small`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: `<span className="inline-flex size-10 items-center justify-center rounded-md bg-[var(--badge-category-N-bg)] text-[var(--badge-category-N-fg)] text-xs font-medium">PDF</span>` (sm `size-8 rounded-sm`); code and generic `bg-[var(--badge-soft-neutral-bg)]`, generic shows lucide `FileText` (Map MIME type or extension to the type: pdf 8, document 1, sheet 6, slides 2, image 7, video 5, audio 3, archive 4; `aria-hidden`)
