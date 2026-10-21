# Color Picker

Usage guidelines only. Visual specs live in the Figma component (Color Picker page).

## When
| Need | Use |
|---|---|
| Pick from a few fixed colors (labels, calendars, tags) | Swatches only (a row of buttons with a ring on the selected one) |
| Any color (brand settings, theme, charts) | `Color Picker` in a Popover, opened from a color field |

## Rules
- The trigger is a color field: swatch + hex value (example "color field" on the Color Picker
  page). Typing a valid hex updates the swatch.
- Show presets (brand or recent colors) first when users should stay on palette.
- Hex input accepts with or without `#`, 3 or 6 digits; opacity only when the product supports
  it.
- When the color is used behind text, check contrast and warn below the field.
- Never use color as the only way to tell items apart: pair it with a name or icon.

## Figma
`Color Picker`: saturation area, hue slider, hex `Input Group` with opacity, Swatches (native
slot). Gradients in the control are raw colors by design; everything else uses tokens.

## Code
`react-colorful` (or the native `input type="color"` for simple cases) inside a shadcn
`Popover`.

## Related components
- "Swatches only" is now `Swatch Picker`: 6-10 `Swatch`es from the chart palette, one selected, its
  name under them. Use it for labels, categories and calendars; free colors stay on `Color Picker`.
