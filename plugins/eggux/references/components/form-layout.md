# Form Layout

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Form Section](#form-section) | 2 | Fields |
| [Fieldset](#fieldset) | 2 | Options |
| [Error Summary](#error-summary) | 1 | Errors |
| [Requirement List](#requirement-list) | 1 | Items |
| [Check Item](#check-item) | 9 | - |

On the Figma page: "Example / Check Item tones", "Example / in account settings form", "Stress test / Error Summary", "Stress test / Fieldset", "Stress test / Form Section", "Stress test / Requirement List"

## Form Section

Component set · 2 variants · default size 960 × 225

One group of a long form or settings page: title and a sentence on the left (280), the fields on the right (Fields slot). side from 1024 px, stacked on narrow screens and in sheets. Group fields the way people think about them (billing, contact, security); 2-6 fields per section; divider between sections. One Save for the page, in a Save Bar or Action Bar.

**Use for**

- Settings pages with several groups (billing, contact, security)
- Long record forms: a customer, a product, an invoice
- Profile pages

**Not for**

- Settings that apply at once, one per row: use Setting Row
- A short form of 2-4 fields: use Fields in one column
- A group of checkboxes or radios with one label: use Fieldset

**Anatomy**

1. Title (heading/h3) and Description (Show description)
2. Fields slot: Field instances
3. Divider (Show divider): Separator

**Content and behavior**

- Layout: side from 1024 px (heading column 280), stacked on narrow screens and in Sheets
- Group fields the way people think about them; 2-6 fields per section
- Description says what the fields are for or when changes apply
- Divider between sections, off on the last one
- One Save for the page, in a Save Bar or Action Bar

**Accessibility**

- The title is a real heading that follows the page outline
- Wrap the section in a section element labelled by its title (aria-labelledby)
- Tab order goes from the heading column to the fields, top to bottom

| Variant property | Values |
|---|---|
| Layout | side, stacked |

| Property | Type | Default |
|---|---|---|
| Title | text | Billing details |
| Description | text | Shown on every invoice you send. Changes apply to new invoices only. |
| Show description | boolean | true |
| Show divider | boolean | true |

Slots (fill them in the instance, never detach): `Fields`

Built from: `Field`, `Separator`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/12`, `spacing/4`, `spacing/6`, `spacing/8`
- Text styles: `body/small`, `heading/h4`

Guides: [form-validation](../../skills/build-ui/patterns/form-validation.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: `<section class="grid gap-6 lg:grid-cols-[280px_1fr]">` with heading, description and `FormField`s (Stacked below 1024 px; `Separator` between sections)

## Fieldset

Component set · 2 variants · default size 480 × 130

A group of related controls with one label: checkboxes, radios, the parts of an address or a date. The legend names the question; the description gives the rule; the error belongs to the group, not to one control. Options slot holds Checkbox, Radio or Fields.

**Use for**

- A checkbox or radio group with a question
- The parts of an address or a date
- A group of Option Cards

**Not for**

- One control: use Field
- A titled group of unrelated fields in a long form: use Form Section
- One on/off setting: use Setting Row

**Anatomy**

1. Legend: the question
2. Description (Show description): the rule
3. Options slot: Checkbox, Radio or Fields
4. Error (State=error)

**Content and behavior**

- State: default, error
- The legend names the question ("Notify me about"); the description gives the rule ("Choose at least one.")
- The error belongs to the group, not to one control: "Choose at least one notification."
- Options in a meaningful order; 2-7 options, more go in a Select or Combobox

**Accessibility**

- A fieldset with a legend, or role="group" / role="radiogroup" with aria-labelledby
- Description and error are linked to the group with aria-describedby
- On submit, focus moves to the first control of the group in error

| Variant property | Values |
|---|---|
| State | default, error |

| Property | Type | Default |
|---|---|---|
| Legend | text | Notify me about |
| Description | text | Choose at least one. |
| Show description | boolean | true |
| Error | text | Choose at least one notification. |

Slots (fill them in the instance, never detach): `Options`

Built from: `Checkbox`

Tokens and styles:
- Colors: `background/destructive`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`
- Text styles: `body/small`, `ui/label`

Guides: [form-validation](../../skills/build-ui/patterns/form-validation.md)

Code: `<fieldset>` + `<legend>`; shadcn `RadioGroup` or `Checkbox` items, `FormMessage` for the group (Error belongs to the group)

## Error Summary

Component · 1 variant · default size 560 × 130

At the top of a long form after a failed submit: how many fields need a fix and a link to each. Focus moves here on submit; each link moves focus to its field, which shows the same message inline. Only for forms longer than one screen; short forms show inline errors only. Disappears when all are fixed.

**Use for**

- Forms longer than one screen
- Multi-step forms at the review step
- Imports and settings pages with many fields

**Not for**

- Short forms: show inline errors on the Field only
- A server or network error: use Alert
- A message about a saved action: use Toast

**Anatomy**

1. circle-alert icon
2. Title: "Fix 3 fields to continue"
3. Errors slot: one link per field ("Email: enter an email address like name@company.com")

**Content and behavior**

- Shows only after a submit; focus moves here
- Each link names the field and the fix, the same message the field shows inline
- Links in the order of the fields on the page
- The count updates as fields are fixed; the summary disappears when all are fixed

**Accessibility**

- role="alert" or a focused container with tabindex="-1" and a heading
- Each link moves focus to its field (href="#field-id")
- Error color is paired with the icon and the title text

| Property | Type | Default |
|---|---|---|
| Title | text | Fix 3 fields to continue |

Slots (fill them in the instance, never detach): `Errors`

Icons: circle-alert

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `foreground/default`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `body/small`, `ui/label`

Guides: [form-validation](../../skills/build-ui/patterns/form-validation.md)

Code: shadcn `Alert` (destructive) with anchor links from react-hook-form `formState.errors` (Focus moves here on submit; links focus the field)

## Requirement List

Component · 1 variant · default size 320 × 126

Rules checked live while people type or before they publish: password rules, import checks, what a listing needs before it goes live. Each Check Item updates as soon as it is met; nothing turns red before a submit. Keep it under 6 rules and in the order people fix them.

**Use for**

- Password rules under a new-password field
- Checks before a listing or a page goes live
- Import checks before people continue

**Not for**

- One strength level for a password: use Password Strength
- Errors after a submit: use the Field error or Error Summary
- Steps of a process: use Stepper

**Anatomy**

1. Title (Show title): "Your password needs"
2. Items slot: Check Items

**Content and behavior**

- Each Check Item updates as soon as it is met
- Nothing turns red before a submit; pending stays neutral
- Under 6 rules, in the order people fix them
- Rules are positive and short: "At least 12 characters"

**Accessibility**

- A list (ul) linked to the field with aria-describedby
- Changes are announced politely (aria-live="polite"), not on every key
- Met is shown by icon and text, not color alone

| Property | Type | Default |
|---|---|---|
| Title | text | Your password needs |
| Show title | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Check Item`

Tokens and styles:
- Colors: `foreground/default`
- Spacing and size: `spacing/1_5`, `spacing/2`
- Text styles: `ui/label`

Guides: [input](../../skills/build-ui/components/input.md), [auth](../../skills/build-ui/patterns/auth.md), [form-validation](../../skills/build-ui/patterns/form-validation.md)

Code: custom `<ul>` of `Check Item`s, state from the zod schema of the field (`aria-live="polite"`; nothing red before submit)

## Check Item

Component set · 9 variants · default size 163 × 20

One line with a mark: check (met, included), dash (pending, not included) or x (failed after a submit). Used in Requirement List (password and publish rules) and in Plan Card feature lists. Label is one line; keep the order people read or fix them in.


Tone: default; on-primary on primary bands and cards (label and mark in foreground/primary, 5.2:1); inverted on inverted cards (Plan Card inverted, Pricing Enterprise Banner: label and mark in background/default, dash in background/muted). The mark is one color in both tones so it keeps 3:1 in every theme. Never override the colors by hand.

**Use for**

- Rules in a Requirement List (password, publish checks)
- Features of a Plan Card
- Benefits next to a sign-up form or a call to action

**Not for**

- Tasks people tick off: use Task Item
- Benefits with an icon and a description: use Feature Item
- A message about one field: use the Field hint or error

**Anatomy**

1. Mark: circle-check (Mark=check), dash (Mark=dash), x (Mark=x)
2. Label: one line, muted when Mark=dash
3. Tone: default, on-primary (label and mark in foreground/primary), inverted (label and mark in background/default; dash in background/muted)

**Content and behavior**

- Mark=check for met or included, dash for pending or not included, x only after a submit failed
- One line per item; lead with the benefit or the rule ("At least 12 characters")
- In plans, list what is included first and keep the same order across plans
- In Requirement List the marks update as people type; nothing turns x before a submit
- Tone=on-primary on primary bands and cards, Tone=inverted on inverted cards (Plan Card inverted, Pricing Enterprise Banner); never recolor the label or the mark by hand

**Accessibility**

- The mark is aria-hidden; the meaning is in text ("included", "not included", "met", "not met yet")
- Lists are ul elements
- Contrast of muted labels stays at 4.5:1
- In the on-primary and inverted tones the mark has the label color (foreground/primary 5.2:1 on primary; background/default over 14:1 on inverted), because the success green falls under 3:1 on an inverted card in Dark

| Variant property | Values |
|---|---|
| Mark | check, dash, x |
| Tone | default, on-primary, inverted |

| Property | Type | Default |
|---|---|---|
| Label | text | At least 12 characters |

Icons: circle-check, minus, x

Tokens and styles:
- Colors: `background/default`, `background/muted`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/2`
- Text styles: `body/small`

Guides: [content](../../skills/build-ui/components/content.md), [input](../../skills/build-ui/components/input.md), [auth](../../skills/build-ui/patterns/auth.md), [marketing-pages](../../skills/build-ui/patterns/marketing-pages.md)

Code: `<li class="flex gap-2">` with lucide `CircleCheck`, `Minus` or `X` (`aria-hidden`) and an sr-only status (Mark=check, dash, x. Tone=on-primary: label and icon `text-primary-foreground`; Tone=inverted: `text-background`, dash `text-muted`)
