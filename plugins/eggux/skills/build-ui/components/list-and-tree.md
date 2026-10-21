# List Item and Tree Item

Usage guidelines only. Visual specs live in the Figma component.

## Which one
| Component | Use |
|---|---|
| List Item | A row of content in a list (people, files, orders): leading media, title, description, trailing meta or actions |
| Menu Item | An action inside a Menu popover (Edit, Duplicate, Delete) |
| Sidebar Item | A navigation destination in the Sidebar |
| Tree Item | A row in a hierarchy (folders, locations, permissions) |
| Table | Items compared across several attributes |

## List Item
- The whole row opens the item when it has one destination; otherwise only the title links.
- Trailing holds at most one action plus meta; more actions go in a Button Icon with a Menu.
- Long lists follow `patterns/search-and-filter.md` and `patterns/loading-states.md`.

## Tree Item
- Indent 16 px per level; at most 4 levels visible (deeper data needs a different structure).
- Chevron toggles expansion; clicking the label selects. Keyboard: arrows move, right expands,
  left collapses.
- With checkboxes, a parent is checked when all children are, indeterminate when some are.
- Counts only where they help the task (unread, items to review).

## Figma
`List Item` has native slots Leading and Trailing. `Tree Item` Type × State × Level; the
Checkbox is exposed. Examples: permissions tree, navigation tree on the List & Tree page.

## Sortable List Item
- Lists people reorder: columns of a view, form fields, steps, priorities. Show the order
  number when it matters; save on drop and allow Undo.
- Drag by the grip handle only, so the row stays clickable. Keyboard: focus the handle, Space
  picks up, arrows move, Space drops, Escape cancels; announce the new position. Also offer
  Move up / Move down in the row menu.
- Figma: `Sortable List Item` State default, hover, dragging (lifted with shadow), drop-target
  (primary line); Label truncates on one line, Description on two; Trailing slot.

## Scroll Area
- A region that scrolls inside the page: long lists in a popover, a sidebar, a table body under
  a fixed header, a row of cards. The page stays the main scroll; never nest two scroll areas
  in the same direction.
- Show that more content exists (a cut item, a fade, the scrollbar); keep keyboard scrolling.
- Figma: `Scroll Area` Orientation vertical, horizontal (own page). Clips its content on purpose.
