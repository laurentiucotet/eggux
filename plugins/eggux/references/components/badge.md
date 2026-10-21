# Badge

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Badge](#badge) | 14 | - |
| [Badge Count](#badge-count) | 4 | - |
| [Status Dot](#status-dot) | 5 | - |
| [Tag List](#tag-list) | 1 | Tags |

On the Figma page: "Example / dataset header", "Example / filter panel", "Example / in announcement banner", "Example / in conversation", "Example / in filtered list", "Stress test / Badge", "Stress test / Badge Count", "Stress test / Status Dot", "Stress test / Tag List"

## Badge

Component set · 14 variants · default size 53 × 20

shadcn Badge plus EGG status variants. Shape: rounded (default) or pill. Options: Icon, Dot (status dot), Count (number after the label). Text carries the meaning; map each status to one variant. Usage: eggux build-ui/components/badge.md

**Use for**

- Status of an object (Paid, Overdue, Draft) next to its name
- Category of an item
- A count after a label (Count on: "Invoices 12")

**Not for**

- Filters and selections: use Chip
- A number alone on an icon or sidebar item: use Badge Count
- State of a system or person in text flow: use Status Dot

**Anatomy**

1. Icon or Dot (optional)
2. Label
3. Count value (Count)

**Content and behavior**

- Text carries the meaning; color only reinforces it
- One or two words, sentence case
- Map each status to one Variant once and reuse it; a status never appears in two colors
- Neutral: secondary or outline; done: success; pending: warning; failed: destructive; new: info
- Not clickable
- Next to the primary information of a row, never instead of it

**Accessibility**

- Label meets 4.5:1 on every Variant; warning uses dark text
- Never a color or dot alone
- Not focusable: it is static text

| Variant property | Values |
|---|---|
| Variant | default, secondary, destructive, outline, success, warning, info |
| Shape | rounded, pill |

| Property | Type | Default |
|---|---|---|
| Label | text | Badge |
| Icon | boolean | false |
| Icon type | instance swap | Icon/check |
| Dot | boolean | false |
| Count | boolean | false |
| Count value | text | 3 |

Icons: check

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/primary`, `background/secondary`, `background/success`, `background/warning`, `border/default`, `foreground/default`, `foreground/destructive`, `foreground/info`, `foreground/primary`, `foreground/secondary`, `foreground/success`, `foreground/warning`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/full`, `radius/md`
- Text styles: `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md), [card](../../skills/build-ui/components/card.md), [indicators](../../skills/build-ui/components/indicators.md), [table](../../skills/build-ui/components/table.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Badge` (+ success, warning, info variants) (Status Dot: custom span + label)

## Badge Count

Component set · 4 variants · default size 20 × 20

Numeric counter (notifications, unread, items in a nav entry). Use "99+" above 99. Place on an icon button corner or at the end of a sidebar item.

**Use for**

- Corner of an icon button, such as the notifications bell
- End of a sidebar item
- Meta of an Accordion Item: active filters in that group

**Not for**

- A count after a text label: use Badge with Count
- A status word: use Badge

**Anatomy**

1. Count: digits only, "99+" above 99
2. Round container colored by Variant: default, secondary, destructive, outline
3. Position: icon button corner or the end of a sidebar item

**Content and behavior**

- Above 99 show "99+"
- Only for something the user must act on (unread, pending); never decorative
- Numbers only; words belong in a Badge

**Accessibility**

- The count is part of the accessible name ("Notifications, 3 unread")
- Count changes that matter are announced politely
- Text meets 4.5:1 on every Variant

| Variant property | Values |
|---|---|
| Variant | default, secondary, destructive, outline |

| Property | Type | Default |
|---|---|---|
| Count | text | 3 |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/default`, `foreground/default`, `foreground/destructive`, `foreground/primary`, `foreground/secondary`
- Spacing and size: `spacing/1_5`, `spacing/5`
- Radius: `radius/full`
- Text styles: `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md), [drawer](../../skills/build-ui/components/drawer.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: shadcn `Badge` (+ success, warning, info variants) (Status Dot: custom span + label)

## Status Dot

Component set · 5 variants · default size 58 × 20

State of a system, service or person in text flow and tables (Online, Down, Syncing). Always with a label; dot alone only where the label is right next to it (avatar status). For a label inside a pill use Badge with Dot.

**Use for**

- Online, Degraded, Down, Syncing, Offline in text flow and tables
- Presence next to an Avatar (dot alone)
- Integration and sync status in settings

**Not for**

- A label inside a pill: use Badge with Dot
- Status of an object (Paid, Overdue): use Badge

**Anatomy**

1. Dot colored by Status: success, warning, error, info, neutral
2. Label (Show label)
3. Inline placement in text flow or a table cell

**Content and behavior**

- Always with a label; color is never the only signal
- Dot alone only right next to its label, as in avatar status
- Each state maps to one Status value

**Accessibility**

- The Label is real text; the dot is aria-hidden
- A dot alone has a text equivalent for screen readers
- The dot meets 3:1 against its background

| Variant property | Values |
|---|---|
| Status | success, warning, error, info, neutral |

| Property | Type | Default |
|---|---|---|
| Label | text | Online |
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/success`, `background/warning`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [indicators](../../skills/build-ui/components/indicators.md)

Code: shadcn `Badge` (+ success, warning, info variants) (Status Dot: custom span + label)

## Tag List

Component · 1 variant · default size 244 × 22

A few tags or labels on one line with "+N" for the rest: category, status, region, format. Badges go in the Tags slot (outline for neutral labels, a status Variant only when it means something); the +N Badge opens the full list in a Tooltip or Popover. Show 2-4, keep labels to one or two words. Filters people remove use Chip; a single status uses Badge or Status Dot.

**Use for**

- Category, format and region of a dataset, an article or a job
- Labels under a page title
- Tags in a card or a table row with limited space

**Not for**

- Filters people remove: use Chip
- One status: use Badge or Status Dot
- Choosing tags: use a multi Select or a Combobox

**Anatomy**

1. Tags slot: Badges (outline for neutral labels)
2. +N Badge (Show more, exposed): secondary, opens the full list

**Content and behavior**

- Show 2-4 tags, then +N
- One or two words per tag, sentence case
- Status colors only when the tag means a status
- Same order everywhere (type, frequency, region)

**Accessibility**

- Code as a list (ul) with a label ("Tags")
- +N is a button that names the hidden tags in its Tooltip or Popover
- Tags that link to a listing are links, not buttons

| Property | Type | Default |
|---|---|---|
| Show more | boolean | true |

Slots (fill them in the instance, never detach): `Tags`

Built from: `Badge`

Tokens and styles:
- Spacing and size: `spacing/1_5`
