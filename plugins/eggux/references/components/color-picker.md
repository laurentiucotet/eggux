# Color Picker

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Color Picker](#color-picker) | 1 | Swatches |

## Color Picker

Component · 1 variant · default size 264 × 294

Pick any color (brand settings, labels, charts): saturation area, hue slider, hex input with opacity, swatches. Show presets first when users should stay on palette. Gradients are part of the control (not tokens).

Slots (fill them in the instance, never detach): `Swatches`

Built from: `Input Group`

Tokens and styles:
- Colors: `background/default`, `background/popover`, `border/default`, `border/input`, `border/ring`, `chart/1`, `chart/2`, `chart/3`, `chart/4`, `chart/5`, `chart/6`, `chart/7`, `chart/8`
- Spacing and size: `border-width/2`, `border-width/DEFAULT`, `spacing/1_5`, `spacing/3`, `spacing/6`
- Radius: `radius/full`, `radius/md`
- Effects: `shadow/sm`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md)

Code: react-colorful in `Popover`
