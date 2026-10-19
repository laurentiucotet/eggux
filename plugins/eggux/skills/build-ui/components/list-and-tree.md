# List Item and Tree Item

Usage guidelines only. Visual specs live in the Figma component.

## Which one
| Component | Use |
|---|---|
| List Item | A row of content in a list (people, files, appointments): leading media, title, description, trailing meta or actions |
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
