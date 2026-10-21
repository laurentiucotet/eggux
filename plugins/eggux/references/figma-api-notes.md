# Figma Plugin API notes (learned building EGG UI v2)

Read before any `use_figma` write to the library or a client file. Each line cost a failed run.

## Sizing and layout
- `resize()` sets both sizing modes to FIXED, every time. Resize first, then set hug back
  (`primaryAxisSizingMode = 'AUTO'` or `layoutSizing* = 'HUG'`). Forgetting it left Buttons,
  Tabs, Avatars, Tag, Input Addon and Split Button at a fixed width.
- `layoutSizingHorizontal/Vertical = 'FILL'` works only after the node is in an auto-layout parent.
- A new frame clips by default and is 100 x 100. A GRID frame needs a width or FILL from its
  parent, or columns are cut off. A slot cannot be GRID.
- A text set to FILL before it has content can collapse to width 0 (one letter per line): set
  `characters` and `textAutoResize = 'HEIGHT'` first, then FILL.
- Resizing a frame inside an instance (not the instance itself) is ignored. Proportional fills
  (Progress indicator) use a non-auto-layout parent and `constraints.horizontal = 'SCALE'`.
- An instance whose main component has a bound `width` ignores FILL until the binding is
  removed. Blocks let their inner Card FILL so they stretch.
- Adding FILL children to an auto-layout row resizes the earlier ones each time; fill
  non-auto-layout columns (grids, calendars) only after all columns exist, or their children's
  constraints distort them.
- Max width that still hugs (chat bubbles): parent HUG with `maxWidth`, text inside on FILL. Short
  text hugs, long text wraps at the max.
- `resize()` on an auto-layout frame you want to hug in height (a thread, a column) fixes both
  axes: set `primaryAxisSizingMode = 'AUTO'` again, or later children overlap.
- `maxLines` only sticks when `textTruncation = 'ENDING'` is set first; without it, wrapping
  text stays on one line.
- Constraint enums are `MIN | CENTER | MAX | STRETCH | SCALE` (not TOP/BOTTOM/LEFT/RIGHT).

## Slots
- `component.createSlot()` creates a SLOT node and a `SLOT` property; the key is in
  `slot.componentPropertyReferences.slotContentId`. Rename with `editComponentProperty`.
- `createSlot()` turns `clipsContent` on. Turn it off on every slot.
- `figma.createFrame()` also starts with `clipsContent = true` (`createComponent()` starts with
  false). Set `clipsContent = false` on every frame you create, unless it must crop: a focus
  variant (for the ring), an image crop, a scroll area. `scan-components.js` lists the others
  as `clippingFrame`.
- In a component set, create the slot in every variant before `combineAsVariants`; same-named
  slots merge into one property. Created after combining, each variant gets its own property:
  point all slots to one key and delete the others.
- Never assign `slot.componentPropertyReferences = { visible: k }`: it drops `slotContentId` and
  the slot becomes a plain FRAME. Merge: `{ ...slot.componentPropertyReferences, visible: k }`.
  The scan reports this as `brokenSlot`.
- `clone()` of a variant turns its SLOT into a FRAME named after the property, and the clone may
  land outside the set, on the current page (once on Cover). Append it (`set.appendChild(clone)`), then for each such frame:
  `v.createSlot()`, copy layout and bound padding, move the children in, delete the frame,
  point the slot to the existing keys (`{ slotContentId: K('Content'), visible: K('Show content') }`)
  and `set.deleteComponentProperty()` the key the new slot created. Run the scan after.
- `findOne(n => n.name === 'value')` can hit a TEXT layer with the same name inside a nested
  component. Filter by type (`n.type === 'INSTANCE'`) when looking for nested instances.
- The plugin sandbox has no `Intl`: `toLocaleString` ignores locales and grouping. Format
  numbers by hand.
