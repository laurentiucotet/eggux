# Badge

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Badge](#badge) | 24 | - |
| [Badge Count](#badge-count) | 4 | - |
| [Status Dot](#status-dot) | 5 | - |
| [Badge List](#badge-list) | 1 | Tags |
| [Announcement Pill](#announcement-pill) | 1 | - |
| [Trust Badge](#trust-badge) | 3 | - |

On the Figma page: "Example / Trust Badge tones", "Example / dataset header", "Example / filter panel", "Example / in announcement banner", "Example / in filtered list", "Example / stock status", "Stress test / Announcement Pill", "Stress test / Badge", "Stress test / Badge Count", "Stress test / Badge List", "Stress test / Status Dot", "Stress test / Trust Badge"

## Badge

Component set · 24 variants · default size 55 × 20

shadcn Badge plus EGG status variants. Solid: default, secondary, destructive, outline, success, warning, info. Soft (tinted fill, colored text, calm color for tables and lists): soft-success, soft-warning, soft-destructive, soft-info, soft-neutral; their colors come from badge/soft-{status}-bg and badge/soft-{status}-fg (4.5:1 or more in every mode). Shape: rounded (default) or pill. Options: Icon, Dot (status dot), Count (number after the label). Text carries the meaning; map each status to one variant and use one style (solid or soft) per table. Usage: eggux build-ui/components/badge.md

**Use for**

- Status of an object (Paid, Overdue, Draft) next to its name
- Category of an item
- A count after a label (Count on: "Invoices 12")
- Variant=soft-* for statuses repeated down a table or list (Paid, Pending, Overdue), so the page gets calm color

**Not for**

- Filters and selections: use Chip
- A number alone on an icon or sidebar item: use Badge Count
- State of a system or person in text flow: use Status Dot

**Anatomy**

1. Variant: solid default, secondary, destructive, outline, success, warning, info; soft soft-success, soft-warning, soft-destructive, soft-info, soft-neutral
2. Shape: rounded or pill
3. Icon (Show icon, Icon swap) or Dot (Show dot), in the label color
4. Label
5. Count value (Show count)

**Content and behavior**

- Text carries the meaning; color only reinforces it
- One or two words, sentence case
- Map each status to one Variant once and reuse it; a status never appears in two colors
- Neutral: secondary, outline or soft-neutral; done: success; pending: warning; failed: destructive; new: info
- One style per table or list: all solid or all soft
- Soft colors come from badge/soft-*-bg (status color at opacity 10 in Light, 20 in Dark) and badge/soft-*-fg; never recolor by hand
- Not clickable
- Next to the primary information of a row, never instead of it

**Accessibility**

- Label meets 4.5:1 on every Variant; warning uses dark text (solid) or amber/800 (soft)
- Soft labels measured 5.5 to 11 : 1 in Light, Dark, Corporate Light and Corporate Dark
- Never a color or dot alone
- Not focusable: it is static text

| Variant property | Values |
|---|---|
| Variant | default, secondary, destructive, outline, success, warning, info, soft-success, soft-warning, soft-destructive, soft-info, soft-neutral |
| Shape | rounded, pill |

| Property | Type | Default |
|---|---|---|
| Label | text | Badge |
| Show icon | boolean | false |
| Icon | instance swap | Icon/check |
| Show dot | boolean | false |
| Show count | boolean | false |
| Count value | text | 3 |

Icons: check

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/primary`, `background/secondary`, `background/success`, `background/warning`, `badge/soft-destructive-bg`, `badge/soft-destructive-fg`, `badge/soft-info-bg`, `badge/soft-info-fg`, `badge/soft-neutral-bg`, `badge/soft-neutral-fg`, `badge/soft-success-bg`, `badge/soft-success-fg`, `badge/soft-warning-bg`, `badge/soft-warning-fg`, `border/default`, `foreground/default`, `foreground/destructive`, `foreground/info`, `foreground/primary`, `foreground/secondary`, `foreground/success`, `foreground/warning`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/full`, `radius/md`
- Text styles: `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md), [card](../../skills/build-ui/components/card.md), [content](../../skills/build-ui/components/content.md), [indicators](../../skills/build-ui/components/indicators.md), [table](../../skills/build-ui/components/table.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Badge` (+ success, warning, info variants; soft-success, soft-warning, soft-destructive, soft-info, soft-neutral as cva variants `bg-[var(--badge-soft-X-bg)] text-[var(--badge-soft-X-fg)]`) (Status Dot: custom span + label. Soft = status color at 10% (Light) / 20% (Dark) with a darker or lighter text step; one style per table)

## Badge Count

Component set · 4 variants · default size 20 × 20

Numeric counter (notifications, unread, items in a nav entry). Use "99+" above 99. Place on an icon button corner or at the end of a sidebar item.

**Use for**

- Corner of an icon button, such as the notifications bell
- End of a sidebar item
- Meta of an Accordion Item: active filters in that group

**Not for**

- A count after a text label: use Badge with Count
- A status word: use Badge

**Anatomy**

1. Count: digits only, "99+" above 99
2. Round container colored by Variant: default, secondary, destructive, outline
3. Position: icon button corner or the end of a sidebar item

**Content and behavior**

- Above 99 show "99+"
- Only for something the user must act on (unread, pending); never decorative
- Numbers only; words belong in a Badge

**Accessibility**

- The count is part of the accessible name ("Notifications, 3 unread")
- Count changes that matter are announced politely
- Text meets 4.5:1 on every Variant

| Variant property | Values |
|---|---|
| Variant | default, secondary, destructive, outline |

| Property | Type | Default |
|---|---|---|
| Count | text | 3 |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `background/secondary`, `border/default`, `foreground/default`, `foreground/destructive`, `foreground/primary`, `foreground/secondary`
- Spacing and size: `spacing/1_5`, `spacing/5`
- Radius: `radius/full`
- Text styles: `ui/label-small`

Guides: [badge](../../skills/build-ui/components/badge.md), [drawer](../../skills/build-ui/components/drawer.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: shadcn `Badge` (+ success, warning, info variants; soft-success, soft-warning, soft-destructive, soft-info, soft-neutral as cva variants `bg-[var(--badge-soft-X-bg)] text-[var(--badge-soft-X-fg)]`) (Status Dot: custom span + label. Soft = status color at 10% (Light) / 20% (Dark) with a darker or lighter text step; one style per table)

## Status Dot

Component set · 5 variants · default size 60 × 20

State of a system, service or person in text flow and tables (Online, Down, Syncing). Always with a label; dot alone only where the label is right next to it (avatar status). For a label inside a pill use Badge with Dot.

**Use for**

- Online, Degraded, Down, Syncing, Offline in text flow and tables
- Presence next to an Avatar (dot alone)
- Integration and sync status in settings

**Not for**

- A label inside a pill: use Badge with Dot
- Status of an object (Paid, Overdue): use Badge

**Anatomy**

1. Dot colored by Status: success, warning, error, info, neutral
2. Label (Show label)
3. Inline placement in text flow or a table cell

**Content and behavior**

- Always with a label; color is never the only signal
- Dot alone only right next to its label, as in avatar status
- Each state maps to one Status value

**Accessibility**

- The Label is real text; the dot is aria-hidden
- A dot alone has a text equivalent for screen readers
- The dot meets 3:1 against its background

| Variant property | Values |
|---|---|
| Status | success, warning, error, info, neutral |

| Property | Type | Default |
|---|---|---|
| Label | text | Online |
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/success`, `background/warning`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [badge](../../skills/build-ui/components/badge.md), [indicators](../../skills/build-ui/components/indicators.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `Badge` (+ success, warning, info variants; soft-success, soft-warning, soft-destructive, soft-info, soft-neutral as cva variants `bg-[var(--badge-soft-X-bg)] text-[var(--badge-soft-X-fg)]`) (Status Dot: custom span + label. Soft = status color at 10% (Light) / 20% (Dark) with a darker or lighter text step; one style per table)

## Badge List

Component · 1 variant · default size 243 × 22

A few tags or labels on one line with "+N" for the rest: category, status, region, format. Badges go in the Tags slot (outline for neutral labels, a status Variant only when it means something); the +N Badge opens the full list in a Tooltip or Popover. Show 2-4, keep labels to one or two words. Filters people remove use Chip; a single status uses Badge or Status Dot.

**Use for**

- Category, format and region of a dataset, an article or a job
- Labels under a page title
- Tags in a card or a table row with limited space

**Not for**

- Filters people remove: use Chip
- One status: use Badge or Status Dot
- Choosing tags: use a multi Select or a Combobox

**Anatomy**

1. Tags slot: Badges (outline for neutral labels)
2. +N Badge (Show more, exposed): secondary, opens the full list

**Content and behavior**

- Show 2-4 tags, then +N
- One or two words per tag, sentence case
- Status colors only when the tag means a status
- Same order everywhere (type, frequency, region)

**Accessibility**

- Code as a list (ul) with a label ("Tags")
- +N is a button that names the hidden tags in its Tooltip or Popover
- Tags that link to a listing are links, not buttons

| Property | Type | Default |
|---|---|---|
| Show more | boolean | true |

Slots (fill them in the instance, never detach): `Tags`

Built from: `Badge`

Tokens and styles:
- Spacing and size: `spacing/1_5`

Guides: [badge](../../skills/build-ui/components/badge.md), [content-and-docs](../../skills/build-ui/patterns/content-and-docs.md)

Code: `<ul class="flex gap-1.5">` of shadcn `Badge`; "+N" as a `Popover` trigger

## Announcement Pill

Component · 1 variant · default size 276 × 26

A short link above a hero title to the newest launch: "New" tag, one line, arrow. Links to the announcement or changelog. One at a time; remove it after a few weeks. Product notices inside the app use Alert.

**Use for**

- Above the Hero title for a launch or a release
- Top of a changelog or a product page for the latest version

**Not for**

- Product notices inside the app: use Alert
- A site-wide message above the Navbar: use Block / Announcement Banner
- A status or a label: use Badge

**Anatomy**

1. Tag Badge (Show tag): "New"
2. Label: one line
3. Arrow icon: arrow-right

**Content and behavior**

- One at a time; remove it after a few weeks
- Links to the announcement or the changelog
- Label is one line (about 40 characters) and says what is new
- Tag says "New" or "Beta", nothing louder
- Never for errors or outages

**Accessibility**

- The whole pill is one link; its name reads tag and label ("New: Automations for every team")
- The arrow icon is aria-hidden
- Visible focus ring around the pill; label meets 4.5:1

| Property | Type | Default |
|---|---|---|
| Label | text | Automations for every team |
| Show tag | boolean | true |

Built from: `Badge`. Icons: arrow-right

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/full`
- Text styles: `ui/label`

Guides: [badge](../../skills/build-ui/components/badge.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<a>` (`rounded-full border`) + shadcn `Badge` + lucide `ArrowRight` (One at a time)

## Trust Badge

Component set · 3 variants · default size 199 × 54

A certification or compliance claim: SOC 2, ISO 27001, GDPR, PCI DSS. Name and what backs it (audit date, region). Only claims that are current and can be shown on request; link to the trust page. In footers, pricing and security sections, sign-up pages for enterprise buyers.


Tone: default on page and card backgrounds; on-primary on primary bands and cards (name, detail, icon and border in foreground/primary, 5.2:1 Light and Dark, 6.7:1 Corporate Light); inverted on inverted cards such as Plan Card inverted and Pricing Enterprise Banner (text and icon in background/default, detail in background/muted). Never override the colors by hand.


Usage: eggux build-ui/components/badge.md

**Use for**

- Footers (Block / Footer Corporate)
- Pricing and security sections
- Sign-up pages for enterprise buyers
- A trust or security page

**Not for**

- Customer logos: use Logo Tile
- Customer proof in words: use Testimonial Card
- The status of a record: use Badge

**Anatomy**

1. Icon (swap): shield-check
2. Name: "SOC 2 Type II"
3. Description: muted, audit date or region
4. Tone: default, on-primary (name, detail, icon and border in foreground/primary), inverted (name and icon in background/default, detail in background/muted, border/default)

**Content and behavior**

- Only claims that are current and can be shown on request
- Description says what backs it ("Audited September 2026", "Data in the EU")
- Link to the trust page
- Update or remove it when a certificate expires
- Same order everywhere; 3-5 in a row
- Name and Description wrap inside the border when the badge is narrower than its text; set Fill in rows of equal badges
- Tone=on-primary on primary bands and cards, Tone=inverted on inverted cards (Plan Card inverted, Pricing Enterprise Banner); never override the colors by hand

**Accessibility**

- The icon is aria-hidden; name and detail are text, not part of an image
- When linked, the link names the claim ("SOC 2 Type II report")
- The muted detail meets 4.5:1
- on-primary: foreground/primary on background/primary is 5.2:1 Light and Dark, 6.7:1 Corporate Light; inverted: background/default and background/muted on foreground/default are over 14:1 in every theme

| Variant property | Values |
|---|---|
| Tone | default, on-primary, inverted |

| Property | Type | Default |
|---|---|---|
| Name | text | SOC 2 Type II |
| Description | text | Audited September 2026 |
| Icon | instance swap | Icon/shield-check |

Icons: shield-check

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [badge](../../skills/build-ui/components/badge.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: custom: lucide icon + name and detail, `<a>` to the trust page (Only current claims. Tone=on-primary: `text-primary-foreground border-primary-foreground`; Tone=inverted: `text-background border-border`, detail `text-muted` (on `bg-foreground` cards))
