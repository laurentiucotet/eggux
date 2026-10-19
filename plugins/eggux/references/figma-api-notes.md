# Figma Plugin API notes (learned building EGG UI v2)

Read before any `use_figma` write to the library or a client file. Each line cost a failed run.

## Layout
- `resize()` sets both sizing modes to FIXED. Call it first, then set `primaryAxisSizingMode =
  'AUTO'` (hug) or `layoutSizing* = 'HUG'`. Forgetting this leaves buttons, tabs and avatars at
  a fixed width.
- `layoutSizingHorizontal/Vertical = 'FILL'` works only after the node is appended to an
  auto-layout parent.
- A new frame clips by default and is 100 x 100. A GRID frame needs a width or FILL from its
  parent, or columns are cut off.

- Changing a text or property inside a nested instance can re-create sibling nodes: when editing
  many texts in one component, re-query after each change instead of looping over a stale list.
- An instance whose main component has a bound `width` ignores FILL until the binding is removed;
  blocks should let their inner Card FILL so they stretch.
- Resizing a frame inside an instance (not an instance itself) is ignored. For proportional fills
  (Progress indicator) use a non-auto-layout parent and `constraints.horizontal = 'SCALE'`.
- Every `resize()` on a hug component turns it FIXED again: set `primaryAxisSizingMode = 'AUTO'`
  after the last resize (Tag, Input Addon and Split Button were built fixed by mistake).
- A text appended to a slot and set to FILL before it has content can collapse to width 0: set
  `characters` and `textAutoResize = 'HEIGHT'` first, then FILL.

## Slots
- `component.createSlot()` creates a SLOT node and a `SLOT` property; the key is in
  `slot.componentPropertyReferences.slotContentId`. Rename with `editComponentProperty`.
- `createSlot()` turns `clipsContent` on. Turn it off on every slot.
- In a component set, create the slot in every variant before `combineAsVariants`; same-named
  slots merge into one property. Created after combining, each variant gets its own property:
  point all slots to one key and delete the others.
- `clone()` of a variant turns its SLOT into a FRAME named after the property. Clone first, then
  create slots; or delete that frame and create a fresh slot.
- In an instance, a slot node is named after its property (`Content`, `Footer`), not the layer
  name used in the main component. Find slots by type and name.
- A slot cannot have `layoutMode = 'GRID'`.
- Never assign `slot.componentPropertyReferences = { visible: k }`: it drops `slotContentId` and
  the slot becomes a plain FRAME. Merge instead:
  `slot.componentPropertyReferences = { ...slot.componentPropertyReferences, visible: k }`.
  The scan reports this as `brokenSlot`.
- Fill an instance slot before moving that instance into another instance's slot; references to
  nested nodes are invalid after the move.

## Instances and properties
- `isExposedInstance = true` only after the nested instance is inside the component.
- TEXT properties share text styling across variants; per-variant decoration (underline) has to
  be drawn with a frame stroke.
- An INSTANCE_SWAP property on a node forces the default component on every variant. For
  per-variant icons, do not bind the swap.
- Cloned variants lose `componentPropertyReferences`: re-wire every property after cloning.
- Setting an INSTANCE_SWAP to the component it already shows resets that nested instance to the
  main icon's own overrides (e.g. a plus in a primary Button turns dark). Set the swap only when
  the icon changes.
- `setProperties({ State })` on one nested instance re-creates sibling instances inside the same
  parent instance: re-query nodes after each change instead of reusing a list.
- A stroke cannot be bound to a boolean. For an optional divider, add a 1 px frame bound to
  `border/default` and bind its `visible`.
- Swapping an instance renames its layer to the component name; do not look nested instances
  up by their original layer name after a swap.
- Hidden children of instances are skipped by `findAll` / `children` unless
  `figma.skipInvisibleInstanceChildren = false`; hidden icons then look empty.
- After `editComponentProperty` renames a slot property, the slot node in the main component
  takes the property name too; find slots by type and position, not by the original layer name.
- An instance can be exposed only if it has properties or exposed children (`isExposedInstance`
  fails on a Navbar or Footer without properties).
- Swapping instances to a rebuilt set drops overrides of properties whose key changed; re-apply them.

- Setting `fontName` on a text with a text style detaches the style. Use another text style
  (`ui/label` for a medium weight) instead of overriding the font.
- Copy the look of an existing variant (fills, strokes, effects, bound radius, stroke weights,
  height, opacity) instead of rebinding tokens by hand: Textarea, Combobox, Date Picker and
  Pagination Item reuse Input, Select and Button this way.

## Icons
- Swaps keep stroke overrides only on layers that match by position. Keep every icon a single
  layer named `Vector` (`figma.flatten`), or swapped icons come out partly in the default color.
- Flattening a main component empties existing instances. Record their colors first, then
  `resetOverrides()` each instance and re-apply.

## Effects and styles
- Drop shadow spread shows only with `clipsContent` on and a fill on the node. Focus variants
  without a background (ghost, link) need a `background/default` fill.
- Load every font a text style uses (`Roboto Mono SemiBold` for `code`) before writing text.

## Safety
- A failed `use_figma` call is rolled back as a whole; fix and rerun. Wrap multi-node builds in
  try/catch that removes what the call created.
- `getInstancesAsync()` also returns instances inside deleted nodes; filter by a page ancestor
  before deciding a component is unused.
