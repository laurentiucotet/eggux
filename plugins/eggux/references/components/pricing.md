# Pricing

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Price](#price) | 4 | - |
| [Plan Card](#plan-card) | 4 | Features |
| [Comparison Table](#comparison-table) | 2 | - |

On the Figma page: "Example / Plan Card styles", "Example / Price styles", "Example / in pricing with comparison", "Stress test / Comparison Table", "Stress test / Plan Card", "Stress test / Price"

## Price

Component set · 4 variants · default size 174 × 36

A price as people compare it: amount with currency, period, and the old price struck through during a discount. Size=sm in Product Cards and Line Items, default in Plan Cards, lg on a single-plan pricing page, xl (display/lg, 60) as the display price of a pricing hero or a single-offer section, once per page. Prices compared side by side use the same Size. Usage: eggux build-ui/patterns/marketing-pages.md, patterns/commerce.md

**Use for**

- Plan Card prices (Size=default)
- Product Card and Line Item prices (Size=sm)
- A single-plan pricing page (Size=lg)
- Pricing heroes and single-offer landing pages (Size=xl)
- Add-ons and one-time fees in a list

**Not for**

- Totals, taxes and discounts in a breakdown: use Summary Row
- A key number that is not a price: use Figure or Stat Card
- A price people type: use Currency Input

**Anatomy**

1. Old price (Show old price): struck through, muted (body/default in xl)
2. Amount: with the currency symbol, the largest text (display/lg, 60, in xl)
3. Period (Show period): muted, "per seat / month", "one-time" (body/default in xl)
4. Size: sm, default, lg, xl

**Content and behavior**

- Amounts in the locale format of the market (€29, €1,290)
- Period names the unit and the interval; yearly prices shown per month say "billed yearly"
- Say whether VAT is included near the price
- Old price only during a real discount, with the end date nearby
- Prices compared side by side use the same Size
- Size=xl once per page, in a hero or a single-offer section; comparisons use default

**Accessibility**

- The old price is announced as such ("Was €35, now €29"): <s> alone is not read by most screen readers
- Amount and period read as one phrase ("€29 per seat per month")
- The muted period and old price meet 4.5:1

| Variant property | Values |
|---|---|
| Size | sm, default, lg, xl |

| Property | Type | Default |
|---|---|---|
| Amount | text | €29 |
| Old price | text | €35 |
| Period | text | per seat / month |
| Show old price | boolean | false |
| Show period | boolean | true |

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `body/default`, `body/small`, `display`, `display/lg`, `heading/h2`, `heading/h4`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom: amount, `<s>` old price and period (`text-muted-foreground`) (`Intl.NumberFormat` with currency; sr-only "Was ... now ...")

## Plan Card

Component set · 4 variants · default size 352 × 421

One plan in a pricing section: name, who it is for, Price, the main action, what it adds (Features slot of Check Items). Variant: default for most plans; featured (primary border, shadow and primary button) for one recommended plan on a light section; inverted (foreground/default surface, background/default text, secondary button) for the recommended plan when the page needs more contrast than a border, it flips to a light card in Dark; compact (one row: name and description, Price, action; Features hidden) for 4+ plans, add-ons and seat packs in a list. One featured or inverted plan per section, never both. 2-4 plans side by side, same order of features; Enterprise says "Contact sales" instead of a price. Content placed in the Features slot of an inverted card must use inverted colors (Check Items are recolored in the default content).


Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Block / Pricing with 2-4 plans side by side
- Plan choice in billing settings and upgrade dialogs
- One recommended plan next to a short comparison
- Variant=inverted: the recommended plan when a border is not enough (dark pricing sections stay default)
- Variant=compact: 4+ plans, add-ons, seat packs or credits in a list

**Not for**

- The detailed feature comparison: use Block / Comparison Table
- A single plan with its own page: use Block / Pricing Single
- A choice inside a form: use Option Card
- Current plan usage in settings: use Usage Meter

**Anatomy**

1. Variant: default, featured, inverted, compact
2. Title
3. Description: who it is for, one sentence
4. Price (exposed)
5. CTA: Button (outline in default and compact, primary in featured, secondary in inverted)
6. Separator (not in compact)
7. Features title (Show features title): "Everything in Starter, plus:" (not in compact)
8. Features slot: Check Items (hidden in compact)
9. Inverted: foreground/default surface, background/default text, description and Check Items at opacity/70 or background/default
10. Compact: one row, 720 wide: name and description (fill), Price, CTA; padding spacing/4 x spacing/6

**Content and behavior**

- One recommended plan only: Variant=featured or Variant=inverted, never both on a page
- featured on light sections with the primary button; inverted keeps the secondary button (primary is under 3:1 on the inverted surface in Corporate)
- 2-4 plans, cheapest first, the same order of features
- Variant=compact for 4 or more options or add-ons, stacked in a list with the same width; link to the comparison table for features
- Enterprise says "Contact sales" instead of a price
- CTA labels match across the page ("Start free trial"); one primary per section
- Features title says what the plan adds to the one before
- Cards in a row share height; buttons and prices align
- Check Items placed in an inverted card's Features slot use background/default text and icon

**Accessibility**

- The plan name is a heading one level below the section title
- The CTA names the plan ("Start free trial, Business plan") with aria-label or aria-describedby
- The recommended plan says it in text, not only with the border
- Inverted text 19.8:1 Light, 19.0:1 Dark, 17.9:1 Corporate Light; it flips to a near-white card in Dark

| Variant property | Values |
|---|---|
| Variant | default, featured, inverted, compact |

| Property | Type | Default |
|---|---|---|
| Title | text | Business |
| Description | text | For finance teams that approve and report every week. |
| Features title | text | Everything in Starter, plus: |
| Show features title | boolean | true |

Slots (fill them in the instance, never detach): `Features`

Built from: `Badge`, `Button`, `Check Item`, `Price`, `Separator`

Tokens and styles:
- Colors: `background/card`, `background/default`, `background/primary`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0`, `spacing/1_5`, `spacing/2`, `spacing/4`, `spacing/5`, `spacing/6`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h4`, `ui/label`
- Effects: `shadow/lg`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `Card` + `Price`, `Button`, `<ul>` of `Check Item` (Variant=featured: `ring-2 ring-primary`, primary `Button`)

## Comparison Table

Component set · 2 variants · default size 1152 × 748

Plan comparison table for pricing pages: a header row per plan (name, Price, action) and feature rows grouped under section labels, with Table Cell Check marks or short values. Use Plans=3 or Plans=4 to match the plan cards above it; edit labels and values in place, and hide rows you do not need.


Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Under the plan cards in Block / Pricing with Comparison (Plans=4)
- Block / Comparison Table on its own pricing or plans page (Plans=3)
- Any page that compares 3 or 4 plans feature by feature

**Not for**

- Choosing a plan at a glance: use Plan Card
- Comparing products or records with many columns: use Table
- One plan with what is included: use Block / Pricing Single

**Anatomy**

1. Plans: 3 (label column 432, plan columns 240), 4 (label column 352, plan columns 200)
2. Header row: plan name (with an optional Badge), Price sm and a sm Button per plan
3. Section rows: an overline label ("Core", "Collaboration", "Security")
4. Feature rows: label and one Table Cell Check per plan (check, dash or a short value)
5. Rows divided by border/default

**Content and behavior**

- Plans matches the number of plan cards above it, in the same order
- Same feature order and wording as the plan cards
- Use a check or a dash for yes and no; a short value ("100 GB", "Unlimited") when it differs
- Hide rows you do not need; keep at least one row per section
- One primary button in the header: the recommended plan

**Accessibility**

- Code it as a <table> with plan names as column headers (scope="col") and feature labels as row headers (scope="row")
- Check and dash cells have text for screen readers ("Included", "Not included")
- Section labels are row headers that span the table

| Variant property | Values |
|---|---|
| Plans | 3, 4 |

Built from: `Badge`, `Button`, `Price`, `Table Cell Check`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `layout/container/6xl`, `spacing/2`, `spacing/4`, `spacing/60`
- Text styles: `body/small`, `ui/label`, `ui/overline`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<table>` with shadcn `Table` parts; header cells with `Price` (sm) and `Button` (sm); cells with lucide `Check` / `Minus` and `sr-only` text (Plans=3 or 4 columns; used by `Block / Comparison Table` (3) and `Block / Pricing with Comparison` (4))
