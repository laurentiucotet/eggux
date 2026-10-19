# Dialog and AlertDialog

Usage guidelines only. Visual specs live in the Figma component.

## Which one
| Component | Use |
|---|---|
| `AlertDialog` | Confirm a decision the user must answer before continuing (delete, discard, sign out). No close on outside click |
| `Dialog` | A short, focused task that does not need its own page (rename, invite, quick create) |
| `Sheet` | Longer forms or details next to a list, where the user benefits from seeing the context behind it |
| Page | Anything with more than one step, more than ~6 fields, or content the user wants to link to |

## Rules
- Title says the task or the question ("Invite member", "Discard changes?"). Never "Info" or "Warning".
- One primary action, bottom right. Cancel is `outline`, to its left.
- Never open a dialog from a dialog. Replace the content or move the task to a page.
- Focus moves into the dialog on open (first field, or Cancel for an AlertDialog) and returns to
  the trigger on close. Escape closes it.
- A dialog with unsaved input follows `patterns/unsaved-changes.md` when closed.
- Long content scrolls inside the body; the title and the action bar stay fixed.
- On mobile, a `Dialog` with a form becomes a full-screen `Drawer` or `Sheet`.
- Destructive confirmations follow `patterns/delete-confirmation.md`.

## Figma
- `Dialog`: Title, Description, Content (native slot), footer with Cancel + primary (exposed), close X.
- `Alert Dialog`: no close button and no slot; footer with Cancel + destructive action.
- Overlay behind both: `dialog/overlay`. See the "dialog over page" example on the Dialog page.
