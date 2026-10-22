# Slider

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Slider](#slider) | 6 | - |

On the Figma page: "Example / price range", "Stress test / Slider"

## Slider

Component set · 6 variants · default size 320 × 16

Pick a value or range on a continuous scale where the exact number matters less (price range, distance, volume). Show the value next to it; pair with an Input when precise values matter. Step and min/max labels under the track when useful.

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
4. Thumb, or two for Type=range
5. Min and max labels under the track, when useful

**Content and behavior**

- Always show the current value and unit next to the label
- Step matches the data: 5 EUR, 1 km
- Range thumbs cannot cross
- Exact values: pair it with an Input (type number)

**Accessibility**

- Arrows move by one step, Page Up and Page Down by 10 steps
- Each thumb has a name: "Minimum price", "Maximum price"
- aria-valuetext includes the unit: "150 EUR"

| Variant property | Values |
|---|---|
| Type | single, range |
| State | default, focus, disabled |

Tokens and styles:
- Colors: `background/default`, `background/muted`, `background/primary`
- Spacing and size: `spacing/1_5`, `spacing/4`
- Radius: `radius/full`
- Effects: `shadow/sm`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md)

Code: shadcn `Slider`, `Progress`
