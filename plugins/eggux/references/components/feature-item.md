# Feature Item

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Feature Item](#feature-item) | 8 | - |
| [Icon Tile](#icon-tile) | 12 | - |

On the Figma page: "Example / Feature Item styles", "Example / features in a grid", "Stress test / Feature Item", "Stress test / Icon Tile"

## Feature Item

Component set · 8 variants · default size 352 × 124

One benefit, capability or step: icon tile or step number, short title, one or two lines of text, optional link. Layout: stacked in grids of 3 or 4; inline in two-column lists and narrow asides; centered under a centered Section Heading; card (bordered card with padding, the same tile, title, text and optional link) when the grid sits on a muted or busy section, or when each item links to its own page (Show link). Same Layout, icon style and text length across a grid. Plan feature lists use Check Items, not Feature Items. Marker=number replaces the icon with a step number for "How it works" rows (3-4 steps, only when order matters).


Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Feature grids of 3 or 4 on marketing pages
- Benefits on a careers page
- What a plan or product does, in a two-column list (Layout=inline)
- Layout=card: a grid on a muted or busy section, or items that each link to their own page
- Under a centered Section Header (Layout=centered)
- "How it works" sections with numbered steps (Marker=number)

**Not for**

- Plan feature lists with checks: use Check Item
- Numbers and results: use Figure or Stat Card
- Clickable cards that open something: use Card or Post Card
- Steps people do in the product (a wizard): use Stepper

**Anatomy**

1. Layout: stacked, inline, centered, card
2. Marker: icon tile (Marker=icon, Icon swap; neutral tile 40, background/muted, radius/md) or step number circle (Marker=number, Number)
3. Title: body/large
4. Description (Show description)
5. Link (Show link): Button link
6. Card (Layout=card): background/card, border/default, radius/xl, padding spacing/6, gap spacing/4

**Content and behavior**

- Same Layout, icon style and text length across a grid
- Layout=card for the whole grid or none; cards in a row share height (Fill in a grid)
- Title in 2-5 words; description in one or two lines
- One idea per item; no bullet lists inside
- Link only when there is a page that explains more
- Marker=number only when order matters ("How it works", 3-4 steps); otherwise Marker=icon
- Layout=card with Show link when every item has its own page; the card is not clickable as a whole unless the link is the only action

**Accessibility**

- The icon is decorative (aria-hidden)
- The title is a heading one level below the section title
- Link text names the destination, not only "Learn more" when several sit together

| Variant property | Values |
|---|---|
| Layout | stacked, inline, centered, card |
| Marker | number, icon |

| Property | Type | Default |
|---|---|---|
| Title | text | Approvals in one place |
| Description | text | Route each invoice to the right person and see who approved what, and when. |
| Icon | instance swap | Icon/sparkles |
| Show description | boolean | true |
| Show link | boolean | false |
| Number | text | 1 |

Built from: `Button`. Icons: sparkles

Tokens and styles:
- Colors: `background/card`, `background/muted`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/full`, `radius/md`, `radius/xl`
- Text styles: `body/large`, `body/small`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md), [stepper](../../skills/build-ui/components/stepper.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom: lucide icon in a `bg-muted rounded-md` tile + `<h3>` + `<p>` (Icon `aria-hidden`; grid of 3 or 4. Marker=number: an `<ol>`, number circle `rounded-full bg-muted`, `aria-hidden`)

## Icon Tile

Component set · 12 variants · default size 40 × 40

Icon Tile: a rounded square holding one Lucide icon, for features, steps, stats and bento cards. Style: neutral (default; background/muted, foreground/default icon), brand (icon-tile/brand-bg tint with icon-tile/brand-fg icon, for one accent row), gradient (icon-tile/gradient-start to -end with a foreground/primary icon, for one hero feature or a highlighted step), outline (border/default ring, foreground/muted icon, for quiet lists on cards). Size: default 40 (icon 20), sm 32 (icon 16), lg 48 (icon 24). Icon swaps the Lucide icon. Use one Style per grid; the icon is decorative next to a title, so it carries no meaning of its own. Usage: eggux build-ui/patterns/marketing-pages.md

**Use for**

- Feature grids and benefit lists on marketing pages
- Bento cards and "How it works" rows that lead with an icon
- Help categories, support options and contact methods
- Stats or KPI cards that need a small visual anchor

**Not for**

- Status or meaning: use Badge or Status Dot (the tile is decorative)
- Clickable icon buttons: use Button Icon
- People or companies: use Avatar or Logo
- Numbered steps where order matters: use Feature Item Marker=number

**Anatomy**

1. Tile: rounded square, Size=default 40 (radius/md), sm 32 (radius/md), lg 48 (radius/lg)
2. Icon (Icon swap): Lucide icon, 20 / 16 / 24 px, default Icon/sparkles
3. Style=neutral (default): background/muted fill, foreground/default icon
4. Style=brand: icon-tile/brand-bg fill (background/primary at 10% light, 20% dark), icon-tile/brand-fg icon (foreground/brand)
5. Style=gradient: linear icon-tile/gradient-start to icon-tile/gradient-end, foreground/primary icon
6. Style=outline: no fill, border/default ring (border-width/DEFAULT), foreground/muted icon

**Content and behavior**

- One Style per grid; gradient for one hero feature or one highlighted step only
- Same Size across a grid: default in feature grids, sm in dense lists, lg in bento cards
- Pick icons from one family (Lucide) with the same stroke weight
- brand and gradient follow the theme: violet in Showcase, near black in Default, blue in Corporate

**Accessibility**

- The icon is decorative next to a title: aria-hidden on the svg
- Icon contrast 3:1 or more in every mode (lowest: gradient start 4.2:1 in Showcase)
- Never the only carrier of meaning; the title says what it is

| Variant property | Values |
|---|---|
| Style | neutral, brand, gradient, outline |
| Size | default, sm, lg |

| Property | Type | Default |
|---|---|---|
| Icon | instance swap | Icon/sparkles |

Icons: sparkles

Tokens and styles:
- Colors: `background/muted`, `border/default`, `icon-tile/brand-bg`
- Spacing and size: `spacing/10`, `spacing/12`, `spacing/8`
- Radius: `radius/lg`, `radius/md`

Guides: [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom `<div class="flex size-10 items-center justify-center rounded-md">` + lucide icon (`size-5`, `aria-hidden`) (Size: sm `size-8` + `size-4` icon, default `size-10` + `size-5`, lg `size-12 rounded-lg` + `size-6`. Style: neutral `bg-muted text-foreground`; brand `bg-[var(--icon-tile-brand-bg)] text-[var(--icon-tile-brand-fg)]`; gradient `bg-linear-to-br from-[var(--icon-tile-gradient-start)] to-[var(--icon-tile-gradient-end)] text-primary-foreground`; outline `border text-muted-foreground`. Decorative)
