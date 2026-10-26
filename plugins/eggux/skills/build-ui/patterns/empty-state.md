# Pattern: empty state

**Problem:** an empty list or screen looks broken and leaves the user without a next step.
**Heuristic:** visibility of system status, help users recognize what to do.

## Types
| Type | Cause | Content |
|---|---|---|
| First use | The actor has never created one | What this is for + primary CTA to create the first one |
| No results | Search or filter matched nothing | Say what was searched + "Clear filters" action |
| Cleared | User finished everything (inbox zero) | Short positive confirmation, no CTA needed |
| Error | Data could not load | What failed + "Try again" |
| No permission | Actor cannot see this | Who to ask, never a blank area |

## Content
- Title: one short line in the client's voice ("No invoices yet").
- Description: one sentence on what will appear here or what to do.
- CTA: only if the actor is permitted to create (check actors.md). Use the object's create CTA.
- Visual: optional icon or illustration, muted, never larger than the content it replaces.

## Component
`Empty State` (Empty State page): Size default for pages and large cards, sm inside tables,
cards and panels; Media icon or image; Icon (swap), Title, Description, Actions slot. Examples:
`Example / no results` (Table page), stress test with long text and title only.
- Media=icon is the default. Media=image (a 16:9 Image Placeholder above the title, decorative)
  only for first run and onboarding: first-run pages and empty dashboards where a picture shows
  the value of the first action. The image never hides or replaces the title and action. No
  results, error and no access always use Media=icon. Example "Empty State styles".
- The example "empty state types" on the Empty State page shows the five cases with their icon,
  copy and actions: no data yet (inbox; create, import), no results (search; clear filters), error
  (circle-alert; try again), no access (lock; request access), first run (sparkles; set up).
- `Block / Empty States Set` (App page) shows the three empty reasons (no results, no access,
  first use with an image) and Size=sm inside a table or card; copy one state, not the set.

## Layout
Centered inside the area the content would occupy, not the whole page. Text styles:
`heading/h4` for title, `body/small` with `foreground/muted` for description.
