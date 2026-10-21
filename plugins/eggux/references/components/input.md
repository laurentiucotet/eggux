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
| [Input Group](#input-group) | 4 | Start, End |
| [Input Addon](#input-addon) | 2 | - |
| [Number Input](#number-input) | 4 | - |
| [Inline Edit](#inline-edit) | 5 | - |
| [Signature Pad](#signature-pad) | 2 | - |
| [Copy Field](#copy-field) | 2 | - |
| [Search Field](#search-field) | 3 | - |
| [Inline Form](#inline-form) | 3 | - |
| [Currency Input](#currency-input) | 4 | - |
| [Phone Input](#phone-input) | 4 | - |
| [Date Input](#date-input) | 4 | - |
| [Duration Input](#duration-input) | 3 | - |
| [Range Fields](#range-fields) | 2 | - |

On the Figma page: "Example / approve a contract", "Example / in multi-step form", "Example / in navbar search", "Example / in product detail", "Example / in reset password", "Example / input groups", "Example / rename a project", "Stress test / Copy Field", "Stress test / Currency Input", "Stress test / Date Input", "Stress test / Duration Input", "Stress test / Field", "Stress test / Inline Edit and Signature Pad", "Stress test / Inline Form", "Stress test / Input", "Stress test / Input Group", "Stress test / Number Input", "Stress test / Password Strength", "Stress test / Phone Input", "Stress test / Range Fields", "Stress test / Search Field", "Stress test / Signature Pad", "Stress test / Textarea"

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
- Radius: `radius/md`
- Text styles: `code`

Guides: [input](../../skills/build-ui/components/input.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `InputGroup` with a `readOnly` Input (`font-mono`) + Copy `Button`; `navigator.clipboard.writeText` (copied state 2 s, no toast; mask secrets until Reveal)

## Search Field

Component set · 3 variants · default size 320 × 36

Search box for a list, a table or the whole app: search icon, placeholder that names what is searched ("Search invoices"), ⌘K hint (Show shortcut), clear (x) once there is a query. Results update as people type (debounce ~300 ms); Esc clears. Global search opens Command Dialog; filtering one list stays inline.

**Use for**

- Filtering one list or table as people type
- The search of a Filter Bar or a Top Bar
- Global search that opens Command Dialog on click or with the shortcut

**Not for**

- Search with filters, sort and views: use Filter Bar
- Picking one value from a list in a form: use Combobox
- Free text that is not a query: use Input

**Anatomy**

1. Search icon
2. Placeholder ("Search invoices") or Query
3. Clear (x), once there is a query
4. Shortcut: Kbd "⌘K" (Show shortcut)

**Content and behavior**

- State: default, focus, filled
- The placeholder names what is searched: "Search invoices", never just "Search"
- Results update as people type, with a debounce of about 300 ms; Esc clears
- Clear shows only when there is a query; the shortcut hides while typing
- Global search opens Command Dialog; filtering one list stays inline. Keep the query in the URL
- No results: Empty State that names the query

**Accessibility**

- role="search" on the wrapper and an aria-label that says what it searches when there is no visible label
- Clear is a button with aria-label="Clear search"
- The result count is announced in a live region as it changes

| Variant property | Values |
|---|---|
| State | default, focus, filled |

| Property | Type | Default |
|---|---|---|
| Placeholder | text | Search invoices |
| Query | text | northwind |
| Show shortcut | boolean | true |

Built from: `Kbd`. Icons: search, x

Tokens and styles:
- Colors: `background/default`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: shadcn `InputGroup` (`type="search"`) + search icon, `Kbd`, clear `Button` (Debounce ~300 ms; global search opens `CommandDialog`)

## Inline Form

Component set · 3 variants · default size 400 × 62

One field and one button on a line: newsletter sign-up, coupon code, invite by email, add a tag. Input and Button are exposed (set the placeholder and the verb). error keeps the value and says how to fix it; success replaces the hint with what happens next. Two or more fields need a form.

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
2. Button (exposed): the verb ("Subscribe", "Apply", "Invite")
3. Hint (Show hint), Error or Success message under the row

**Content and behavior**

- State: default, error, success
- The button says what happens: a verb, never "Submit"
- Error keeps the value and says how to fix it: "Enter an email address like name@company.com."
- Success replaces the hint with what happens next; clear the input only when people add several items
- On narrow screens the button stays on the line; below 320 px it goes full width under the input

**Accessibility**

- The input has a visible label or an aria-label ("Email address")
- It is a form: Enter submits
- Error and success messages are linked with aria-describedby and announced in a live region

| Variant property | Values |
|---|---|
| State | default, error, success |

| Property | Type | Default |
|---|---|---|
| Hint | text | One email a month. Unsubscribe at any time. |
| Error | text | Enter an email address like name@company.com. |
| Success message | text | You are subscribed. Check your inbox to confirm. |
| Show hint | boolean | true |

Built from: `Button`, `Input`

Tokens and styles:
- Colors: `background/destructive`, `background/success`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [commerce](../../skills/build-ui/patterns/commerce.md)

Code: `<form class="flex gap-2">` with shadcn `Input` + `Button` (react-hook-form + zod) (Keep the value on error)

## Currency Input

Component set · 4 variants · default size 240 × 36

An amount with its currency: invoice lines, budgets, prices, limits. Currency picker on the left (ISO code), amount right-aligned in the locale format with two decimals, formatted on blur. Accept typed separators of the locale; never let the currency change silently. One currency for the whole form: hide the picker and show the code as a fixed prefix.

**Use for**

- Invoice lines, prices and budgets
- Limits and thresholds (approval above EUR 5,000)
- Forms where the currency can differ per record

**Not for**

- One currency for the whole form: use Input Group with the code as a fixed prefix
- Small integer quantities: use Number Input
- A minimum and a maximum amount: use Range Fields

**Anatomy**

1. Currency: ISO code ("EUR") with chevron-down, opens a list
2. Amount: right-aligned, two decimals

**Content and behavior**

- State: default, focus, error, disabled
- Format on blur in the locale format (1,250.00 or 1.250,00); accept the typed separators of the locale
- Never change the currency silently: changing it keeps the amount and asks before converting
- Errors name the limit: "Enter an amount up to EUR 10,000.00"
- Store the amount in minor units with the ISO code

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
- Radius: `radius/md`
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
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [input](../../skills/build-ui/components/input.md)

Code: react-phone-number-input (libphonenumber-js) + shadcn `Popover` + `Command` country list (Store E.164; `type="tel"`, `autocomplete="tel"`)

## Date Input

Component set · 4 variants · default size 200 × 36

A date people type: day, month and year segments in the locale order, with a calendar button that opens Date Picker. Use it for known dates (birth date, invoice date, contract start) where typing is faster than picking. Arrow keys change a segment; empty segments show DD, MM, YYYY in muted. Errors name the rule ("Date must be after 1 Jan 2026").

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
- Radius: `radius/md`, `radius/sm`
- Text styles: `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: react-aria `DateField` + shadcn `Popover` with `Calendar` (react-day-picker) (Segments in locale order)

## Duration Input

Component set · 3 variants · default size 200 × 36

A length of time in hours and minutes: time entries, SLAs, reminders, meeting length. Accept "1:30", "90" (minutes) and "1.5h" and normalize on blur. Minutes above 59 roll into hours. Days only when the task needs them (lead times): add a third segment.

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
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md)

Code: custom: two shadcn `Input`s (`inputmode="numeric"`) with unit addons (Parse "1:30", "90", "1.5h" on blur; store minutes)

## Range Fields

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
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [input](../../skills/build-ui/components/input.md), [search-and-filter](../../skills/build-ui/patterns/search-and-filter.md)

Code: custom: two shadcn `InputGroup`s in a `<fieldset>`; zod `refine` min <= max (Either side may be empty)
