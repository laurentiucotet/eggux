# Pattern: form validation

**Problem:** users fill forms wrong and need to know what and how to fix it, without being
interrupted while typing.
**Heuristic:** error prevention, help users recognize and recover from errors.

## Timing
- Validate a field on blur, after the user leaves it.
- Once a field shows an error, re-validate on every change so the error clears as soon as it is fixed.
- On submit, validate all fields, focus the first invalid one, and show a summary at the top
  for long forms (more than 5 fields).

## Prevention first
- Use the right input type (date picker, select, number) instead of validating free text.
- Show format hints before the user types (`ui/caption` under the field), not only in errors.
- Disable submit only while submitting, never as validation. A disabled button does not explain why.

## Error messages
- Next to the field, below it, in `background/destructive` (CSS `text-destructive`) with an icon
  (not color alone). `foreground/destructive` is the text *on* a destructive fill, not error text.
- Say what is wrong and how to fix it: "Enter a phone number with 10 digits", not "Invalid".
- Field border switches to `background/destructive`.
- Keep the user's input. Never clear the field.

## Submit
- Button shows loading state while submitting and blocks double submit.
- The form ends with an Action Bar (Align=end): Cancel, then the primary; Delete in Leading.
- Server errors: keep all input, show the message near the submit button or at the top.
- Success: confirm and move the user to the next logical step of the workflow.

## shadcn / Figma
`Form` + `FormField` + `FormMessage` (react-hook-form + zod) in code. In Figma, the input
component's error variant and the `ui/caption` style for hints.

## Related components
- Long forms: show an `Error Summary` at the top after a failed submit, with a link to each field.
  Group fields in `Form Section`s and option groups in a `Fieldset` whose error belongs to the
  group. Rules checked live (password, publish checks) use `Requirement List`.
