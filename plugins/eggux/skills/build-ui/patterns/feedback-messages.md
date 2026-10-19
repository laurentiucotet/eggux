# Pattern: feedback messages

**Problem:** the same kind of message appears as a toast in one place, a banner in another and a
dialog in a third, so users miss important ones and get interrupted by trivial ones.
**Heuristic:** visibility of system status, consistency and standards, help users recover from errors.

## Choose the channel
| Situation | Channel |
|---|---|
| Error in a field | Inline under the field (`form-validation.md`) |
| Error that blocks the action (server, permission) | Inline near the action or at the top of the form; keep input |
| Confirmation of an action the user just took | The visible change, or a toast when the result is out of view (`action-feedback.md`) |
| Reversible action | Toast with "Undo" |
| Persistent state of a page or section (read-only, trial ending, sync failed) | Alert above that content |
| Decision required before continuing | AlertDialog |
| Something happened in the background, act later | Notification center or badge; toast only if relevant now |

## Writing
- Say what happened, then what to do: "We couldn't save the invoice. Check your connection and try again."
- Name the object and use the client's terminology.
- No blame ("You entered an invalid..."), no codes alone, no "Oops". Codes can follow the message for support.
- Success messages are short; error messages are as long as needed to recover.

## Rules
- Severity has one look across the product: `info`, `success`, `warning`, `destructive`, always
  with an icon, never color alone.
- Never interrupt with a dialog for something that does not need a decision.
- A message the user needs again (instructions, a reference number) is never only in a toast.

## shadcn / Figma
`FormMessage`, `Alert`, `Sonner` toast, `AlertDialog`. See `components/toast.md`, `components/alert.md`, `components/dialog.md`.
