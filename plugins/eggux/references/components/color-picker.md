# Color Picker

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Color Picker](#color-picker) | 1 | Swatches |
| [Swatch Picker](#swatch-picker) | 1 | Swatches |
| [Swatch](#swatch) | 2 | - |

On the Figma page: "Stress test / Color Picker", "Stress test / Swatch Picker"

## Color Picker

Component · 1 variant · default size 264 × 294

Pick any color (brand settings, labels, charts): saturation area, hue slider, hex input with opacity, swatches. Show presets first when users should stay on palette. Gradients are part of the control (not tokens).

**Use for**

- Brand or theme settings
- Custom colors for labels or charts
- In a Popover opened from a color field (swatch + hex value)

**Not for**

- A few fixed colors (labels, calendars, tags): use swatches only, with a ring on the selected one
- Simple cases in code: the native input type="color"

**Anatomy**

1. Saturation area
2. Hue slider
3. Hex Input Group with opacity
4. Swatches slot: presets or recent colors

**Content and behavior**

- Show presets first when users should stay on palette
- Hex accepts with or without #, 3 or 6 digits; a valid hex updates the swatch
- Opacity only when the product supports it
- When the color sits behind text, check contrast and warn below the field
- Gradients in the control are raw colors by design; the rest uses tokens

**Accessibility**

- The hex input is the keyboard path; area and slider handles also move with arrow keys
- Swatches are buttons labelled with the color name or hex; selected has a ring
- Color is never the only way to tell items apart: pair it with a name or icon

Slots (fill them in the instance, never detach): `Swatches`

Built from: `Input Group`

Tokens and styles:
- Colors: `background/default`, `background/popover`, `border/default`, `border/input`, `border/ring`, `chart/1`, `chart/2`, `chart/3`, `chart/4`, `chart/5`, `chart/6`, `chart/7`, `chart/8`
- Spacing and size: `border-width/2`, `border-width/DEFAULT`, `spacing/1_5`, `spacing/3`, `spacing/6`
- Radius: `radius/full`, `radius/md`
- Effects: `shadow/sm`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md)

Code: react-colorful in `Popover`

## Swatch Picker

Component · 1 variant · default size 252 × 52

A short set of colors for labels, categories, calendars and project avatars: 6-10 Swatches from the chart palette in the Swatches slot, one selected, its name under them. Free colors (brand, themes) use Color Picker. Colors stay readable in dark mode because they come from chart tokens.

**Use for**

- Label and tag colors
- Calendar and category colors
- Project or workspace avatar colors

**Not for**

- Any color (brand, themes): use Color Picker
- Presets plus a custom color: use Color Picker with its Swatches slot

**Anatomy**

1. Swatches slot: 6-10 Swatches
2. Label (Show label): the name of the selected color

**Content and behavior**

- 6-10 colors from the chart palette; one selected
- Colors come from chart tokens so they stay readable in dark mode
- Same order everywhere the palette appears
- Show the name under the swatches; never rely on color alone

**Accessibility**

- A radiogroup with a label ("Label color"); arrow keys move between swatches
- Each swatch is labelled with its color name
- Items that use the color also show a name or icon

| Property | Type | Default |
|---|---|---|
| Label | text | Blue |
| Show label | boolean | true |

Slots (fill them in the instance, never detach): `Swatches`

Built from: `Swatch`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`
- Text styles: `ui/caption`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md)

Code: shadcn `RadioGroup` (or `ToggleGroup` single) of round items with chart token backgrounds (Color name as label)

## Swatch

Component set · 2 variants · default size 28 × 28

One color to pick, 28 px: a dot of the color, a ring when selected. Override the fill of the "color" layer with a chart or brand token. Part of Swatch Picker.

**Use for**

- Inside Swatch Picker
- Preset colors in the Swatches slot of Color Picker

**Not for**

- Any color, typed or picked freely: use Color Picker

**Anatomy**

1. Color: a dot filled with a chart or brand token
2. Ring (State=selected)

**Content and behavior**

- State: default, selected
- Override the fill of the "color" layer with a chart or brand token, never a raw hex
- The ring is visible on light and dark backgrounds

**Accessibility**

- A button or radio with the color name as its label ("Blue")
- Focus ring and selected ring look different

| Variant property | Values |
|---|---|
| State | default, selected |

Tokens and styles:
- Colors: `chart/1`, `foreground/default`
- Radius: `radius/full`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md)

Code: shadcn `RadioGroup` (or `ToggleGroup` single) of round items with chart token backgrounds (Color name as label)
