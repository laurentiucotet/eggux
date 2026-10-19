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
- At most one action, as a link or small button, that resolves the situation.
- Place it above the content it concerns, not at the top of the page when it concerns one section.
- Dismissible only when the situation does not need action; remember the dismissal.
- Never stack more than one alert in the same place. Show the most important one.
