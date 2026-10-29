# Toggle Group

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toggle Group](#toggle-group) | 3 | Items |
| [Toggle Group Item](#toggle-group-item) | 30 | - |
| [Toggle](#toggle) | 30 | - |

On the Figma page: "Example / Toggle", "Example / Toggle Group sizes", "Example / Toggle Group styles", "Example / billing period", "Example / theme switch", "Example / view switch", "Stress test / Toggle", "Stress test / Toggle Group"

## Toggle Group

Component set · 3 variants · default size 177 × 36

Group of Toggle Group Items that sets a value: view mode, period, text style. Variant: default (selected item in background/accent), outline (bordered group), segmented (one pill track on background/muted, the selected item a raised background/default pill with shadow/xs; put Toggle Group Item Variant=segmented in the Items slot). segmented is for 2-4 short options such as a period or a monthly / yearly switch. It sets a value; switching panels is Tabs. Full width segmented: set the group to FILL and its items to FILL; items share the track equally. In a hugging group keep items on HUG.


Size lives on the items: set every Toggle Group Item in the group to the same Size (sm in toolbars and Chart Card headers, lg for billing period and theme choices). One on/off button alone is Toggle.


Usage: eggux build-ui/components/tabs.md

**Use for**

- View mode: list / board
- Period: day / week / month
- Formatting in a Rich Text Editor toolbar
- Product options such as size on a product page
- Variant=segmented: 2-4 short options on one track, such as a period or a monthly / yearly billing switch
- Size=sm items in Toolbars and Chart Card period switches; Size=lg for the pricing billing period and the Appearance theme choice

**Not for**

- Switching panels of content: use Tabs
- Independent actions (Archive, zoom): use Button Group
- Many options: use Select
- One on/off button alone (bold, pin, mute): use Toggle

**Anatomy**

1. Group (Variant: default, outline or segmented)
2. Items slot: Toggle Group Item instances with the matching Item Variant (default for default and outline, segmented for segmented)
3. Item: Label and/or icon (Show label, Show icon, Icon)
4. Selected item: State=selected (background/accent; segmented: background/default with shadow/xs)
5. Segmented track: background/muted, padding spacing/1, items 28 high; the Items slot fills the track
6. Size lives on the items: Toggle Group Item Size sm (32; segmented 24), default (36; 28), lg (40; 32); the segmented track adds 4 px around

**Content and behavior**

- It sets a value; if the content below changes panels, use Tabs
- Single choice for view mode or period; multiple for formatting
- Icon-only items: Show label off, Show icon on, with a tooltip
- Choosing a value is a Toggle Group, not a Button Group
- segmented looks like Tabs Variant=default; it still sets a value, it never switches panels
- segmented: at most 4 items with one or two words each; more options: use Select
- Full width segmented: Toggle Group FILL and every item FILL, items share the track equally; in a hugging group keep items on HUG
- Every item in one group has the same Size
- Resize: hugs its items; segmented on FILL shares the track equally

**Accessibility**

- Arrow keys move between items; Space or Enter toggles
- Selected state is exposed (aria-checked for single, aria-pressed for multiple)
- Icon-only items have an aria-label that matches the tooltip
- segmented: labels are foreground/default on the track (18:1 Light, 14.5:1 Dark); the selected pill differs from the track by fill (1.1:1) and shadow, so the selected state is also exposed with aria-checked

| Variant property | Values |
|---|---|
| Variant | default, outline, segmented |

Slots (fill them in the instance, never detach): `Items`

Built from: `Toggle Group Item`

Tokens and styles:
- Colors: `background/muted`, `border/input`
- Spacing and size: `spacing/1`
- Radius: `button/radius`
- Effects: `shadow/xs`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md), [navigation](../../skills/build-ui/components/navigation.md), [tabs](../../skills/build-ui/components/tabs.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: shadcn `ToggleGroup` (`type` single or multiple) (View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme`)

## Toggle Group Item

Component set · 30 variants · default size 59 × 36

One option in a Toggle Group: Label, Show label, Show icon + Icon. Variant matches the group: default for Toggle Group default and outline; segmented (28 high, transparent, hover toggle-group/segmented-hover, selected background/default with shadow/xs) for Toggle Group Variant=segmented. Icon-only items need a tooltip and an aria-label.


Size: sm (default 32, segmented 24), default (36, 28), lg (40, 32). Every item in one group uses the same Size.


Usage: eggux build-ui/components/tabs.md

**Use for**

- Inside Toggle Group only, one item per option

**Not for**

- A single on/off button: use Toggle
- Toolbars: use Toggle Size=sm in a Toolbar

**Anatomy**

1. Icon (Show icon, Icon swap) and Label (Show label)
2. Variant: default (background/accent when selected) or segmented (pill on the muted track)
3. Size: sm (32; segmented 24), default (36; 28), lg (40; 32); icon-only items are square
4. State: default, hover, selected, focus, disabled

**Content and behavior**

- Use the Variant that matches the group (default for default and outline groups)
- All items in one group share the Size
- Resize: hugs its label; FILL in a full width segmented group

**Accessibility**

- aria-checked (single) or aria-pressed (multiple) exposes the selected state
- Icon-only items need aria-label and a Tooltip

| Variant property | Values |
|---|---|
| Variant | default, segmented |
| Size | default, sm, lg |
| State | default, hover, selected, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Week |
| Show label | boolean | true |
| Show icon | boolean | false |
| Icon | instance swap | Icon/info |

Icons: info

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/muted`, `foreground/accent`, `foreground/default`, `toggle-group/segmented-hover`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/2`, `spacing/2_5`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/7`, `spacing/8`
- Radius: `button/radius`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `ToggleGroup` (`type` single or multiple) (View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme`)

## Toggle

Component set · 30 variants · default size 36 × 36

One on/off button with a pressed state (shadcn Toggle): bold, pin, mute, captions, favorite. Icon only by default (Show icon on, Show label off, square: sm 32, default 36, lg 40); turn Show label on for text or icon and text. Variant default (no border, for toolbars) or outline (border/input, on plain surfaces). State=pressed is the on state (background/accent, foreground/accent). It switches one setting at once; a set of options where one or several are on is a Toggle Group, an action is a Button Icon. Icon-only toggles need an aria-label and a Tooltip with the shortcut.


Usage: eggux build-ui/components/tabs.md

**Use for**

- A format or setting that stays on: bold in a Toolbar, captions and mute in a Video Player
- Pin, favorite or watch on a record (Variant=outline, with a label)
- Formatting in Chat Composer and Selection Toolbar

**Not for**

- One choice out of several options: use Toggle Group
- A setting in a form that applies on save: use Switch or Checkbox
- An action that runs once (copy, delete, refresh): use Button Icon or Button

**Anatomy**

1. Icon (Show icon, Icon swap; default bold) and Label (Show label, off by default)
2. Variant: default (no border) or outline (border/input, shadow/xs)
3. Size: sm 32, default 36, lg 40; icon-only is square (minWidth = height)
4. State: default, hover (background/muted), pressed (background/accent, foreground/accent), focus (ring), disabled (50%)

**Content and behavior**

- Pressed is the on state; the icon does not change between on and off, the fill does
- When the label says the state, keep it the same in both states ("Pinned" toggles; do not swap text)
- default in Toolbars and players; outline on plain surfaces next to outline Buttons
- Same Size as the controls next to it (sm in a Toolbar)
- Resize: hugs; never stretches; with a label it is one line

**Accessibility**

- aria-pressed="true" or "false"; the accessible name does not change with the state
- Icon-only: aria-label and a Tooltip with the shortcut (Bold, ⌘B)
- pressed: foreground/accent on background/accent is 16.5:1 Light, 14.5:1 Dark, 16.4:1 Corporate Light; the pressed fill is close to the page, so the state is also exposed with aria-pressed
- Focus shows the border/ring focus ring

| Variant property | Values |
|---|---|
| Variant | default, outline |
| Size | default, sm, lg |
| State | default, hover, pressed, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Bold |
| Show label | boolean | false |
| Show icon | boolean | true |
| Icon | instance swap | Icon/bold |

Icons: bold

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/muted`, `border/input`, `foreground/accent`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/2`, `spacing/2_5`, `spacing/3`, `spacing/8`
- Radius: `button/radius`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [button](../../skills/build-ui/components/button.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `Toggle` (`variant` default, outline; `size` sm, default, lg) (State=pressed = `data-state="on"` (`pressed`, `onPressedChange`); icon-only needs `aria-label` + `Tooltip`; `shrink-0`)
