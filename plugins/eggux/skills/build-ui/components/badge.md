# Badge

Usage guidelines only. Visual specs live in the Figma component.

## Use
- Status of an object (Paid, Overdue, Draft), a category, or a count.
- Not clickable. For filters and selections use `Chip` (its remove x is a button labeled
  "Remove <value>").
- Tags and categories that people can remove or click use `Chip` with a soft Tone (info, success,
  warning, neutral); a status nobody changes stays a Badge. Example "Chip styles".

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
- Categories with no status meaning (projects, teams, Kanban labels) use Variant=category-1 to
  category-8 in the Swatch Picker order; Chip and Tag have the same Tone=category-N.
- Statuses repeated in tables and lists, and status inside rows and cards (Order Row, Progress Card, Tool Call, Search Result Item), use the soft variants (soft-success, soft-warning, soft-destructive, soft-info, soft-neutral); a solid variant only for the one status that must stand out. One style per table.

## Rules
- The text carries the meaning; color only reinforces it.
- One or two words, sentence case. No full sentences.
- Do not use a badge for the primary information of a row; use it next to it.
- On a muted card or panel use `outline` (or a status variant), never `secondary`: it disappears into the surface.

## Figma
- `Badge`: Variant × Shape (rounded, pill) × Size. Options: Show icon (Icon swap), Show dot
  (status dot before the label), Show count (number after the label: "Invoices 12").
- Badge Size=sm (16) in dense tables and Kanban cards, lg (24) next to a record title, default
  elsewhere; one Size per table or list. Example "Badge styles".
- `Badge Count`: number only, for sidebar items and icon buttons. Above 99 show "99+". Type=dot
  marks something new when the amount does not matter. Example "Badge Count styles".
- `Chip`: default, hover, focus, selected, disabled; Show leading icon (Leading icon swap, check
  when selected), Show remove. Tone default, soft-info, soft-success, soft-warning, soft-neutral
  (selected only on default), category-1 to category-8.
  See the "filter chips" example.
- Chip Size sm (24) in dense rows, lg (40) as touch filters on mobile; Show count for result
  counts, Show avatar for people filters. Example "Chip styles".

## Chip Group
- Group filter and scope chips in a `Chip Group`: Layout=wrap on desktop, scroll on mobile,
  "+N more" (Show more) after 4 to 8 chips.
- One choice or several, never both in one group; the first chip may be "All".
- Figma: `Chip Group` Layout (wrap, scroll); Chips slot, Show more. Example "Chip Group" on the
  Chip page.

## Badge List (a few tags on one line)
- Category, format, frequency, region of a dataset, an article or a job, under a title or in a
  card. Show 2-4 tags, then "+N" that opens the full list in a Tooltip or Popover.
- Outline Badges for neutral labels; a status Variant only when the tag is a status. Same order
  everywhere (type, frequency, region).
- Not for filters people remove (Chip) or a single status (Badge, Status Dot).
- Figma: `Badge List` with a Tags slot of Badges and an exposed "+N" Badge (Show more).

## Related components
- Two marketing badges: `Announcement Pill` (a "New" link above a hero title, one at a time) and
  `Trust Badge` (a current certification with what backs it, linking to the trust page). On a
  primary band use Tone=on-primary, on an inverted card Tone=inverted; never recolor by hand.
- Stock on a product page ("In stock", "Only 3 left", "Out of stock") is a `Status Dot` with its
  label: success, warning, error. Example "stock status" on the Badge page.