- `component.findAll(n => n.type === 'SLOT')` also returns slots inside nested instances (an
  Input Group's Start slot). Take the component's own slot from `component.children` or check
  `slot.parent`.
- In an instance, and in the main component after `editComponentProperty`, a slot node is named
  after its property (`Content`, `Footer`). Find slots by type and name or position.
- Fill an instance slot before moving that instance into another instance's slot; references to
  nested nodes are invalid after the move.

## Instances and properties
- Changing a property, variant or text inside a nested instance can re-create its sibling
  nodes. When editing several, re-query after each change instead of looping over a stale list.
- `isExposedInstance = true` only after the nested instance is inside the component, and only
  for instances that have properties or exposed children.
- Cloned variants lose `componentPropertyReferences`: re-wire every property after cloning.
- Swapping instances to a rebuilt set drops overrides of properties whose key changed; re-apply.
- Swapping renames the layer to the component name; do not find nested instances by their old
  layer name afterwards.
- Hidden children of instances are skipped by `findAll` / `children` unless
  `figma.skipInvisibleInstanceChildren = false`.
- A stroke cannot be bound to a boolean. For an optional divider, add a 1 px frame bound to
  `border/default` and bind its `visible`.
- TEXT properties share text styling across variants; per-variant decoration (underline) has to
  be drawn with a frame stroke.
- Copy the look of an existing variant (fills, strokes, effects, bound radius, stroke weights,
  height, opacity) instead of rebinding tokens by hand.

## Icons
- Keep every icon one layer named `Vector`, or swapped icons come out partly in the default color.
- An INSTANCE_SWAP property on a node forces its default on every variant: do not bind the swap
  when variants need different icons.
- Components without an icon swap property (Menu Item): swap the nested icon with
  `iconInstance.swapComponent(Icon/...)`.
- New icons from Lucide SVG: convert the path (relative commands, H/V, arcs to cubic curves),
  translate to the bounding box, set `vectorPaths`, then place the vector at the box origin.
- Setting an INSTANCE_SWAP to the icon it already shows resets the nested color override (a plus
  in a primary Button turns dark). Set the swap only when the icon changes.
- Flattening a main component empties existing instances. Record their colors first, then
  `resetOverrides()` each instance and re-apply.
- New icon: clone an existing icon component, set `vectorPaths` with coordinates relative to the
  vector's top-left, then position the vector in the 24 grid. Arcs must be written as curves.

## Text and styles
- Setting `fontName` on a text with a text style detaches the style. Pick another text style
  (`ui/label` for a medium weight) instead.
- Load every font a text style uses (`Roboto Mono SemiBold` for `code`) before writing text.
- Drop shadow spread shows only with `clipsContent` on and a fill on the node. Focus variants
  without a background (ghost, link) need a `background/default` fill.
- A paint's own `opacity` is lost when the color is bound to a variable; bind the node's
  `opacity` to `opacity/*` instead (chart area wash).

## Variables
- Variable names that do not exist throw only when used: check the scale first (there is no
  `spacing/4_5`, `spacing/5_5`, `spacing/18` or `spacing/160`; half steps stop at 3_5; widths
  like 672 come from `layout/container/*`). `N(x) || N(y)` does not fall back: N throws.
- FLOAT and STRING tokens without a Figma use (motion) get `scopes = []` and a WEB code syntax.

## Grid frames
- Assigning `gridRowSizes` / `gridColumnSizes` with a new array can be ignored. Set the
  columns at creation, then make rows hug by mutating the live objects:
  `for (const s of g.gridRowSizes) s.type = 'HUG'`, and set `layoutSizingVertical = 'HUG'`.
- Place cells with `cell.setGridChildPosition(row, col)`; span with `cell.gridColumnSpan`.
- `rescale()` breaks GRID frames (rows overlap); place grids 1:1 and crop instead.

## Unsupported here
- `figma.loadAllPagesAsync()` and `figma.setFileThumbnailNodeAsync()` are not available in
  `use_figma`. Load pages one by one with `page.loadAsync()`; set the thumbnail by hand
  (right click the Cover frame, Set as thumbnail).
- `rescale()` scales text sizes and detaches text styles: use it only for artwork (the Cover).
- Switching a frame from a wrapping HORIZONTAL layout to VERTICAL leaves it broken (texts
  collapse to 0 width). Create the frame with the final direction.
- Children of a boolean operation keep their own fills; clear them, the boolean's fill is what
  shows.

## Vectors and pages
- `figma.createVector()` starts with a default black stroke: set `strokes = []` (or a token) on
  every vector you fill, or the scan reports a raw stroke.
- Two pages can share a name (`Navigation` in COMPONENTS and in BLOCKS). Find block pages by
  searching after the BLOCKS divider.

- A paint bound with `setBoundVariableForPaint` keeps the base color you pass. In a call that
  also creates variables, screenshots (and sometimes the canvas) draw that base color, so a
  `{r:0,g:0,b:0}` base shows black. Pass the resolved color as the base:
  `v.resolveForConsumer(node).value`.
- `combineAsVariants` on a used component keeps its id, its instances and their slot content,
  but gives every component property a new key (`Header#48:0` → `Header#229:12`). Look keys up
  by name prefix, never hard-code them.

- An empty auto-layout frame from `createFrame()` keeps its 100 px default height when it hugs;
  a spacer must be `layoutSizingVertical = 'FIXED'` and resized to 1.
- `editComponentProperty` on a slot property fails after `combineAsVariants` ("Must pass in
  valid name…"). Rename slots in each variant before combining.
- Setting a Button's icon swap property to the icon it already shows resets the icon's stroke
  override to the icon's own color (dark on a primary button). Re-bind the vector stroke to the
  label's color after swapping, or pick the icon on the main component.
- A TEXT property has one default for all variants. When variants need different default text
  (Note, Increase, Decrease), give each variant its own property.

## Safety
- New and cloned nodes go to the current page, which may be any page a previous call left
  open. Start every call that creates nodes with `await figma.setCurrentPageAsync(page)`, and
  end a session of edits by listing each touched page's top-level nodes for strays.
- A failed `use_figma` call is rolled back as a whole; fix and rerun. Wrap multi-node builds in
  try/catch that removes what the call created.
- `getInstancesAsync()` also returns instances inside deleted nodes; filter by a page ancestor
  before deciding a component is unused.
- `node.description` reads back HTML-escaped (`&quot;`). Appending to it and writing it back escapes again (`&amp;quot;`). Unescape first, or rewrite the whole description.
- Boolean operation nodes (`figma.subtract`, `union`) have no `constraints`. To keep a cut-out centered when the parent resizes, put the boolean in a frame and set the frame's constraints.
- `frame.resize(w, h)` on an auto-layout frame sets both axes to FIXED. Set `layoutSizingVertical = 'HUG'` again for a column that must grow with its text.
