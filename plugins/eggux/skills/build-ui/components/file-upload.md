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
- Privacy: medical or personal documents say who can see them.

## Figma
- `File Dropzone` State: default, drag-over, error, disabled; Hint text; Browse button exposed.
- `File Item` State: uploading (Progress + cancel), complete (remove), error (reason + Retry +
  cancel); File name. Example "upload documents" (Field + dropzone + items).
