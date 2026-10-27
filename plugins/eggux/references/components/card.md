# Card

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Card](#card) | 16 | Header, Content, Footer |
| [Card Header](#card-header) | 1 | Action |
| [Card Footer](#card-footer) | 1 | Actions |
| [Stat Card](#stat-card) | 9 | - |
| [Option Card](#option-card) | 10 | - |
| [Post Card](#post-card) | 8 | - |
| [Entity Card](#entity-card) | 4 | Leading, Tags, Details, Actions |
| [Progress Card](#progress-card) | 3 | - |
| [Person Card](#person-card) | 3 | Avatar, Tags, Contact, Actions |
| [Event Card](#event-card) | 3 | Tags, Meta, Actions |
| [Date Tile](#date-tile) | 2 | - |
| [Link Preview](#link-preview) | 2 | - |
| [Location Card](#location-card) | 1 | - |

On the Figma page: "Example / Card styles", "Example / Person Card styles", "Example / Post Card styles", "Example / Stat Card styles", "Example / customer card", "Example / events grid", "Example / in offices", "Example / people directory", "Example / plan choice", "Example / quarter goal", "Example / related links in an aside", "Example / shared link in a conversation", "Example / upcoming events", "Examples / cards", "Examples / stat cards", "Stress test / Card", "Stress test / Entity and Progress cards", "Stress test / Event Card", "Stress test / Link Preview", "Stress test / Location Card", "Stress test / Option Card", "Stress test / Person Card", "Stress test / Post Card", "Stress test / Progress Card", "Stress test / Stat Card"

## Card

Component set · 16 variants · default size 384 × 308

shadcn Card. Variant: default (card background and border); outline (border only; inside panels and long lists); muted (tinted, no border; secondary or summary information); inverted (foreground/default surface with background/default text, near black in Light and near white in Dark) for the one card that must stand out on a page, such as an upgrade offer or a key summary, never a whole grid. Size: default (padding and gap 24, 16 in Compact), sm (16, 12 in Compact). Elevation: false (flat) or true (shadow md; an outline card gets the card background so the shadow has a surface). Use Elevation for one card that must stand out or floats over content, never for a whole grid. Header, Content and Footer are native slots with their own side padding, so a slot set to padding 0 runs edge to edge. Content you place in an inverted card's slots must use inverted colors: text background/default (70% opacity for secondary text), Buttons secondary or outline, never the primary default (under 3:1 in Corporate). Padding and gap come from density/card-*; change those tokens for a product-wide decision. A card with its own anatomy (Stat Card, Option Card, Post Card) is a separate component built on Card.


Usage: eggux build-ui/components/card.md

**Use for**

- Content about one object or topic, set apart from the page
- Variant=outline inside panels, dialogs and long lists of cards
- Variant=muted for secondary or summary information and placeholders
- Variant=inverted for the one card that must stand out on a page (an upgrade offer, a key summary)
- Size=sm for grids of many cards, sidebars and dashboards

**Not for**

- A status message: use Alert, or a Badge inside the card
- A metric, selectable option or post: use Stat Card, Option Card or Post Card
- Groups inside a card: use spacing or a Separator, never a nested card

**Anatomy**

1. Variant: default (background/card + border/default), outline (border only), muted (background/muted), inverted (foreground/default surface, background/default text)
2. Header slot (Card Header): Icon (Show icon, Icon swap, 20 px), Title, Description, Action slot top right
3. Content slot
4. Footer slot (Card Footer): Actions slot
5. Inverted default slot content is recolored: titles background/default, descriptions background/default at opacity/70, ghost icons background/default

**Content and behavior**

- Never nest cards in cards
- Elevation=true only for one card that must stand out or floats; never a whole grid
- Variant=inverted on one card per view, never a whole grid; it flips to a near-white card in Dark
- One variant per group of cards; equal height and structure per row
- Whole card clickable only with one destination; otherwise the title is the link
- Footer: one primary action at most, usually none in a grid
- Padding comes from density/card-* tokens; change the tokens, never single instances
- Turn off Show header or Show footer when unused; never detach
- Card Header icon: on all cards of a row or none; it names the card type, never decorates
- Content you place in an inverted card's slots uses inverted colors: text background/default (opacity/70 for secondary), Buttons secondary or outline, never default (primary is under 3:1 on the inverted surface in Corporate)

**Accessibility**

- A clickable card is one link with a hover state and a focus ring
- The Card Header Title is a heading at the right level for the page
- Action slot Button Icons have labels and tooltips
- The Card Header icon is decorative (aria-hidden); the Title carries the meaning
- Inverted text is background/default on foreground/default: 19.8:1 Light, 19.0:1 Dark, 17.9:1 Corporate Light; secondary text at 70% stays above 7:1

| Variant property | Values |
|---|---|
| Variant | default, outline, muted, inverted |
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
- Colors: `background/card`, `background/default`, `background/muted`, `border/default`, `card/muted-background`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/card-gap`, `density/card-gap-sm`, `density/card-padding`, `density/card-padding-sm`, `spacing/4`, `spacing/96`
- Radius: `radius/md`, `radius/xl`
- Text styles: `ui/caption`
- Effects: `shadow/md`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` (`CardHeader`, `CardFooter`) + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) (Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Card Header `Show icon` / `Icon` = optional Lucide icon (`size-5`, `aria-hidden`) before `CardTitle` in a `flex items-center gap-2` row. Stat Card: custom content)

## Card Header

Component · 1 variant · default size 336 × 54

shadcn CardHeader: CardTitle (body/large), CardDescription, CardAction (native slot). Show icon puts a 20 px icon (Icon swap, foreground/default) before the title, centered on the title line: use it when cards on a dashboard are told apart by type (data releases, saved queries, sessions); all cards in a row either have an icon or none.

| Property | Type | Default |
|---|---|---|
| Title | text | Recent activity |
| Description | text | Next 7 days, all locations. |
| Show description | boolean | true |
| Show action | boolean | true |
| Show icon | boolean | false |
| Icon | instance swap | Icon/file-text |

Slots (fill them in the instance, never detach): `Action`

Built from: `Button Icon`. Icons: file-text

Tokens and styles:
- Colors: `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `body/large`, `body/small`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` (`CardHeader`, `CardFooter`) + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) (Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Card Header `Show icon` / `Icon` = optional Lucide icon (`size-5`, `aria-hidden`) before `CardTitle` in a `flex items-center gap-2` row. Stat Card: custom content)

## Card Footer

Component · 1 variant · default size 336 × 36

shadcn CardFooter. "Actions" is a native slot.

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` (`CardHeader`, `CardFooter`) + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) (Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Card Header `Show icon` / `Icon` = optional Lucide icon (`size-5`, `aria-hidden`) before `CardTitle` in a `flex items-center gap-2` row. Stat Card: custom content)

## Stat Card

Component set · 9 variants · default size 288 × 172

Metric card (shadcn dashboard section card). Layout: vertical (default: label, change badge, value, optional sparkline, trend line and footnote) for dashboard rows; compact (Icon Tile, label, change badge and value in one row, no footer) for dense rows, sidebars and mobile; horizontal (label, value and change on the left, a Sparkline on the right, footer below) when the shape of the trend matters next to the number. Trend sets the icon, the change badge tone (up = soft-success, down = soft-destructive, neutral = soft-neutral) and the sparkline; the change Badge is exposed: set its Label and Variant on the instance, independent of Trend. When down is good (churn, costs, response time) keep Trend=down for the icon and set the badge Variant to soft-success; when up is bad, Trend=up with soft-destructive. The compact Icon Tile is exposed: set its Icon and Style on the instance, the same across a row. Direction is shown by icon and sign, never color alone. One Layout per row.


Usage: eggux build-ui/components/card.md

**Use for**

- One number people check (revenue this month)
- A row of key metrics at the top of a report or dashboard
- Dashboard sections next to a Chart Card
- Layout=compact: dense rows, sidebars and mobile dashboards
- Layout=horizontal: when the shape of the trend matters next to the number

**Not for**

- A trend people need to read over time: use a chart in a Chart Card
- A goal against a target: use Progress Card

**Anatomy**

1. Layout: vertical (default), compact, horizontal
2. Label (body/small, muted)
3. Value (heading/h2 in vertical and horizontal, heading/h3 in compact; one line)
4. Change Badge (Show change): exposed Badge; set its Label ("+12.5%") and Variant on the instance. Default tone follows Trend: up soft-success, down soft-destructive, neutral soft-neutral; icon trending-up, trending-down, minus
5. Sparkline (vertical: Show sparkline, off by default, under the value; horizontal: always on, 120 x 48, right of the value)
6. Trend line and Footnote (Show footer; vertical and horizontal)
7. Icon Tile (compact): exposed, Style=brand, Size default; set Icon and Style on the instance
8. Show change and Show trend hide the change badge and the trend row when there is no comparison

**Content and behavior**

- Trend sets the icon, the sparkline and the default badge tone; edit the badge Label and the trend line per instance
- Tone follows meaning, not direction: when down is good (churn, costs, response time) keep Trend=down and set the badge Variant to soft-success; when up is bad, Trend=up with soft-destructive
- Direction is shown by icon and sign, never color alone
- One Layout per row; compact rows keep the same Icon Tile Style
- Show sparkline on all cards of a row or none; same period in each
- Numbers in the locale format of the page: +12.5% and €48,250 in English, never a decimal comma next to a thousands comma
- Value stays on one line; amounts in the locale format (€48,250)
- The Footnote says what it is compared to
- Cards in a row share structure and height
- Resize: trend text caps at 200, 1 line with ellipsis, icon after it

**Accessibility**

- The change reads as text ("Up 12% compared to September")
- Label and value are read together
- The Footnote meets 4.5:1
- The sparkline is decorative (aria-hidden); the change text carries the meaning
- Change badge text meets 4.5:1 in every mode (soft badge tokens)

| Variant property | Values |
|---|---|
| Trend | up, down, neutral |
| Layout | vertical, compact, horizontal |

| Property | Type | Default |
|---|---|---|
| Label | text | Revenue this month |
| Value | text | €48,250 |
| Footnote | text | Compared to October 2026 |
| Show footer | boolean | true |
| Trend text | text | 12.5% vs last month |
| Show change | boolean | true |
| Show trend | boolean | true |
| Show sparkline | boolean | false |

Built from: `Badge`, `Icon Tile`, `Sparkline`. Icons: minus, trending-down, trending-up

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-padding`, `density/card-padding-sm`, `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/72`, `spacing/96`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h2`, `heading/h3`, `ui/caption`, `ui/label`
- Effects: `shadow/sm`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` (`CardHeader`, `CardFooter`) + `cva` with `variant` (default, outline, muted), `size` (default, sm) and `elevated` (boolean, `shadow-md`) (Padding from `var(--card-padding)` / `var(--card-padding-sm)` on Card (py) and CardHeader, CardContent, CardFooter (px); gap from `var(--card-gap)`. Card Header `Show icon` / `Icon` = optional Lucide icon (`size-5`, `aria-hidden`) before `CardTitle` in a `flex items-center gap-2` row. Stat Card: custom content)

## Option Card

Component set · 10 variants · default size 384 × 80

Selectable card: a radio option with more context (plan, delivery, billing period). The whole card is the click target; selected = 2 px primary border + checked radio. Group 2-4 of them vertically or in a row. Control=checkbox for several choices (a card per option with a checkbox); radio for one choice.

**Use for**

- Choosing one of 2-4 options that each need a description (Control=radio)
- Turning on several add-ons, modules or channels (Control=checkbox)
- Onboarding choices where each option needs a sentence of context

**Not for**

- Many options or short labels: use Radio or Select
- Short labels that need no description: use Checkbox
- A setting that applies at once: use Setting Row with a Switch

**Anatomy**

1. Icon (optional, Show icon + Icon)
2. Title
3. Description (Show description)
4. Control: Radio (Control=radio) or Checkbox (Control=checkbox)

**Content and behavior**

- The whole card is the click target
- Control=radio: exactly one selected; Control=checkbox: any number
- State: default, hover, focus, selected, disabled
- Group 2-6 cards in a column or a grid with the same height

**Accessibility**

- The group is a radiogroup with a label; arrow keys move between options
- Selected shows by the radio and the border, not color alone
- State=focus shows the focus ring on the card

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected, disabled |
| Control | checkbox, radio |

| Property | Type | Default |
|---|---|---|
| Title | text | Standard shipping |
| Description | text | Delivered in 3-5 business days. |
| Show description | boolean | true |
| Show icon | boolean | true |
| Icon | instance swap | Icon/building |

Built from: `Checkbox`, `Radio`. Icons: building

Tokens and styles:
- Colors: `background/accent`, `background/card`, `background/muted`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-padding-sm`, `spacing/10`, `spacing/1_5`, `spacing/3`, `spacing/96`
- Radius: `radius/lg`, `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/xs`

Guides: [card](../../skills/build-ui/components/card.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `RadioGroup` (Control=radio) or `Checkbox` (Control=checkbox) with a `Label` wrapping a `Card` (`has-[:checked]:ring-2`) (Whole card is the target; checkbox groups in a `<fieldset>`)

## Post Card

Component set · 8 variants · default size 352 × 410

Article, news or case-study card: image 16:9, category + date · reading time, title, excerpt (3 lines max), author. Layout: vertical for blog grids of 3; horizontal for the featured post; compact for a link row in asides and lists (related, most read, up next): title on 2 lines and meta, optional 1:1 image (Show image); overlay (title, category, date and author over a full-bleed photo on a media/scrim panel, no excerpt) for one lead story, a hero grid or a carousel of covers where the photo carries the post. Overlay text is media/foreground on media/scrim (black 60%), 5.7:1 over the brightest pixel; pick a photo whose subject sits in the top half. Size=sm for dense grids and lists: smaller gaps, heading/h4 title, overlay 320 tall; horizontal sm gives the image one third of the width (120-240 px) instead of half; compact sm has a 48 px image and a ui/label-small title. The whole card links to the article. The category Badge (layer Badge, exposed) is set from the instance panel: Label and Variant.


Usage: eggux build-ui/components/card.md

**Use for**

- Blog grids of 3: Layout=vertical
- The featured post at the top of a list: Layout=horizontal
- Layout=overlay: one lead story, a hero grid of covers or a carousel where the photo carries the post
- News, case studies, changelog entries and carousels of posts
- Layout=compact: related, most read and up next lists in an aside or under an article
- Size=sm: dense grids of 4, lists in a column next to a featured story, dashboards

**Not for**

- A product with a price: use Product Card
- A record in an app: use Entity Card

**Anatomy**

1. Image 16:9 (Image Placeholder)
2. Horizontal: the image takes half the card width (160-640) and keeps its ratio, so the card works from a featured row down to a list in a column
3. Horizontal Size=sm: the image takes one third of the width (120-240), text top aligned
4. Category Badge (layer Badge, exposed: set its Label and Variant from the instance panel), Date and reading time
5. Title: heading/h4 (vertical, sm), heading/h2 (horizontal default)
6. Excerpt, 3 lines max (Show excerpt)
7. Author with Avatar (Show author)
8. Compact: optional 1:1 image (Show image, 64 px, 48 px in sm), Title on 2 lines (ui/label, ui/label-small in sm), meta in Date (type · date)
9. Size: default or sm (smaller gaps and titles) for every Layout
10. Overlay: full-bleed photo (exposed Image Placeholder, 1:1 in default and 4:3 in sm so the locked ratio covers the card, centered crop, Show image on, default Image / Cover / 02), a 64 px media/scrim-fade to media/scrim gradient, then a media/scrim panel with category Badge, date, title and author in media/foreground; no excerpt; 352 x 440 (sm 352 x 320), radius/xl, clips

**Content and behavior**

- The whole card is one link to the article
- Excerpt is 3 lines max, then truncates
- Date and reading time on one line ("12 Oct 2026 · 6 min read")
- Cards in a grid share the same structure
- Compact: 3-5 items per list; meta says type and date ("Guide · 12 Oct 2026"); image on all items or none
- One Size per list or grid; sm for lists next to a featured story and for grids of 4
- Never restyle the title per instance: switch Size instead
- Overlay text sits only on the solid media/scrim panel, never on the fade; choose photos with the subject in the top half
- Resize: meta row fills, the date truncates to 1 line after the Badge; the author name truncates to 1 line after the avatar

**Accessibility**

- One link per card; the Title is the link text
- The image has alt text, or alt="" when decorative
- Focus ring around the whole card
- Overlay text is media/foreground on media/scrim (black 60%): 5.7:1 even over a white pixel, in every theme

| Variant property | Values |
|---|---|
| Layout | vertical, horizontal, compact, overlay |
| Size | default, sm |

| Property | Type | Default |
|---|---|---|
| Title | text | How we cut onboarding time in half with checklists |
| Excerpt | text | Three changes to the first-run experience, the data behind them, and what we would do differently next time. |
| Date | text | 12 Oct 2026 · 6 min read |
| Author | text | Maria Ilie |
| Show author | boolean | true |
| Show excerpt | boolean | true |
| Show image | boolean | false |

Built from: `Avatar`, `Badge`, `Image Placeholder`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`, `media/foreground`, `media/scrim`
- Spacing and size: `spacing/0`, `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/8`
- Radius: `radius/lg`, `radius/md`, `radius/xl`
- Text styles: `body/default`, `body/small`, `heading/h2`, `heading/h4`, `ui/caption`, `ui/label`, `ui/label-small`

Guides: [content](../../skills/build-ui/components/content.md), [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `Card` (meta `flex min-w-0`, date `truncate`; author name `truncate`)

## Entity Card

Component set · 4 variants · default size 320 × 259

Summary of one object (customer, project, vendor, asset) in a grid or board: leading avatar, icon or 1:1 image (slot), title and subtitle, Actions slot (Show actions) for the one direct action people take on every card (add, remove, pin), menu, status and tags (slot), 2-4 key details (slot), footer with people and last update. Show the attributes marked "card" in objects.md. Whole card clickable only with one destination; then hover and focus apply and the menu is the only other control. A toggled action shows its state: plus to add, check once added, with State=selected. Show people hides the Avatar Group in the footer.

**Use for**

- Grids and boards of records
- Customers, projects, vendors and assets people scan by key details
- Board columns, where each card is one record

**Not for**

- Many records compared by columns: use a table of Table Cells
- One metric: use Stat Card
- A goal against a target: use Progress Card

**Anatomy**

1. Leading slot: avatar, icon or a 1:1 image
2. Title (2 lines) and Description (1 line)
3. Actions slot: one or two Button Icon for a direct action, like add or remove (Show actions)
4. Menu Button Icon (Show menu)
5. Tags slot: status and tags (Show tags)
6. Details slot: 2-4 key details (Show details)
7. Footer: people (Avatar Group, Show people) and Footer text (Show footer)

**Content and behavior**

- Details are the attributes marked "card" in objects.md, in that order
- Whole card clickable only with one destination; then hover and focus apply
- In a clickable card the menu is the only other control
- Actions slot for the one action people take on every card (add to a selection, remove, pin); everything else goes in the menu
- A toggled action shows its state: plus to add, check (secondary) once added, with State=selected on the card
- Status in text (Show badge), never color alone
- Footer text says when it was last updated ("Updated 2 h ago")

**Accessibility**

- One link for the card; the menu is a separate button with a label
- State=focus shows the border/ring focus ring
- State=selected is announced, not only shown
- Each Button Icon in Actions has an accessible label that names the card ("Add Website redesign")

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected |

| Property | Type | Default |
|---|---|---|
| Title | text | Northwind Traders |
| Description | text | Customer · Berlin |
| Footer text | text | Updated 2 h ago |
| Show menu | boolean | true |
| Show tags | boolean | true |
| Show details | boolean | true |
| Show footer | boolean | true |
| Show actions | boolean | false |
| Show people | boolean | true |

Slots (fill them in the instance, never detach): `Leading`, `Tags`, `Details`, `Actions`

Built from: `Avatar`, `Avatar Group`, `Badge`, `Button Icon`, `Separator`

Tokens and styles:
- Colors: `background/card`, `border/default`, `border/ring`, `foreground/card`, `foreground/muted`
- Spacing and size: `density/card-gap-sm`, `density/card-padding-sm`, `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `body/small`, `ui/caption`, `ui/label`
- Effects: `shadow/md`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` with `size="sm"`; `Progress`

## Progress Card

Component set · 3 variants · default size 320 × 174

A goal against its target (revenue, budget, quota, completion): label, status badge, value and target, bar (exposed Progress, pick Value), footnote with percent and time left. Status names the state in text; pick it from a rule (for example at risk under 80% of the expected pace) and say the rule in the footnote or a tooltip.

**Use for**

- Revenue, budget, quota or completion goals
- Dashboards and reports next to Stat Cards
- Team or customer quotas and budgets against plan

**Not for**

- A metric without a target: use Stat Card
- Progress of a running task: use Progress or Agent Plan

**Anatomy**

1. Label
2. Status Badge (soft): on-track soft-success, at-risk soft-warning, off-track soft-destructive
3. Value and Target ("€48,250 of €60,000")
4. Progress bar (exposed Progress, set Value)
5. Footnote: percent and time left

**Content and behavior**

- Status names the state in text, picked from a rule
- Say the rule in the footnote or a tooltip ("at risk under 80% of the expected pace")
- The bar Value matches the percent in the Footnote
- Amounts follow the locale format
- Resize: the target text fills the value row (at least 80), 1 line with ellipsis, and wraps under the value when there is no room

**Accessibility**

- Progress has role="progressbar" with aria-valuenow and a label
- Status is in text, never color alone
- The Footnote meets 4.5:1

| Variant property | Values |
|---|---|
| Status | on-track, at-risk, off-track |

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

## Person Card

Component set · 3 variants · default size 280 × 266

One person: author, expert, speaker, contact or team member. Layout: vertical (avatar, name, role, organization, expertise tags, contact) in grids of 3-4; horizontal in asides and lists; photo (a large 4:5 portrait tile with name, role and organization below, no card surface) for team, speaker and leadership pages where faces matter. Avatar slot (photo or initials) in vertical and horizontal; photo uses the exposed Image Placeholder (pick the Image on the instance) and keeps the Avatar slot hidden. Tags, Contact and Actions are native slots with Show booleans; on photo cards turn Show tags and Show contact off unless the page is a directory. Same Layout and photo crop across a grid.


Usage: eggux build-ui/components/card.md

**Use for**

- Experts, authors and speakers on a content or product page
- Contacts on a record or account page
- Layout=photo: team, speaker and leadership pages where faces matter
- Team directories and "Who to talk to" sections

**Not for**

- A record with details and status: use Entity Card
- A user picked in a form: use Person Option in People Picker
- Avatar and name in a table: use Table Cell User

**Anatomy**

1. Layout: vertical (280), horizontal (400), photo (280, no card surface)
2. Avatar slot: photo or initials (hidden in photo)
3. Photo (Layout=photo): exposed Image Placeholder 3:4, 280 x 350, radius/xl, default Image / Person / 05
4. Name (heading/h4), Role, Organization (Show organization)
5. Tags slot: expertise as Badges (Show tags)
6. Contact slot: Meta Items with mail, phone, link (Show contact)
7. Actions slot: View profile, Follow (Show actions)

**Content and behavior**

- vertical in grids of 3-4, horizontal in asides and lists, photo on team and speaker pages
- Role says what they do here; Organization only when people come from several
- Photo layout: real photos with the same crop, light and background across the grid; turn Show tags and Show contact off unless the page is a directory
- Contact details people copy are plain text
- Two tags at most; the rest on the profile
- Photos square-cropped or 4:5, same style across the grid

**Accessibility**

- The name is the card heading at the page's level
- Email and phone are links (mailto:, tel:)
- A photo has the person's name as alt, or alt="" when the name is next to it

| Variant property | Values |
|---|---|
| Layout | vertical, horizontal, photo |

| Property | Type | Default |
|---|---|---|
| Name | text | Maria Ilie |
| Role | text | Head of Finance Operations |
| Organization | text | Acme |
| Show organization | boolean | true |
| Show tags | boolean | true |
| Show contact | boolean | true |
| Show actions | boolean | false |

Slots (fill them in the instance, never detach): `Avatar`, `Tags`, `Contact`, `Actions`

Built from: `Avatar`, `Badge`, `Button`, `Image Placeholder`, `Meta Item`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/card-gap-sm`, `density/card-padding-sm`, `spacing/0`, `spacing/0_5`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h4`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` + `Avatar`, `Badge`, links (`mailto:`, `tel:`)

## Event Card

Component set · 3 variants · default size 640 × 144

One event, webinar or session in a list or grid: Date Tile (exposed), format badges (Tags slot), title, time with time zone and place as Meta Items (Meta slot), one action (Register, Watch recording). horizontal for agenda lists, vertical with an image for grids of 3. Vertical Date position=image puts the Date Tile over the top-left corner of the image (needs Show image on) so the title gets the full width; Date position=text keeps it next to the title. The whole card links to the event page; the action is the only other control. Past events: "Watch the recording" or no action, and a Recorded badge.

**Use for**

- Agenda and upcoming events lists (Layout=horizontal)
- Event grids on a hub or topic page (Layout=vertical, with image)
- Sessions of a conference day
- Date position=image: grids where titles are long, so the title gets the full card width

**Not for**

- The event page itself: use Block / Header Event
- Calendar views with many events: use Calendar Event in Block / Scheduler Month
- Articles and news: use Post Card

**Anatomy**

1. Date Tile (exposed): month over day
2. Date position (vertical): text = Date Tile next to the title; image = Date Tile over the top-left corner of the image, inset spacing/3, on background/default
3. Tags slot: format Badges (Webinar, Online, In person)
4. Title, 2 lines
5. Meta slot: Meta Items for time with time zone and place
6. Actions slot: one action (Register, Join waitlist, Watch recording)
7. Vertical: image 16:9 on top (Show image)

**Content and behavior**

- Sorted by date, soonest first; past events in their own list
- Time always with time zone; place with city, or Online
- One action per card; the whole card links to the event page
- Past events: Recorded badge and Watch the recording, or no action
- Full events say it in the action (Join waitlist), never by hiding the card
- Date position=image only with Show image on; same Date position for every card of a grid

**Accessibility**

- The Date Tile reads as a full date ("12 November 2026") for screen readers
- One link for the card; the action is a separate button with a label that names the event
- Badges are text, not color alone

| Variant property | Values |
|---|---|
| Layout | horizontal, vertical |
| Date position | text, image |

| Property | Type | Default |
|---|---|---|
| Show tags | boolean | true |
| Title | text | Close the books in five days |
| Show actions | boolean | true |
| Show image | boolean | true |

Slots (fill them in the instance, never detach): `Tags`, `Meta`, `Actions`

Built from: `Badge`, `Button`, `Date Tile`, `Image Placeholder`, `Meta Item`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`
- Spacing and size: `density/card-gap-sm`, `density/card-padding-sm`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `heading/h4`

Guides: [card](../../skills/build-ui/components/card.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `Card` + `Badge`, `Button`; date tile as custom markup (`<time datetime>` for the date. `datePosition` prop (text, image) on vertical: image = tile `absolute top-3 left-3 bg-background` inside a `relative` image wrapper)

## Date Tile

Component set · 2 variants · default size 56 × 66

The date of an event as a tile: month (three letters) over the day. Part of Event Card; also in agenda lists and calendars of events. Size default 56, sm 44. Past events: the card says it, the tile stays the same.

| Variant property | Values |
|---|---|
| Size | default, sm |

| Property | Type | Default |
|---|---|---|
| Month | text | NOV |
| Day | text | 12 |

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/lg`
- Text styles: `heading/h3`, `heading/h4`, `ui/overline`

Guides: [card](../../skills/build-ui/components/card.md)

Code: shadcn `Card` + `Badge`, `Button`; date tile as custom markup (`<time datetime>` for the date. `datePosition` prop (text, image) on vertical: image = tile `absolute top-3 left-3 bg-background` inside a `relative` image wrapper)

## Link Preview

Component set · 2 variants · default size 480 × 122

A pasted URL shown as a card in comments, chat, notes and editors: site, title, description, image from the page metadata. The whole card opens the link in a new tab. Author can remove the preview and keep the plain link. No preview for private links that need sign-in.

**Use for**

- Links in comments and chat messages
- Links in notes and rich text
- Shared links in an activity feed

**Not for**

- Articles on your own site: use Post Card
- Attached files: use File Item
- A record inside the product: use Entity Card

**Anatomy**

1. Site: globe icon and domain
2. Title: 2 lines
3. Description: 2 lines, muted
4. Image (Show image): Image Placeholder
5. Layout: horizontal, vertical

**Content and behavior**

- The whole card opens the link in a new tab
- The author can remove the preview and keep the plain link
- No preview for private links that need sign-in
- Title and description cut at 2 lines
- While loading, a Skeleton; when the fetch fails, the plain link
- Resize: the site row fills; the domain truncates to 1 line

**Accessibility**

- One link wraps the card; its name is the title and it says it opens a new tab
- The image is decorative (alt="")
- Remove has aria-label="Remove preview"

| Variant property | Values |
|---|---|
| Layout | horizontal, vertical |

| Property | Type | Default |
|---|---|---|
| Domain | text | acme.com |
| Title | text | How we cut month-end close from nine days to five |
| Description | text | Three changes to approvals and bank matching, and the numbers behind them. |
| Show image | boolean | true |

Built from: `Image Placeholder`. Icons: globe

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [card](../../skills/build-ui/components/card.md), [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: `<a>` card (domain `truncate min-w-0`)

## Location Card

Component · 1 variant · default size 320 × 204

One office, store or venue: city with an optional tag Badge (Show tag), full address, phone and hours as Meta Items, and a Get directions link. Show map adds a Map at the top of the card (full width, card radius on top) for contact and careers pages; keep the written address either way. Use the same fields in every card of a grid (Block / Offices: 3 cards with Show map). Usage: eggux build-ui/components/card.md

**Use for**

- Contact and careers pages, in grids of 3 (Block / Offices)
- Next to a Map when there are several places
- Store finder results

**Not for**

- Saved shipping addresses: use Address Card
- One address in a record: use Description List Item
- An event at a place: use Event Card

**Anatomy**

1. Map (Show map): Map at the top, full width, card radius on top
2. Title row: city and tag Badge (Show tag): Headquarters, Store
3. Address
4. Meta Items: phone, hours (hide the hours Meta Item when unknown)
5. Directions: Button link

**Content and behavior**

- Addresses in the format of the country
- Directions opens the map app with the address
- Phone as a tel: link in international format
- Hours with days; say when a place is closed
- Same fields in every card of a grid
- Show map on contact and careers pages where people visit; the same setting on every card of a grid
- The map pin and the written address name the same place

**Accessibility**

- The city is a heading; the address is in an <address> element
- The Directions link names the place ("Directions to Berlin office") and says it opens a new tab
- Meta icons are aria-hidden
- The map has a title or alt ("Map of the Berlin office"); the written address stays the accessible content

| Property | Type | Default |
|---|---|---|
| City | text | Berlin |
| Address | text | Friedrichstraße 68, 10117 Berlin, Germany |
| Show tag | boolean | true |
| Show map | boolean | false |

Built from: `Badge`, `Button`, `Map`, `Meta Item`

Tokens and styles:
- Colors: `background/card`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/5`
- Radius: `radius/xl`
- Text styles: `body/small`, `heading/h4`

Guides: [card](../../skills/build-ui/components/card.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `Card` + `<address>`, `tel:` link, maps link (Show map: a static map image or embed on top)
