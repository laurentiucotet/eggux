# Feature Item

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Feature Item](#feature-item) | 3 | - |
| [Step Item](#step-item) | 2 | - |

On the Figma page: "Example / features in a grid", "Stress test / Feature Item", "Stress test / Step Item"

## Feature Item

Component set · 3 variants · default size 352 × 124

One benefit or capability: icon tile, short title, one or two lines of text, optional link. stacked in grids of 3 or 4, inline in two-column lists and narrow asides, centered under a centered Section Heading. Same icon style and text length across a grid. Plan feature lists use check items, not Feature Items.

**Use for**

- Feature grids of 3 or 4 on marketing pages
- Benefits on a careers page
- What a plan or product does, in a two-column list (Layout=inline)
- Under a centered Section Header (Layout=centered)

**Not for**

- Plan feature lists with checks: use a check list
- Numbers and results: use Figure or Stat Card
- Clickable cards that open something: use Card or Post Card

**Anatomy**

1. Icon tile: 40 px, background/muted, radius/md, Icon swap
2. Title: body/large
3. Description (Show description): body/small, muted
4. Link (Show link): Button link, sm

**Content and behavior**

- Same Layout, icon style and text length across a grid
- Title in 2-5 words; description in one or two lines
- One idea per item; no bullet lists inside
- Link only when there is a page that explains more

**Accessibility**

- The icon is decorative (aria-hidden)
- The title is a heading one level below the section title
- Link text names the destination, not only "Learn more" when several sit together

| Variant property | Values |
|---|---|
| Layout | stacked, inline, centered |

| Property | Type | Default |
|---|---|---|
| Title | text | Approvals in one place |
| Description | text | Route each invoice to the right person and see who approved what, and when. |
| Icon | instance swap | Icon/sparkles |
| Show description | boolean | true |
| Show link | boolean | false |

Built from: `Button`. Icons: sparkles

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/3`, `spacing/4`
- Radius: `radius/md`
- Text styles: `body/large`, `body/small`

Guides: [content](../../skills/build-ui/components/content.md)

Code: custom: lucide icon in a `bg-muted rounded-md` tile + `<h3>` + `<p>` (Icon `aria-hidden`; grid of 3 or 4)

## Step Item

Component set · 2 variants · default size 280 × 116

One step of "How it works" on a marketing or onboarding page: number, short title, one sentence. 3-4 steps in a row (vertical) or a column (horizontal). Steps people do in the product (a wizard) use Stepper.

**Use for**

- A How it works section with 3-4 steps
- Onboarding pages that explain the setup
- The overview of a help article

**Not for**

- Steps people do in the product (a wizard): use Stepper
- Benefits with no order: use Feature Item
- Tasks people tick off: use Checklist Item
- Events over time: use Timeline Item

**Anatomy**

1. Number circle: 1, 2, 3
2. Title: short, starts with a verb
3. Description: one sentence, muted
4. Layout: vertical, horizontal

**Content and behavior**

- 3-4 steps: vertical in a row, horizontal in a column
- Numbers start at 1 and follow the order
- Title in 2-5 words; description in one sentence
- Same Layout across a group

**Accessibility**

- Code as an <ol> so the order is read; the number circle is aria-hidden
- Titles are headings one level below the section title
- Muted description meets 4.5:1

| Variant property | Values |
|---|---|
| Layout | vertical, horizontal |

| Property | Type | Default |
|---|---|---|
| Number | text | 1 |
| Title | text | Connect your bank |
| Description | text | Payments match to invoices on their own, every morning. |

Tokens and styles:
- Colors: `background/primary`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/4`
- Radius: `radius/full`
- Text styles: `body/large`, `body/small`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md), [stepper](../../skills/build-ui/components/stepper.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<ol>` of `<li>`: number circle (`rounded-full bg-muted`), `<h3>`, `<p>` (Number circle `aria-hidden`)
