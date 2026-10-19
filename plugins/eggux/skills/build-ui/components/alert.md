# Alert (inline banner)

Usage guidelines only. Visual specs live in the Figma component. Choosing between toast, alert
and inline messages: `patterns/feedback-messages.md`.

## Use
- A persistent message about the page or a section: a problem to fix, a state to know about
  (trial ends in 3 days, read-only access, sync failed).
- Not for confirming an action that just happened (use a toast).

## Rules
- Variant matches the meaning: `default`, `info`, `success`, `warning`, `destructive`. Always with an icon.
- `warning` is a filled banner (`background/warning` + `foreground/warning`) because amber fails
  contrast as text on white. The others are outlined cards with colored icon and title.
- Title states the situation in a few words; description says what to do about it.
- Up to three actions (small buttons or links) in the Actions slot, the one that resolves the
  situation first.
- Place it above the content it concerns, not at the top of the page when it concerns one section.
- Dismiss (x) only when the situation does not need action; remember the dismissal.
- Never stack more than one alert in the same place. Show the most important one.

## Figma
`Alert` Variant × Layout. `inline` is a card above the content it concerns; `banner` spans the
page or panel width (trial ending, maintenance, read-only mode). Actions is a native slot.
