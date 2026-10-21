# File upload

Usage guidelines only. Visual specs live in the Figma components (File Upload page).

## Use
- Documents, images or exports the user attaches to a record or a form.
- One image (avatar, logo): a button + preview, no dropzone.

## Rules
- The hint states accepted types and max size before the user picks a file.
- Validate on selection (type, size, count) and explain the fix: "MOV files are not accepted.
  Upload PDF, JPG or PNG." Retry only for errors a retry can fix (network, server).
- Each file shows name, size, progress while uploading, cancel; remove after upload.
- Upload starts on selection; the form submit waits for uploads to finish or says what is pending.
- Multiple files: list them under the dropzone in the order added. Show the total when there is a
  limit ("3 of 5 files").
- The whole dropzone is clickable and focusable; "Browse files" is the keyboard path. On mobile it
  opens the system picker (camera allowed for photos).
- Privacy: contracts, IDs and personal documents say who can see them.

## Figma
- `File Dropzone` State: default, drag-over, error, disabled; Hint text; Browse button exposed.
- `File Item` State: uploading (Progress + cancel), complete (remove), error (reason + Retry +
  cancel); File name. Example "upload documents" (Field + dropzone + items).

## File Preview
- Look at a document without downloading it: invoices, contracts, attachments. Opens in a
  Sheet beside a list, a Dialog, or its own page; Esc closes and returns focus.
- Toolbar: file name and meta, zoom, download, close. Multi-page files show thumbnails and
  "Page 1 of 3". Unsupported types say so and offer Download; loading shows a spinner.
- Figma: `File Preview` State ready, loading, unavailable; File name and Meta truncate on one line.

## Avatar Upload and Image Cropper
- Profile and logo pictures in settings: current avatar (initials when empty), the rules (type,
  minimum size, maximum weight), Upload or Change, Remove (Undo in a toast, no confirm).
- After picking a file, open the `Image Cropper` with the target shape (circle for avatars);
  drag to move, slider or scroll to zoom, arrow keys and +/- for keyboard users. Save uploads.
- Errors say what to fix ("Choose an image under 5 MB").
- Figma: `Avatar Upload` State empty, filled, uploading, error; `Image Cropper` Shape square,
  circle (image as fill on the "image" layer; the selection stays centered; min width 320).
