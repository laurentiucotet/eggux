# Color Picker

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Color Picker](#color-picker) | 1 | Swatches |

On the Figma page: "Example / color field", "Stress test / Color Picker"

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
