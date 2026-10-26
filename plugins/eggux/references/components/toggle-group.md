# Toggle Group

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toggle Group](#toggle-group) | 3 | Items |
| [Toggle Group Item](#toggle-group-item) | 10 | - |

On the Figma page: "Example / Toggle Group styles", "Example / billing period", "Example / theme switch", "Example / view switch", "Stress test / Toggle Group"

## Toggle Group

Component set · 3 variants · default size 177 × 36

Group of Toggle Group Items that sets a value: view mode, period, text style. Variant: default (selected item in background/accent), outline (bordered group), segmented (one pill track on background/muted, the selected item a raised background/default pill with shadow/xs; put Toggle Group Item Variant=segmented in the Items slot). segmented is for 2-4 short options such as a period or a monthly / yearly switch. It sets a value; switching panels is Tabs.


Usage: eggux build-ui/components/tabs.md

**Use for**

- View mode: list / board
- Period: day / week / month
- Formatting in a Rich Text Editor toolbar
- Product options such as size on a product page
- Variant=segmented: 2-4 short options on one track, such as a period or a monthly / yearly billing switch

**Not for**

- Switching panels of content: use Tabs
- Independent actions (Archive, zoom): use Button Group
- Many options: use Select

**Anatomy**

1. Group (Variant: default, outline or segmented)
2. Items slot: Toggle Group Item instances with the matching Item Variant (default for default and outline, segmented for segmented)
3. Item: Label and/or icon (Show label, Show icon, Icon)
4. Selected item: State=selected (background/accent; segmented: background/default with shadow/xs)
5. Segmented track: background/muted, padding spacing/1, items 28 high

**Content and behavior**

- It sets a value; if the content below changes panels, use Tabs
- Single choice for view mode or period; multiple for formatting
- Icon-only items: Show label off, Show icon on, with a tooltip
- Choosing a value is a Toggle Group, not a Button Group
- segmented looks like Tabs Variant=default; it still sets a value, it never switches panels
- segmented: at most 4 items with one or two words each; more options: use Select

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

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md), [navigation](../../skills/build-ui/components/navigation.md), [tabs](../../skills/build-ui/components/tabs.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `ToggleGroup` (`type` single or multiple) (View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme`)

## Toggle Group Item

Component set · 10 variants · default size 59 × 36

One option in a Toggle Group: Label, Show label, Show icon + Icon. Variant matches the group: default for Toggle Group default and outline; segmented (28 high, transparent, hover toggle-group/segmented-hover, selected background/default with shadow/xs) for Toggle Group Variant=segmented. Icon-only items need a tooltip and an aria-label.


Usage: eggux build-ui/components/tabs.md

| Variant property | Values |
|---|---|
| Variant | default, segmented |
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
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/2_5`, `spacing/3`, `spacing/7`
- Radius: `button/radius`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `ToggleGroup` (`type` single or multiple) (View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme`)
