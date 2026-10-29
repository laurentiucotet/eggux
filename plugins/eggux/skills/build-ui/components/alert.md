# Alert (inline banner)

Usage guidelines only. Visual specs live in the Figma component. Choosing between toast, alert
and inline messages: `patterns/feedback-messages.md`.

## Use
- A persistent message about the page or a section: a problem to fix, a state to know about
  (trial ends in 3 days, read-only access, sync failed).
- Not for confirming an action that just happened (use a toast).
- For one line of status next to what it is about (autosave, a row result), use `Inline Message`
  instead of an Alert; it has no box, title or actions.

## Inline Message
- Type default, info, success, warning, error or loading (Spinner, "Saving…"). One line, two at
  most; it sits next to or under the thing it describes.
- Not for errors of one field (Field error) or messages that need an action (Alert).
- Figma: `Inline Message` Type; Text. Hugs up to 480; set it to FILL in narrow columns. Example
  "Inline Message" on the Alert page.

## Rules
- Variant matches the meaning: `default`, `info`, `success`, `warning`, `destructive`. Always with an icon.
- In Style=default, `warning` is a filled banner (`background/warning` + `foreground/warning`)
  because amber fails contrast as text on white. The others are outlined cards with colored icon
  and title.
- Title states the situation in a few words; description says what to do about it.
- Up to three actions (small buttons or links) in the Actions slot, the one that resolves the
  situation first.
- Place it above the content it concerns, not at the top of the page when it concerns one section.
- Show close (x) only when the situation does not need action; remember the dismissal.
- Never stack more than one alert in the same place. Show the most important one.

## Style
- `default`: outlined card (filled for warning), the standard.
- `soft`: tinted fill, no border; for calm notes and docs callouts.
- `accent`: card with a 4 px status bar on the left; for dense settings pages and lists.
- One Style per product; Variant still carries the meaning.

## Figma
`Alert` Variant × Layout × Style. `inline` is a card above the content it concerns; `banner` spans
the page or panel width (trial ending, maintenance, read-only mode). Actions is a native slot.
Example "Alert styles".
