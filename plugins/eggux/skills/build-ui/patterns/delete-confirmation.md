# Pattern: delete confirmation

**Problem:** destructive actions are easy to trigger by mistake and hard or impossible to undo.
**Heuristic:** error prevention, user control and freedom.

## Choose the level by cost of the mistake
| Level | When | UI |
|---|---|---|
| Undo | Easy to restore (archive, remove from list) | Act immediately, toast with "Undo" for 5-10 s |
| Confirm | Not restorable, single item | AlertDialog |
| Type to confirm | Not restorable and high impact (account, project, bulk data) | AlertDialog with input that must match the item name |

Prefer undo over confirmation when the system can support it.

## Confirm dialog content
- **Title:** the action and the object: "Delete project?"
- **Body:** what will be lost, named specifically ("The project Website redesign and its 24 tasks"),
  and "This can't be undone." when true.
- **Buttons:** cancel (outline, left) and the action (destructive variant, right), labeled with
  the verb: "Delete project". Never "Yes" / "No".
- **Focus:** initial focus on Cancel. Escape closes the dialog.

## After
- Success: toast naming what was deleted. Return focus to a logical place in the list.
- Failure: keep the dialog open with the error, so the user can retry.

## shadcn / Figma
`AlertDialog` + `Button variant="destructive"`; `Toast`/`Sonner` for undo.
