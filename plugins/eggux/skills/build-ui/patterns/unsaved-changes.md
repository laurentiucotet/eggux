# Pattern: unsaved changes

**Problem:** users lose work by navigating away, closing a dialog or refreshing before saving.
**Heuristic:** error prevention, user control and freedom.

## Choose the model
| Model | When | UI |
|---|---|---|
| Autosave | Single-user editing, every intermediate state is valid (notes, settings toggles) | Save on change or blur, show "Saved" / "Saving..." status, no save button |
| Explicit save | Changes must be reviewed together, affect others, or can be invalid midway | Save button, warn on leave |

Do not mix both in the same form.

## Explicit save
- The form knows it is dirty only when values differ from the saved ones (typing and undoing is clean).
- Leaving with unsaved changes (route change, closing a dialog or sheet, closing the tab) asks:
  title "Discard changes?", body naming what will be lost, buttons "Keep editing" (outline) and
  "Discard" (destructive).
- Browser refresh and close use the native `beforeunload` prompt; do not build a custom one.
- In long forms, a sticky action bar shows Save and Cancel while the form is dirty.
- After saving, the form is clean and shows a confirmation (toast or inline status).

## Autosave
- Status text near the title: "Saving...", "Saved", "Couldn't save. Retry".
- Failed saves keep the local value and retry; never silently drop input.

## shadcn / Figma
`AlertDialog` for the discard prompt. Long forms and settings: `Save Bar` (default, saving,
error) sticky at the bottom while there are changes, with a count ("3 unsaved changes"). See `components/dialog.md`.
