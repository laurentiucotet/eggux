# Progress and Slider

Usage guidelines only. Visual specs live in the Figma components (Progress, Slider pages).

## Progress
- Determinate only: the share is known (upload, import, profile completion, step 3 of 5).
- Unknown duration: Spinner under ~3 s, Skeleton for content, progress text for long jobs
  ("Importing 1 240 rows…"). See `patterns/loading-states.md`.
- Show the number or the remaining count next to the bar; never only color.
- Long jobs (> 10 s) run in the background with a toast or notification when done.
- Figma: `Progress` Value 0, 25, 50, 75, 100; resize the indicator for other values.

## Slider
- For a value on a continuous scale where approximate is fine (price range, radius, volume).
  Exact numbers: Input (type number) or Input + Slider together.
- Always show the current value (and unit) next to the label; min/max under the track if unclear.
- Range sliders for filters ("150 - 450 lei"); thumbs cannot cross.
- Step matches the data (5 lei, 1 km). Keyboard: arrows by step, PageUp/PageDown by 10 steps.
- Figma: `Slider` Type (single, range) × State (default, focus, disabled). Move the range and thumb
  layers for other values. Example "price range".

## Progress Ring
- Same rules as Progress, for compact places: an upload in a list, setup completion in a card,
  a quota next to a label.
- sm (32) has no label: put the number next to it. default (48) and lg (80) show the percent.
- Figma: `Progress Ring` Size × Value (0, 25, 50, 75, 100); Show label.
