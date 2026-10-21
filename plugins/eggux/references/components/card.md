# Card

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Card Header](#card-header) | 1 | Action |
| [Card Footer](#card-footer) | 1 | Actions |
| [Stat Card](#stat-card) | 3 | - |
| [Option Card](#option-card) | 5 | - |
| [Post Card](#post-card) | 2 | - |
| [Card](#card) | 12 | Header, Content, Footer |
| [Entity Card](#entity-card) | 4 | Leading, Tags, Details |
| [Progress Card](#progress-card) | 3 | - |

On the Figma page: "Stress test / Card", "Stress test / Entity and Progress cards"

## Card Header

Component · 1 variant · default size 336 × 54

shadcn CardHeader: CardTitle (body/large), CardDescription, CardAction (native slot).

| Property | Type | Default |
|---|---|---|
| Title | text | Recent activity |
| Description | text | Next 7 days, all locations. |
| Show description | boolean | true |
| Show action | boolean | true |

Slots (fill them in the instance, never detach): `Action`

Built from: `Button Icon`

Tokens and styles:
- Colors: `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `body/large`, `body/small`

Guides: [card](../../skills/build-ui/components/card.md)

## Card Footer

Component · 1 variant · default size 336 × 36

shadcn CardFooter. "Actions" is a native slot.

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`

Tokens and styles:
- Spacing and size: `spacing/2`

## Stat Card

Component set · 3 variants · default size 288 × 174

Metric card (shadcn dashboard section card). Trend sets the icon; the change and trend line are edited per instance. Direction is shown by icon and text, never color alone.

| Variant property | Values |
|---|---|
| Trend | up, down, neutral |

| Property | Type | Default |
|---|---|---|
| Label | text | Revenue this month |
| Value | text | €48,250 |
| Footnote | text | Compared to October 2026 |
| Show footer | boolean | true |

Built from: `Badge`. Icons: minus, trending-down, trending-up

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-padding`, `spacing/1_5`, `spacing/2`, `spacing/4`, `spacing/72`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h2`, `ui/caption`, `ui/label`
- Effects: `shadow/sm`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) (Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Stat Card: custom content)

## Option Card

Component set · 5 variants · default size 384 × 80

Selectable card: a radio option with more context (plan, delivery, billing period). The whole card is the click target; selected = 2 px primary border + checked radio. Group 2-4 of them vertically or in a row.

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected, disabled |

| Property | Type | Default |
|---|---|---|
| Title | text | Standard shipping |
| Description | text | Delivered in 3-5 business days. |
| Show description | boolean | true |
| Icon | boolean | true |
| Icon type | instance swap | Icon/building |

Built from: `Radio`. Icons: building

Tokens and styles:
- Colors: `background/accent`, `background/card`, `background/muted`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-padding-sm`, `spacing/10`, `spacing/1_5`, `spacing/3`, `spacing/96`
- Radius: `radius/lg`, `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/xs`

Guides: [card](../../skills/build-ui/components/card.md)

## Post Card

Component set · 2 variants · default size 352 × 410

Article, news or case-study card: image 16:9, category + date · reading time, title, excerpt (3 lines max), author. horizontal = featured post. The whole card links to the article.

| Variant property | Values |
|---|---|
| Layout | vertical, horizontal |

| Property | Type | Default |
|---|---|---|
| Title | text | How we cut onboarding time in half with checklists |
| Excerpt | text | Three changes to the first-run experience, the data behind them, and what we would do differently next time. |
| Date | text | 12 Oct 2026 · 6 min read |
| Author | text | Maria Ilie |
| Show author | boolean | true |
| Show excerpt | boolean | true |

Built from: `Avatar`, `Badge`, `Image Placeholder`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `radius/lg`
- Text styles: `body/default`, `body/small`, `heading/h2`, `heading/h4`, `ui/caption`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md)

## Card

Component set · 12 variants · default size 384 × 308

shadcn Card. Variant: default (card background and border), outline (border only; inside panels and long lists), muted (tinted, no border; secondary or summary information). Size: default (padding and gap 24, 16 in Compact), sm (16, 12 in Compact). Elevation: false (flat) or true (shadow md; an outline card gets the card background so the shadow has a surface). Use Elevation for one card that must stand out or floats over content, never for a whole grid. Header, Content and Footer are native slots with their own side padding, so a slot set to padding 0 runs edge to edge. Padding and gap come from density/card-*; change those tokens for a product-wide decision. A card with its own anatomy (Stat Card, Option Card, Post Card) is a separate component built on Card.

| Variant property | Values |
|---|---|
| Variant | default, outline, muted |
| Size | default, sm |
| Elevation | false, true |

| Property | Type | Default |
|---|---|---|
| Show header | boolean | true |
| Show content | boolean | true |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Header`, `Content`, `Footer`

Built from: `Card Footer`, `Card Header`

Tokens and styles:
- Colors: `background/card`, `background/muted`, `border/default`, `card/muted-background`, `foreground/muted`
- Spacing and size: `density/card-gap`, `density/card-gap-sm`, `density/card-padding`, `density/card-padding-sm`, `spacing/4`, `spacing/96`
- Radius: `radius/md`, `radius/xl`
- Text styles: `ui/caption`
- Effects: `shadow/md`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) (Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Stat Card: custom content)

## Entity Card

Component set · 4 variants · default size 320 × 259

Summary of one object (customer, project, vendor, asset) in a grid or board: leading avatar or icon (slot), title and subtitle, menu, status and tags (slot), 2-4 key details (slot), footer with people and last update. Show the attributes marked "card" in objects.md. Whole card clickable only with one destination; then hover and focus apply and the menu is the only other control.

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected |

| Property | Type | Default |
|---|---|---|
| Title | text | Northwind Traders |
| Subtitle | text | Customer · Berlin |
| Footer text | text | Updated 2 h ago |
| Show menu | boolean | true |
| Show tags | boolean | true |
| Show details | boolean | true |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Leading`, `Tags`, `Details`

Built from: `Avatar`, `Avatar Group`, `Badge`, `Button Icon`, `Separator`

Tokens and styles:
- Colors: `background/card`, `border/default`, `border/ring`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-gap-sm`, `density/card-padding-sm`, `spacing/0_5`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `body/small`, `ui/caption`, `ui/label`
- Effects: `shadow/md`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` with `size="sm"`; `Progress`

## Progress Card

Component set · 3 variants · default size 320 × 174

A goal against its target (revenue, budget, quota, completion): label, status badge, value and target, bar (exposed Progress, pick Value), footnote with percent and time left. Status names the state in text; pick it from a rule (for example at risk under 80% of the expected pace) and say the rule in the footnote or a tooltip.

| Variant property | Values |
|---|---|
| Status | on track, at risk, off track |

| Property | Type | Default |
|---|---|---|
| Label | text | Q4 revenue target |
| Value | text | €48,250 |
| Target | text | of €60,000 |
| Footnote | text | 80% reached · 23 days left |

Built from: `Badge`, `Progress`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-gap-sm`, `density/card-padding`, `spacing/0_5`, `spacing/2`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h3`, `ui/caption`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` with `size="sm"`; `Progress`
