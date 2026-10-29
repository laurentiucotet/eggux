# Toolbar

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toolbar](#toolbar) | 4 | Items |

On the Figma page: "Example / canvas zoom", "Example / editor toolbar", "Stress test / Toolbar"

## Toolbar

Component set · 4 variants · default size 298 × 40

A row (or column) of related controls in groups: Toggles, Button Icons, small Buttons and Selects, with a vertical Separator between groups and an overflow Button Icon (ellipsis) for what does not fit. Style default has no surface and sits inside an editor, card or panel header (the parent draws the border); Style floating is a popover surface (border, radius/lg, shadow/md) over a canvas, an image or a selection. Orientation vertical for canvas tool columns. Items is a native slot: use sm controls (Toggle sm, Button Icon ghost sm, Button ghost sm). Not for selected rows (Table Toolbar or Bulk Action Bar), list filters (Page Toolbar, Data Grid Toolbar) or form endings (Action Bar).


Usage: eggux build-ui/components/rich-text-editor.md

**Use for**

- The formatting bar of a Rich Text Editor or a document header (Style=default, FILL)
- Zoom and view controls over a canvas: Org Chart, Workflow Builder, File Preview, Image Cropper (Style=floating)
- A tool column on the side of a canvas (Orientation=vertical, Style=floating)
- Dashboard edit mode and media controls that act on the content around them

**Not for**

- Rows are selected in a table: use Table Toolbar; in a grid or board: use Bulk Action Bar
- Search, filters and view switch above a list: use Page Toolbar or Data Grid Toolbar
- The buttons that end a form or a step: use Action Bar
- Text selected in a document: use Selection Toolbar

**Anatomy**

1. Items (native slot): sm controls in groups, Toggle Size=sm for on/off formats, Button Icon ghost sm for actions, Button ghost sm for a value ("100%"), a Select sm
2. Separator Orientation=vertical Spacing=sm between groups (horizontal in a vertical Toolbar)
3. Overflow (Show overflow): Button Icon ghost sm with ellipsis that opens a Menu with the items that do not fit
4. Style default: no surface, the parent draws the border (editor, card or panel header)
5. Style floating: background/popover, border/default, radius/lg, shadow/md
6. Orientation: horizontal, vertical; padding spacing/1, gap spacing/0_5

**Content and behavior**

- Group related controls (text style, lists, insert, zoom) and separate groups with a Separator; 2 to 5 items per group
- Toggle for formats that stay on (bold, grid), Button Icon for one-off actions (insert link, fit to screen); never mix Toggle Group Items into a Toolbar
- All controls in one Toolbar use the same size (sm)
- When the Toolbar runs out of room the last groups move into the overflow Menu, in order; the first group never moves
- floating sits 16 px from the canvas edge it belongs to (zoom: bottom right; tools: top left)
- Resize: hugs its items; set to FILL in a header and the overflow stays at the end (space between); below about 400 drop whole groups into the overflow instead of squeezing

**Accessibility**

- role="toolbar" with an aria-label ("Formatting", "Zoom"); aria-orientation for vertical
- One Tab stop: Tab enters the toolbar, arrow keys move between items (roving tabindex), Home and End jump
- Icon-only items have aria-label and a Tooltip with the shortcut; Toggles expose aria-pressed
- The overflow button is labelled "More" and its Menu holds the hidden items with their names

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |
| Style | default, floating |

| Property | Type | Default |
|---|---|---|
| Show overflow | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Button Icon`, `Separator`, `Toggle`

Tokens and styles:
- Colors: `background/popover`, `border/default`
- Spacing and size: `spacing/0_5`, `spacing/1`
- Radius: `radius/lg`
- Effects: `shadow/md`

Guides: [button](../../skills/build-ui/components/button.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: Radix `Toolbar` (`@radix-ui/react-toolbar`): `Toolbar.Root`, `Toolbar.ToggleItem` / shadcn `Toggle size="sm"`, `Toolbar.Button` with shadcn `Button variant="ghost" size="icon-sm"`, `Toolbar.Separator`; overflow `DropdownMenu` (Style default: no surface (parent draws `border-b`); floating: `rounded-lg border bg-popover shadow-md p-1 gap-0.5`. `orientation="vertical"` for tool columns. Overflow: ResizeObserver moves trailing groups into the menu; resize contract `flex items-center justify-between` when it fills)
