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
- `resize()` on a frame with `layoutMode = 'NONE'` applies its children's constraints: STRETCH and
  SCALE children change size, MAX children move. Set constraints first, or resize the children
  after, when they must stay as they are.

## Slots
- `component.createSlot()` creates a SLOT node and a `SLOT` property; the key is in
  `slot.componentPropertyReferences.slotContentId`. Rename with `editComponentProperty`.
- `createSlot()` turns `clipsContent` on. Turn it off on every slot.
- `figma.createFrame()` also starts with `clipsContent = true` (`createComponent()` starts with
  false). Set `clipsContent = false` on every frame you create, unless it must crop: a focus
  variant (for the ring), an image crop, a scroll area. `scan-components.js` lists the others
  as `clippingFrame`; it skips frames without children, focus variants and crop layers named in
  its `CROP_NAMES` list (image, media, viewport, track, avatar, logo...).
- In a component set, create the slot in every variant before `combineAsVariants`; same-named
  slots merge into one property. Created after combining, each variant gets its own property:
  point all slots to one key and delete the others.
- Adding a slot to every variant of an existing set: rename the first variant's slot property
  right after `createSlot()`, then for each other variant create the slot, point it to that key
  (`{ ...refs, slotContentId: k0 }`) and `deleteComponentProperty` its own key at once. Creating
  all slots first and renaming after fails ("Must pass in valid name").
- A variant that hides a slot (Side Panel collapsed, Sidebar Double collapsed) must still contain
  the SLOT node, hidden (`visible = false`). If that variant has no SLOT node, switching an
  instance to it and back loses the content placed in the slot.
- A cloned SLOT (or a new one) can be re-linked to an existing property by setting
  `slot.componentPropertyReferences = { slotContentId: key }`, then deleting the key the new slot
  created. Look the key up by name prefix in `set.componentPropertyDefinitions`.
- `combineAsVariants` merges same-named slot properties into one, and slot content placed in
  existing instances survives the merge (merging Tabs, Tabs Line and Tabs Vertical kept every
  instance's tabs).
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
- Renaming a slot node renames its SLOT property and changes the key: references in clones point at
  the old key and leave orphan properties. Rename the property (`editComponentProperty`), not the node,
  and delete orphans after cloning variants.
- Changing a property, variant or text inside a nested instance can re-create its sibling
  nodes. When editing several, re-query after each change instead of looping over a stale list.
- `isExposedInstance = true` only after the nested instance is inside the component, and only
  for instances that have properties or exposed children.
- Cloned variants lose `componentPropertyReferences`: re-wire every property after cloning.
- `resize()` on a frame or instance nested inside an instance does nothing and raises no error.
  A size the designer must change per use has to come from the component (FILL with min / max,
  a `Size` variant) or from an exposed instance that resizes with its parent.
- Swapping instances to a rebuilt set drops overrides of properties whose key changed; re-apply.
- Swapping renames the layer to the component name; do not find nested instances by their old
  layer name afterwards.
- Hidden children of instances are skipped by `findAll` / `children` unless
  `figma.skipInvisibleInstanceChildren = false`.
- Scanning blocks: call `await instance.getMainComponentAsync()` on each instance before walking
  into it. Until the main component is loaded, `findAll` does not see the content placed in the
  instance's slots, so a scan reports too few nested instances.
- A stroke cannot be bound to a boolean. For an optional divider, add a 1 px frame bound to
  `border/default` and bind its `visible`.
- TEXT properties share text styling across variants; per-variant decoration (underline) has to
  be drawn with a frame stroke.
- Copy the look of an existing variant (fills, strokes, effects, bound radius, stroke weights,
  height, opacity) instead of rebinding tokens by hand.
- A TEXT property cannot drive text inside a nested instance. Expose the nested Button, Badge or
  Chip instead (`isExposedInstance = true`); its own Label then shows in the parent's panel.
- A TEXT property has one default for every variant. When variants need different default text
  (a vacant node, a done or error state), give each its own property (Vacancy; Status, Result,
  Error) or keep plain text per variant without a property.
- Variant option order in the panel follows the order the options were created; renaming keeps
  the slot. To move an option last, move its variants out of the set (`appendChild` to the
  parent) and back in (`insertChild`): ids and property references stay.

## Icons
- Icon stroke follows size like lucide-react: stroke = 2 x size / 24 (16 px 1.33, 14 px 1.17, 20 px 1.67).
  `rescale()` keeps that; `resize()` keeps stroke 2 and the icon looks bold. After `resize()`, set the
  vectors' `strokeWeight` to 2 x width / 24 in the main component so instances inherit.
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
- Write component descriptions with `descriptionMarkdown`. Setting `description` stores quotes
  as `&quot;`, which then shows literally in the published description and in the generated
  reference. All descriptions were rewritten this way in 0.51.0.
- Setting `fontName` on a text with a text style detaches the style. Pick another text style
  (`ui/label` for a medium weight) instead.
- Load every font a text style uses (`Roboto Mono SemiBold` for `code`) before writing text.
- Drop shadow spread shows only with `clipsContent` on and a fill on the node. Focus variants
  without a background (ghost, link) need a `background/default` fill.
- A paint's own `opacity` is ignored in rendering when the color is bound to a variable (it reads
  back, but the paint draws opaque). Use the layer opacity instead: bind the node's `opacity` to
  `opacity/*` (chart area wash).

