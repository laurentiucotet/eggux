# Input

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Input](#input) | 8 | Trailing |
| [Field](#field) | 3 | Control |
| [Password Strength](#password-strength) | 5 | - |
| [Textarea](#textarea) | 8 | - |
| [Input Addon](#input-addon) | 2 | - |
| [Input Group](#input-group) | 4 | Start, End |
| [Number Input](#number-input) | 4 | - |
| [Inline Edit](#inline-edit) | 5 | - |
| [Signature Pad](#signature-pad) | 2 | - |

On the Figma page: "Example / approve a contract", "Example / in multi-step form", "Example / in navbar search", "Example / in product detail", "Example / in reset password", "Example / input groups", "Example / rename a project", "Example / textarea in field", "Stress test / Field", "Stress test / Inline Edit and Signature Pad", "Stress test / Input", "Stress test / Input Group", "Stress test / Number Input", "Stress test / Password Strength", "Stress test / Signature Pad", "Stress test / Textarea"

## Input

Component set · 8 variants · default size 320 × 36

shadcn Input. Content=placeholder shows an example value in foreground/muted, never the label. Use inside Field for label, hint and error. Usage: eggux build-ui/components/input.md

**Use for**

- Short free text: names, titles, email, search
- Search above a list, with the search Leading icon
- Any form control inside Field

**Not for**

- Text longer than one line: use Textarea
- Choosing from a list: use Select or Combobox
- Fixed prefix or suffix (https://, EUR, %): use Input Group
- Common data (email, phone, card): use Field Preset

**Anatomy**

1. Leading icon (Leading icon, Leading icon type)
2. Value or placeholder
3. Trailing slot (Show trailing): clear, show password

**Content and behavior**

- Content=placeholder shows an example value, never the label or instructions
- State: default, focus, error, disabled
- Width suggests the expected length
- Pick the narrowest type and set autocomplete in code
- Never clear what the user typed after an error

**Accessibility**

- Always has a visible label through Field; icon-only search fields need aria-label
- Focus ring uses border/ring; border contrast at least 3:1
- Error is linked with aria-describedby and aria-invalid

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | name@example.com |
| Leading icon | boolean | false |
| Leading icon type | instance swap | Icon/search |
| Show trailing | boolean | false |

Slots (fill them in the instance, never detach): `Trailing`

Icons: search

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/1_5`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/xs`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Field

Component set · 3 variants · default size 320 × 88

Label + Control (native slot, default Input) + hint or error. Label always visible. Error text uses background/destructive with an icon. Usage: eggux build-ui/patterns/form-validation.md

**Use for**

- Every form control: Input, Textarea, Select, Input Group, Number Input
- Format hints shown before the user types
- Grouped fields (address, date range) that need one label each

**Not for**

- Table cells or filter toolbars where the column or chip names the value: use Input alone with aria-label
- Values edited in place on a detail page: use Inline Edit

**Anatomy**

1. Label
2. Control slot (default Input)
3. Hint (Show hint) or Error with circle-alert icon

**Content and behavior**

- Label is always visible
- State: default, error, disabled
- Error replaces the hint, says what is wrong and how to fix it: "Enter an email address like name@example.com"
- Validate on blur; once in error, re-validate on every change
- Error text uses background/destructive with an icon, not color alone

**Accessibility**

- Label is tied to the control (for / id)
- Hint and error linked with aria-describedby; aria-invalid on error
- On submit, focus moves to the first invalid field

| Variant property | Values |
|---|---|
| State | default, error, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Email |
| Hint | text | We send receipts and account notices here. |
| Show hint | boolean | true |
| Error | text | Enter an email address like name@example.com |

Slots (fill them in the instance, never detach): `Control`

Built from: `Input`. Icons: circle-alert

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `ui/caption`, `ui/label`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Password Strength

Component set · 5 variants · default size 288 × 42

Strength meter under a new-password Field. Message says what is missing; the level is in text and bar count, not only color. Fair uses foreground/default because amber fails as a thin bar on white.

**Use for**

- Sign up, reset password and change password forms
- Under the new-password Field Preset
- Setting a password after accepting an invite

**Not for**

- Sign in (current-password): no meter
- PINs and one-time codes: use Input OTP

**Anatomy**

1. Bar segments
2. Level in text
3. Message: what is missing

**Content and behavior**

- Strength: empty, weak, fair, good, strong
- The level is in text and bar count, not only color
- Fair uses foreground/default because amber fails as a thin bar on white
- No composition rules beyond length; never block paste

**Accessibility**

- Level and message are text, announced politely in a live region as the user types
- Message is linked to the password field with aria-describedby

| Variant property | Values |
|---|---|
| Strength | empty, weak, fair, good, strong |

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/muted`, `background/success`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/72`
- Radius: `radius/full`
- Text styles: `ui/caption`

## Textarea

Component set · 8 variants · default size 320 × 64

Multi-line text input (shadcn Textarea). Min height 64, grows with content; in code set rows or max height with scroll. Put it in a Field for label, hint and error. Character count goes in the Field hint ("120/500").

**Use for**

- Free text longer than one line: notes, descriptions, reasons
- Messages and comments without formatting
- Reasons for a rejection, a refund or a status change

**Not for**

- One line of text: use Input
- Formatted text with headings and lists: use Rich Text Editor

**Anatomy**

1. Field label
2. Text area
3. Hint with character count ("120/500")

**Content and behavior**

- State: default, focus, error, disabled; Content: placeholder, filled
- Min height 64; grows with content up to a max height, then scrolls
- Height shows the expected length: 3-5 rows
- A limit shows as a counter in the Field hint and turns to error past the limit

**Accessibility**

- Visible label through Field
- Counter is linked with aria-describedby; announce only near the limit
- Never trap Tab: Tab leaves the field

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Add a note… |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Input Addon

Component set · 2 variants · default size 74 × 36

Text or icon attached to an Input Group: protocol, domain, unit, currency, @. Muted background, divider toward the field.

| Variant property | Values |
|---|---|
| Position | start, end |

| Property | Type | Default |
|---|---|---|
| Text | text | https:// |

Tokens and styles:
- Colors: `background/muted`, `border/input`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputGroup` or custom

## Input Group

Component set · 4 variants · default size 360 × 36

Input with attached addons (shadcn Input Group). Use when a fixed prefix/suffix is part of the value format (https://, .com, EUR, kg, %). For icons inside the field, use Input with Leading icon / Trailing slot instead.

**Use for**

- Prefix or suffix that is part of the value: https://, .com, EUR, kg, %, @
- Money, decimals and large numbers with a unit
- A Select (currency) or Button (Copy, Generate) attached to a field

**Not for**

- Icons inside the field: use Input with Leading icon or the Trailing slot
- Small integer quantities: use Number Input

**Anatomy**

1. Start slot: Input Addon (Show start)
2. Input with Value
3. End slot: Input Addon (Show end)

**Content and behavior**

- Input Addon is not editable and not part of what the user types
- Input Addon Position: start or end; muted background, divider toward the field
- State: default, focus, error, disabled
- Amounts are right-aligned in tables

**Accessibility**

- Addon text is included in the accessible description (aria-describedby)
- Focus ring wraps the whole group
- Buttons in the slots have labels

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Value | text | egg-ux |
| Show start | boolean | true |
| Show end | boolean | true |

Slots (fill them in the instance, never detach): `Start`, `End`

Built from: `Input Addon`

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md), [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputGroup` or custom

## Number Input

Component set · 4 variants · default size 140 × 36

Number with − / + steppers for small integer quantities (guests, seats, items). Typing stays possible; min/max disable the buttons; long press repeats. For money or decimals use Input Group with a unit.

**Use for**

- Small integers: seats, guests, items in a cart
- Quantities changed by one or two steps
- Settings with a short integer range: reminders, retries

**Not for**

- Money, decimals and large numbers: use Input Group with a unit
- A range of values: use Slider

**Anatomy**

1. Decrease button (minus)
2. Value
3. Increase button (plus)

**Content and behavior**

- Typing stays possible
- Min and max disable the matching button
- Long press repeats the step
- State: default, focus, error, disabled

**Accessibility**

- Arrow Up and Down change the value
- Buttons have labels: "Decrease seats", "Increase seats"
- Role spinbutton with aria-valuemin, aria-valuemax, aria-valuenow

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Value | text | 2 |

Icons: minus, plus

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputGroup` or custom

## Inline Edit

Component set · 5 variants · default size 320 × 40

Edit a value in place (titles, names, short fields on a detail page): hover shows it is editable, click or Enter opens the input, Enter or the check saves, Escape or x cancels, blur saves. Saving shows a spinner; errors keep the input open with the message. Use a form for several related fields.

**Use for**

- Renaming a project, invoice or view title
- One short field on a detail page
- Short fields on a record header: owner name, reference

**Not for**

- Several related fields, cross-field validation or a review step: use a form
- Values in a table edited in bulk: use bulk actions

**Anatomy**

1. Value text
2. Pencil on hover
3. Input
4. Save (check) and cancel (x) Button Icons
5. Spinner while saving
6. Error message

**Content and behavior**

- State: view, hover, editing, saving, error
- Click or Enter opens the input with the text selected
- Enter or the check saves, Escape or x cancels, blur saves
- Errors keep the input open with the message and the typed value
- Success needs no toast

**Accessibility**

- The value is a button with a label: "Edit title"
- Focus returns to the value after save or cancel
- Saving and errors are announced

| Variant property | Values |
|---|---|
| State | view, hover, editing, saving, error |

| Property | Type | Default |
|---|---|---|
| Value | text | Q3 vendor review |

Built from: `Button Icon`, `Input`, `Spinner`. Icons: pencil

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`
- Radius: `radius/md`
- Text styles: `body/default`, `ui/caption`

Guides: [input](../../skills/build-ui/components/input.md)

Code: custom: text ↔ `Input` with save / cancel `Button Icon`s (Optimistic save, revert on error)

## Signature Pad

Component set · 2 variants · default size 480 × 220

Draw a signature for approvals, contracts and deliveries: the pad (clips the stroke on purpose), a baseline, Clear, and "Type instead" (typed name in a script font) for keyboard and screen reader users. After signing, show who signed and when. Store the image with the timestamp and the document version.

**Use for**

- Approvals and contract signing
- Delivery receipts on a tablet or phone
- Sign-off on an inspection, handover or timesheet

**Not for**

- Simple consent: use a Checkbox
- Qualified e-signatures with legal weight: use a signing provider

**Anatomy**

1. Pad (clips the stroke on purpose)
2. Baseline
3. Clear
4. Type instead
5. Signed by and date (signed)

**Content and behavior**

- State: empty, signed
- Always offer "Type instead" (typed name in a script font)
- After signing, show who signed and when
- Store the image with the timestamp and the document version
- Name the signing method in the decision log; legal weight depends on the country

**Accessibility**

- Type instead is the keyboard and screen reader path
- Clear and Type instead are labeled buttons
- The signed state is announced in text, not only drawn

| Variant property | Values |
|---|---|
| State | empty, signed |

Built from: `Button`

Tokens and styles:
- Colors: `background/default`, `border/default`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Radius: `radius/md`
- Text styles: `body/small`, `heading/h3`, `ui/caption`

Guides: [input](../../skills/build-ui/components/input.md)

Code: `signature_pad` (or `react-signature-canvas`) in a bordered canvas (Typed fallback; store PNG/SVG + timestamp)
