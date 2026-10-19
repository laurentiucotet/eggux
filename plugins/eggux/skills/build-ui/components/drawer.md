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
- Filters in a Sheet or Drawer: one `Accordion Item` (compact) per group with a `Badge Count` of
  active options in Meta; see `accordion.md`.

## Figma
- `Sheet`: Side right, left. `Drawer`: Handle (boolean). Both have native slots Header, Content,
  Footer, built from `Dialog Header` and `Dialog Footer`.
- Drawer header: `Dialog Header` with Close off (the handle and outside tap close it).
- Examples on the Drawer page: "sheet over list" (edit form with Field Presets) and "bottom drawer
  on mobile" (filter groups with checkboxes).

## Code
shadcn `Sheet` (`side="right" | "left"`) and `Drawer` (vaul). Responsive pattern: `Drawer` below
`md`, `Dialog` or `Sheet` from `md`.
