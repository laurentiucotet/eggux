# Empty State

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Empty State](#empty-state) | 4 | Actions |

On the Figma page: "Example / Empty State styles", "Example / empty state types", "Example / first invoice", "Stress test / Empty State"

## Empty State

Component set · 4 variants · default size 400 × 286

What to show when there is nothing: first use (explain and offer the first action), no results (say why and offer "Clear filters"), no access (say who can grant it), error (say what failed and offer Retry). Size default for pages and large cards, sm inside tables, cards and panels. Five cases with their own icon and action: no data yet, no results, error, no access, first run (see "empty state types").


Media: icon (icon tile, the default; lists, tables, panels and every error or no-access case), image (an Image Placeholder above the title, exposed, for a photo or illustration; first-run pages and empty dashboards where a picture shows the value of the first action). The image never replaces the title and action, and stays decorative.


Usage: eggux build-ui/patterns/empty-state.md

**Use for**

- First use: explain and offer the first action ("Create invoice")
- No results: say what was searched and offer "Clear filters"
- No access: say who can grant it
- Error: say what failed and offer Retry
- Size=default for pages and large cards, sm inside tables, cards and panels
- Media=image: first-run pages and empty dashboards where a photo or illustration shows the value of the first action

**Not for**

- Loading: use Skeleton in the shape of the content
- A whole page that failed or is forbidden: use a result page
- Field errors: inline message under the field

**Anatomy**

1. Media=icon: icon tile with an Icon (swap) that matches the object
2. Media=image: Image Placeholder 16:9 (exposed) above the title; swap the Image
3. Title ("No invoices yet")
4. Description, one sentence (Show description)
5. Actions slot (Show actions)

**Content and behavior**

- Every list and table has one
- Action only when the user may create; use the object's create label
- Centered in the area the content would occupy, not the whole page
- Media=image only for first run and onboarding; never an image that hides or replaces the title and action
- Inside a table: Size=sm under the header row
- Cleared (inbox zero): a short positive line, no action
- Five cases, each with its own icon and action (see "empty state types"): no data yet (create, import), no results (clear filters), error (try again), no access (request access), first run (set up)
- No results, error and no access always use Media=icon

**Accessibility**

- The title is a heading at the right level
- The icon is decorative (aria-hidden)
- Actions are buttons reachable by keyboard
- Description in foreground/muted keeps 4.5:1
- The image is decorative (empty alt) unless it carries information

| Variant property | Values |
|---|---|
| Size | default, sm |
| Media | icon, image |

| Property | Type | Default |
|---|---|---|
| Title | text | No invoices yet |
| Description | text | Create your first invoice or import them from your accounting system. |
| Icon | instance swap | Icon/inbox |
| Show actions | boolean | true |
| Show description | boolean | true |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`, `Image Placeholder`. Icons: inbox

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/12`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`
- Text styles: `body/default`, `body/small`, `heading/h4`, `ui/label`

Guides: [table](../../skills/build-ui/components/table.md), [empty-state](../../skills/build-ui/patterns/empty-state.md)

Code: shadcn `Empty` (or a custom block: icon, title, description, actions)
