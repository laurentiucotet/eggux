# Pricing

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Price](#price) | 4 | - |
| [Plan Card](#plan-card) | 4 | Features |
| [Comparison Table](#comparison-table) | 2 | - |
| [Plan Option Row](#plan-option-row) | 2 | - |
| [Meter Banner](#meter-banner) | 3 | - |
| [Paywall Card](#paywall-card) | 3 | Benefits, Plans |
| [Lock Badge](#lock-badge) | 4 | - |
| [Gate Overlay](#gate-overlay) | 2 | Preview |
| [Usage Limit Banner](#usage-limit-banner) | 4 | - |
| [Trial Banner](#trial-banner) | 3 | - |
| [Upsell Card](#upsell-card) | 1 | - |

On the Figma page: "Example / Plan Card styles", "Example / Price styles", "Example / in article paywall", "Example / in feature gate", "Example / in mobile paywall", "Example / in pricing with comparison", "Example / paywall parts at widths", "Stress test / Comparison Table", "Stress test / Gate Overlay", "Stress test / Lock Badge", "Stress test / Meter Banner", "Stress test / Paywall Card", "Stress test / Plan Card", "Stress test / Plan Option Row", "Stress test / Price", "Stress test / Trial Banner", "Stress test / Upsell Card", "Stress test / Usage Limit Banner"

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
- Resize: the amount never wraps or truncates; the period fills what is left and truncates to 1 line. Give the Price at least the amount's width

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

Code: custom flex row (Amount `whitespace-nowrap shrink-0`; period `min-w-0 truncate`)

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
- Resize: the features title wraps to 2 lines with an ellipsis; Price and the features keep their width

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

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: shadcn `Card` + `Price`, `Button`, `<ul>` of `Check Item` (Variant=featured: `ring-2 ring-primary`, primary `Button`)

## Comparison Table

Component set · 2 variants · default size 1152 × 748

Plan comparison table for pricing pages: a header row per plan (name, Price, action) and feature rows grouped under section labels, with Table Cell Check marks or short values. Use Plans=3 or Plans=4 to match the plan cards above it; edit labels and values in place, and hide rows you do not need.


Needs at least 768 wide (Plans=3) or 1024 (Plans=4); plan columns never go under 192. Below that, stack Plan Cards.


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

1. Plans: 3 (label column 432, plan columns 240), 4 (label column 352, plan columns 200); all columns FILL in that proportion with a 192 minimum (label 256 with 4 plans)
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
- Resize: label and plan columns fill in proportion (432/240, or 352/200 with 4 plans); plan columns never go under 192, the label column under 192 (256 with 4 plans) and feature labels wrap
- Needs at least 768 (Plans=3) or 1024 (Plans=4); below that, stack Plan Cards

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
- Spacing and size: `layout/container/6xl`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/label`, `ui/overline`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<table>` with shadcn `Table` parts, wrapped in `min-w-[768px]` (Plans=3) or `min-w-[1024px]` (Plans=4) (Plan columns `min-w-48`; feature labels wrap; below `md` render stacked Plan Cards instead (`hidden md:table` / `md:hidden`))

## Plan Option Row

Component set · 2 variants · default size 358 × 86

One plan in a mobile or in-app paywall: radio, plan name, the billed price per period, a per-week or per-month equivalent, a saving Badge and the trial line. The whole row is the target.


Two or three rows stacked, FILL width (min 280). Yearly first and selected when it is the better deal; monthly under it.
The billed price ("€59.99 per year") is the main value; the equivalent ("€1.15 per week") is secondary and never larger.
Saving Badge soft-success compares with the other row in the list ("Save 58%"); Show badge off on the base plan.
Trial text says what is free and for how long ("7-day free trial"); turn it off on plans without a trial.
Prices come from the store or the billing provider, in the local currency.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- Block / Mobile Paywall Style=list: yearly and monthly rows
- Paywall Card: the plan choice in the Plans slot
- Any short choice of 2 or 3 billing plans in a sheet or dialog on mobile

**Not for**

- Plans compared side by side on a pricing page: use Plan Card
- A detailed feature comparison: use Comparison Table
- A choice that is not a plan or price: use Option Card

**Anatomy**

1. State: default, selected
2. Radio (follows State)
3. Name: "Yearly"
4. Badge (Show badge, exposed): soft-success pill "Save 58%"
5. Trial text (Show trial text): "7-day free trial"
6. Price: the billed amount and period, "€59.99 per year"
7. Equivalent (Show equivalent): "€1.15 per week" or "€4.17 per month"

**Content and behavior**

- Stack 2 or 3 rows with spacing/3; the better deal first and selected (State=selected), the base plan under it
- The billed price is the main value; the equivalent is secondary (ui/caption, muted) and never larger than the billed price
- The saving compares with the other row in the same list and is rounded down ("Save 58%")
- Show badge off on the base plan; Show trial text off on plans without a trial
- Prices, currency and trial length come from the store or billing provider
- Resize: FILL width, min 240. Text column fills (min 80) and wraps the Badge under the name; price column hugs and never wraps

**Accessibility**

- A radio group: each row is role=radio with aria-checked, the group has a label ("Choose a plan")
- The accessible name reads the whole row: "Yearly, €59.99 per year, €1.15 per week, save 58%, 7-day free trial"
- Selected is shown by the filled radio and the 2 px primary border (5.2:1 Light, 3.5:1 Dark on the card), not color alone
- Muted text on the card 4.7:1 Light, 7.1:1 Dark; soft-success Badge 6.2:1 Light, 7.2:1 Dark

| Variant property | Values |
|---|---|
| State | default, selected |

| Property | Type | Default |
|---|---|---|
| Name | text | Yearly |
| Trial text | text | 7-day free trial |
| Price | text | €59.99 per year |
| Equivalent | text | €1.15 per week |
| Show badge | boolean | true |
| Show trial text | boolean | true |
| Show equivalent | boolean | true |

Built from: `Badge`, `Radio`

Tokens and styles:
- Colors: `background/card`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-padding-sm`, `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`
- Text styles: `body/large`, `body/small`, `ui/caption`, `ui/label`
- Effects: `shadow/xs`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md), [mobile](../../skills/build-ui/patterns/mobile.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: shadcn `RadioGroupItem` inside a `<label>` card + `Badge` (`flex items-center gap-3 p-4 rounded-lg border min-w-60`; text `flex-1 min-w-20` with name and Badge in `flex flex-wrap gap-2`; price stack `shrink-0 text-right whitespace-nowrap`; `data-[state=checked]:border-2 data-[state=checked]:border-primary shadow-xs`)

## Meter Banner

Component set · 3 variants · default size 1440 × 75

Sticky bar at the bottom of metered content: how many free articles are left this month, Subscribe and Sign in. FILL width (min 320); the actions wrap under the message below about 640.


State=remaining while free reads are left ("You have 2 free articles left this month"); last on the last free one (soft warning tile); none once the meter is used up, next to the Paywall Card.
The description names the lowest price and the period ("from €6.49 per month. Cancel anytime.").
Keep Dismiss on remaining and last: the reader can close the bar and keep reading. Never cover the article text; pin it to the bottom of the viewport.
Sign in for people who already pay; Subscribe is the only primary.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- Articles and videos on a metered site, while free reads are left
- The last free article before the wall (State=last)
- Next to the content wall once the meter is used (State=none), when the page keeps a bar

**Not for**

- A product usage limit in an app: use Usage Limit Banner or Usage Meter
- A site-wide announcement: use Block / Banner with Action
- A trial countdown: use Trial Banner

**Anatomy**

1. State: remaining, last, none
2. Icon tile 40: bookmark on background/muted (remaining), file on soft-warning (last), lock on soft-info (none)
3. Title (remaining), Last title, None title: one per State
4. Description: the lowest price and "Cancel anytime"
5. Sign in (Show sign in, exposed ghost Button)
6. Subscribe (exposed primary Button)
7. Dismiss (Show dismiss): ghost sm Button Icon

**Content and behavior**

- Pin it to the bottom of the viewport; it never covers the headline or the text being read (pad the page by its height)
- Say the count in words people use: "You have 2 free articles left this month"
- The description names a price and period ("from €6.49 per month") and how to cancel
- Keep Dismiss on remaining and last; the reader can always close it and keep reading
- One primary action (Subscribe); Sign in for people who already pay
- Resize: FILL width, min 320, container max 1152 centered. The actions wrap under the message below about 640; title 2 lines, description 3 lines with ellipsis

**Accessibility**

- role=region with aria-label "Free articles"; not a dialog, focus stays in the article
- Changes of the count are announced once (polite), not on every page view
- Dismiss has aria-label "Dismiss"; Esc does not need to close it
- Title on the card 19.8:1, description 4.7:1 Light and 7.1:1 Dark; soft tiles carry an icon, not color alone

| Variant property | Values |
|---|---|
| State | remaining, last, none |

| Property | Type | Default |
|---|---|---|
| Title | text | You have 2 free articles left this month |
| Last title | text | This is your last free article this month |
| None title | text | You have read your 3 free articles this month |
| Description | text | Subscribe for unlimited reading from €6.49 per month. Cancel anytime. |
| Show sign in | boolean | true |
| Show dismiss | boolean | true |

Built from: `Button`, `Button Icon`. Icons: bookmark, file-text, lock

Tokens and styles:
- Colors: `background/card`, `background/muted`, `badge/soft-info-bg`, `badge/soft-warning-bg`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/lg`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: custom fixed bar + shadcn `Button` (`fixed inset-x-0 bottom-0 border-t bg-card shadow-lg px-6 py-4`; inner `max-w-6xl mx-auto flex flex-wrap items-center gap-x-4 gap-y-3`; message `flex-1 min-w-60`; title `line-clamp-2`, description `line-clamp-3`; `role="region" aria-label="Free articles"`)

## Paywall Card

Component set · 3 variants · default size 560 × 642

The subscription card that sits over faded content when a reader reaches a content wall: logo, title, what they get as Check Items, the plan choice, one primary action, sign in for subscribers and the price and renewal fine print.


Type=metered: the free meter is used up; say when it resets. Type=registration: asks only for an email (Inline Form, Continue) or Continue with Google; no plans, no card. Type=hard: subscriber-only content, no free way in.
Plans slot: 2 Plan Option Rows (yearly selected with the saving, monthly), or a segmented billing Toggle Group with a Price.
The fine print states every price, the period, renewal and where to cancel, right under the action. No hidden fees.
Keep Sign in visible: subscribers must never meet a wall without it.
560 wide in an article column, FILL on mobile (min 320). Place it under the gradient fade of the preview, never over the headline.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- Block / Article Paywall: the end of the free preview
- A metered, registration or hard wall on articles, videos, reports or courses
- Inside a Dialog or Drawer when the wall opens over the page

**Not for**

- A locked feature inside an app: use Gate Overlay or Upgrade Dialog
- A full pricing page: use Block / Pricing and Plan Card
- A mobile app paywall: use Block / Mobile Paywall

**Anatomy**

1. Type: metered, registration, hard
2. Logo (swap, Show logo): Logo / Press / Northbeam Daily by default
3. Lock Badge (hard only, exposed): Tone=brand, "Subscribers"
4. Title, Description (metered); Registration title, Registration description; Hard title, Hard description
5. Benefits slot: 3 Check Items
6. Plans slot (metered, hard): 2 Plan Option Rows, yearly selected with the saving, monthly
7. Subscribe (metered, hard): exposed primary lg Button, FILL
8. Inline Form (registration, exposed): email + Continue, hint
9. Separator "or" + Continue with Google (registration, exposed outline lg Button)
10. Sign in prompt + Sign in link Button (Show sign in)
11. Fine print (metered, hard) or Note (registration)

**Content and behavior**

- metered: say that the free articles are used and when they come back ("3 more on 1 December")
- registration asks only for an email or Google; no plans, no card, no password
- hard: only for content that is never free; it is the one wall without another way in, so keep Sign in
- The fine print sits right under the action and states every price, the period, automatic renewal and where to cancel; no hidden fees
- Plans slot: Plan Option Rows, or a segmented billing Toggle Group with a Price; never preselect a more expensive plan without saying why (the saving)
- Place it under the faded preview, never over the headline; the reader can scroll back up
- Resize: 560 wide in an article column, FILL on mobile, min 320. Title up to 3 lines, fine print 4 lines

**Accessibility**

- The title is a heading (h2) in the article flow; the card is not a modal and does not trap focus
- Plans are a radio group with a label; the Subscribe label can name the plan (aria-describedby the fine print)
- Fine print 4.7:1 Light, 7.1:1 Dark on the card; title 19.8:1
- The Google button names the provider in text

| Variant property | Values |
|---|---|
| Type | metered, registration, hard |

| Property | Type | Default |
|---|---|---|
| Logo | instance swap | Logo / Press / Northbeam Daily |
| Show logo | boolean | true |
| Title | text | You have read your 3 free articles this month |
| Registration title | text | Create a free account to keep reading |
| Hard title | text | This article is for subscribers |
| Description | text | Subscribe for unlimited reading, or come back on 1 December for 3 more free articles. |
| Registration description | text | Free accounts get 5 articles a month and the morning briefing. No card needed. |
| Hard description | text | Subscribe to read the full story and everything else in Northbeam Daily. |
| Sign in prompt | text | Already a subscriber? |
| Fine print | text | Yearly €49.99 per year or monthly €6.49 per month, VAT included. Renews automatically until you cancel. Cancel anytime in Account settings. |
| Note | text | Free account, no card needed. By continuing you agree to the Terms and the Privacy Policy. |
| Show sign in | boolean | true |

Slots (fill them in the instance, never detach): `Benefits`, `Plans`

Built from: `Button`, `Check Item`, `Inline Form`, `Lock Badge`, `Logo / Press / Northbeam Daily`, `Plan Option Row`, `Separator`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/6`, `spacing/8`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h3`, `ui/caption`
- Effects: `shadow/xl`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: shadcn `Card` + `Check Item`, `RadioGroup` of `Plan Option Row`, `Button`, `Inline Form`, `Separator` (`w-full max-w-[560px] min-w-80 mx-auto p-8 rounded-xl shadow-xl`; Type maps to which parts render (plans + Subscribe, or email form + Google); fine print `text-xs text-muted-foreground text-center` right under the action)

## Lock Badge

Component set · 4 variants · default size 52 × 20

A small lock and the plan that unlocks a feature (Pro, Business), placed after the name of a locked menu item, tab, button, setting or report. It says what is locked and which plan opens it, before people click.


Use it next to the feature name, never instead of it. Tone=neutral in menus, tables and settings lists; Tone=brand on upgrade surfaces (Gate Overlay, Upsell Card). Size=sm (16) in Sidebar Items, Tabs and Menu Items; default (20) next to headings and in cards. Label is the plan name only, one word. Clicking the locked item opens the upgrade path (Upgrade Dialog or the Gate Overlay), it is never a dead end.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- After the label of a locked Sidebar Item, Tab, Menu Item or setting row
- Next to a report or card title that needs a higher plan
- Inside Gate Overlay and Upsell surfaces (Tone=brand)

**Not for**

- Status of an object (Paid, Overdue): use Badge
- A feature that is simply off: use Switch or a disabled state with a reason
- Marketing plan labels on pricing pages: use Badge on Plan Card

**Anatomy**

1. Lock icon (12, sm 10) in the label color
2. Label: plan name, one word ("Business")
3. Size: default 20 (headings, cards), sm 16 (Sidebar Items, Tabs, Menu Items)
4. Tone: neutral (badge/soft-neutral-*), brand (icon-tile/brand-*)

**Content and behavior**

- Always after the feature name, never instead of it
- The locked item stays clickable and opens the upgrade path (Gate Overlay, Upgrade Dialog); never a dead end
- Tone=neutral in navigation and lists, Tone=brand on upgrade surfaces
- One Lock Badge per item; do not combine with a Badge Count
- Resize: hugs its label, never wraps or truncates (plan names are short)

**Accessibility**

- The lock icon is decorative; the item's accessible name ends with "(Business plan)"
- Label meets 4.5:1 in Light, Dark and Corporate Light (neutral 8.35, brand 5.83 in Light)
- In a sidebar, absolute over the item: keep it out of the tab order

| Variant property | Values |
|---|---|
| Size | default, sm |
| Tone | neutral, brand |

| Property | Type | Default |
|---|---|---|
| Label | text | Pro |

Icons: lock

Tokens and styles:
- Colors: `badge/soft-neutral-bg`, `badge/soft-neutral-fg`, `icon-tile/brand-bg`, `icon-tile/brand-fg`
- Spacing and size: `spacing/0`, `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/md`
- Text styles: `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md), [monetization](../../skills/build-ui/patterns/monetization.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md)

Code: shadcn `Badge variant="secondary"` with lucide `Lock` (`size-3`, sm `size-2.5`, `aria-hidden`) + plan name; Tone=brand: `bg-primary/10 text-primary`; sm `h-4 px-1.5 text-xs` (Inside a nav item: `ml-auto shrink-0`; the item's accessible name ends with "(Business plan)"; the item stays a link to the upgrade path)

## Gate Overlay

Component set · 2 variants · default size 720 × 420

Placed over locked content so people see the value before the wall: the real content (Preview slot: a report, chart or result) stays visible but blurred (Style=blur: layer blur and a light Scrim) or fades into the surface (Style=fade: the top stays readable, for long content such as a list or a document), with a centered card: Lock Badge with the plan, Title (what they get), one line of value, the primary Upgrade action, a secondary See plans and a Note with the price and billing period.


Use it on a paid feature inside the app (a report, an export, an advanced setting) while the rest of the screen keeps working. For a plan limit reached by an action, use Block / Usage Limit Reached or Block / Upgrade Dialog. For articles and media, use the content paywall blocks.


Rules: put real or sample content in Preview, never an empty box. Title says the benefit, not the plan. The Note states the price, the period and how to cancel next to the action. Upgrade opens the Upgrade Dialog or Plan Checkout. Resize the instance to cover the content; the card is 400 at most and fills down to 272 (overlay min width 320, min height 320). Locked content is not focusable; the card is a region with the title as its heading.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- A paid report, chart, export or advanced setting inside the app
- A blurred AI result or preview people can see before upgrading
- Long content (list, document) that fades after the first rows (Style=fade)

**Not for**

- A limit reached by an action (invite, create): use Block / Usage Limit Reached or Block / Upgrade Dialog
- Articles and media: use the content paywall blocks
- Whole pages people cannot use at all: show Block / Result no-access or the plans

**Anatomy**

1. Preview (native slot): the real content, default a Chart Card
2. Style=blur: layer blur/DEFAULT on Preview and Scrim Tone=light at opacity/60
3. Style=fade: gradient from transparent to background/default, card at the bottom
4. Card (400 max, background/card, radius/xl, shadow/lg): Lock Badge (exposed, brand), Title (heading/h4), Description (body/small), Upgrade (exposed Button), See plans (exposed outline Button, Show see plans), Note (Show note)

**Content and behavior**

- Put real or sample content in Preview, never an empty box
- Title says the benefit ("Unlock revenue reports"), not the plan name
- Note states price, period and how to cancel next to the action
- Only the locked part is covered; navigation and free data keep working
- Upgrade opens the Upgrade Dialog or Plan Checkout and returns here after paying
- Resize: resize the instance to cover the content (min 320 x 320); the card fills down to 272 and stays 400 at most; title 2 lines, description 3, note 2 with ellipsis; actions wrap

**Accessibility**

- Preview content is aria-hidden and not focusable
- The card is a region labelled by its title; Upgrade gets focus first when the gate opens from a click
- Price text meets 4.5:1 (foreground/muted on background/card 4.74 in Light)

| Variant property | Values |
|---|---|
| Style | blur, fade |

| Property | Type | Default |
|---|---|---|
| Title | text | Unlock revenue reports |
| Description | text | See revenue by client, month and project, and export it to your accountant. Included in Business. |
| Note | text | €24 per user per month, billed yearly. Cancel anytime in Settings. |
| Show note | boolean | true |
| Show see plans | boolean | true |

Slots (fill them in the instance, never detach): `Preview`

Built from: `Button`, `Chart Card`, `Lock Badge`, `Scrim`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h4`, `ui/caption`
- Effects: `blur/DEFAULT`, `shadow/lg`

Guides: [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md), [mobile](../../skills/build-ui/patterns/mobile.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: `relative` wrapper; preview child `blur-sm pointer-events-none select-none` + `aria-hidden`; overlay `absolute inset-0 grid place-items-center p-6 bg-background/60` (Style=fade: `bg-gradient-to-b from-transparent to-background to-45%`, `items-end`); card shadcn `Card` `w-full max-w-[400px] text-center` (Title `line-clamp-2`, description `line-clamp-3`, actions `flex flex-wrap justify-center gap-2`; Upgrade links to checkout with a return URL)

## Usage Limit Banner

Component set · 4 variants · default size 1136 × 92

Tells people they are close to a plan limit (Status=approaching, from 80%) or have reached it (Status=reached, 100%), with the numbers, the reset date and the two ways forward: Upgrade and Buy more. Layout=banner is a full-width strip at the top of the page or a panel (Progress sm under the text, actions on the right, they wrap below under about 640); Layout=inline is a card (400, min 280) with a Usage Meter for a sidebar, a settings page or next to the feature that uses the limit.


Use it for metered limits: AI credits, API calls, storage, documents or exports per month. For seats and limits reached by one action (invite, create), open Block / Usage Limit Reached or the Upgrade Dialog at that moment. For plan status in settings, use Usage Meter in Block / Plan and Usage.


Rules: say used and limit with the unit and the reset date ("8,000 of 10,000 credits, reset on 1 Dec 2026"). Approaching can be dismissed (Show close) and comes back at the next threshold; reached stays until the limit changes. State the add-on price in the text or on the button. Never block work that is not metered. Status is in the title text, never color alone; the bar and Usage Meter have role meter.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- Metered limits: AI credits, API calls, storage, exports or documents per month
- Top of the page that uses the limit (Layout=banner)
- Sidebar, settings or next to the feature (Layout=inline)

**Not for**

- Seat or project caps reached by one action: open Block / Usage Limit Reached or Upgrade Dialog then
- Plan status in settings: use Usage Meter in Block / Plan and Usage
- System errors: use Alert

**Anatomy**

1. Status: approaching (warning tint, triangle-alert, dismissible) or reached (destructive tint, circle-alert)
2. Title / Reached title, Description / Reached description
3. banner: Progress sm (exposed, Value 80 or 100) + percent text, actions on the right
4. inline: card 400 with Usage Meter (exposed, Level near or over, hint with the reset date)
5. Buy more (exposed outline Button, Show buy more), Upgrade (exposed Button), close (Show close, approaching only)

**Content and behavior**

- Say used and limit with the unit and the reset date
- Approaching from 80%, dismissible, comes back at the next threshold (90%)
- Reached stays until the limit changes; never block work that is not metered
- State the add-on price in the text or on the button
- Bar Value matches the numbers (nearest step)
- Resize: banner wraps: text column min 240, actions and close drop under it below about 640; inline min 280; title 2 lines, description 3

**Accessibility**

- Progress and Usage Meter have role meter with aria-valuenow and aria-valuemax
- Status is in the title text, never color alone
- Crossing a threshold is announced once (polite live region)
- Contrast in Light: soft-warning-fg on soft-warning-bg 6.57, soft-destructive-fg on soft-destructive-bg 5.54

| Variant property | Values |
|---|---|
| Status | approaching, reached |
| Layout | banner, inline |

| Property | Type | Default |
|---|---|---|
| Title | text | You have used 80% of your AI credits |
| Description | text | 8,000 of 10,000 credits used. They reset on 1 Dec 2026, or add 5,000 credits now for €15. |
| Reached title | text | You have used all your AI credits |
| Reached description | text | AI drafts and summaries are paused until your credits reset on 1 Dec 2026. Upgrade, or buy 5,000 credits for €15. |
| Show close | boolean | true |
| Show buy more | boolean | true |

Built from: `Button`, `Progress`, `Usage Meter`. Icons: circle-alert, triangle-alert, x

Tokens and styles:
- Colors: `background/card`, `badge/soft-destructive-bg`, `badge/soft-destructive-fg`, `badge/soft-warning-bg`, `badge/soft-warning-fg`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`, `spacing/6`
- Radius: `radius/sm`, `radius/xl`
- Text styles: `body/small`, `ui/label`, `ui/label-small`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md), [mobile](../../skills/build-ui/patterns/mobile.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: Layout=banner: `flex flex-wrap items-center gap-x-4 gap-y-3 px-6 py-3` on `--badge-soft-warning-bg` (reached: destructive), text `min-w-60 flex-1`, shadcn `Progress` `h-1 max-w-60` + percent; Layout=inline: shadcn `Card` + `UsageMeter` + actions `flex flex-wrap gap-2` (`role="status"`; dismissal of approaching stored per user per threshold; numbers from the metering API, never hard-coded)

## Trial Banner

Component set · 3 variants · default size 1440 × 48

A strip across the top of the app during a free trial: how many days are left, what happens after the trial and Choose a plan. State=active (calm, info tint, dismissible for the day), ending (3 days or less, warning tint, says the date and that nothing is charged without consent), ended (primary strip, workspace read-only, not dismissible).


Use it above the Page Shell (full width, min 360; text wraps and the button drops under it on phones). One strip at a time: it replaces announcement banners while it shows. For the trial email, use Screen / Email / Trial ending.


Rules: state the end date and the price after the trial next to the action ("Then €12 per user per month"). Ended says what still works (read-only, export) and that nothing was deleted. Choose a plan opens the plans with the trial plan preselected. Message carries the state in words; the tint only repeats it. A region labelled "Trial"; changes are not announced on every page load.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- Above the Page Shell while a trial runs
- Ending (3 days or less) and ended (read-only workspace) states

**Not for**

- Product news and promotions: use the Banner blocks
- Payment problems: use Alert destructive with Update payment method
- Inside page content: it belongs above the shell

**Anatomy**

1. State: active (soft-info, sparkles, dismissible), ending (soft-warning, clock, dismissible), ended (background/primary, lock, not dismissible)
2. Message / Ending message / Ended message (ui/label)
3. Detail / Ending detail / Ended detail (body/small, Show detail)
4. Choose a plan (exposed Button sm; secondary on ended)
5. close (Show close)

**Content and behavior**

- State the end date and the price after the trial next to the action
- Ending says nothing is charged without consent
- Ended says what still works (read-only, export) and that nothing was deleted
- One strip at a time: it replaces announcement banners while it shows
- Choose a plan opens the plans with the trial plan preselected
- Resize: full width, min 360; the detail fills (min 160, 3 lines) and wraps under the message; the button and close drop to a new line on phones

**Accessibility**

- role=region with aria-label "Trial"
- State is in the message text
- Contrast in Light: soft-info-fg on soft-info-bg 5.83, soft-warning-fg on soft-warning-bg 6.57, foreground/primary on background/primary 5.17

| Variant property | Values |
|---|---|
| State | active, ending, ended |

| Property | Type | Default |
|---|---|---|
| Message | text | 12 days left in your Pro trial |
| Detail | text | Then €12 per user per month. Add a payment method to keep Pro features. |
| Ending message | text | 3 days left in your Pro trial |
| Ending detail | text | On 1 Nov 2026 your workspace moves to Free. No charge unless you choose a plan. |
| Ended message | text | Your Pro trial ended on 1 Nov 2026 |
| Ended detail | text | Your workspace is read-only. Nothing was deleted: choose a plan to edit again. |
| Show detail | boolean | true |
| Show close | boolean | true |

Built from: `Button`. Icons: clock, lock, sparkles, x

Tokens and styles:
- Colors: `background/primary`, `badge/soft-info-bg`, `badge/soft-info-fg`, `badge/soft-warning-bg`, `badge/soft-warning-fg`, `foreground/default`, `foreground/primary`
- Spacing and size: `spacing/0`, `spacing/2`, `spacing/3`, `spacing/6`
- Radius: `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [mobile](../../skills/build-ui/patterns/mobile.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: `flex flex-wrap items-center gap-3 px-6 py-2` above the app shell; text `flex flex-wrap gap-x-2 min-w-50 flex-1`, detail `line-clamp-3`; State=ended `bg-primary text-primary-foreground` + `Button variant="secondary"` (`role="region" aria-label="Trial"`; days left computed from the trial end date in the workspace time zone)

## Upsell Card

Component · 1 variant · default size 240 × 238

A compact card that suggests one upgrade where people already work: the sidebar footer, an empty state, the bottom of a settings list. Icon Tile (exposed, Style=brand), Title with the benefit, one sentence, a full-width Upgrade button and a Note with the price; Show close lets people dismiss it.


Use it for one quiet, dismissible nudge per screen. For a locked feature people try to open, use Gate Overlay; for limits, Usage Limit Banner; for wider in-app announcements and tips, Callout Card.


Rules: one benefit, said in the title ("Unlock revenue reports"), not "Go Pro". Price and period in the Note. Dismissed cards stay hidden for that person for at least 30 days. Never show it to people who cannot buy (members without billing rights): show "Ask your admin" instead. Width 240 (sidebar), fills from 200 to 360; title 2 lines, text 3 lines.


Usage: eggux build-ui/patterns/monetization.md

**Use for**

- Sidebar footer above the user menu
- Empty states of paid features
- End of a settings list or a free report

**Not for**

- A locked feature people tried to open: use Gate Overlay
- Limits: use Usage Limit Banner
- Tips and announcements: use Callout Card

**Anatomy**

1. Icon Tile (exposed, Style=brand, sm)
2. close X (Show close)
3. Title (ui/label, 2 lines)
4. Description (body/small, 3 lines)
5. Upgrade (exposed Button sm, FILL)
6. Note (ui/caption, Show note): price and period
7. Surface: background/card, border/default, radius/lg, padding spacing/4

**Content and behavior**

- One benefit in the title, not "Go Pro"
- Price and period in the Note
- Dismissed cards stay hidden for that person for at least 30 days
- Never shown to people who cannot buy: say "Ask your admin" instead
- One upsell per screen
- Resize: 240 by default, fills from 200 to 360; text wraps, button fills

**Accessibility**

- role=complementary with the title as label
- Close has aria-label "Dismiss"
- Icon is decorative

| Property | Type | Default |
|---|---|---|
| Title | text | Unlock revenue reports |
| Description | text | See which clients bring in the most revenue each month. |
| Note | text | €24 per user per month. Cancel anytime. |
| Show note | boolean | true |
| Show close | boolean | true |

Built from: `Button`, `Icon Tile`. Icons: x

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`, `radius/sm`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [card](../../skills/build-ui/components/card.md), [monetization](../../skills/build-ui/patterns/monetization.md)

Code: shadcn `Card` `p-4 gap-3 w-60 min-w-50 max-w-90`, `IconTile` sm brand, close `Button variant="ghost" size="icon"`, `Button size="sm" className="w-full"`, note `text-xs text-muted-foreground` (Dismissal stored per user (30 days); hidden for roles without billing rights)
