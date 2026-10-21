# File Upload

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [File Dropzone](#file-dropzone) | 4 | - |
| [File Item](#file-item) | 3 | - |
| [File Preview](#file-preview) | 3 | - |

On the Figma page: "Example / upload documents", "Stress test / File Preview"

## File Dropzone

Component set · 4 variants · default size 480 × 186

Drop area + "Browse files" button for uploads. The whole area is clickable and keyboard-focusable. Hint states accepted types and max size. drag-over while dragging; error after a rejected drop. Each file then appears as a File Item below.

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
