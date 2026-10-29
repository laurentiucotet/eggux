# Chip

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chip](#chip) | 159 | - |
| [Chip Group](#chip-group) | 2 | Chips |

On the Figma page: "Example / Chip Group", "Example / Chip styles", "Example / filter chips", "Stress test / Chip", "Stress test / Chip Group"

## Chip

Component set · 159 variants · default size 91 × 32

Chip (pill) for filters, multi-selection and tags. Tone=default: neutral outline, State=selected marks an active filter (check icon when Leading icon is on). Tone=soft-info, soft-success, soft-warning, soft-neutral: tinted tags with the Badge soft tokens. Tone=category-1 to category-8: categorical tags in the chart hues (badge/category-{n}-bg and -fg), for projects, teams and labels with no status meaning. Soft and category tones have states default, hover, focus, disabled; selected stays on Tone=default. Size: default (32), sm (24) for dense filter rows and table toolbars, lg (40) for touch and hero filters. Options: Avatar (Show avatar, exposed Avatar) for people filters, Leading icon, Count (Show count, Count value: "Open 12"), Remove (x; in code a button labelled "Remove <value>"). The label truncates at 320 wide. Group chips with Chip Group. Usage: eggux build-ui/components/badge.md, patterns/search-and-filter.md

**Use for**

- Quick filters above a list ("This week", "Unpaid")
- Multi-select options shown as toggles
- Active filter values that can be cleared with Remove
- Tone=soft-info, soft-success, soft-warning, soft-neutral: tags and categories on cards and records ("Design", "Approved")
- Tone=category-1 to category-8: categories with a fixed color (projects, teams, labels)
- Show avatar: people filters (assignee, owner)
- Show count: filter values with result counts ("Open 12")
- Size=sm in table toolbars and dense filter rows, lg for touch and hero filters

**Not for**

- A status or category that is not clickable: use Badge
- A field filter with several values in a Filter Bar: use Filter Chip
- One choice among a few options: use Toggle Group
- A tone that means a status nobody can change: use Badge Variant=soft-*
- Several chips that wrap or scroll as one control: use Chip Group

**Anatomy**

1. Size: default (32, ui/label, 16 px icons), sm (24, ui/label-small, 14 px icons), lg (40, ui/label)
2. Tone: default, soft-info, soft-success, soft-warning, soft-neutral (badge/soft-*), category-1 to category-8 (badge/category-*)
3. Avatar (Show avatar, exposed Avatar xs, sm on lg): sits 2 to 8 px from the edge, as far as from top and bottom
4. Leading icon (Show leading icon): calendar, or check when selected
5. Label
6. Count value (Show count)
7. Remove x (Show remove)
8. State: default, hover, focus, selected, disabled (soft and category tones: default, hover, focus, disabled)

**Content and behavior**

- Label is one or two words in sentence case
- State=selected marks an active filter; with Show leading icon on, the icon becomes a check
- Selected is shown by the check and fill, not by color alone
- Show "Clear all" when more than one filter is active
- Soft tones are for tags and categories, not for filter state: a selected filter stays Tone=default, State=selected
- Use the tone by meaning (success = done or approved, warning = needs attention, info = type or topic, neutral = other), and keep it the same for the same tag everywhere
- Category tones follow the Badge category order; the same tag keeps the same number everywhere
- One Size per row of chips
- Count is a number only, after the label; no brackets
- Hugs its content up to 320 (maxWidth spacing/80); the label truncates to 1 line with ellipsis, the avatar, icons, count and x never shrink

**Accessibility**

- A selectable chip is a toggle button with aria-pressed
- The remove x is a separate button labelled "Remove <value>"
- Focus state is visible (border/ring)
- Touch targets at least 44 x 44 on mobile
- A count is part of the accessible name ("Open, 12 results")

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected, disabled |
| Tone | default, soft-info, soft-success, soft-warning, soft-neutral, category-1, category-2, category-3, category-4, category-5, category-6, category-7, category-8 |
| Size | default, sm, lg |

| Property | Type | Default |
|---|---|---|
| Label | text | This week |
| Show leading icon | boolean | false |
| Show remove | boolean | false |
| Show avatar | boolean | false |
| Show count | boolean | false |
| Count value | text | 12 |

Built from: `Avatar`. Icons: calendar, check, x

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `badge/category-1-bg`, `badge/category-1-fg`, `badge/category-2-bg`, `badge/category-2-fg`, `badge/category-3-bg`, `badge/category-3-fg`, `badge/category-4-bg`, `badge/category-4-fg`, `badge/category-5-bg`, `badge/category-5-fg`, `badge/category-6-bg`, `badge/category-6-fg`, `badge/category-7-bg`, `badge/category-7-fg`, `badge/category-8-bg`, `badge/category-8-fg`, `badge/soft-info-bg`, `badge/soft-info-fg`, `badge/soft-neutral-bg`, `badge/soft-neutral-fg`, `badge/soft-success-bg`, `badge/soft-success-fg`, `badge/soft-warning-bg`, `badge/soft-warning-fg`, `border/input`, `foreground/accent`, `foreground/default`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/3_5`, `spacing/4`, `spacing/5`, `spacing/6`, `spacing/8`
- Radius: `radius/full`
- Text styles: `ui/label`, `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md)

Code: custom on `Badge` + remove `Button` (Chip sizes `h-6 px-2 text-xs` (sm), `h-8 px-3` (default), `h-10 px-4` (lg); Show avatar = shadcn `Avatar className="size-5 -ml-1.5"` (`size-6 -ml-2` on lg); Show count = `<span class="tabular-nums">`; label `min-w-0 truncate`, chip `max-w-80`, tag `max-w-48`; Tag sizes `h-5 px-1.5` (sm), `h-6 px-2`; Tone=category-N uses the Badge category classes)

## Chip Group

Component set · 2 variants · default size 480 × 72

A set of Chips that wraps or scrolls, with a "+N more" Chip at the end. Layout=wrap (default): chips wrap to more lines, +N stays at the end of the first row; Layout=scroll: one line that scrolls sideways, chips past the edge are cut so people see there is more. Chips (native slot): Chip instances, all the same Size and the same Tone family. Show more + exposed more Chip: "+3 more" opens a Popover with the rest or expands the group. Selection: single select (one State=selected, like a radio group) or multi select (several selected, toggle buttons); say which in the label above. Fills its container; min width 160. Usage: eggux build-ui/components/badge.md, patterns/search-and-filter.md

**Use for**

- Filter rows above a list or feed (Activity Feed, Case Study Grid industries)
- Scopes or reasons to pick (AI Search Answer scopes, Response Feedback reasons, Write a Review highlights)
- Layout=scroll on mobile and in narrow headers (Header Topic subtopics)

**Not for**

- Tags that are not clickable: use Badge List
- One choice among 2 to 5 options in a toolbar: use Toggle Group
- Many filters on different fields: use Filter Bar

**Anatomy**

1. Layout: wrap (default) or scroll
2. Chips (native slot): Chip instances
3. More (Show more, exposed Chip): "+3 more" at the end of the first row
4. viewport (Layout=scroll): crops the row so the last chip is cut at the edge

**Content and behavior**

- Chips in a group share one Size and one Tone family
- Single select: exactly one State=selected (radio behavior); multi select: any number selected (toggle buttons); the label above says which
- Show 4 to 8 chips, then +N that opens a Popover with the rest or expands the group
- Order chips by frequency or a natural order, never alphabetically when one option is the default (All first)
- Fills its container (min width 160); Layout=wrap drops chips to the next line with 8 px row gap, Layout=scroll keeps one line and scrolls sideways

**Accessibility**

- Single select: role="radiogroup" with radio chips; multi select: a group (role="group" with aria-label) of toggle buttons with aria-pressed
- Arrow keys move between chips in a radiogroup; Tab moves in and out
- +N is a button whose label names what it opens ("Show 3 more industries")
- Layout=scroll: the row scrolls with the keyboard when a chip gets focus

| Variant property | Values |
|---|---|
| Layout | wrap, scroll |

| Property | Type | Default |
|---|---|---|
| Show more | boolean | true |

Slots (fill them in the instance, never detach): `Chips`

Built from: `Chip`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [badge](../../skills/build-ui/components/badge.md)

Code: `div role="group"` with `flex flex-wrap gap-2` (wrap) or shadcn `ScrollArea` + `flex w-max gap-2` (scroll); shadcn `ToggleGroup type="single" \ ("multiple"` for selection)
