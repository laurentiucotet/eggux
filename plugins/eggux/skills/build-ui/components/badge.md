# Badge

Usage guidelines only. Visual specs live in the Figma component.

## Use
- Status of an object (Paid, Overdue, Draft), a category, or a count.
- Not clickable. For a removable filter or selection use a chip (Badge with a remove button, labeled
  "Remove <value>").

## Status variants
Map each status of an object to one variant once, in `objects.md` or `decisions.md`, and reuse
it everywhere. The same status never appears in two colors.

| Meaning | Variant / token |
|---|---|
| Neutral, draft, inactive | `secondary` or `outline` |
| Positive, done, paid | `success` |
| Needs attention, pending | `warning` |
| Failed, overdue, blocked | `destructive` |
| Informational, new | `info` |

## Rules
- The text carries the meaning; color only reinforces it.
- One or two words, sentence case. No full sentences.
- Do not use a badge for the primary information of a row; use it next to it.
