# Feature Item

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Feature Item](#feature-item) | 6 | - |

On the Figma page: "Example / features in a grid", "Stress test / Feature Item"

## Feature Item

Component set · 6 variants · default size 352 × 124

One benefit or capability: icon tile, short title, one or two lines of text, optional link. stacked in grids of 3 or 4, inline in two-column lists and narrow asides, centered under a centered Section Heading. Same icon style and text length across a grid. Plan feature lists use check items, not Feature Items. Marker=number replaces the icon with a step number for "How it works" rows (3-4 steps, only when order matters).

**Use for**

- Feature grids of 3 or 4 on marketing pages
- Benefits on a careers page
- What a plan or product does, in a two-column list (Layout=inline)
- Under a centered Section Header (Layout=centered)
- "How it works" sections with numbered steps (Marker=number)

**Not for**

- Plan feature lists with checks: use Check Item
- Numbers and results: use Figure or Stat Card
- Clickable cards that open something: use Card or Post Card
- Steps people do in the product (a wizard): use Stepper

**Anatomy**

1. Marker: icon tile (Marker=icon, Icon swap) or step number circle (Marker=number, Number)
2. Title: body/large
3. Description (Show description)
4. Link (Show link): Button link

**Content and behavior**

- Same Layout, icon style and text length across a grid
- Title in 2-5 words; description in one or two lines
- One idea per item; no bullet lists inside
- Link only when there is a page that explains more
- Marker=number only when order matters ("How it works", 3-4 steps); otherwise Marker=icon

**Accessibility**

- The icon is decorative (aria-hidden)
- The title is a heading one level below the section title
- Link text names the destination, not only "Learn more" when several sit together

| Variant property | Values |
|---|---|
| Layout | stacked, inline, centered |
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
- Colors: `background/muted`, `background/primary`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/10`, `spacing/3`, `spacing/4`
- Radius: `radius/full`, `radius/md`
- Text styles: `body/large`, `body/small`, `ui/label`

Guides: [content](../../skills/build-ui/components/content.md), [stepper](../../skills/build-ui/components/stepper.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom: lucide icon in a `bg-muted rounded-md` tile + `<h3>` + `<p>` (Icon `aria-hidden`; grid of 3 or 4. Marker=number: an `<ol>`, number circle `rounded-full bg-muted`, `aria-hidden`)
