# Selection controls

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Checkbox](#checkbox) | 12 | - |
| [Radio](#radio) | 8 | - |
| [Switch](#switch) | 6 | - |
| [Setting Row](#setting-row) | 1 | Control |
| [Checkbox Card](#checkbox-card) | 5 | - |

On the Figma page: "Example / billing period", "Example / in settings section", "Example / in two-factor", "Example / settings section", "Stress test / Checkbox", "Stress test / Checkbox Card", "Stress test / Radio", "Stress test / Setting Row", "Stress test / Switch"

## Checkbox

Component set · 12 variants · default size 198 × 20

shadcn Checkbox with label. Inside forms that save on submit. Indeterminate only for "select all" over a partial selection. Usage: eggux build-ui/components/select.md

**Use for**

- 2-5 options worth seeing, where several can be chosen
- A single opt-in or consent in a form
- Row selection in tables with bulk actions

**Not for**

- On/off that applies immediately: use Switch
- One choice from a set: use Radio
- Many options: use Tag Input or a Combobox with multi-select

**Anatomy**

1. Box: check icon when Checked=true, minus when Checked=indeterminate
2. Label to the right (Label, Show label)
3. Error message from Field or text under the group

**Content and behavior**

- The label is clickable and sits to the right of the box
- Indeterminate only for "select all" over a partial selection
- A consent checkbox says what the user agrees to, not "I agree"
- Never pre-tick consent or anything with consequences
- State=error marks the box; the message comes from Field

**Accessibility**

- Space toggles; the label is tied to the input
- Show label off needs an aria-label: "Select invoice INV-1041"
- Indeterminate exposes aria-checked="mixed"
- The box border meets 3:1; focus ring in border/ring

| Variant property | Values |
|---|---|
| Checked | false, true, indeterminate |
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Send me product updates |
| Show label | boolean | true |

Icons: check, minus

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `border/input`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/4`
- Radius: `radius/sm`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [select](../../skills/build-ui/components/select.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md)

Code: shadcn `Checkbox`, `RadioGroup`, `Switch`

## Radio

Component set · 8 variants · default size 87 × 20

shadcn RadioGroup item with label. 2-5 options worth seeing, single choice. Usage: eggux build-ui/components/select.md

**Use for**

- One choice from 2-5 options shown at once
- Options people should compare before choosing (plan, delivery method)
- The input mode of Rating: a radio group of 5

**Not for**

- 6-15 options: use Select
- On/off: use Switch or Checkbox
- Several choices: use Checkbox

**Anatomy**

1. Group label
2. Circle, with a dot when Checked=true
3. Label (Label, Show label)
4. Error message under the group

**Content and behavior**

- Always in a group of 2 or more
- No default unless one option is clearly right for most users
- Options in a meaningful order; labels short and parallel
- The label is clickable and sits to the right of the control
- State=error marks the controls; the message sits under the group

**Accessibility**

- The group has a label (fieldset legend or aria-labelledby)
- Tab enters the group; arrow keys move and select
- The circle border meets 3:1; focus ring in border/ring

| Variant property | Values |
|---|---|
| Checked | false, true |
| State | default, focus, error, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | In person |
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `border/input`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/4`
- Radius: `radius/full`
- Text styles: `ui/label`
- Effects: `shadow/xs`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Checkbox`, `RadioGroup`, `Switch`

## Switch

Component set · 6 variants · default size 167 × 20

shadcn Switch with label. Applies immediately and shows the result; inside a form that saves on submit use Checkbox. Usage: eggux build-ui/components/select.md

**Use for**

- Settings that take effect at once: notifications, a feature on or off
- Enabling or pausing an integration
- Lists of preferences on settings pages without a Save button

**Not for**

- Inside a form that saves on submit: use Checkbox
- Choosing between named options: use Radio or Toggle Group

**Anatomy**

1. Track: background/primary when Checked=true
2. Thumb
3. Label (Label, Show label)

**Content and behavior**

- Applies immediately; the change itself is the feedback, no toast
- On failure, restore the old value and show an inline error
- The label names the setting, not the action: "Email notifications"
- Temporarily unavailable: State=disabled with the reason

**Accessibility**

- role="switch" with aria-checked; Space toggles
- The label is tied to the control; Show label off needs an aria-label
- Thumb and track meet 3:1 in both states; focus ring in border/ring

| Variant property | Values |
|---|---|
| Checked | false, true |
| State | default, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Email notifications |
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/default`, `background/primary`, `border/input`, `foreground/default`, `switch/thumb-unchecked`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/4`, `spacing/5`, `spacing/9`
- Radius: `radius/full`
- Text styles: `ui/label`
- Effects: `shadow/sm`, `shadow/xs`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Checkbox`, `RadioGroup`, `Switch`

## Setting Row

Component · 1 variant · default size 640 × 77

One setting: title, optional description, and its control on the right (Control slot: Switch for on/off, Select for a choice, Button for an action like Change or Connect). Stack rows in a settings section; Divider off on the last row. The title names the setting, the description says what changes. Switches save at once, unless the section has its own Save button; then every row in it saves with that button.

**Use for**

- Settings sections: notifications, preferences, integrations
- On and off options that apply at once
- A choice (Select) or an action (Change, Connect) for one setting

**Not for**

- A form people fill and submit: use Field
- Many options of one group: use a Checkbox group in a Field
- A list of objects: use List Item or a Table

**Anatomy**

1. Title (ui/label)
2. Description (Show description)
3. Control slot: Switch, Select or Button
4. Divider (off on the last row)

**Content and behavior**

- Title names the setting, description says what changes
- Switches save at once, unless the section has its own Save button; then every row saves with it
- Controls align right; Selects 200 wide
- Disabled rows say why in the description
- Group rows under a section title; 3-8 rows per section

**Accessibility**

- The Switch is labeled by the Title and described by the Description
- The whole row is not a click target; only the control
- State changes are announced ("Payment reminders on")

| Property | Type | Default |
|---|---|---|
| Title | text | Payment reminders |
| Description | text | Email customers 3 days before and 7 days after the due date. |
| Show description | boolean | true |
| Divider | boolean | true |

Slots (fill them in the instance, never detach): `Control`

Built from: `Separator`, `Switch`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`, `spacing/6`
- Text styles: `body/small`, `ui/label`

Guides: [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: custom row + shadcn `Switch`, `Select` or `Button` (Label and `aria-describedby` from the texts)

## Checkbox Card

Component set · 5 variants · default size 384 × 98

A checkbox with more context, as a card: modules to enable, add-ons, notification channels, onboarding goals. Several can be on; the whole card toggles. Pairs with Option Card (one choice). Group 2-6 in a column or a grid of 2; a group label says what is chosen.

**Use for**

- Modules or add-ons to enable
- Notification channels and reminders
- Onboarding goals where people pick several

**Not for**

- One choice of several: use Option Card
- Short labels that need no description: use Checkbox
- A setting that applies at once: use Setting Row with a Switch

**Anatomy**

1. Checkbox
2. Title
3. Description (Show description)

**Content and behavior**

- State: default, hover, focus, selected, disabled
- The whole card is the click target
- Group 2-6 cards in a column or a grid of 2; a group label says what is chosen
- Selected shows by the checkbox and the border, not color alone
- Disabled says why in the description

**Accessibility**

- Each card is a labelled checkbox; Space toggles
- The group is a fieldset with a legend (Fieldset)
- Title is the label, description is linked with aria-describedby

| Variant property | Values |
|---|---|
| State | default, hover, focus, selected, disabled |

| Property | Type | Default |
|---|---|---|
| Title | text | Approval reminders |
| Description | text | Email approvers when an invoice waits more than 2 days. |
| Show description | boolean | true |

Built from: `Checkbox`

Tokens and styles:
- Colors: `background/accent`, `background/card`, `background/primary`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `body/small`, `ui/label`

Guides: [select](../../skills/build-ui/components/select.md)

Code: shadcn `Checkbox` in a `Label` styled as a `Card` (Whole card toggles; group in a `<fieldset>`)
