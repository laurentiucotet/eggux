# Pricing

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Price](#price) | 3 | - |
| [Plan Card](#plan-card) | 2 | Features |

On the Figma page: "Stress test / Plan Card", "Stress test / Price"

## Price

Component set · 3 variants · default size 174 × 36

A price as people compare it: amount with currency, period (per seat / month, one-time), the old price struck through during a discount. sm in cards and lists, default in plan cards, lg on a single-plan page. Say whether VAT is included near it. Amounts in the locale format.

**Use for**

- Plan Card prices (Size=default)
- Product Card and Line Item prices (Size=sm)
- A single-plan pricing page (Size=lg)
- Add-ons and one-time fees in a list

**Not for**

- Totals, taxes and discounts in a breakdown: use Summary Row
- A key number that is not a price: use Figure or Stat Card
- A price people type: use Currency Input

**Anatomy**

1. Old price (Show old price): struck through, muted
2. Amount: with the currency symbol, the largest text
3. Period (Show period): muted, "per seat / month", "one-time"
4. Size: sm, default, lg

**Content and behavior**

- Amounts in the locale format of the market (€29, €1,290)
- Period names the unit and the interval; yearly prices shown per month say "billed yearly"
- Say whether VAT is included near the price
- Old price only during a real discount, with the end date nearby
- Prices compared side by side use the same Size

**Accessibility**

- The old price is announced as such ("Was €35, now €29"): <s> alone is not read by most screen readers
- Amount and period read as one phrase ("€29 per seat per month")
- The muted period and old price meet 4.5:1

| Variant property | Values |
|---|---|
| Size | sm, default, lg |

| Property | Type | Default |
|---|---|---|
| Amount | text | €29 |
| Old price | text | €35 |
| Period | text | per seat / month |
| Show old price | boolean | false |
| Show period | boolean | true |

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`
- Text styles: `body/small`, `display`, `heading/h2`, `heading/h4`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom: amount, `<s>` old price and period (`text-muted-foreground`) (`Intl.NumberFormat` with currency; sr-only "Was ... now ...")

## Plan Card

Component set · 2 variants · default size 352 × 421

One plan in a pricing section: name, who it is for, Price, the main action, what it adds (Features slot of Check Items). Variant=featured for one recommended plan only, with a primary button. 2-4 plans side by side, same order of features; Enterprise says "Contact sales" instead of a price.

**Use for**

- Block / Pricing with 2-4 plans side by side
- Plan choice in billing settings and upgrade dialogs
- One recommended plan next to a short comparison

**Not for**

- The detailed feature comparison: use Block / Comparison Table
- A single plan with its own page: use Block / Pricing Single
- A choice inside a form: use Option Card
- Current plan usage in settings: use Usage Meter

**Anatomy**

1. Title
2. Description: who it is for, one sentence
3. Price (exposed)
4. CTA: Button (primary when Variant=featured)
5. Separator
6. Features title (Show features title): "Everything in Starter, plus:"
7. Features slot: Check Items

**Content and behavior**

- Variant=featured on one recommended plan only, with the primary button
- 2-4 plans, cheapest first, the same order of features
- Enterprise says "Contact sales" instead of a price
- CTA labels match across the page ("Start free trial"); one primary per section
- Features title says what the plan adds to the one before
- Cards in a row share height; buttons and prices align

**Accessibility**

- The plan name is a heading one level below the section title
- The CTA names the plan ("Start free trial, Business plan") with aria-label or aria-describedby
- The recommended plan says it in text, not only with the border

| Variant property | Values |
|---|---|
| Variant | default, featured |

| Property | Type | Default |
|---|---|---|
| Title | text | Business |
| Description | text | For finance teams that approve and report every week. |
| Features title | text | Everything in Starter, plus: |
| Show features title | boolean | true |

Slots (fill them in the instance, never detach): `Features`

Built from: `Badge`, `Button`, `Check Item`, `Price`, `Separator`

Tokens and styles:
- Colors: `background/card`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/5`, `spacing/6`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h4`, `ui/label`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `Card` + `Price`, `Button`, `<ul>` of `Check Item` (Variant=featured: `ring-2 ring-primary`, primary `Button`)
