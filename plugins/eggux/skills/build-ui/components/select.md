# Select, Combobox and choice inputs

Usage guidelines only. Visual specs live in the Figma component.

## Which one
| Options | Single choice | Multiple choice |
|---|---|---|
| 2-5, all worth seeing | `RadioGroup` | `Checkbox` group |
| 2 (on/off) that applies immediately | `Switch` | - |
| 6-15 | `Select` | `Combobox` with multi-select |
| More than 15, or the user knows what they want | `Combobox` with search | `Combobox` with chips |

## Rules
- Default to no selection unless one option is clearly right for most users. Never preselect
  something with consequences (a paid plan, consent).
- Options are sorted in a meaningful order (frequency, logical sequence, then alphabetical).
- Option labels are short and parallel in form. Add a description line only when options are
  hard to tell apart.
- A Combobox shows "No results for <query>" and, when the actor may create, a "Create <query>" option.
- Long lists load asynchronously with a loading row, never an empty dropdown.
- Disabled options stay visible with the reason in a tooltip or description when possible.

## Checkbox, Radio, Switch
- The label is clickable and sits to the right of the control.
- `Switch` applies immediately and shows the result. Inside a form that saves on submit, use `Checkbox`.
- A single checkbox for consent states what the user agrees to, not "I agree".
- Indeterminate checkbox only for "select all" over a partial selection.

## Figma
- `Select` is the trigger. For the open state, place a `Menu` under it and set `Checked` on the
  selected `Menu Item`. See the "select open" example.
- `Checkbox`, `Radio`, `Switch` include their label (`Show label` to hide it). Error state marks
  the control; the message comes from `Field` or text under the group.
- `Combobox` is the searchable trigger (chevrons-up-down). Open state: `Combobox` (focus) +
  `Command` 4 px below: `Command Input` with the query, `Items` slot with the matching
  `Menu Item`s (Checked on the selected one). No match: turn on `Empty`, off `Show items`.
  See "combobox open" on the Popover page.

## Multi-select and Tag Input
- Several values in one field: from a list (multi-select, Chevron on, opens Command with Checked
  items that stay open while picking) or free entry (tags, Chevron off, Enter or comma adds).
- Show selected values as `Tag`s; after ~5, collapse to "+3 more". Backspace removes the last tag.
- Up to ~7 options with all worth seeing: Checkbox group instead.
- Figma: `Tag` (Label, Remove), `Tag Input` (State, Tags slot, Chevron) on the Popover page.
  Example "multi-select open".
