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
