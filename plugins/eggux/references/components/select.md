# Select

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Select](#select) | 90 | - |
| [Combobox](#combobox) | 30 | - |
| [Tag Input](#tag-input) | 12 | Tags |
| [Tag](#tag) | 36 | - |
| [People Picker](#people-picker) | 2 | Selected, Results |
| [Person Option](#person-option) | 4 | - |
| [Transfer List](#transfer-list) | 1 | Available, Selected |
| [Address Autocomplete](#address-autocomplete) | 1 | - |
| [Select Option](#select-option) | 8 | - |
| [Recurrence Picker](#recurrence-picker) | 3 | - |

On the Figma page: "Example / Combobox create option", "Example / Combobox styles", "Example / Select ghost and leading", "Example / Select styles", "Example / Tag Input styles", "Example / Tag styles", "Example / combobox open", "Example / customer picker in a new invoice", "Example / in account settings form", "Example / language switch", "Example / multi-select open", "Example / role permissions", "Example / select open", "Example / share a report", "Stress test / Address Autocomplete", "Stress test / Combobox", "Stress test / People Picker and Transfer List", "Stress test / Recurrence Picker", "Stress test / Select", "Stress test / Select Option", "Stress test / Tag Input", "Stress test / Transfer List"

## Select

Component set · 90 variants · default size 240 × 36

shadcn Select trigger. 6-15 options, single choice. Open state: Select (focus) + Menu with Checked on the selected item. Use inside Field for label and errors.


Style: default (outlined) or filled (background/muted fill, no border until focus or error, placeholder in input/filled-muted-foreground). Use the same Style as the other controls of the form.


Size: default 36, sm 32 (filter bars, Data Grid Toolbar, table rows), lg 40 (hero and mobile forms). State=read-only: muted fill, no chevron, value in foreground/default, for a value people may see but not change here. Show clear: an x before the chevron for a Select that can be emptied (filters).


Style=ghost: no border or fill, hugs its text, with an inline Label ("Sort by:", Show label) in muted text before the value. For sort, period and rows-per-page switches in toolbars, chart cards and list headers, never in a form.


Leading (Show leading icon + Leading icon, Show avatar, Show status dot): one part before the value, off by default. Icon for languages, currencies and categories; Avatar xs for assignee and owner; Status Dot for status and priority. Use the same leading on every option in the open Menu (Select Option).


Usage: eggux build-ui/components/select.md

**Use for**

- One choice from 6-15 options in a form
- Inside Field, for the label, description and error
- Rows per page in Table Pagination
- Style=filled in forms that use Input Style=filled
- Size=sm: filter bars, Data Grid Toolbar, rows per page, dense forms
- Size=lg: hero and mobile forms
- State=read-only: a value shown in a form that cannot be changed there (plan, owner after approval)
- Show clear: filters and optional values that can be emptied
- Style=ghost: sort, period and rows-per-page switches in list headers, Chart Cards, Activity Feed and Product Grid ("Sort by: Newest")
- Leading: Status Dot for status and priority, Avatar for assignee and owner, an icon for language, currency or category

**Not for**

- 2-5 options worth seeing: use Radio
- More than 15 options, or users know what to type: use Combobox
- Several values: use Tag Input or a Checkbox group
- Actions, not a value: use Menu
- Style=ghost inside a form: use default or filled so the field looks editable

**Anatomy**

1. Label (from Field)
2. Style: default (border/input), filled (background/muted, no border until focus or error) or ghost (no border or fill, hugs its text)
3. Label (Show label, ghost only): inline muted text before the value ("Sort by:")
4. Leading (off by default): Show leading icon + Leading icon (swap), Show avatar (Avatar xs, exposed), Show status dot (Status Dot, exposed, label off)
5. Trigger with Value: placeholder or filled (Content); Show clear
6. chevron-down icon
7. Open: Menu under the trigger, Checked on the selected Menu Item
8. Error message (from Field)

**Content and behavior**

- No preselection unless one option is clearly right; never preselect something with consequences
- Options in a meaningful order: frequency, sequence, then alphabetical
- Option labels are short and parallel; the placeholder is an example, not a label
- Disabled options stay visible, with the reason when possible
- State=error marks the trigger; the message comes from Field
- Use the same Style as the other controls in the form
- State: default, focus, error, disabled, read-only; Size: default, sm, lg
- Match the Size of the Inputs and Buttons in the same row
- Resize: the value truncates to 1 line; icons keep their size
- One leading part at a time, and the same leading on every option in the open list (Select Option Leading)
- Ghost: padding spacing/2 (lg spacing/3); the value is medium weight and truncates at 200 with an ellipsis; the whole row stays one line
- Resize: default and filled FILL their column with the value truncating; ghost hugs

**Accessibility**

- The visible label is tied to the trigger
- Enter, Space or arrows open; arrows move, Enter selects, Escape closes
- Typing a letter jumps to the matching option
- Focus ring in border/ring (State=focus)
- Style=filled: placeholder 7:1 on the fill (input/filled-muted-foreground); focus ring 4.7:1 on the fill
- Ghost: the inline label is part of the accessible name ("Sort by, Newest"); the focus ring still shows (State=focus)
- Status Dot color is never the only cue: the value names the status

| Variant property | Values |
|---|---|
| Style | default, filled, ghost |
| Size | default, sm, lg |
| State | default, focus, error, disabled, read-only |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select a location |
| Show clear | boolean | false |
| Label | text | Sort by: |
| Show label | boolean | true |
| Show leading icon | boolean | false |
| Leading icon | instance swap | Icon/globe |
| Show avatar | boolean | false |
| Show status dot | boolean | false |

Built from: `Avatar`, `Status Dot`. Icons: chevron-down, globe, x

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`, `input/filled-muted-foreground`
- Spacing and size: `density/control-height`, `spacing/1`, `spacing/10`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `input/radius`
- Text styles: `body/default`, `body/small`, `ui/label`
- Effects: `shadow/xs`

Guides: [dropdown-menu](../../skills/build-ui/components/dropdown-menu.md), [input](../../skills/build-ui/components/input.md), [select](../../skills/build-ui/components/select.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Select`; `Popover` + `Command`

## Combobox

Component set · 30 variants · default size 240 × 36

Searchable select (shadcn Combobox = Popover + Command). Use instead of Select when there are more than ~10 options or users know what to type (country, customer, product). Open state: Combobox (focus) + Command below, 4 px gap.


Size: default 36, sm 32, lg 40. State=read-only: muted fill, no chevrons. Show clear: an x before the chevrons to empty the value.


Leading (Show leading icon + Leading icon, Show avatar, Show status dot): one part before the value, off by default. Avatar xs for customers and people, icon for types, Status Dot for status. The options in the Command show the same leading.


Usage: eggux build-ui/components/select.md

**Use for**

- Long option lists: country, customer, product
- Users know what they want and type it
- Adding people or values in share dialogs and filters
- With Show avatar for customers, people and owners; with an icon for record types

**Not for**

- 6-15 options without search: use Select
- 2-5 options worth seeing: use Radio
- Several values in one field: use Tag Input; people: use People Picker

**Anatomy**

1. Label (from Field)
2. Leading (off by default): Show leading icon + Leading icon (swap), Show avatar (Avatar xs, exposed), Show status dot (Status Dot, exposed)
3. Trigger with Value: placeholder or filled (Content); Show clear
4. chevrons-up-down icon
5. Open: Command 4 px below, with Command Input showing the query
6. Matching Select Options or Menu Items, Checked on the selected one; Select Option Type=create last when people may add

**Content and behavior**

- No match: "No results for <query>" (Command Empty on, Show items off)
- Offer Select Option Type=create ("Create customer "Nord"") as the last item when people may create
- Show recent or suggested options before typing
- Long lists load asynchronously with a loading row, never an empty dropdown
- A single choice closes the list after the pick
- Resize: the value truncates to 1 line with an ellipsis; the chevron keeps its size
- State: default, focus, error, disabled, read-only; Size: default, sm, lg
- Show clear empties the value and keeps focus on the trigger
- The trigger leading matches the leading of the options

**Accessibility**

- Visible label; the trigger exposes aria-expanded
- Typing filters, arrows move, Enter picks, Escape closes and returns focus to the trigger
- "No results" is announced, not only shown

| Variant property | Values |
|---|---|
| Size | default, sm, lg |
| State | default, focus, error, disabled, read-only |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select country… |
| Show clear | boolean | false |
| Show leading icon | boolean | false |
| Leading icon | instance swap | Icon/globe |
| Show avatar | boolean | false |
| Show status dot | boolean | false |

Built from: `Avatar`, `Status Dot`. Icons: chevrons-up-down, globe, x

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`, `input/filled-muted-foreground`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `input/radius`
- Text styles: `body/default`, `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [popover](../../skills/build-ui/components/popover.md), [select](../../skills/build-ui/components/select.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Select`; `Popover` + `Command`

## Tag Input

Component set · 12 variants · default size 360 × 36

Several values in one field: multi-select from a list (Chevron on, opens Command with checkboxes) or free tags (Chevron off, Enter adds). Show at most ~5 tags, then "+3 more".


Size: default (min 36), sm (min 32, dense forms and filter bars), lg (min 40). Tags keep their 24 px height; the field grows in height when tags wrap.


Usage: eggux build-ui/components/select.md

**Use for**

- Multi-select from a list (Show chevron on): opens Command with checked items
- Free tags or keywords (Show chevron off): Enter adds a tag
- Lists too long for a Checkbox group

**Not for**

- Up to ~7 options all worth seeing: use a Checkbox group
- Choosing people: use People Picker
- Filters outside a field: use Chip

**Anatomy**

1. Field container (State)
2. Tags slot: Tag instances (Label, Show remove)
3. Overflow text: "+3 more"
4. Typing area
5. chevrons-up-down icon (Show chevron on)
6. Size: default (min height 36), sm (min 32, 2 px padding), lg (min 40, 6 px padding)

**Content and behavior**

- Show at most ~5 tags, then "+3 more"
- Enter adds a free tag; Backspace in the empty field removes the last tag
- The multi-select list stays open while picking
- Disabled field: every Tag uses State=disabled
- State=error marks the field; the message comes from Field
- Size: default, sm, lg; match the other fields in the form
- Resize: tags wrap to new lines and the field grows in height

**Accessibility**

- Each Tag remove button has a label: "Remove Design"
- Tags can be removed from the keyboard (Backspace, Delete)
- Adding and removing a value is announced

| Variant property | Values |
|---|---|
| Size | default, sm, lg |
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Show chevron | boolean | true |

Slots (fill them in the instance, never detach): `Tags`

Built from: `Tag`. Icons: chevrons-up-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/default`, `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `Select`; `Popover` + `Command`

## Tag

Component set · 36 variants · default size 73 × 24

Removable value inside Tag Input, People Picker and multi-select. Tone=default (secondary fill) or category-1 to category-8 (badge/category-{n} tokens, for labels and categories with a color). Size: default (24) in fields, sm (20) in dense fields and table filters. Options: Avatar (Show avatar, exposed Avatar) for people, Leading icon (Show leading icon, Leading icon swap) for typed values such as a status or a file type, Remove (x, a button labelled "Remove <value>" in code). State: default, disabled. Label truncates at 192 wide. For filters outside a field use Chip. Usage: eggux build-ui/components/select.md

**Use for**

- Selected values in Tag Input and multi Select
- People Picker selections (Show avatar)
- Typed values with an icon (status, file type, channel)
- Labels with a fixed color (Tone=category-n)

**Not for**

- Filters outside a field: use Chip
- Static labels nobody removes: use Badge

**Anatomy**

1. Size: default (24) or sm (20)
2. Tone: default (secondary fill) or category-1 to category-8 (badge/category-*)
3. Avatar (Show avatar, exposed Avatar xs on a background/default circle)
4. Leading icon (Show leading icon, Leading icon swap, 12 px)
5. Label
6. Remove x (Show remove)
7. State: default, disabled

**Content and behavior**

- One Size per field: sm in dense fields and table filters
- Avatar or icon, not both
- Category tones follow the Badge category order
- Disabled field: every Tag uses State=disabled
- Hugs its label up to 192 (maxWidth spacing/48); the label truncates to 1 line with ellipsis

**Accessibility**

- Remove x is a button labelled "Remove <value>"
- Tags can be removed from the keyboard (Backspace, Delete)
- Category labels 5.67:1 or more in every mode

| Variant property | Values |
|---|---|
| State | default, disabled |
| Tone | default, category-1, category-2, category-3, category-4, category-5, category-6, category-7, category-8 |
| Size | default, sm |

| Property | Type | Default |
|---|---|---|
| Label | text | Design |
| Show remove | boolean | true |
| Show avatar | boolean | false |
| Show leading icon | boolean | false |
| Leading icon | instance swap | Icon/hash |

Built from: `Avatar`. Icons: hash, x

Tokens and styles:
- Colors: `background/secondary`, `badge/category-1-bg`, `badge/category-1-fg`, `badge/category-2-bg`, `badge/category-2-fg`, `badge/category-3-bg`, `badge/category-3-fg`, `badge/category-4-bg`, `badge/category-4-fg`, `badge/category-5-bg`, `badge/category-5-fg`, `badge/category-6-bg`, `badge/category-6-fg`, `badge/category-7-bg`, `badge/category-7-fg`, `badge/category-8-bg`, `badge/category-8-fg`, `foreground/secondary`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3_5`, `spacing/4`, `spacing/5`, `spacing/6`
- Radius: `radius/sm`
- Text styles: `ui/label-small`

Guides: [select](../../skills/build-ui/components/select.md)

Code: custom on `Badge` + remove `Button` (Chip sizes `h-6 px-2 text-xs` (sm), `h-8 px-3` (default), `h-10 px-4` (lg); Show avatar = shadcn `Avatar className="size-5 -ml-1.5"` (`size-6 -ml-2` on lg); Show count = `<span class="tabular-nums">`; label `min-w-0 truncate`, chip `max-w-80`, tag `max-w-48`; Tag sizes `h-5 px-1.5` (sm), `h-6 px-2`; Tone=category-N uses the Badge category classes)

## People Picker

Component set · 2 variants · default size 360 × 36

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
- Radius: `input/radius`, `radius/md`
- Text styles: `body/small`
- Effects: `shadow/md`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger (Server search by name, email, team; debounce 200 ms)

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
| Description | text | Finance manager · ana.popescu@acme.com |
| Show description | boolean | true |

Built from: `Avatar`, `Checkbox`

Tokens and styles:
- Colors: `background/accent`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Popover` + `Command` with `Avatar` rows; chips in the trigger (Server search by name, email, team; debounce 200 ms)

## Transfer List

Component · 1 variant · default size 628 × 291

Move items between two lists (permissions to a role, columns to a view, members to a group): each side has a count, search and checkboxes; arrows move the checked items. Keyboard: Space checks, the buttons move. For under ~10 items a list of checkboxes is simpler.


Needs at least 512 (each list 208 or more); in narrower places use a searchable list with checkboxes.

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
- Resize: both lists fill equally and never go under 208; list titles truncate to 1 line
- Needs at least 512; in narrower places use a searchable list with checkboxes

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

Code: custom (`grid grid-cols-[1fr_auto_1fr] min-w-[512px]`, lists `min-w-52`; titles `truncate`)

## Address Autocomplete

Component · 1 variant · default size 360 × 233

Address field with suggestions as people type (street, number, then city and country on a second line). Pick a suggestion to fill the address fields below it; "Enter the address manually" opens the separate fields. Suggestions after 3 characters; keep what was typed if nothing matches.

**Use for**

- Shipping and billing addresses at checkout
- Company and customer addresses
- Delivery or meeting places

**Not for**

- Picking from a known list (a warehouse, an office): use Select or Combobox
- Countries or cities only: use Combobox
- Coordinates on a map: use Map

**Anatomy**

1. Field: map-pin icon and Query
2. Suggestions (Show suggestions): map-pin, street and number, then city and country on a second line
3. Manual: "Enter the address manually" link

**Content and behavior**

- Suggestions after 3 characters, with a debounce
- A pick fills the separate fields below (street, city, postal code, country); people can still edit them
- Keep what was typed if nothing matches, and offer manual entry
- "Enter the address manually" opens the separate fields
- Bias suggestions to the country of the account; show at most 5

**Accessibility**

- Combobox pattern: role="combobox", aria-expanded, aria-activedescendant on the input
- Arrow keys move through suggestions, Enter picks, Esc closes and keeps the text
- The number of suggestions is announced politely

| Property | Type | Default |
|---|---|---|
| Query | text | Strada Vic |
| Show suggestions | boolean | true |

Icons: map-pin

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/popover`, `border/default`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `input/radius`, `radius/md`, `radius/sm`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Popover` + `Command` (`shouldFilter={false}`) fed by a places API (Google Places, Mapbox) (Debounce, 3 characters minimum; fills the address Fields)

## Select Option

Component set · 8 variants · default size 280 × 48

A rich option in a Select, Combobox or Menu list: icon or avatar, title and a muted second line (type, place, email), check when selected. Use when the label alone is ambiguous (two customers with the same name) or a picture tells options apart. Same Leading for every option in one list.


Type=create: the last option when the typed text matches nothing and people may add it: plus icon and Create label ("Create label "Urgent"", "Invite anna@acme.com"). Picking it creates the value and selects it.

**Use for**

- Options that share a name (two customers called Northwind)
- Options a picture tells apart: workspaces, integrations, people
- Lists where the type or place helps the choice
- Type=create: the last option when the typed text matches nothing and people may add it (labels, customers, projects, invite by email)

**Not for**

- Short options that are clear by name: use Menu Item
- People with role and email: use Person Option in People Picker
- Choices with a long description: use Option Card

**Anatomy**

1. Type: icon (icon tile, Icon swap), avatar, none, create (plus icon tile and Create label)
2. Title
3. Description (Show description): muted, one line
4. Check (Checked)
5. Create label (Type=create): "Create label "Urgent"", "Invite anna@acme.com"

**Content and behavior**

- Type: icon, avatar, none; the same Type for every option in one list; create is the only exception, always last
- State: default, highlighted
- Description is one short line: type, place, email ("Customer · Berlin")
- Title and description truncate on one line each; the full text shows in a tooltip
- Checked marks the selected option; multi-select lists keep it open while picking
- Create shows only when the query has no exact match; quote the typed text; picking it creates and selects the value

**Accessibility**

- role="option" with aria-selected; the list is a listbox
- Title and description are read together as the option name
- Icons and avatars are decorative (aria-hidden) unless they carry meaning
- The create option is read as "Create label Urgent"; after picking, announce "Label Urgent created"

| Variant property | Values |
|---|---|
| Type | icon, avatar, none, create |
| State | default, highlighted |

| Property | Type | Default |
|---|---|---|
| Title | text | Northwind Traders |
| Description | text | Customer · Berlin |
| Show description | boolean | true |
| Checked | boolean | false |
| Icon | instance swap | Icon/building |
| Create label | text | Create "Urgent" |

Built from: `Avatar`. Icons: building, check, plus

Tokens and styles:
- Colors: `background/accent`, `background/muted`, `foreground/muted`, `foreground/popover`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Radius: `radius/md`, `radius/sm`
- Text styles: `ui/caption`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `CommandItem` / `SelectItem` with `Avatar` or icon, two text lines, check icon (Same Leading for every option in a list)

## Recurrence Picker

Component set · 3 variants · default size 400 × 192

How often something repeats: recurring invoices, reports by email, reminders, meetings. Interval and unit, the days for weekly, the day for monthly, and when it ends (never, on a date, after N times). The summary sentence says the result in words; read it back in confirmations. Time zone of the account unless the field says otherwise.

**Use for**

- Recurring invoices
- Reports sent by email on a schedule
- Reminders and meetings

**Not for**

- One date: use Date Picker
- A fixed set of choices (daily, weekly digest): use Select or Radio
- A time of day only: use Time Picker

**Anatomy**

1. Repeat every: interval Number Input and unit Select (day, week, month)
2. Days (Frequency=weekly): Toggle Group Items M T W T F S S
3. On (Frequency=monthly): Select of the day ("Day 5")
4. Ends: Radios "Never", "On 31 Dec 2026", "After 12 times"
5. Summary (Show summary): "Every week on Monday, Wednesday and Friday, until 31 Dec 2026"

**Content and behavior**

- Frequency: daily, weekly, monthly
- The summary says the result in words; read it back in confirmations and lists
- Weekly needs at least one day; default to the day of the start date
- Monthly on day 29-31 says what happens in shorter months ("last day of the month")
- Time zone of the account unless the field says otherwise

**Accessibility**

- Each part has a label; Ends is a radiogroup
- Day toggles have full names as aria-labels ("Monday") and aria-pressed
- The summary is in a live region (aria-live="polite") so changes are read

| Variant property | Values |
|---|---|
| Frequency | daily, weekly, monthly |

| Property | Type | Default |
|---|---|---|
| Show summary | boolean | true |

Built from: `Number Input`, `Radio`, `Select`, `Toggle Group Item`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/label`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md), [select](../../skills/build-ui/components/select.md)

Code: custom: `Number Input`, `Select`, `ToggleGroup` (multiple), `RadioGroup`; rrule (Summary from `rrule.toText()` or own strings; account time zone)
