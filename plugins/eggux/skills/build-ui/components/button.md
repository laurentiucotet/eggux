# Button

Usage guidelines only. Visual specs (sizes, padding, colors) live in the Figma component and
its variables; read them through Figma MCP, do not copy them here.

## Variants
| Variant | Use |
|---|---|
| `default` (primary) | The single main action of the view or dialog |
| `secondary` | Alternative actions with some weight |
| `outline` | Cancel, back, secondary actions next to a primary |
| `ghost` | Toolbar actions, low-emphasis actions in dense UI |
| `destructive` | The confirming action of a destructive flow, inside a confirmation |
| `link` | Navigation that looks like text, inside content |
| `soft` | Brand-colored secondary actions next to one `default` (tinted primary fill, brand text) |

## Rules
- One `default` button per view or dialog.
- Label = verb + object when ambiguous ("Save customer"). Use the client's terminology.
- Order in dialogs and forms: secondary left, primary right.
- `destructive` appears inside the confirmation step; the trigger in a list can be `ghost` or a menu item.
- Icon-only buttons need an accessible label and a tooltip.
- Loading: keep the width, show a spinner, block repeat clicks.
- Sizes: xs 28 for table rows, cards and dense toolbars, xl 48 for the one main action of a hero
  or a phone screen; one size per group.
- Disabled only when the action is truly unavailable, with a reason nearby. Never as form validation.
- On a muted card or panel, secondary actions are `outline`, never `secondary` (same color as the surface). `link` text uses `foreground/brand`.
- `link` has no side padding, so it lines up with the text column above it.
- The other actions of a group use `soft` or `secondary`: pick one for the whole group.

## Figma
- `Button`: `Variant` × `Size` (xs, sm, default, lg, xl) × `State` (default, hover, focus,
  disabled, loading). Properties: `Label`, `Show leading icon` with the `Leading icon` swap, `Show
  trailing icon` with the `Trailing icon` swap.
- `Button Icon`: icon-only, `Variant` × `Size` × `State`, `Icon` swap. Size xs 28 (table rows,
  sidebar item actions), sm 32 (tables, dense toolbars), default 36, lg 40 (next to lg Buttons).
  Pair it with a tooltip. It has `soft` too, for icon actions next to soft Buttons. Example
  "Button styles".
- `Button` State=loading: a spinner replaces the leading icon, the width stays; label stays or
  says the action in progress ("Saving…"). Block repeat clicks while loading.
- `Button Icon` State=loading while a refresh, retry or send runs; keep the size and block repeat
  clicks.
- Copy a value with `Copy Button` (Variant ghost or outline, Size like the row; State=copied
  shows a check for 2 s with the tooltip "Copied", no toast). A labelled value to copy is
  `Copy Field`.

## Common buttons built from Button and Button Icon
There is no separate component for these; build them from the base and keep the rules above.
- AI action: `Button` with Show leading icon on and the `sparkles` icon; the label is a verb
  ("Summarize"), never just "AI". Example "AI action".
- Wishlist: `Button Icon` ghost with the `heart` icon; the label says the state ("Save to
  wishlist", "Remove from wishlist"). Example "wishlist".
- Scroll to top: `Button Icon` outline, Size lg, `arrow-up`, fixed bottom right on long pages.
  Example "scroll to top".
- Sign-in providers: `Button` outline, full width, the provider mark as the leading icon, label
  "Continue with Google". Stacked, same order everywhere. Example "sign-in providers".
All four examples are on the Button page.

## Client overrides
Check `eggux/brand.md` → Overrides (for example "buttons never show icons"). In Figma, the icon
is a boolean property; turn it off in the client file rather than detaching instances.

## Button Group and Split Button
- Button Group: 2-5 related actions of equal weight joined in one control (Edit / Duplicate /
  Archive, previous / next, zoom − / +). Choosing a value is a Toggle Group, not a Button Group.
- Split Button: one main action that runs the most common choice + a chevron that opens a Menu of
  variants of the same action (Save / Save as draft / Save and close). Never hide unrelated or
  destructive actions in it.
- Figma: `Button Group Item` Position (first, middle, last) × State, Icon-only via Show label off;
  `Button Group` (Items slot); `Split Button` Variant (default, outline). Example "split button open".

## Action Bar (the row of buttons at the end)
- Ends a form, a settings section, a wizard step, a hero or a page header. One primary per bar.
- `Align=end` for forms and steps: secondary left of primary (Cancel, Save). `start` for heroes
  and page headers: primary first (Get started, Talk to sales). `center` under centered heroes,
  CTAs and empty states.
- Destructive or secondary-flow actions (Delete, Remove, Back) go in the Leading slot, on the left,
  away from the primary. Show divider when the bar closes a long form.
- Not for: Dialog footers (the Dialog has its own), unsaved changes that follow the scroll (Save
  Bar), related actions joined in one control (Button Group).
- On phones end checkout, product and wizard screens with `Action Bar` Style=sticky-mobile: a
  summary line (Show summary, "Total" and the amount) plus xl Buttons that share the width.
- Figma: `Action Bar` Align (end, start, center) × Style (default, sticky-mobile); Show divider,
  Show leading; Leading and Actions slots. Used in the hero, page header, CTA, empty page and
  import blocks. Example "sticky mobile action bar".

## Toolbar
- A row (or column) of controls that act on one surface: editor formatting, canvas zoom and
  tools, a media or file viewer. Groups of `Toggle`s and `Button Icon`s split by `Separator`s,
  most used first.
- Style=default inside a frame (editor header, card top); Style=floating over a canvas or image
  (popover surface, shadow). Orientation=vertical for tool columns at the side of a canvas.
- Narrow toolbars move the last groups into the overflow (Show overflow, ellipsis Menu); never
  wrap to two rows.
- Every icon-only control has a tooltip with its shortcut; Arrow keys move inside the toolbar
  (`role="toolbar"`), Tab leaves it.
- Not for page actions (Page Header Actions), list filters (Filter Bar) or a selection's actions
  (Bulk Action Bar, Table Toolbar).
- Figma: `Toolbar` Orientation × Style; Items slot, Show overflow. Toolbar page, examples "editor
  toolbar" and "canvas zoom".
