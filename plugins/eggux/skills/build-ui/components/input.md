# Input

Usage guidelines only. Visual specs live in the Figma component.

## Anatomy
Label (`ui/label`) → input → hint or error (`ui/caption`). The label is always visible.

## Rules
- Pick the narrowest input type: email, tel, number, date picker, select, combobox, textarea.
- Width suggests the expected length (postal code short, address full width).
- Placeholder shows an example value, never the label or instructions.
- Required/optional marking is consistent across the product (see ux-rules.md). Mark the
  minority: `Field` Show optional on the few optional fields, or Show required on the few
  required ones, never both in one form.
- Values people may read but not change use State=read-only, never disabled.
- Errors follow `patterns/form-validation.md`.
- Group related fields (address, date range) and keep one column on mobile.
- Autofill: set the correct `autocomplete` attribute in code.

## Style
Pick one `Input` Style per form, and give `Select` the same Style.

| Style | Use |
|---|---|
| `default` | Outlined; most forms |
| `filled` | Muted fill, border on focus; dense screens |
| `floating` | Label inside the box, 48 high; short public forms |

- Floating: put the Input in a `Field` with `Show label` off, so the hint and error stay. Type the
  label in the Input's `Label` property; it floats on focus and when filled.
- Never mix filled and outlined controls in one form.
- Figma: `Input` Style × State × Content; `Field` Show label. Example "Input styles" on the Input page.

## Size and layout
| Size | Use |
|---|---|
| `sm` (32) | Filter bars, toolbars and table rows |
| `default` (36) | Most forms |
| `lg` (40) | Hero and mobile forms |

- One Size per row or form, matching the Buttons in the same row. Size is on `Input`, `Select`,
  `Combobox`, `Date Picker`, `Time Picker` and `Tag Input`.
- `Field` Layout=horizontal (label column at the left) for dense settings and record forms at
  400 px and wider; vertical below.
- `Field` Show info adds an `Info Tip Trigger` after the label for a definition (see
  `tooltip.md`).
- `Input` Show loading while a value is checked or looked up (VAT number, username); Show clear
  on search and filter inputs.

## Textarea
- Use for free text longer than one line: notes, descriptions, messages, reasons.
- Height shows the expected length (3-5 rows); it grows with content up to a max, then scrolls.
- A text limit uses `Field` Show counter (`Field Counter` at the right of the label, "86/500"):
  Status near from 90%, over past the limit together with State=error.
- Figma: `Textarea` (State × Content, like Input) inside a `Field` Control slot.

## Input OTP (one-time codes)
- For verification codes sent by SMS or email: 6 digits as 3 + 3, or 4.
- `autocomplete="one-time-code"`, `inputmode="numeric"`; paste fills all boxes; auto-submit when
  the last digit is entered, or enable the Verify button then.
- Say where the code was sent (masked number) and offer "Resend code" after a countdown.
- Wrong code: error state on all boxes, message under them, keep the digits for editing.
- Figma: `OTP Slot` Position (first, middle, last) × State (empty, filled, active, error);
  `Input OTP` Length 4 or 6. Example "verify phone" on the Input OTP page.

## Input Group and Number Input
- Input Group when a fixed prefix or suffix is part of the value: https://, .com, EUR, kg, %, @.
  The addon is not editable and not part of what the user types; a Select (currency, country
  code) or a Button (Copy, Generate) can sit in the Start/End slots.
- Icons inside the field stay on `Input` (Show leading icon with the Leading icon swap, Trailing
  slot).
- Number Input for small integers (guests, seats, quantity): − / + plus typing; min/max disable
  the buttons. Money, decimals and large numbers: Input Group with a unit, right-aligned in tables.
- Figma: `Input Addon` (start, end), `Input Group` (State; Start/End slots; Show start/end),
  `Number Input` (State × Size: default 36, sm 32 for cart lines and dense rows). Example "input
  groups" on the Input page.

## Inline Edit
- One value edited in place on a detail page (title, name, a short field). Several related
  fields, validation across fields or a review step: use a form.
- View shows a pencil on hover; click or Enter opens the input with the text selected. Enter or
  the check saves, Escape or x cancels, blur saves. Saving shows a spinner; an error keeps the
  input open with the message; success needs no toast.
- Figma: `Inline Edit` State view, hover, editing, saving, error; Value.

## Signature Pad
- Approvals, contracts, delivery receipts. Always offer "Type instead" (typed name) for
  keyboard and screen reader users; Clear restarts.
- After signing show who signed and when; store the image with the timestamp and the document
  version. Legal weight depends on the country: name the signing method in the decision log.
- Figma: `Signature Pad` State empty, signed. The pad clips the stroke on purpose.

## Related components
- Specialized inputs: `Copy Field` for values people copy (keys, links), `Search Field` for
  searching a list or the app, `Inline Form` for one field and one button (newsletter, coupon,
  invite; on a primary band or card set Tone=on-primary, no manual overrides). For typed values
  with a format: `Currency Input` (amount with ISO code), `Phone Input` (country code, E.164),
  `Duration Input` (hours and minutes) and `Range Input` (min and max).
- New-password fields: `Password Strength` under the Field (Level and what is missing, in text)
  and a `Requirement List` of `Check Item`s (Mark=check when met, dash while pending, x only after
  a submit). See `patterns/auth.md`.
