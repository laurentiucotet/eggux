# Slider

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Slider](#slider) | 18 | - |

On the Figma page: "Example / Slider styles", "Example / price range", "Stress test / Slider"

## Slider

Component set · 18 variants · default size 320 × 16

shadcn Slider. Pick a value (Type=single) or a range (Type=range) on a scale where the exact number matters less. Show value adds a Tooltip (Side=top, exposed: set its Label) over each thumb; it draws 37 px above the 16 px box. Show marks adds Min label, Mid label and Max label under the track (24 px below the box), for scales people read like EUR 0, 250, 500. Leave room around the Slider when either is on; keep the value and unit next to the label too. Value: 0, 25, 50, 75 or 100 places the thumb and the range for Type=single (like Progress); for another value or for Type=range, select the thumb wrapper and move it, and resize the range layer to the thumb center.


Usage: eggux build-ui/components/progress-and-slider.md

**Use for**

- Price range filters (Type=range)
- Distance, radius or volume (Type=single)
- Together with an Input when precise values also matter

**Not for**

- Exact numbers: use Input or Number Input
- Showing progress: use Progress
- A few named options: use Radio or Toggle Group

**Anatomy**

1. Label with the current value and unit
2. Track: background/muted
3. Range: background/primary
4. Thumb, or two for Type=range: a fixed 16 px knob centered in a wrapper that moves with the value, so it stays round at any width
5. Min and max labels under the track, when useful
6. Value bubble (Show value): a Tooltip Side=top (exposed, set its Label) over each thumb; draws 37 px above the 16 px box
7. Marks (Show marks): Min label, Mid label, Max label under the track, centered on the thumb ends; draws 24 px below the box
8. Value (Type=single): 0, 25, 50 (default), 75, 100; places the thumb and the range like Progress Value

**Content and behavior**

- Always show the current value and unit next to the label
- Step matches the data: 5 EUR, 1 km
- Range thumbs cannot cross
- Exact values: pair it with an Input (type number)
- Show value while dragging, or always when the exact value matters; keep the value next to the label too
- Show marks for scales people read (0, 250, 500 EUR); three labels, units on the ends only if they fit
- Leave 40 px above and 24 px below the Slider when Show value or Show marks is on; they overflow the component box
- Stretch the Slider (FILL or any width): the thumbs keep their size and follow the value; never resize the thumb itself
- Pick the Value nearest to the real number; for another value or for Type=range, move the thumb wrapper and resize the range layer to the thumb center (never resize the thumb)
- Keep the shown number, the marks and Value in step (2,500 on a 0 to 5,000 scale = Value=50)

**Accessibility**

- Arrows move by one step, Page Up and Page Down by 10 steps
- Each thumb has a name: "Minimum price", "Maximum price"
- aria-valuetext includes the unit: "150 EUR"
- The bubble repeats aria-valuetext; it is not the only place the value is shown. Mark labels are foreground/muted, 4.7:1 or more

| Variant property | Values |
|---|---|
| Type | single, range |
| State | default, focus, disabled |
| Value | 0, 25, 50, 75, 100 |

| Property | Type | Default |
|---|---|---|
| Show value | boolean | false |
| Show marks | boolean | false |
| Min label | text | 0 |
| Mid label | text | 50 |
| Max label | text | 100 |

Built from: `Tooltip`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `background/primary`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/4`
- Radius: `radius/full`
- Text styles: `ui/caption`
- Effects: `shadow/sm`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md)

Code: shadcn `Slider`, `Progress` (Slider Value (0, 25, 50, 75, 100) = `value` as a percent of `max`. Progress Value (Type=default): 0 to 100 in steps of 10, plus 25 and 75 = `value`)
