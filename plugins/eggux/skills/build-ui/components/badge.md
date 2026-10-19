# Badge

Usage guidelines only. Visual specs live in the Figma component.

## Use
- Status of an object (Paid, Overdue, Draft), a category, or a count.
- Not clickable. For filters and selections use `Chip` (its remove x is a button labeled
  "Remove <value>").

## Status variants
Map each status of an object to one variant once, in `objects.md` or `decisions.md`, and reuse
it everywhere. The same status never appears in two colors.

| Meaning | Variant / token |
|---|---|
| Neutral, draft, inactive | `secondary` or `outline` |
| Positive, done, paid | `success` |
| Needs attention, pending | `warning` (filled, dark text) |
| Failed, overdue, blocked | `destructive` |
| Informational, new | `info` |

## Rules
- The text carries the meaning; color only reinforces it.
- One or two words, sentence case. No full sentences.
- Do not use a badge for the primary information of a row; use it next to it.

## Figma
- `Badge`: Variant × Shape (rounded, pill). Options: Icon, Dot (status dot before the label),
  Count (number after the label: "Invoices 12").
- `Badge Count`: number only, for sidebar items and icon buttons. Above 99 show "99+".
- `Chip`: default, hover, focus, selected, disabled; Leading icon (check when selected), Remove.
  See the "filter chips" example.
