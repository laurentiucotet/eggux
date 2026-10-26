# Description List

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Description List Item](#description-list-item) | 2 | Value |
| [Meta Item](#meta-item) | 1 | - |
| [Figure](#figure) | 8 | - |
| [Summary Row](#summary-row) | 3 | - |

On the Figma page: "Example / event facts", "Example / in billing", "Example / invoice totals", "Example / report figures", "Stress test / Description List Item", "Stress test / Figure", "Stress test / Meta Item", "Stress test / Summary Row"

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
- Many objects compared side by side: use a table of Table Cells
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
| Show divider | boolean | true |

Slots (fill them in the instance, never detach): `Value`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/40`
- Text styles: `body/small`, `ui/label`

Guides: [description-list](../../skills/build-ui/components/description-list.md)

Code: custom `dl` with `dt` / `dd` and a Tailwind grid; custom `ol` (No shadcn component)

## Meta Item

Component · 1 variant · default size 225 × 20

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

Guides: [description-list](../../skills/build-ui/components/description-list.md)

Code: custom: icon + text (`text-sm text-muted-foreground`); `dl` with value and label (Figure has no trend; that is Stat Card)

## Figure

Component set · 8 variants · default size 240 × 56

A number with what it counts: stacked (value over label, optional source and divider) for report headers, dashboards without trends and key facts; inline (value then label on one baseline) for counts in a profile or header ("42 articles"). Every figure has a label that reads on its own; add the source when the number is a claim. A metric compared to a period goes in Stat Card. Tone=on-primary sets value, label and source in foreground/primary for primary bands (Stats Brand Band), so no color overrides are needed.

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
5. Tone: default, on-primary (value, label and source in foreground/primary)

**Content and behavior**

- Layout=stacked for 2-4 headline figures; inline for counts in a line
- The label reads on its own ("average time to get paid", not "time")
- Add the source when the figure is a claim; one source line under a group is enough
- Numbers in the locale format with units (€18,500, 47 days, 62%)
- No trend arrows or colors here: that is Stat Card
- Tone=on-primary on primary bands (Block / Stats Brand Band); keep text alignment as the only override

**Accessibility**

- Value and label are read together as one phrase
- Do not round in a way that changes the meaning; the exact value in a tooltip when rounded
- Tone=on-primary text is 5.2:1 Light and Dark, 6.7:1 Corporate Light on background/primary

| Variant property | Values |
|---|---|
| Layout | stacked, inline |
| Size | default, lg |
| Tone | default, on-primary |

| Property | Type | Default |
|---|---|---|
| Value | text | 47 days |
| Label | text | average time to get paid |
| Source | text | Acme survey, September 2026 |
| Show source | boolean | false |
| Show divider | boolean | false |

Built from: `Separator`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/0`, `spacing/1`, `spacing/1_5`
- Text styles: `body/small`, `heading/h2`, `heading/h3`, `heading/h4`, `ui/caption`

Guides: [description-list](../../skills/build-ui/components/description-list.md)

Code: custom: icon + text (`text-sm text-muted-foreground`); `dl` with value and label (Figure has no trend; that is Stat Card)

## Summary Row

Component set · 3 variants · default size 336 × 20

One line of a money breakdown: label left, amount right (order summary, invoice totals, price calculator, plan cost). default for lines, discount for reductions (amount in success, with a minus sign), total for the last line (put a Separator above it). Amounts align right with the same number format and currency in every row. Record details that are not amounts use Description List Item.

**Use for**

- Order and cart summaries
- Invoice and quote totals
- Price calculators and plan cost
- Tiers of a volume price

**Not for**

- Record details that are not amounts: use Description List Item
- Many rows compared side by side: use a table of Table Cells
- A single key number: use Figure or Stat Card

**Anatomy**

1. Label: body/small, muted (total: ui/label)
2. Value: body/small, right aligned (total: heading/h4)
3. Variant: default, discount (value in success), total

**Content and behavior**

- Same currency and number format in every row
- Discounts carry a minus sign (−€62.50)
- Total is the last row, with a Separator above
- Labels say what is included (VAT 19%, included)

**Accessibility**

- Code as a description list (dt, dd) or a table
- The discount color is never the only cue: keep the minus sign
- The total is announced with its label

| Variant property | Values |
|---|---|
| Variant | default, discount, total |

| Property | Type | Default |
|---|---|---|
| Label | text | Subtotal |
| Value | text | €95.00 |

Tokens and styles:
- Colors: `background/success`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/4`
- Text styles: `body/small`, `heading/h4`, `ui/label`

Guides: [description-list](../../skills/build-ui/components/description-list.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: `<dl>` row, `flex justify-between`, `tabular-nums` (Discount keeps the minus sign; Separator above the total)
