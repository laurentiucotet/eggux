# Progress and Slider

Usage guidelines only. Visual specs live in the Figma components (Progress, Slider pages).

## Progress
- Determinate only: the share is known (upload, import, profile completion, step 3 of 5).
- Unknown duration: Spinner under ~3 s, Skeleton for content, progress text for long jobs
  ("Importing 1 240 rows…"). See `patterns/loading-states.md`.
- Show the number or the remaining count next to the bar; never only color.
- Long jobs (> 10 s) run in the background with a toast or notification when done.
- Figma: `Progress` Value 0, 25, 50, 75, 100; resize the indicator for other values.
- Tone: success when complete, warning near a limit, error when failed; the text next to the bar
  says it too. Figma: `Progress` Tone × Value.
- Long exports and syncs show as Background Jobs in a Popover from a top bar button, one row per job (Status, Result or Error per state).
- Type=segmented for a count of steps (onboarding, a setup checklist, a multi-step form on mobile):
  one segment per step, 4 to 10, and the count in text next to it ("Step 2 of 4"). Type=default for
  a share of work (uploads, imports, quotas). Circular progress is `Progress Ring`.
- Figma: Type=segmented holds `Progress Segment` instances (State complete or upcoming, Tone) in the
  Segments slot; Value sets 0 to 4 of 4 complete. Add or remove segments and set each State for
  other counts. Example "Progress styles".

## Slider
- For a value on a continuous scale where approximate is fine (price range, radius, volume).
  Exact numbers: Input (type number) or Input + Slider together.
- Always show the current value (and unit) next to the label; min/max under the track if unclear.
- Range sliders for filters ("EUR 150 - 450"); thumbs cannot cross.
- Step matches the data (EUR 5, 1 km). Keyboard: arrows by step, PageUp/PageDown by 10 steps.
- Figma: `Slider` Type (single, range) × State (default, focus, disabled). Move the range and thumb
  layers for other values. Example "price range". The Slider stretches to any width (FILL); the
  thumbs stay 16 px and follow the value, so never resize a thumb.
- `Show value` puts a value bubble over each thumb for exact readings while dragging; `Show marks`
  adds min, mid and max labels under the track (Min label, Mid label, Max label) for scales people
  read. Both draw outside the slider box: leave 40 px above and 24 px below. Example "Slider styles".

## Progress Ring
- Same rules as Progress, for compact places: an upload in a list, setup completion in a card,
  a quota next to a label.
- sm (32) has no label: put the number next to it. default (48) and lg (80) show the percent.
- Figma: `Progress Ring` Size × Value (0, 25, 50, 75, 100); Show label.
