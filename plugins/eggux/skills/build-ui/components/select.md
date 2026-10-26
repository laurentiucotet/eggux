# Select, Combobox and choice inputs

Usage guidelines only. Visual specs live in the Figma component.

## Which one
| Options | Single choice | Multiple choice |
|---|---|---|
| 2-5, all worth seeing | `RadioGroup` | `Checkbox` group |
| 2 (on/off) that applies immediately | `Switch` | - |
| 6-15 | `Select` | `Tag Input` with a list (Show chevron on) |
| More than 15, or the user knows what they want | `Combobox` with search | `Tag Input` with search in the list |

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
- `Select` Style default or filled: filled matches `Input` Style=filled. Use the form's Input Style;
  never mix filled and outlined controls in one form. Example "Select styles".
- `Checkbox`, `Radio`, `Switch` include their label (`Show label` to hide it). Error state marks
  the control; the message comes from `Field` or text under the group.
- `Combobox` is the searchable trigger (chevrons-up-down). Open state: `Combobox` (focus) +
  `Command` 4 px below: `Command Input` with the query, `Items` slot with the matching
  `Menu Item`s (Checked on the selected one). No match: turn on `Show empty`, off `Show items`.
  See "combobox open" on the Select page.

## Multi-select and Tag Input
- `Tag Input` is the multi-select: several values in one field, from a list (Show chevron on,
  opens Command with Checked items that stay open while picking) or free entry (tags, Show
  chevron off, Enter or comma adds). Combobox picks one value only.
- Show selected values as `Tag`s; after ~5, collapse to "+3 more". Backspace removes the last tag.
- 2-5 options all worth seeing: Checkbox group instead.
- Figma: `Tag` (Label, Show remove), `Tag Input` (State, Tags slot, Show chevron) on the Select page.
  Example "multi-select open".

## People Picker
- Choosing people (assignee, approvers, reviewers, share with). Search matches name, email and
  team; results show avatar, name, role and email so two people with the same name differ.
- Recent and suggested people first; selected people as chips in the field; after ~4, "+3".
- Nobody matches: offer "Invite by email" when inviting is allowed, otherwise say who can add them.
- One person only (owner, assignee): close the list after the pick.
- Figma: `Person Option` (Selected × State; Name, Description, Show detail; Avatar exposed),
  `People Picker` (closed, open; Selected and Results slots; Placeholder truncates on one line).

## Transfer List
- Moving items between two sets where both sides matter (permissions of a role, columns of a
  view, members of a group). Each side: title, count, search, checkboxes; buttons move checked items.
- Under ~10 items: a checkbox list is simpler. Order matters: add `Sortable List Item` on the right.
- Keyboard: Space checks, Tab reaches the move buttons; announce "2 moved to Selected".
- Figma: `Transfer List` (Left title, Right title; Available and Selected slots of `Facet Option`s).

## Related components
- Use `Select Option` for rich options (icon or avatar, title, second line) when labels alone are
  ambiguous. `Address Autocomplete` fills address fields from suggestions; `Recurrence Picker` sets
  how often something repeats, with a summary sentence. The interface language is a `Select`
  that opens a `Menu` of languages, each written in its own language: example "language switch"
  on the Select page. `Option Card` Control=checkbox is the multi-choice card;
  Control=radio picks one.
