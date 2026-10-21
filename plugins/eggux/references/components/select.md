# Select

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Select](#select) | 8 | - |
| [Combobox](#combobox) | 8 | - |
| [Tag](#tag) | 2 | - |
| [Tag Input](#tag-input) | 4 | Tags |
| [Person Option](#person-option) | 4 | - |
| [People Picker](#people-picker) | 2 | Selected, Results |
| [Transfer List](#transfer-list) | 1 | Available, Selected |

On the Figma page: "Example / combobox open", "Example / multi-select open", "Example / role permissions", "Example / select open", "Example / share a report", "Stress test / Combobox", "Stress test / People Picker and Transfer List", "Stress test / Select", "Stress test / Tag Input", "Stress test / Transfer List"

## Select

Component set · 8 variants · default size 240 × 36

shadcn Select trigger. 6-15 options, single choice. Open state: Select (focus) + Menu with Checked on the selected item. Use inside Field for label and errors. Usage: eggux build-ui/components/select.md

**Use for**

- One choice from 6-15 options in a form
- Inside Field, for the label, description and error
- Rows per page in Table Pagination

**Not for**

- 2-5 options worth seeing: use Radio
- More than 15 options, or users know what to type: use Combobox
- Several values: use Tag Input or a Checkbox group
- Actions, not a value: use Menu

**Anatomy**

1. Label (from Field)
2. Trigger with Value: placeholder or filled (Content)
3. chevron-down icon
4. Open: Menu under the trigger, Checked on the selected Menu Item
5. Error message (from Field)

**Content and behavior**

- No preselection unless one option is clearly right; never preselect something with consequences
- Options in a meaningful order: frequency, sequence, then alphabetical
- Option labels are short and parallel; the placeholder is an example, not a label
- Disabled options stay visible, with the reason when possible
- State=error marks the trigger; the message comes from Field

**Accessibility**

- The visible label is tied to the trigger
- Enter, Space or arrows open; arrows move, Enter selects, Escape closes
- Typing a letter jumps to the matching option
- Focus ring in border/ring (State=focus)

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select a location |

Icons: chevron-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`
- Effects: `shadow/xs`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [select](../../skills/build-ui/components/select.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Select`; `Popover` + `Command`

## Combobox

Component set · 8 variants · default size 240 × 36

Searchable select (shadcn Combobox = Popover + Command). Use instead of Select when there are more than ~10 options or users know what to type (country, customer, product). Open state: Combobox (focus) + Command below, 4 px gap.

**Use for**

- Long option lists: country, customer, product
- Users know what they want and type it
- Adding people or values in share dialogs and filters

**Not for**

- 6-15 options without search: use Select
- 2-5 options worth seeing: use Radio
- Several values in one field: use Tag Input; people: use People Picker

**Anatomy**

1. Label (from Field)
2. Trigger with Value: placeholder or filled (Content)
3. chevrons-up-down icon
4. Open: Command 4 px below, with Command Input showing the query
5. Matching Menu Items, Checked on the selected one

**Content and behavior**

- No match: "No results for <query>" (Command Empty on, Show items off)
- Offer "Create <query>" when the user may create
- Show recent or suggested options before typing
- Long lists load asynchronously with a loading row, never an empty dropdown
- A single choice closes the list after the pick

**Accessibility**

- Visible label; the trigger exposes aria-expanded
- Typing filters, arrows move, Enter picks, Escape closes and returns focus to the trigger
- "No results" is announced, not only shown

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select country… |

Icons: chevrons-up-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Select`; `Popover` + `Command`

## Tag

Component set · 2 variants · default size 72 × 24

Removable value inside Tag Input and multi-select (secondary bg, 24 high). For filters outside a field use Chip.

| Variant property | Values |
|---|---|
| State | default, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Design |
| Remove | boolean | true |

Icons: x

Tokens and styles:
- Colors: `background/secondary`, `foreground/secondary`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `radius/sm`
- Text styles: `ui/label-small`

Guides: [select](../../skills/build-ui/components/select.md)

Code: custom on `Badge` + remove `Button`

## Tag Input

Component set · 4 variants · default size 360 × 38

Several values in one field: multi-select from a list (Chevron on, opens Command with checkboxes) or free tags (Chevron off, Enter adds). Show at most ~5 tags, then "+3 more".

**Use for**

- Multi-select from a list (Chevron on): opens Command with checked items
- Free tags or keywords (Chevron off): Enter adds a tag
- Lists too long for a Checkbox group

**Not for**

- Up to ~7 options all worth seeing: use a Checkbox group
- Choosing people: use People Picker
- Filters outside a field: use Chip

**Anatomy**

1. Field container (State)
2. Tags slot: Tag instances (Label, Remove)
3. Overflow text: "+3 more"
4. Typing area
5. chevrons-up-down icon (Chevron on)

**Content and behavior**

- Show at most ~5 tags, then "+3 more"
- Enter adds a free tag; Backspace in the empty field removes the last tag
- The multi-select list stays open while picking
- Disabled field: every Tag uses State=disabled
- State=error marks the field; the message comes from Field

**Accessibility**

- Each Tag remove button has a label: "Remove Design"
- Tags can be removed from the keyboard (Backspace, Delete)
- Adding and removing a value is announced

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Chevron | boolean | true |

Slots (fill them in the instance, never detach): `Tags`

Built from: `Tag`. Icons: chevrons-up-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Select`; `Popover` + `Command`

## Person Option

Component set · 4 variants · default size 288 × 54

One person in a People Picker list: checkbox (multi-select), avatar (exposed: initials or photo), name, role and email. Disambiguate people with the same name by email or team.

| Variant property | Values |
|---|---|
| Selected | false, true |
| State | default, hover |

| Property | Type | Default |
|---|---|---|
| Name | text | Ana Popescu |
| Detail | text | Finance manager · ana.popescu@acme.com |
| Show detail | boolean | true |

Built from: `Avatar`, `Checkbox`

Tokens and styles:
- Colors: `background/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger (Server search by name, email, team; debounce 200 ms)

## People Picker

Component set · 2 variants · default size 360 × 38

Choose one or more people (assignee, approvers, share with): selected people as chips in the field (Selected slot), search by name, email or team, results with avatar, role and email (Results slot of Person Options), invite by email when nobody matches. Recent and suggested people first. Over ~4 selected: "+3" in the field. Placeholder truncates on one line; chips wrap to new rows.

**Use for**

- Assignees, approvers and reviewers
- Share and invite dialogs
- Any field whose value is a person

**Not for**

- Free text values: use Tag Input
- Moving many members between two sets: use Transfer List

**Anatomy**

1. Field: Selected slot with people as Context Chips, and the Placeholder
2. Open: Command Input for the search
3. Results slot: Person Option rows with checkbox, Avatar, Name and Detail
4. Separator
5. Invite by email action when nobody matches

**Content and behavior**

- Search matches name, email and team; recent and suggested people come first
- Detail shows role and email, so two people with the same name differ
- More than ~4 selected: show "+3" in the field
- The Placeholder truncates on one line; chips wrap to new rows
- Nobody matches: offer "Invite by email" when allowed, otherwise say who can add them
- One person only (owner, assignee): close the list after the pick

**Accessibility**

- Each chip has a remove button labeled "Remove Ana Popescu"
- Arrows move through results, Space or Enter selects, Escape closes
- Selected state of a Person Option is exposed, not only shown by its checkbox color

| Variant property | Values |
|---|---|
| State | closed, open |

| Property | Type | Default |
|---|---|---|
| Placeholder | text | Add people… |

Slots (fill them in the instance, never detach): `Selected`, `Results`

Built from: `Button`, `Command Input`, `Context Chip`, `Person Option`, `Separator`

Tokens and styles:
- Colors: `background/default`, `background/popover`, `border/default`, `border/input`, `border/ring`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/md`
- Text styles: `body/small`
- Effects: `shadow/md`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger (Server search by name, email, team; debounce 200 ms)

## Transfer List

Component · 1 variant · default size 628 × 291

Move items between two lists (permissions to a role, columns to a view, members to a group): each side has a count, search and checkboxes; arrows move the checked items. Keyboard: Space checks, the buttons move. For under ~10 items a list of checkboxes is simpler.

**Use for**

- Permissions assigned to a role
- Visible columns of a view
- Members of a group or team

**Not for**

- Under ~10 items: use a list of Checkboxes
- Picking people for a field: use People Picker
- Only the chosen side matters: use Tag Input

**Anatomy**

1. Left list: Left title with count
2. Search Input
3. Available slot: Facet Option rows with checkboxes
4. Move buttons (Button Icon) between the lists
5. Right list: Right title, count, search and the Selected slot

**Content and behavior**

- Each side has a title, count, search and checkboxes
- Move buttons act on the checked items only
- Counts update after every move
- When order matters, use Sortable List Item on the right side

**Accessibility**

- Space checks an item; Tab reaches the move buttons
- Move buttons have labels: "Move to Selected", "Move to Available"
- The result is announced: "2 moved to Selected"

| Property | Type | Default |
|---|---|---|
| Left title | text | Available |
| Right title | text | Selected |

Slots (fill them in the instance, never detach): `Available`, `Selected`

Built from: `Button Icon`, `Facet Option`, `Input`, `Separator`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md)

Code: custom: two lists of `Checkbox` rows + move `Button`s (Or `@dnd-kit` when order matters)
