# Sheet (side drawer) and Drawer (bottom)

Usage guidelines only. Visual specs live in the Figma components. Dialog vs Sheet vs page:
`dialog.md`.

## Which one
| Component | Use |
|---|---|
| `Sheet` right | Edit or inspect one object without leaving the list (customer, invoice, order). Filters with many groups on desktop |
| `Sheet` left | Navigation on mobile and tablet (the Sidebar inside a Sheet) |
| `Drawer` | Mobile: filters, sort, quick actions, a short form, a confirmation. Thumb reach, drag to close |
| `Dialog` | Short focused task on desktop that does not need the list behind it |
| Page | More than ~8 fields, several steps, or content the user wants to link to |
| `Side Panel` | Inline, beside the page content: details, properties or a preview of the object being edited. The page stays usable; nothing is covered |

On desktop, the content of a mobile `Drawer` usually becomes a `Dialog` (short) or a `Sheet`
(long). Keep the same Header, Content and Footer so one design covers both.

## Rules
- Title names the object or the task ("Edit contact", "Filters"). Description is optional.
- Sheet: full height, 384 wide (`spacing/96`); wider (up to 640) only for tables or previews.
  Footer stays fixed at the bottom; Content scrolls.
- Sheet footer: primary action right, Cancel `outline` to its left, same as Dialog.
- Drawer footer: full-width buttons stacked, primary first. The primary label says the result
  ("Show 24 results", not "Apply").
- Drawer: keep it under ~70% of the screen height; longer content goes in a Sheet or a page.
- Overlay `dialog/overlay` behind both. Outside click and Escape close them; with unsaved input,
  follow `patterns/unsaved-changes.md`.
- Focus moves to the first field (or the title) on open and returns to the trigger on close.
- Never open a Sheet from a Sheet. A Dialog on top of a Sheet is allowed only for a confirmation.
- Filters in a Sheet or Drawer: one `Accordion Item` (Size=sm) per group with a `Badge Count` of
  active options in Meta; see `accordion.md`.

## Side Panel
- An aside in the page grid, not an overlay. Title names what it shows ("Showcase info",
  "Properties"); Actions slot holds a menu or one Button Icon; the collapse button
  (Collapsible) folds it to a 48 px strip with the title written vertically.
- 320 wide expanded, 48 collapsed. The grid column hugs it, so Main takes the space back.
- Content reads top to bottom: Description List Items, a preview, short lists. No tabs, no long
  forms; those belong in Main or a page.
- Optional Footer: one full-width action ("View all details").
- Remember the collapsed state per user and page. Below 1024 px open it as a right Sheet.

## Figma
- `Side Panel`: State expanded, collapsed; Title; slots Actions, Content, Footer (Show footer);
  Collapsible. Examples: "Editor with side panel", "Editor with collapsed side panel".
- `Sheet`: Side right, left. `Drawer`: Show handle. Both have native slots Header, Content,
  Footer, built from `Dialog Header` and `Dialog Footer`.
- Drawer header: `Dialog Header` with Show close off (the handle and outside tap close it).
- Examples on the Drawer page: "sheet over list" (edit form with Field Presets) and "bottom drawer
  on mobile" (filter groups with checkboxes).
- `Sheet` width: 384 for details and filters, 480 for forms, 640 for a record, a table or a preview;
  full screen on mobile.

## Code
shadcn `Sheet` (`side="right" | "left"`) and `Drawer` (vaul). Responsive pattern: `Drawer` below
`md`, `Dialog` or `Sheet` from `md`.

## Related components
- List and detail, editor and preview, or code and output side by side with a draggable split use
  `Resizable Panels`; the split is remembered per person and narrow screens show one panel at a
  time.