## Variables
- Variable names that do not exist throw only when used: check the scale first (there is no
  `spacing/4_5`, `spacing/5_5`, `spacing/18` or `spacing/160`; half steps stop at 3_5; widths
  like 672 come from `layout/container/*`). `N(x) || N(y)` does not fall back: N throws.
- FLOAT and STRING tokens without a Figma use (motion) get `scopes = []` and a WEB code syntax.

## Grid frames
- Assigning `gridRowSizes` / `gridColumnSizes` with a new array can be ignored. Set the
  columns at creation, then make rows hug by mutating the live objects:
  `for (const s of g.gridRowSizes) s.type = 'HUG'`, and set `layoutSizingVertical = 'HUG'`.
- Row sizes of type HUG set before the cells exist come back as FIXED 1 (the table collapses to
  one line). Set `g.gridRowSizes = Array(n).fill({ type: 'HUG' })` after the last cell is added,
  and again after content inside the cells changes height (wrapped text).
- Replacing a grid child (insert the new node, remove the old) can push the new one to an extra
  row. `setGridChildPosition` refuses an occupied cell and `gridRowCount` refuses to drop an
  occupied row: add a row, move children through it, then reduce the count.
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
- Setting any icon swap property to the icon it already shows resets the icon's stroke override
  to the icon's own color (dark on a primary button, dark in a muted Meta Item). Set the swap only
  when the icon changes, or re-bind the vector stroke after. Swapping to a different icon keeps the
  override (every icon is one `Vector` layer).
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
- Switching `layoutMode` between VERTICAL and HORIZONTAL swaps which axis is primary but keeps
  the sizing modes, so a fixed-width column becomes hug width (a 1152 container shrank to 100
  and its text wrapped one letter per line). Set `primaryAxisSizingMode` and
  `counterAxisSizingMode` again and resize after the switch.
- An auto-layout child with `layoutGrow = 1` is FIXED on that axis. Set it back to HUG before
  measuring how tall the content is.
- `createInstance()` puts the instance on the current page at 0,0 until it is appended. A
  leftover call without `appendChild` leaves a stray; list the page's top level after a build.
- A one-side stroke on a frame that stretches (FILL) inside an instance was drawn at the main
  component's height (a divider stopped at 720 in a 900 tall instance). Put the divider on the
  sibling that grows (the panel's left edge) instead.
- Charts drawn with absolute positions inside a fixed frame do not follow FILL: set constraints
  (gridlines STRETCH, bars and labels SCALE, left axis MIN, right axis MAX) so an instance in a
  narrower card redraws instead of overflowing.
- `use_figma` code can build functions from text: `new (Object.getPrototypeOf(async function(){}).constructor)('figma', 'JOBS', src)`. Store a long script in a hidden text node once and send only the data per call; delete the node after.
- An instance's SLOT accepts `appendChild` and child removal, so a page shell instance can host any component in its Page slot without detaching.
