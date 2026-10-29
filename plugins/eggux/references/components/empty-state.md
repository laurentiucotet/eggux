# Empty State

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Empty State](#empty-state) | 8 | Actions |

On the Figma page: "Example / Empty State styles", "Example / Empty State tones and illustrations", "Example / empty state types", "Example / first invoice", "Stress test / Empty State"

## Empty State

Component set · 8 variants · default size 400 × 286

What to show when there is nothing: first use (explain and offer the first action), no results (say why and offer "Clear filters"), no access (say who can grant it), error (say what failed and offer Retry). Size default for pages and large cards, sm inside tables, cards and panels. Five cases with their own icon and action: no data yet, no results, error, no access, first run (see "empty state types").


Media: icon (icon tile, the default; lists, tables, panels and every error or no-access case), illustration (a Spot Illustration, exposed: pick its Type; first-run pages, empty dashboards and onboarding where a picture helps but a photo is not the point; 120 px, 80 in sm), image (an Image Placeholder above the title, exposed, for a photo or product screenshot that shows the value of the first action). Media never replaces the title and action, and stays decorative.


Tone: default, error (Media=icon only: soft destructive tile with an alert icon, its own Error title and Error description, and a Try again Button; for a widget, chart, table or search that failed to load). A whole page that failed uses a result page instead.


Usage: eggux build-ui/patterns/empty-state.md

**Use for**

- First use: explain and offer the first action ("Create invoice")
- No results: say what was searched and offer "Clear filters"
- No access: say who can grant it
- Error: say what failed and offer Retry
- Size=default for pages and large cards, sm inside tables, cards and panels
- Media=illustration: first-run pages, empty dashboards and onboarding where a picture helps but a photo is not the point
- Media=image: a photo or product screenshot that shows the value of the first action
- Tone=error: a widget, chart, table or search that failed to load

**Not for**

- Loading: use Skeleton in the shape of the content
- A whole page that failed or is forbidden: use a result page
- Field errors: inline message under the field

**Anatomy**

1. Media=icon: icon tile with an Icon (swap) that matches the object
2. Media=illustration: Spot Illustration (exposed, pick its Type), 120 (80 in Size=sm)
3. Media=image: Image Placeholder 16:9 (exposed) above the title; swap the Image
4. Title ("No invoices yet")
5. Description, one sentence (Show description)
6. Actions slot (Show actions)
7. Tone=error (Media=icon): tile badge/soft-destructive-bg with triangle-alert in badge/soft-destructive-fg; Error title and Error description (own text properties); Actions: Button outline "Try again" with refresh-cw

**Content and behavior**

- Every list and table has one
- Action only when the user may create; use the object's create label
- Centered in the area the content would occupy, not the whole page
- Inside a table: Size=sm under the header row
- Cleared (inbox zero): a short positive line, no action
- Five cases, each with its own icon and action (see "empty state types"): no data yet (create, import), no results (clear filters), error (try again), no access (request access), first run (set up)
- No results, error and no access always use Media=icon
- Media=illustration or image only for first run, empty dashboards and onboarding; never an image that hides or replaces the title and action
- Tone=error: say what failed and that data is safe, offer Try again; Error title and Error description are separate properties, so set them after switching Tone
- FILL the area; text centered; works from 276 (Size=sm)

**Accessibility**

- The title is a heading at the right level
- The icon is decorative (aria-hidden)
- Actions are buttons reachable by keyboard
- Description in foreground/muted keeps 4.5:1
- The image is decorative (empty alt) unless it carries information
- Tone=error: announce with role="alert" when it replaces content that was loading

| Variant property | Values |
|---|---|
| Size | default, sm |
| Media | icon, image, illustration |
| Tone | default, error |

| Property | Type | Default |
|---|---|---|
| Title | text | No invoices yet |
| Description | text | Create your first invoice or import them from your accounting system. |
| Icon | instance swap | Icon/inbox |
| Show actions | boolean | true |
| Show description | boolean | true |
| Error title | text | Could not load invoices |
| Error description | text | Check your connection and try again. If it keeps failing, contact support. |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`, `Image Placeholder`, `Spot Illustration`. Icons: inbox, triangle-alert

Tokens and styles:
- Colors: `background/muted`, `badge/soft-destructive-bg`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/12`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`
- Text styles: `body/default`, `body/small`, `heading/h4`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md), [empty-state](../../skills/build-ui/patterns/empty-state.md)

Code: shadcn `Empty` (or a custom block: icon, title, description, actions)
