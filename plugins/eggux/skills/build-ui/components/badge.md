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

## Tag List (a few tags on one line)
- Category, format, frequency, region of a dataset, an article or a job, under a title or in a
  card. Show 2-4 tags, then "+N" that opens the full list in a Tooltip or Popover.
- Outline Badges for neutral labels; a status Variant only when the tag is a status. Same order
  everywhere (type, frequency, region).
- Not for filters people remove (Chip) or a single status (Badge, Status Dot).
- Figma: `Tag List` with a Tags slot of Badges and an exposed "+N" Badge (Show more).
