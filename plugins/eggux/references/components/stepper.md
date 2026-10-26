# Stepper

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Step](#step) | 16 | - |
| [Stepper](#stepper) | 4 | Steps |

On the Figma page: "Example / Stepper styles", "Stress test / Stepper"

## Step

Component set · 16 variants · default size 240 × 36

One step of a multi-step flow. completed = check on primary, current = primary ring, upcoming = muted, error = destructive. Turn Connector off on the last step. Clickable only for completed steps.


Style: default (numbered circle with title and description), dots (compact progress dots: horizontal shows only the dot, 8 px, the current one a 24 px pill; vertical keeps title and description next to an 8 px dot on a thin rail). Use dots for onboarding, carousels of steps and mobile flows with 3 to 6 steps, always with a "Step 2 of 4" label nearby; use default when people need the step names to orient.


Usage: eggux build-ui/components/stepper.md

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |
| State | completed, current, upcoming, error |
| Style | default, dots |

| Property | Type | Default |
|---|---|---|
| Title | text | Account details |
| Description | text | Name, phone, email |
| Number | text | 2 |
| Show description | boolean | true |
| Show connector | boolean | true |

Icons: check, x

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/8`
- Radius: `radius/full`
- Text styles: `ui/caption`, `ui/label`

Guides: [stepper](../../skills/build-ui/components/stepper.md)

Code: custom (no shadcn stepper)

## Stepper

Component set · 4 variants · default size 960 × 36

Progress through a multi-step form or wizard (3-6 steps). Show it above the form; on mobile show "Step 2 of 3" + title instead.


Orientation: horizontal (above the form) or vertical (in a side column next to a long form, or a setup checklist). Style: default (numbered steps with titles) or dots (compact progress dots; horizontal for onboarding and mobile flows with a "Step 2 of 4" label, vertical as a light checklist rail). Steps (native slot) holds Step instances with the same Orientation and Style; turn Show connector off on the last one.


Usage: eggux build-ui/components/stepper.md

**Use for**

- Multi-step forms and wizards where order matters: onboarding, checkout
- 3-6 steps
- On top of Block / Multi-step Form, one Card per step
- Orientation=vertical: in a side column next to a long form, or as a setup checklist
- Style=dots: onboarding, carousels of steps and mobile flows, always with a "Step 2 of 4" label

**Not for**

- 2 steps: use one page or a Dialog
- Independent sections: use Tabs
- Mobile: "Step 2 of 3 · Plan" and a Progress bar

**Anatomy**

1. Steps slot: Step instances with the same Orientation and Style
2. Indicator: Number, check when completed, x when error (Style=default)
3. Style=dots: 8 px dot (current: 24 px pill horizontal, ring vertical; upcoming foreground/muted)
4. Title
5. Description (Show description)
6. Connector to the next step, off on the last

**Content and behavior**

- Step titles are nouns: "Account", "Plan", "Confirm"
- Exactly one Step is current
- Completed steps show a check and are clickable; upcoming steps are not
- Validate each step before moving on; an invalid step that was left shows error
- Keep entered data when going back; the last step is a review
- Style=dots horizontal hides the step names: show the current title and "Step 2 of 4" next to it

**Accessibility**

- An ordered list; the current step has aria-current="step"
- Step state is in text for screen readers ("Completed", "Error")
- Moving to a step moves focus to its heading
- Style=dots: each dot has an accessible name ("Step 2 of 4, current")

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |
| Style | default, dots |

Slots (fill them in the instance, never detach): `Steps`

Built from: `Step`

Tokens and styles:
- Spacing and size: `spacing/2`, `spacing/3`

Guides: [stepper](../../skills/build-ui/components/stepper.md)

Code: custom (no shadcn stepper)
