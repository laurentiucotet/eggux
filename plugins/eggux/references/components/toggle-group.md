# Toggle Group

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toggle Group](#toggle-group) | 2 | Items |
| [Toggle Group Item](#toggle-group-item) | 5 | - |

On the Figma page: "Example / billing period", "Example / theme switch", "Example / view switch", "Stress test / Toggle Group"

## Toggle Group

Component set · 2 variants · default size 176 × 36

shadcn ToggleGroup: sets a value (view mode, period, text style). For switching content panels use Tabs. Usage: eggux build-ui/components/tabs.md

**Use for**

- View mode: list / board
- Period: day / week / month
- Formatting in a Rich Text Editor toolbar
- Product options such as size on a product page

**Not for**

- Switching panels of content: use Tabs
- Independent actions (Archive, zoom): use Button Group
- Many options: use Select

**Anatomy**

1. Group (Variant: default or outline)
2. Items slot: Toggle Group Item instances
3. Item: Label and/or icon (Show label, Show icon, Icon)
4. Selected item: State=selected

**Content and behavior**

- It sets a value; if the content below changes panels, use Tabs
- Single choice for view mode or period; multiple for formatting
- Icon-only items: Show label off, Show icon on, with a tooltip
- Choosing a value is a Toggle Group, not a Button Group

**Accessibility**

- Arrow keys move between items; Space or Enter toggles
- Selected state is exposed (aria-checked for single, aria-pressed for multiple)
- Icon-only items have an aria-label that matches the tooltip

| Variant property | Values |
|---|---|
| Variant | default, outline |

Slots (fill them in the instance, never detach): `Items`

Built from: `Toggle Group Item`

Tokens and styles:
- Colors: `border/input`
- Spacing and size: `spacing/1`
- Radius: `radius/md`
- Effects: `shadow/xs`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md), [navigation](../../skills/build-ui/components/navigation.md), [tabs](../../skills/build-ui/components/tabs.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `ToggleGroup` (`type` single or multiple) (View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme`)

## Toggle Group Item

Component set · 5 variants · default size 58 × 36

shadcn ToggleGroupItem. on = pressed (selected value). Icon-only: Show label off, Icon on, and an accessible label in code.

| Variant property | Values |
|---|---|
| State | default, hover, selected, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Week |
| Show label | boolean | true |
| Show icon | boolean | false |
| Icon | instance swap | Icon/info |

Icons: info

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/muted`, `foreground/accent`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/2_5`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `ToggleGroup` (`type` single or multiple) (View and theme switches: `type="single"`, view in a URL search param, theme with next-themes `setTheme`)
