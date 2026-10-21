# Pricing

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Price](#price) | 3 | - |
| [Check List Item](#check-list-item) | 2 | - |
| [Pricing Toggle](#pricing-toggle) | 2 | - |
| [Plan Card](#plan-card) | 2 | Features |

On the Figma page: "Stress test / Check List Item", "Stress test / Plan Card", "Stress test / Price", "Stress test / Pricing Toggle"

## Price

Component set · 3 variants · default size 155 × 28

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

## Check List Item

Component set · 2 variants · default size 280 × 20

One feature in a plan or a comparison: check when included, a dash and muted text when not. Lead with the benefit, numbers where they matter ("Up to 5 approvers"). Keep lists to 5-8 items per plan; the full comparison goes in Comparison Table.

**Use for**

- Features of a Plan Card
- What is included on a single-plan page
- Benefits next to a sign-up form or a CTA card

**Not for**

- The full comparison across plans: use Block / Comparison Table
- Tasks people tick off: use Checklist Item
- Benefits with an icon and a description: use Feature Item
- Password or field rules: use Requirement Item

**Anatomy**

1. Icon: check (Included=true) or a dash (Included=false)
2. Label: one feature, muted when not included

**Content and behavior**

- Lead with the benefit; numbers where they matter ("Up to 5 approvers")
- 5-8 items per plan; the full comparison goes in Block / Comparison Table
- Same order of features across the plans of a section
- Long labels wrap under the label, never under the icon
- Show not-included items only when the contrast helps the choice

**Accessibility**

- Code as a <ul>; the icon is aria-hidden
- Not-included items carry visually hidden text ("Not included"), not only the dash
- Muted text still meets 4.5:1

| Variant property | Values |
|---|---|
| Included | true, false |

| Property | Type | Default |
|---|---|---|
| Label | text | Unlimited invoices and customers |

Icons: check, minus

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Code: `<li class="flex gap-2">` with lucide `Check` or `Minus` (Icon `aria-hidden`; sr-only "Not included")

## Pricing Toggle

Component set · 2 variants · default size 226 × 36

Monthly or yearly above plan cards, with what yearly saves. Switching updates every price on the page at once, without a reload. Default to the period most customers buy; the saving is a real number ("Save 20%" or "2 months free").

**Use for**

- A pricing section with monthly and yearly billing
- Plan choice in billing settings
- Above Block / Pricing Calculator

**Not for**

- More than two periods or a currency choice: use Toggle Group or Select
- A setting that turns something on or off: use Switch
- Views of the same data: use View Switcher

**Anatomy**

1. Toggle Group: Monthly, Yearly (Period sets the selected one)
2. Saving Badge (Show saving): "Save 20%"

**Content and behavior**

- Switching updates every price on the page at once, without a reload
- Default to the period most customers buy
- The saving is a real number ("Save 20%" or "2 months free")
- Yearly prices say "billed yearly" next to the Price
- The chosen period carries over to sign-up and checkout (in the URL)

**Accessibility**

- Toggle Group with type="single" and aria-label="Billing period"
- The saving is part of the Yearly item's accessible name or linked with aria-describedby
- After a switch, an aria-live="polite" region says what changed ("Prices per month, billed yearly")

| Variant property | Values |
|---|---|
| Period | monthly, yearly |

| Property | Type | Default |
|---|---|---|
| Show saving | boolean | true |

Built from: `Badge`, `Toggle Group`

Tokens and styles:
- Spacing and size: `spacing/3`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `ToggleGroup type="single"` + `Badge` (Period in state and URL; all prices update without reload)

## Plan Card

Component set · 2 variants · default size 352 × 421

One plan in a pricing section: name, who it is for, Price, the main action, what it adds (Features slot of Check List Items). Featured=true for one recommended plan only, with a primary button. 2-4 plans side by side, same order of features; Enterprise says "Contact sales" instead of a price.

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

1. Plan name
2. Description: who it is for, one sentence
3. Price (exposed)
4. CTA: Button (primary when Featured=true)
5. Separator
6. Features title: "Everything in Starter, plus:"
7. Features slot: Check List Items

**Content and behavior**

- Featured=true on one recommended plan only, with the primary button
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
| Featured | false, true |

| Property | Type | Default |
|---|---|---|
| Plan | text | Business |
| Description | text | For finance teams that approve and report every week. |
| Features title | text | Everything in Starter, plus: |

Slots (fill them in the instance, never detach): `Features`

Built from: `Badge`, `Button`, `Check List Item`, `Price`, `Separator`

Tokens and styles:
- Colors: `background/card`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/5`, `spacing/6`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h4`, `ui/label`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `Card` + `Price`, `Button`, `<ul>` of `Check List Item` (Featured: `ring-2 ring-primary`, primary `Button`)
