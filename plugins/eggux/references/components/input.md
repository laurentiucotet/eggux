# Input

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Input](#input) | 68 | Trailing |
| [Field](#field) | 6 | Control |
| [Field Counter](#field-counter) | 3 | - |
| [Password Strength](#password-strength) | 5 | - |
| [Textarea](#textarea) | 10 | - |
| [Input Group](#input-group) | 4 | Start, End |
| [Input Addon](#input-addon) | 2 | - |
| [Number Input](#number-input) | 8 | - |
| [Inline Edit](#inline-edit) | 5 | - |
| [Signature Pad](#signature-pad) | 2 | - |
| [Copy Field](#copy-field) | 2 | - |
| [Search Field](#search-field) | 6 | - |
| [Inline Form](#inline-form) | 6 | - |
| [Currency Input](#currency-input) | 4 | - |
| [Phone Input](#phone-input) | 4 | - |
| [Date Input](#date-input) | 4 | - |
| [Duration Input](#duration-input) | 3 | - |
| [Range Input](#range-input) | 2 | - |

On the Figma page: "Example / Field styles", "Example / Input Group styles", "Example / Input styles", "Example / Search Field styles", "Example / Textarea styles", "Example / approve a contract", "Example / in account settings form", "Example / in product detail", "Example / in reset password", "Example / input groups", "Example / rename a project", "Example / textarea in field", "Example / workspace rules", "Stress test / Copy Field", "Stress test / Currency Input", "Stress test / Date Input", "Stress test / Duration Input", "Stress test / Field", "Stress test / Inline Edit and Signature Pad", "Stress test / Inline Form", "Stress test / Input", "Stress test / Input Group", "Stress test / Number Input", "Stress test / Password Strength", "Stress test / Phone Input", "Stress test / Range Input", "Stress test / Search Field", "Stress test / Signature Pad", "Stress test / Textarea"

## Input

Component set · 68 variants · default size 320 × 36

shadcn Input. Content=placeholder shows an example value, never the label. Use inside Field for label, hint and error.


Style: default (outlined, the standard); filled (background/muted fill, no border until focus or error; for dense or card-heavy screens; placeholder in input/filled-muted-foreground); floating (48 high, the Label sits inside and moves up on focus or once there is a value; for short public forms like sign-up and checkout; put it in a Field with Show label off). One Style per form.


Size: default 36 (density/control-height), sm 32 (filter bars, toolbars, table rows, dense forms), lg 40 (body/default text; hero and mobile forms). Match the Size of the Buttons beside it. State=read-only: muted fill, the same border, no shadow, value in foreground/default; for values people can read and copy but not change (never use disabled for that). Show clear: an x after the value, only while it has a value. Show loading: Spinner sm at the end during an async check (coupon, workspace URL, VAT number). Style=floating has no sizes and no read-only.


Usage: eggux build-ui/components/input.md

**Use for**

- Short free text: names, titles, email, search
- Search above a list, with the search Leading icon
- Any form control inside Field
- Style=filled: dense or card-heavy screens, filters and settings where many outlined boxes look busy
- Style=floating: short public forms (sign-up, checkout, contact) where the label sits inside the field to save height
- Size=sm: filter bars, Data Grid Toolbar, table rows, dense enterprise forms
- Size=lg: hero inline forms, Help Hero search, mobile forms
- State=read-only: values people can read and copy but not change (record details, IDs, fields locked after approval)
- Show loading: async checks (workspace URL, coupon, address, VAT number)
- Show clear: filter fields and search-like fields with a value

**Not for**

- Text longer than one line: use Textarea
- Choosing from a list: use Select or Combobox
- Fixed prefix or suffix (https://, EUR, %): use Input Group
- Common data (email, phone, card): use Field Preset
- Mixing Styles in one form: pick one Style per form
- Style=floating for long or dense forms, or with long labels: use default with the label above
- State=disabled for a value that is only locked: use read-only
- Mixing Sizes in one row: match the Buttons beside it

**Anatomy**

1. Style: default (border/input, shadow/xs), filled (background/muted fill, no border until focus or error), floating (48 high, Label inside)
2. Leading icon (Show leading icon, Leading icon)
3. Label (floating only): rests in the middle in body/small; moves up in ui/caption on focus or when Content=filled; foreground/brand on focus, background/destructive on error
4. Value or placeholder
5. Trailing slot (Show trailing): clear, show password
6. Clear (Show clear): x icon 16 after the value
7. Loading (Show loading): Spinner sm at the end
8. Size: default 36 (density/control-height), sm 32 (spacing/8), lg 40 (spacing/10, body/default text, 16 padding)
9. State=read-only: background/muted fill, border/input border, no shadow, value foreground/default, placeholder input/filled-muted-foreground; clear and loading hidden

**Content and behavior**

- Content=placeholder shows an example value, never the label or instructions
- State: default, focus, error, disabled, read-only; Size: default, sm, lg (Style default and filled; floating has default only)
- Width suggests the expected length
- Pick the narrowest type and set autocomplete in code
- Never clear what the user typed after an error
- Style=filled: placeholder and secondary text use input/filled-muted-foreground (neutral/600 in light modes) because foreground/muted is 4.35:1 on background/muted
- Style=filled on background/default or background/card only; on a muted surface the fill disappears
- Style=floating: put it in a Field with Show label off so the hint and the error stay; the Label is the visible label, never a placeholder only
- Style=floating with focus and no value shows the floated Label and the placeholder
- Read-only text stays selectable and full contrast; never use disabled for it
- Show clear only while there is a value; clearing keeps focus in the field
- Show loading only during the check; then show the result in the Field hint or error
- Resize: the value fills and truncates to 1 line; icons, clear and spinner keep their size

**Accessibility**

- Always has a visible label through Field; icon-only search fields need aria-label
- Focus ring uses border/ring; border contrast at least 3:1
- Error is linked with aria-describedby and aria-invalid
- Style=filled: the fill is about 1.1:1 against the page (1.3:1 Dark), like the default border (1.3:1 Light); the visible label identifies the field, and focus adds a border/ring border and ring (4.7:1 on the fill)
- Style=floating: the Label is the accessible name (label for/id); it stays visible when the field has a value; label text is 4.7:1 or more in every theme
- read-only: readonly attribute, still focusable; no aria-disabled
- Clear is a button with aria-label "Clear"
- Loading: aria-busy on the field and a polite status message

| Variant property | Values |
|---|---|
| Style | default, filled, floating |
| Size | default, sm, lg |
| State | default, focus, error, disabled, read-only |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | name@example.com |
| Show leading icon | boolean | false |
| Leading icon | instance swap | Icon/search |
| Show trailing | boolean | false |
| Label | text | Email |
| Show clear | boolean | false |
| Show loading | boolean | false |

Slots (fill them in the instance, never detach): `Trailing`

Built from: `Spinner`. Icons: search, x

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/input`, `border/ring`, `foreground/brand`, `foreground/default`, `foreground/muted`, `input/filled-muted-foreground`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/12`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `input/radius`
- Text styles: `body/default`, `body/small`, `ui/caption`, `ui/label`
- Effects: `shadow/xs`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [select](../../skills/build-ui/components/select.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Field

Component set · 6 variants · default size 320 × 88

Label + Control (native slot, default Input) + hint or error. Label always visible: Show label off only when the control has its own visible label (Input Style=floating). Error text uses background/destructive with an icon.


Show required adds a red asterisk after the label; Show optional adds "Optional" (bound to the field/optional content string, so it translates). Mark the minority in a form: required or optional, never both. Show info adds an Info Tip Trigger after the label that opens an Info Tip with a short definition. Show counter adds the Field Counter (exposed: Count; Status default, near, over) at the right of the label; over the limit also set State=error with a message. Layout: vertical (label above, the default) or horizontal (160 px label column on the left, min width 400, for dense settings and record forms). Labels wrap at 256 px (144 in horizontal).


Usage: eggux build-ui/patterns/form-validation.md

**Use for**

- Every form control: Input, Textarea, Select, Input Group, Number Input
- Format hints shown before the user types
- Grouped fields (address, date range) that need one label each
- Layout=horizontal: dense settings pages and enterprise record forms with many short fields
- Show info: a field that needs a definition (tax ID, SLA, webhook URL, role names)
- Show counter: text with a limit (bio, SMS, notification text, review, AI prompt)

**Not for**

- Table cells or filter toolbars where the column or chip names the value: use Input alone with aria-label
- Values edited in place on a detail page: use Inline Edit
- Show required and Show optional in the same form: mark only the minority
- Layout=horizontal under 400 px or on mobile: use vertical
- Show info for text people need to finish the task: put it in the hint

**Anatomy**

1. Label row (Show label): label group and counter
2. Label (Label, ui/label; wraps at 256, 144 in horizontal)
3. Required (Show required): red asterisk, background/destructive
4. Optional (Show optional): "Optional" in body/small foreground/muted, bound to the field/optional content string
5. Info (Show info): Info Tip Trigger that opens an Info Tip
6. Counter (Show counter): Field Counter, exposed (Count; Status default, near, over), at the right of the label
7. Control slot (default Input)
8. Hint (Show hint) or Error with circle-alert icon
9. Layout: vertical (label above) or horizontal (160 label column on the left, body fills; min width 400)

**Content and behavior**

- Label is always visible
- State: default, error, disabled
- Error replaces the hint, says what is wrong and how to fix it: "Enter an email address like name@example.com"
- Validate on blur; once in error, re-validate on every change
- Error text uses background/destructive with an icon, not color alone
- Show label off only when the control carries its own visible label (Input Style=floating); hint and error stay under it
- State: default, error, disabled; Layout: vertical, horizontal
- Mark the minority: if most fields are required, mark the optional ones (Show optional), otherwise mark the required ones (Show required); never both in one form
- Required asterisk is explained once at the top of long forms ("* required") unless every field is required
- Counter: default up to about 90% of the limit, near from 90%, over past the limit; over also sets State=error with "Use 160 characters or fewer"; never block typing or paste
- Info Tip text is one or two sentences and at most one link; the hint stays for format help
- Resize: label row fills; the label hugs and wraps at 256 (144 in horizontal), markers wrap to the next line when there is no room; the control fills; hint and error wrap
- Layout=horizontal needs at least 400; below that use vertical

**Accessibility**

- Label is tied to the control (for / id)
- Hint and error linked with aria-describedby; aria-invalid on error
- On submit, focus moves to the first invalid field
- With Show label off the control's own label must stay visible and be tied to the control
- Required: the input gets required / aria-required; the asterisk is aria-hidden and the form explains it
- Optional text is part of the label (read with it)
- Counter text is linked with aria-describedby and announced politely only near and over the limit
- Info trigger is a button with aria-label "More about <label>" and aria-expanded

| Variant property | Values |
|---|---|
| State | default, error, disabled |
| Layout | vertical, horizontal |

| Property | Type | Default |
|---|---|---|
| Label | text | Email |
| Hint | text | We send receipts and account notices here. |
| Show hint | boolean | true |
| Error | text | Enter an email address like name@example.com |
| Show label | boolean | true |
| Show required | boolean | false |
| Show optional | boolean | false |
| Show info | boolean | false |
| Show counter | boolean | false |

Slots (fill them in the instance, never detach): `Control`

Built from: `Field Counter`, `Info Tip Trigger`, `Input`. Icons: circle-alert

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/4`, `spacing/40`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Field Counter

Component set · 3 variants · default size 45 × 16

Character counter shown at the right of a Field label ("142 / 160"); exposed in Field (Show counter). Status: default (foreground/muted), near (foreground/default, medium, from about 90% of the limit), over (background/destructive, medium; set the Field to State=error with a message like "Use 160 characters or fewer"). Never block typing at the limit; let people paste and then trim.


Usage: eggux build-ui/components/input.md

**Use for**

- Inside Field (Show counter) for text with a limit

**Not for**

- Fields without a real limit
- Number limits (min, max): use the hint

**Anatomy**

1. Count text (Count)
2. Status: default (ui/caption, foreground/muted), near (ui/label-small, foreground/default), over (ui/label-small, background/destructive)

**Content and behavior**

- Status near from about 90% of the limit, over past it
- Over the limit the Field also goes to State=error with a message
- Resize: hugs its text; never wraps

**Accessibility**

- Linked to the control with aria-describedby
- Announce only near and over (aria-live polite), not on every key

| Variant property | Values |
|---|---|
| Status | default, near, over |

| Property | Type | Default |
|---|---|---|
| Count | text | 42 / 160 |

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Text styles: `ui/caption`, `ui/label-small`

Guides: [input](../../skills/build-ui/components/input.md)

Code: `span className="text-xs tabular-nums text-muted-foreground"`; near `font-medium text-foreground`; over `font-medium text-destructive` (In the label row (`flex justify-between`); `aria-describedby` on the control, `aria-live="polite"` near and over only)

## Password Strength

Component set · 5 variants · default size 288 × 42

Strength meter under a new-password Field. Level: empty, weak, fair, good, strong. The only rule is length (8 or more characters, no composition rules, see patterns/auth.md): the message asks for a longer password, never for numbers or symbols. The level is in text and bar count, not only color. Fair uses foreground/default because amber fails as a thin bar on white.


Usage: eggux build-ui/patterns/auth.md

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
3. Message: asks for a longer password when weak or fair

**Content and behavior**

- Level: empty, weak, fair, good, strong
- Length is the only rule (8 or more characters): messages never ask for numbers, symbols or cases (patterns/auth.md)
- Default copy: empty "Use at least 8 characters. A longer phrase is stronger.", weak "Weak: make it longer.", fair "Fair: a few more characters make it stronger."
- The level is in text and bar count, not only color
- Fair uses foreground/default because amber fails as a thin bar on white
- No composition rules beyond length; never block paste

**Accessibility**

- Level and message are text, announced politely in a live region as the user types
- Message is linked to the password field with aria-describedby

| Variant property | Values |
|---|---|
| Level | empty, weak, fair, good, strong |

Tokens and styles:
- Colors: `background/destructive`, `background/info`, `background/muted`, `background/success`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/1_5`, `spacing/72`
- Radius: `radius/full`
- Text styles: `ui/caption`

Guides: [input](../../skills/build-ui/components/input.md), [auth](../../skills/build-ui/patterns/auth.md)

Code: custom bars + text under the shadcn `Input` (Level in text, not only color)

## Textarea

Component set · 10 variants · default size 320 × 64

Multi-line text input (shadcn Textarea). Min height 64, grows with content; in code set rows or max height with scroll. Put it in a Field for label, hint and error. Character count goes in the Field hint ("120/500").


State=read-only: muted fill, full-contrast text, no shadow, for notes locked after approval. A character limit goes in the Field: Show counter (Field Counter at the right of the label).


Usage: eggux build-ui/components/input.md

**Use for**

- Free text longer than one line: notes, descriptions, reasons
- Messages and comments without formatting
- Reasons for a rejection, a refund or a status change
- State=read-only: notes and reasons locked after approval

**Not for**

- One line of text: use Input
- Formatted text with headings and lists: use Rich Text Editor

**Anatomy**

1. Field label
2. Text area
3. Counter: Field Show counter (Field Counter at the right of the label)
4. State=read-only: background/muted, no shadow, full-contrast text

**Content and behavior**

- State: default, focus, error, disabled, read-only; Content: placeholder, filled
- Min height 64; grows with content up to a max height, then scrolls
- Height shows the expected length: 3-5 rows
- A limit shows as Field Show counter; past the limit the counter is Status=over and the Field State=error
- Resize: the text area fills the Field; text wraps

**Accessibility**

- Visible label through Field
- Counter is linked with aria-describedby; announce only near the limit
- Never trap Tab: Tab leaves the field

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled, read-only |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Add a note… |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`, `input/filled-muted-foreground`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: shadcn `Input`, `Label`, `Textarea`, `Form` (react-hook-form) (Field = `FormItem` with label, description, message)

## Input Group

Component set · 4 variants · default size 360 × 36

Input with attached addons (shadcn Input Group). Use when a fixed prefix/suffix is part of the value format (https://, .com, EUR, kg, %). For icons inside the field, use Input with Leading icon / Trailing slot instead.


Show loading: Spinner sm after the value while an async check runs (workspace URL available, coupon, VAT number); put the result in the Field hint or error.


Usage: eggux build-ui/components/input.md

**Use for**

- Prefix or suffix that is part of the value: https://, .com, EUR, kg, %, @
- Money, decimals and large numbers with a unit
- A Select (currency) or Button (Copy, Generate) attached to a field
- Show loading: an async check of the value (workspace URL available, coupon, VAT number)

**Not for**

- Icons inside the field: use Input with Show leading icon or the Trailing slot
- Small integer quantities: use Number Input

**Anatomy**

1. Start slot: Input Addon (Show start)
2. Input with Value
3. End slot: Input Addon (Show end)
4. Loading (Show loading): Spinner sm after the value

**Content and behavior**

- Input Addon is not editable and not part of what the user types
- Input Addon Position: start or end; muted background, divider toward the field
- State: default, focus, error, disabled
- Amounts are right-aligned in tables
- Resize: the value fills between the addons and stays on 1 line with ellipsis; addons keep their width
- Show loading only while checking; the result goes in the Field hint or error

**Accessibility**

- Addon text is included in the accessible description (aria-describedby)
- Focus ring wraps the whole group
- Buttons in the slots have labels
- Loading: aria-busy on the input and a polite status message

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Value | text | egg-ux |
| Show start | boolean | true |
| Show end | boolean | true |
| Show loading | boolean | false |

Slots (fill them in the instance, never detach): `Start`, `End`

Built from: `Input Addon`, `Spinner`

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `input/radius`
- Text styles: `body/small`

Guides: [color-picker](../../skills/build-ui/components/color-picker.md), [input](../../skills/build-ui/components/input.md)

Code: shadcn `InputGroup` or custom

## Input Addon

Component set · 2 variants · default size 77 × 36

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

## Number Input

Component set · 8 variants · default size 140 × 36

Number with − / + steppers for small integer quantities (guests, seats, items). Typing stays possible; min/max disable the buttons; long press repeats. For money or decimals use Input Group with a unit. Size=sm (32) for cart lines and dense rows. At the minimum or maximum, set the - or + icon to foreground/muted and block the click.

**Use for**

- Small integers: seats, guests, items in a cart (Size=sm in Line Item)
- Quantities changed by one or two steps
- Settings with a short integer range: reminders, retries

**Not for**

- Money, decimals and large numbers: use Input Group with a unit
- A range of values: use Slider

**Anatomy**

1. Decrease button (minus)
2. Value, typeable
3. Increase button (plus)
4. Size: default (36), sm (32) for cart lines and dense rows

**Content and behavior**

- Typing stays possible
- Min and max disable the matching button
- Long press repeats the step
- State: default, focus, error, disabled; Size: default, sm
- At the minimum or maximum, set the matching icon to foreground/muted and block the click (cart: minus at 1, or remove the line at 0)
- In carts the maximum comes from stock; say "Only 3 left" next to the field

**Accessibility**

- Arrow Up and Down change the value
- Buttons have labels: "Decrease seats", "Increase seats"
- Role spinbutton with aria-valuemin, aria-valuemax, aria-valuenow

| Variant property | Values |
|---|---|
| Size | sm, default |
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Value | text | 2 |

Icons: minus, plus

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`
- Radius: `input/radius`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `InputGroup` or custom

## Inline Edit

Component set · 5 variants · default size 320 × 36

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
| Error | text | Enter a name. |

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
- Resize: the hint stretches with the pad (32 from each edge), centered, up to 2 lines with ellipsis

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

## Copy Field

Component set · 2 variants · default size 360 × 36

A value people copy and paste elsewhere: API key, invite link, webhook URL, reference code. Read-only field in muted with the value in mono, then Copy. State=copied for 2 s after the click: check icon and "Copied", no toast. Long values truncate; the full value is what gets copied. Secrets: mask all but the last 4 characters until Reveal.

**Use for**

- API keys and tokens on an API Keys or integration page
- Invite and share links
- Webhook URLs, IDs and reference codes people paste into another tool

**Not for**

- A value people edit: use Input
- A short code inside text: use Kbd or inline code
- A one-time code people type: use Input OTP

**Anatomy**

1. Field: muted background, Value in mono, truncated
2. Copy: Button (exposed), icon and "Copy"
3. State=copied: check icon and "Copied"

**Content and behavior**

- State=copied lasts 2 s after the click, then returns to default; no toast
- Long values truncate at the end; the full value is what gets copied
- Secrets show only the last 4 characters until Reveal; show a full key once, at creation
- The field has a visible label through Field that names the value ("Live secret key")
- When copying fails, select the value and say "Press Ctrl+C to copy"

**Accessibility**

- The value is a readonly input or text the keyboard can select
- Copy has an aria-label that names the value ("Copy API key")
- "Copied" is announced in a live region (role="status", aria-live="polite")

| Variant property | Values |
|---|---|
| State | default, copied |

| Property | Type | Default |
|---|---|---|
| Value | text | sk_live_51H8xKd2a9f4F2a |

Built from: `Button`

Tokens and styles:
- Colors: `background/muted`, `border/input`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `input/radius`
- Text styles: `code`

Guides: [button](../../skills/build-ui/components/button.md), [input](../../skills/build-ui/components/input.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `InputGroup` with a `readOnly` Input (`font-mono`) + Copy `Button`; `navigator.clipboard.writeText` (copied state 2 s, no toast; mask secrets until Reveal)

## Search Field

Component set · 6 variants · default size 320 × 36

Search box for a list, a table or the whole app: search icon, placeholder that names what is searched ("Search invoices"), ⌘K hint (Show shortcut), clear (x) once there is a query. Results update as people type (debounce about 300 ms); Esc clears. Global search opens Command Dialog; filtering one list stays inline.


Size: default (36) in toolbars, Filter Bar and Top Bar; lg (48, body/default, 20 px icons, 480 wide) for heroes and help centers where search is the main action.


Usage: eggux build-ui/patterns/search-and-filter.md

**Use for**

- Filtering one list or table as people type
- The search of a Filter Bar or a Top Bar
- Global search that opens Command Dialog on click or with the shortcut
- Size=lg: the main search of a hero, a help center or an empty search page

**Not for**

- Search with filters, sort and views: use Filter Bar
- Picking one value from a list in a form: use Combobox
- Free text that is not a query: use Input

**Anatomy**

1. Size: default 36 high (body/small, 16 px icons, 320 wide) or lg 48 high (body/default, 20 px icons, 480 wide)
2. Search icon
3. Placeholder ("Search invoices") or Query
4. Clear (x), once there is a query
5. Shortcut: Kbd "⌘K" (Show shortcut)

**Content and behavior**

- State: default, focus, filled
- The placeholder names what is searched: "Search invoices", never just "Search"
- Results update as people type, with a debounce of about 300 ms; Esc clears
- Clear shows only when there is a query; the shortcut hides while typing
- Global search opens Command Dialog; filtering one list stays inline. Keep the query in the URL
- No results: Empty State that names the query
- Size=lg only where search is the main action of the view; toolbars, Filter Bar and Top Bar use default

**Accessibility**

- role="search" on the wrapper and an aria-label that says what it searches when there is no visible label
- Clear is a button with aria-label="Clear search"
- The result count is announced in a live region as it changes

| Variant property | Values |
|---|---|
| Size | default, lg |
| State | default, focus, filled |

| Property | Type | Default |
|---|---|---|
| Placeholder | text | Search invoices |
| Query | text | northwind |
| Show shortcut | boolean | true |

Built from: `Kbd`. Icons: search, x

Tokens and styles:
- Colors: `background/default`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/12`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `input/radius`
- Text styles: `body/default`, `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `InputGroup` (`type="search"`) + search icon, `Kbd`, clear `Button` (Debounce ~300 ms; global search opens `CommandDialog`)

## Inline Form

Component set · 6 variants · default size 400 × 62

One field and one button on a line: newsletter sign-up, coupon code, invite by email, add a tag. The Input and the Button are exposed, so the placeholder and the button label change from the instance panel. State=error and State=success replace the hint with a message. Tone=on-primary is for primary bands and cards: secondary button and hint, error and success text in foreground/primary (5.2:1 on background/primary); the input keeps its own surface.


Usage: eggux build-ui/components/input.md

**Use for**

- Newsletter sign-up in a footer or a content page
- Coupon or promo code in a cart
- Invite one person by email
- Adding one item to a list (tag, domain, email)

**Not for**

- Two or more fields: use Field in a form with an Action Bar
- Searching a list: use Search Field
- Editing a value that already exists: use Inline Edit

**Anatomy**

1. Input (exposed): placeholder with an example value
2. Button (exposed): the verb ("Subscribe", "Apply", "Invite"); change Label from the instance panel
3. Hint (Show hint), Error or Success message under the row
4. Tone: default, on-primary (secondary Button; hint, error and success text in foreground/primary)

**Content and behavior**

- State: default, error, success
- Tone=on-primary on primary bands and cards (Newsletter Card, CTA bands); never override the button variant or text colors by hand
- The button says what happens: a verb, never "Submit"
- Error keeps the value and says how to fix it: "Enter an email address like name@company.com."
- Success replaces the hint with what happens next; clear the input only when people add several items
- On narrow screens the button stays on the line; below 320 px it goes full width under the input

**Accessibility**

- The input has a visible label or an aria-label ("Email address")
- It is a form: Enter submits
- Error and success messages are linked with aria-describedby and announced in a live region
- On primary bands the hint and messages use foreground/primary: 5.2:1 Light and Dark, 6.7:1 Corporate Light on background/primary

| Variant property | Values |
|---|---|
| State | default, error, success |
| Tone | default, on-primary |

| Property | Type | Default |
|---|---|---|
| Hint | text | One email a month. Unsubscribe at any time. |
| Error | text | Enter an email address like name@company.com. |
| Success message | text | You are subscribed. Check your inbox to confirm. |
| Show hint | boolean | true |

Built from: `Button`, `Input`

Tokens and styles:
- Colors: `background/destructive`, `background/success`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: `<form class="flex gap-2">` with shadcn `Input` + `Button` (react-hook-form + zod) (Keep the value on error. Tone=on-primary: `Button variant="secondary"`, hint and messages `text-primary-foreground`)

## Currency Input

Component set · 4 variants · default size 240 × 36

An amount with its currency: invoice lines, budgets, prices, limits. Currency picker on the left (ISO code), amount right-aligned in the locale format with two decimals, formatted on blur. Accept typed separators of the locale; never let the currency change silently. One currency for the whole form: hide the picker and show the code as a fixed prefix.
Needs at least 160: the currency code caps at 96 and the amount truncates.

**Use for**

- Invoice lines, prices and budgets
- Limits and thresholds (approval above EUR 5,000)
- Forms where the currency can differ per record

**Not for**

- One currency for the whole form: use Input Group with the code as a fixed prefix
- Small integer quantities: use Number Input
- A minimum and a maximum amount: use Range Input

**Anatomy**

1. Currency: ISO code ("EUR") with chevron-down, opens a list
2. Amount: right-aligned, two decimals

**Content and behavior**

- State: default, focus, error, disabled
- Format on blur in the locale format (1,250.00 or 1.250,00); accept the typed separators of the locale
- Never change the currency silently: changing it keeps the amount and asks before converting
- Errors name the limit: "Enter an amount up to EUR 10,000.00"
- Store the amount in minor units with the ISO code
- Resize: min width 160; the currency picker hugs up to 96 with its code on 1 line; the amount fills and truncates

**Accessibility**

- The currency trigger has an aria-label ("Currency, EUR")
- The amount input uses inputmode="decimal" and is labelled by the Field label
- Focus ring wraps the whole field

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Amount | text | 1,250.00 |
| Currency | text | EUR |

Icons: chevron-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/0`, `spacing/1`, `spacing/3`
- Radius: `input/radius`
- Text styles: `body/small`, `ui/label`

Guides: [input](../../skills/build-ui/components/input.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: shadcn `InputGroup` with a `Select` of ISO codes + `Input`; react-number-format or `Intl.NumberFormat` (Store minor units + ISO code; one currency: Input Group prefix)

## Phone Input

Component set · 4 variants · default size 280 × 36

Phone number with a country code picker (searchable list, country name and code). Default to the country of the account; format as people type, store in E.164 (+40712345678). Accept pasted numbers with the + prefix and set the country from them. Ask for a phone number only when it is used.

**Use for**

- Contact details on a profile, a customer or an order
- Two-factor setup and SMS notifications
- Delivery contacts at checkout

**Not for**

- Other numbers (IDs, quantities): use Input or Number Input
- Common contact data in one go: use Field Preset
- One-time codes sent by SMS: use Input OTP

**Anatomy**

1. Country: country code ("RO +40") with chevron-down, opens a searchable list
2. Number: formatted as people type

**Content and behavior**

- State: default, focus, error, disabled
- Default to the country of the account
- Accept pasted numbers with the + prefix and set the country from them
- Store in E.164 (+40712345678); show it formatted for the country
- Ask for a phone number only when it is used, and say what for in the hint
- Resize: the country picker hugs up to 112 with its code on 1 line; the number fills and stays on 1 line with ellipsis

**Accessibility**

- The country list is searchable by country name and code; arrow keys move, Enter picks
- The number input uses type="tel" and autocomplete="tel"
- The country trigger has an aria-label ("Country code, Romania +40")

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Country | text | RO +40 |
| Number | text | 712 345 678 |

Icons: chevron-down

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`
- Spacing and size: `density/control-height`, `spacing/0`, `spacing/1`, `spacing/3`
- Radius: `input/radius`
- Text styles: `body/small`, `ui/label`

Guides: [input](../../skills/build-ui/components/input.md)

Code: react-phone-number-input (libphonenumber-js) + shadcn `Popover` + `Command` country list (Store E.164; `type="tel"`, `autocomplete="tel"`)

## Date Input

Component set · 4 variants · default size 200 × 36

A date people type: day, month and year segments in the locale order, with a calendar button that opens Date Picker. Use it for known dates (birth date, invoice date, contract start) where typing is faster than picking. Arrow keys change a segment; empty segments show DD, MM, YYYY in muted. Errors name the rule ("Date must be after 1 Jan 2026").
Needs at least 160: segments keep their width and a value that does not fit ends with an ellipsis.

**Use for**

- Known dates: birth date, invoice date, contract start, document expiry
- Dates far from today, where typing is faster than paging months
- Data entry forms used all day

**Not for**

- Dates near today or with availability: use Date Picker
- A period with a start and an end: use Date Range Picker
- A time of day: use Time Picker

**Anatomy**

1. Day, month and year segments in the locale order, with separators
2. Empty segments: DD, MM, YYYY in muted
3. Calendar button: calendar icon, opens Date Picker

**Content and behavior**

- State: default, focus, error, disabled
- Segment order and separators follow the locale (12.11.2026 for ro-RO)
- Arrow keys change the focused segment; typing a full segment moves to the next
- Validate on blur; errors name the rule: "Date must be after 1 Jan 2026"
- Pasting a full date fills all segments
- Resize: min width 160; day and month segments hug at least 16 and up to 24, the year 32 to 44, centered, so 2-digit values never truncate

**Accessibility**

- Each segment is a spinbutton with a label ("Day", "Month", "Year") inside a group labelled by the Field
- The calendar button has aria-label="Choose date" and returns focus to the field on close
- Errors are linked with aria-describedby

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Day | text | 12 |
| Month | text | 11 |
| Year | text | 2026 |

Icons: calendar

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/0_5`, `spacing/1`, `spacing/3`
- Radius: `input/radius`, `radius/sm`
- Text styles: `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: react-aria `DateField` + shadcn `Popover` with `Calendar` (react-day-picker) (Segments in locale order)

## Duration Input

Component set · 3 variants · default size 200 × 36

A length of time in hours and minutes: time entries, SLAs, reminders, meeting length. Accept "1:30", "90" (minutes) and "1.5h" and normalize on blur. Minutes above 59 roll into hours. Days only when the task needs them (lead times): add a third segment.
Needs at least 160: values and units keep their width and end with an ellipsis when too long.

**Use for**

- Time entries and timesheets
- SLAs and response targets
- Reminders and meeting length

**Not for**

- A time of day: use Time Picker
- A date: use Date Input or Date Picker
- A count without a time unit: use Number Input

**Anatomy**

1. Hours with the "h" unit
2. Minutes with the "min" unit

**Content and behavior**

- State: default, focus, error
- Accept "1:30", "90" (minutes) and "1.5h"; normalize on blur
- Minutes above 59 roll into hours
- Add a days segment only when the task needs it (lead times)
- Store minutes as one number; errors name the limit ("Up to 24 h per entry")
- Resize: min width 160; values (max 24) and units (max 28) hug and truncate with ellipsis

**Accessibility**

- Hours and minutes are inputs with labels ("Hours", "Minutes") in a group labelled by the Field
- inputmode="numeric"; arrow keys step by 1
- The normalized value is read back after blur ("1 hour 30 minutes")

| Variant property | Values |
|---|---|
| State | default, focus, error |

| Property | Type | Default |
|---|---|---|
| Hours | text | 1 |
| Minutes | text | 30 |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/1`, `spacing/3`
- Radius: `input/radius`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md)

Code: custom: two shadcn `Input`s (`inputmode="numeric"`) with unit addons (Parse "1:30", "90", "1.5h" on blur; store minutes)

## Range Input

Component set · 2 variants · default size 320 × 36

Two fields for a minimum and a maximum: price or amount filters, date ranges typed by hand, quantities. Either side may stay empty ("from 100"). error when min is above max; say it under the pair. Wide numeric ranges people scan visually: use Slider Type=range with these fields next to it.

**Use for**

- Price or amount filters in a Filter Section
- Quantities and sizes with a lower and an upper bound
- Ranges people type, next to a Slider Type=range

**Not for**

- A range people scan visually: use Slider Type=range with these fields next to it
- A date range with a calendar: use Date Range Picker
- One value: use Input Group or Number Input

**Anatomy**

1. Min field: unit ("€") and value
2. Dash between the fields
3. Max field: unit and value

**Content and behavior**

- State: default, error
- Either side may stay empty ("from 100")
- Error when min is above max; say it once under the pair: "Minimum must be lower than the maximum"
- Same unit and format on both sides; format on blur
- In filters, apply on blur or Enter, not on every key
- Resize: the two fields share the width; units hug up to 32 and values stay on 1 line with ellipsis

**Accessibility**

- Wrap the pair in a fieldset or group with the label ("Price")
- Each input has its own label: "Minimum price", "Maximum price"
- The error is linked to both inputs with aria-describedby

| Variant property | Values |
|---|---|
| State | default, error |

| Property | Type | Default |
|---|---|---|
| Min | text | 100 |
| Max | text | 2,500 |
| Unit | text | € |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `input/radius`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: each field `min-w-0 flex-1`; unit `max-w-8 truncate shrink-0`; value `truncate`
