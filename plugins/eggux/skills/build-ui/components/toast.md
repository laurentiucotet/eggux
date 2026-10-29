# Toast (Sonner)

Usage guidelines only. Visual specs live in the Figma component. Choosing between toast, alert
and inline messages: `patterns/feedback-messages.md`.

## Use
- Short confirmation of an action the user just took ("Project saved").
- Undo for reversible actions (`patterns/delete-confirmation.md`).
- Background events the user should know about but need not act on now.

## Rules
- One line, past tense, names the object: "Invoice #1042 sent". Not "Success!".
- At most one action ("Undo", "View"), as a verb.
- Auto-dismiss after 4-6 s; 8-10 s when it has an action. Pause on hover and focus.
- Errors that block the user's goal do not go in a toast alone: show them inline where the
  problem is. A toast may add a summary.
- Never put information in a toast that the user cannot find again elsewhere.
- Position stays the same across the product (default bottom right, top center on mobile).
- Announce to screen readers (`aria-live="polite"`, `assertive` for errors).
- Style=inverted (`<Toaster invert />`) when toasts sit over busy or white content; default
  elsewhere. Icons are monochrome there, so the words must name the outcome.

## Figma
`Toast` types: default, success, error, warning, info, loading; Style default or inverted
(example "Toast styles"). Show avatar for activity from a person, Show progress for uploads and
the Undo countdown; never an avatar and a status icon together. Toast has no TEXT properties for
the title and description: edit those text layers in the instance, and turn off
`Show description` for one-line toasts. Turn on `Show action` for Undo or View (the nested Button
is exposed). `Show close` is off by default. Turn it on for toasts with an action, errors and
toasts that stay longer than ~8 s; simple confirmations dismiss themselves.
