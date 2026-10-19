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
- Built from three pieces, like shadcn: `Dialog Header` (title, description, close X),
  `Dialog Footer` (Actions slot) and `Dialog` with native slots Header, Content and Footer.
- `Alert Dialog`: same pieces, Header with Close off, no Content, footer Cancel + destructive.
- Reuse `Dialog Header` and `Dialog Footer` for Sheet and Drawer.
- Overlay behind both: `dialog/overlay`. See the "dialog over page" example on the Dialog page.

## Alert Dialog types
| Type | When | Buttons |
|---|---|---|
| confirm | A decision with consequences that can be undone or is not destructive | Cancel + action verb |
| destructive | Irreversible loss (delete, revoke) | Cancel + destructive action verb |
| acknowledge | The user must know before going on; no decision | One button ("Got it") |
Prefer a toast or inline message for acknowledgements that do not block the next step.
