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
