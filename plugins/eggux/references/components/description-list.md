# Description List

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Description List Item](#description-list-item) | 2 | Value |
| [Meta Item](#meta-item) | 1 | - |
| [Figure](#figure) | 4 | - |

On the Figma page: "Example / event facts", "Example / in billing", "Example / report figures", "Stress test / Description List Item", "Stress test / Figure", "Stress test / Meta Item"

## Description List Item

Component set · 2 variants · default size 560 × 45

Label-value pair for record details (shadcn has no component; dl/dt/dd in code). Horizontal in cards and sheets, vertical in narrow columns and grids. Divider off on the last row. Empty value: "-" or "Not set" in muted, never blank.

**Use for**

- Details card on a record page
- Details of one object in a Sheet
- What is requested in an approval
- Orientation=vertical in narrow columns and grids of 2-3

**Not for**

- Editable fields: use Field with Input, or Inline Edit for single rows
- Many objects compared side by side: use a Table
- History of events: use Timeline Item

**Anatomy**

1. Label: a short noun in sentence case
2. Value slot: text, Badge, Avatar + name, or a link
3. Divider (off on the last row)

**Content and behavior**

- Horizontal (label column 160) in cards and sheets; vertical in narrow columns
- Empty value: "-" or "Not set" in muted, never blank
- Values never repeat the label; long values wrap
- One Edit action per card, not a pencil per row
- Fill the Value slot in the instance; never detach

**Accessibility**

- Code as dl with dt and dd, so each label is read with its value
- Statuses in the Value slot are Badges with text, not color alone
- Muted empty values still keep 4.5:1

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |

| Property | Type | Default |
|---|---|---|
| Label | text | Phone |
| Divider | boolean | true |

Slots (fill them in the instance, never detach): `Value`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/40`
- Text styles: `body/small`, `ui/label`

Guides: [description-list](../../skills/build-ui/components/description-list.md)

## Meta Item

Component · 1 variant · default size 229 × 20

One fact with an icon: date and time, place, people, length, size, contact. Use in headers, cards and list rows; line up several in a row (gap 24) or a column (gap 8). Text is body/small, muted; the icon says the kind of fact, never decoration. Links: put the Meta Item in a link, the label stays the same color.

**Use for**

- Event, article and product facts in headers and cards
- Contact lines in a Person Card
- A row of 2-4 facts under a title

**Not for**

- Label and value pairs in a details panel: use Description List Item
- Status: use Badge
- A number that matters on its own: use Figure

**Anatomy**

1. Icon (Icon swap, Show icon), 16 px, muted
2. Label, body/small, muted

**Content and behavior**

- The icon says the kind of fact (calendar, clock, map-pin, users, mail); never decoration
- Same icon for the same kind of fact across the product
- In a row gap 24, in a column gap 8; 4 items at most
- Dates with time zone, places with the city
- A link keeps the label color; underline on hover

**Accessibility**

- The icon is decorative (aria-hidden); the label carries the meaning
- Text meets 4.5:1 on its background
- A fact that is a link has a link role and a clear name

| Property | Type | Default |
|---|---|---|
| Label | text | 12 Nov 2026 · 15:00-16:00 CET |
| Icon | instance swap | Icon/calendar |
| Show icon | boolean | true |

Icons: calendar

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/1_5`
- Text styles: `body/small`

## Figure

Component set · 4 variants · default size 240 × 56

A number with what it counts: stacked (value over label, optional source and divider) for report headers, dashboards without trends and key facts; inline (value then label on one baseline) for counts in a profile or header ("42 articles"). Every figure has a label that reads on its own; add the source when the number is a claim. A metric compared to a period goes in Stat Card.

**Use for**

- Headline figures in a report or study header
- Key facts without a comparison period
- Counts in a profile or topic header ("42 articles")

**Not for**

- A metric compared to a period: use Stat Card
- A goal against a target: use Progress Card
- Label and value details: use Description List Item

**Anatomy**

1. Value: heading/h3 (stacked) or h4 (inline); lg one step larger
2. Label: body/small, muted
3. Source (stacked, Show source)
4. Divider (stacked)

**Content and behavior**

- Layout=stacked for 2-4 headline figures; inline for counts in a line
- The label reads on its own ("average time to get paid", not "time")
- Add the source when the figure is a claim; one source line under a group is enough
- Numbers in the locale format with units (€18,500, 47 days, 62%)
- No trend arrows or colors here: that is Stat Card

**Accessibility**

- Value and label are read together as one phrase
- Do not round in a way that changes the meaning; the exact value in a tooltip when rounded

| Variant property | Values |
|---|---|
| Layout | stacked, inline |
| Size | default, lg |

| Property | Type | Default |
|---|---|---|
| Value | text | 47 days |
| Label | text | average time to get paid |
| Source | text | Acme survey, September 2026 |
| Show source | boolean | false |
| Divider | boolean | false |

Built from: `Separator`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0`, `spacing/1`, `spacing/1_5`
- Text styles: `body/small`, `heading/h2`, `heading/h3`, `heading/h4`, `ui/caption`
