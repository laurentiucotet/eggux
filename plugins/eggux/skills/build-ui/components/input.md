# Input

Usage guidelines only. Visual specs live in the Figma component.

## Anatomy
Label (`ui/label`) → input → hint or error (`ui/caption`). The label is always visible.

## Rules
- Pick the narrowest input type: email, tel, number, date picker, select, combobox, textarea.
- Width suggests the expected length (postal code short, address full width).
- Placeholder shows an example value, never the label or instructions.
- Required/optional marking is consistent across the product (see ux-rules.md).
- Errors follow `patterns/form-validation.md`.
- Group related fields (address, date range) and keep one column on mobile.
- Autofill: set the correct `autocomplete` attribute in code.

## Textarea
- Use for free text longer than one line: notes, descriptions, messages, reasons.
- Height shows the expected length (3-5 rows); it grows with content up to a max, then scrolls.
- A limit is shown as a counter in the Field hint ("86/500"), turning to error past the limit.
- Figma: `Textarea` (State × Content, like Input) inside a `Field` Control slot. Example
  "textarea in field" on the Input page.

## Input OTP (one-time codes)
- For verification codes sent by SMS or email: 6 digits as 3 + 3, or 4.
- `autocomplete="one-time-code"`, `inputmode="numeric"`; paste fills all boxes; auto-submit when
  the last digit is entered, or enable the Verify button then.
- Say where the code was sent (masked number) and offer "Resend code" after a countdown.
- Wrong code: error state on all boxes, message under them, keep the digits for editing.
- Figma: `OTP Slot` Position (first, middle, last) × State (empty, filled, active, error);
  `Input OTP` Length 4 or 6. Example "verify phone" on the Input OTP page.
