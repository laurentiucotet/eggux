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
cards and panels; Icon (swap), Title, Description, Actions slot. Examples: `Example / no
results` (Table page), stress test with long text and title only.

## Layout
Centered inside the area the content would occupy, not the whole page. Text styles:
`heading/h4` for title, `body/small` with `foreground/muted` for description.
