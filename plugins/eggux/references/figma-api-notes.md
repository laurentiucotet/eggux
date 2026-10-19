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
- Fill an instance slot before moving that instance into another instance's slot; references to
  nested nodes are invalid after the move.

## Instances and properties
- `isExposedInstance = true` only after the nested instance is inside the component.
- TEXT properties share text styling across variants; per-variant decoration (underline) has to
  be drawn with a frame stroke.
- An INSTANCE_SWAP property on a node forces the default component on every variant. For
  per-variant icons, do not bind the swap.
- Cloned variants lose `componentPropertyReferences`: re-wire every property after cloning.
- Swapping an instance renames its layer to the component name; do not look nested instances
  up by their original layer name after a swap.
- Hidden children of instances are skipped by `findAll` / `children` unless
  `figma.skipInvisibleInstanceChildren = false`; hidden icons then look empty.
- After `editComponentProperty` renames a slot property, the slot node in the main component
  takes the property name too; find slots by type and position, not by the original layer name.
- An instance can be exposed only if it has properties or exposed children (`isExposedInstance`
  fails on a Navbar or Footer without properties).
- Swapping instances to a rebuilt set drops overrides of properties whose key changed; re-apply them.

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
