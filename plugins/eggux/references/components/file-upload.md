# File Upload

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [File Dropzone](#file-dropzone) | 4 | - |
| [File Item](#file-item) | 3 | - |
| [File Preview](#file-preview) | 3 | - |

On the Figma page: "Example / attach documents", "Example / invoice preview over a list", "Example / upload documents", "Stress test / File Dropzone", "Stress test / File Item", "Stress test / File Preview"

## File Dropzone

Component set · 4 variants · default size 480 × 186

Drop area + "Browse files" button for uploads. The whole area is clickable and keyboard-focusable. Hint states accepted types and max size. drag-over while dragging; error after a rejected drop. Each file then appears as a File Item below.

**Use for**

- Several documents or images attached to a record: invoices, contracts, exports
- Upload step inside a form, under a Field label
- Imports where the user drags a file from the desktop

**Not for**

- One image such as an avatar or logo: use Avatar Upload
- Picking an existing file already in the product: use a Select or Combobox

**Anatomy**

1. Upload icon
2. Instruction text
3. Browse files Button
4. Hint: accepted types and max size
5. File Item list below, one per file

**Content and behavior**

- Hint states accepted types and max size before the user picks a file (default "PDF, JPG or PNG · up to 10 MB each")
- Validate type, size and count on selection; the error says the fix: "Upload PDF, JPG or PNG"
- State drag-over while a file is dragged over; error after a rejected drop; disabled when no upload is allowed
- Upload starts on selection; submit waits for uploads or says what is pending
- With a limit, show the total: "3 of 5 files"

**Accessibility**

- The whole area is clickable and keyboard-focusable; Browse files is the keyboard path
- Rejected files are announced with the reason, not shown in red only
- On mobile it opens the system picker, camera allowed for photos

| Variant property | Values |
|---|---|
| State | default, drag-over, error, disabled |

| Property | Type | Default |
|---|---|---|
| Hint | text | PDF, JPG or PNG · up to 10 MB each |

Built from: `Button`. Icons: upload

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/3`, `spacing/6`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [file-upload](../../skills/build-ui/components/file-upload.md)

Code: react-dropzone + custom

## File Item

Component set · 3 variants · default size 480 × 78

One selected or uploaded file. uploading: progress + cancel (X). complete: size + remove (trash). error: reason in destructive text + Retry + cancel. Name truncates in the middle in code; full name in a tooltip.

**Use for**

- Each file added through a File Dropzone
- Files already attached to a record, in edit mode

**Not for**

- Attachments in a read-only record or a message: use a List Item or an attachment chip
- Background imports with many rows: use Progress with a status message

**Anatomy**

1. File icon
2. File name
3. Progress (uploading) or size (complete) or reason (error)
4. Actions: cancel (X), remove (trash), Retry

**Content and behavior**

- State uploading: Progress and cancel (X)
- State complete: size and remove (trash)
- State error: reason in destructive text, Retry and cancel; Retry only for network or server errors
- File name truncates in the middle in code so the extension stays visible; full name in a Tooltip
- Files are listed in the order added

**Accessibility**

- Cancel, remove and Retry are Button Icons with labels that name the file: "Remove q3-financials.pdf"
- Progress and completion are announced in a live region
- Error reason is text with an icon (circle-alert), never color alone

| Variant property | Values |
|---|---|
| State | uploading, complete, error |

| Property | Type | Default |
|---|---|---|
| File name | text | q3-financials.pdf |

Built from: `Button`, `Button Icon`, `Progress`. Icons: circle-alert, file-text

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/3`
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
