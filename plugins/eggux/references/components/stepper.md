# Stepper

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Step](#step) | 8 | - |
| [Stepper](#stepper) | 1 | Steps |

On the Figma page: "Example / in multi-step form", "Stress test / Stepper"

## Step

Component set · 8 variants · default size 240 × 36

One step of a multi-step flow. completed = check on primary, current = primary ring, upcoming = muted, error = destructive. Turn Connector off on the last step. Clickable only for completed steps.

| Variant property | Values |
|---|---|
| Orientation | horizontal, vertical |
| State | completed, current, upcoming, error |

| Property | Type | Default |
|---|---|---|
| Title | text | Account details |
| Description | text | Name, phone, email |
| Number | text | 2 |
| Show description | boolean | true |
| Connector | boolean | true |

Icons: check, x

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/DEFAULT`, `spacing/1`, `spacing/1_5`, `spacing/3`, `spacing/6`, `spacing/8`
- Radius: `radius/full`
- Text styles: `ui/caption`, `ui/label`

Guides: [stepper](../../skills/build-ui/components/stepper.md)

Code: custom (no shadcn stepper)

## Stepper

Component · 1 variant · default size 960 × 36

Progress through a multi-step form or wizard (3-6 steps). Show it above the form; on mobile show "Step 2 of 3" + title instead.

**Use for**

- Multi-step forms and wizards where order matters: onboarding, checkout
- 3-6 steps
- On top of Block / Multi-step Form, one Card per step

**Not for**

- 2 steps: use one page or a Dialog
- Independent sections: use Tabs
- Mobile: "Step 2 of 3 · Plan" and a Progress bar

**Anatomy**

1. Steps slot: Step instances
2. Indicator: Number, check when completed, x when error
3. Title
4. Description (Show description)
5. Connector to the next step, off on the last

**Content and behavior**

- Step titles are nouns: "Account", "Plan", "Confirm"
- Exactly one Step is current
- Completed steps show a check and are clickable; upcoming steps are not
- Validate each step before moving on; an invalid step that was left shows error
- Keep entered data when going back; the last step is a review

**Accessibility**

- An ordered list; the current step has aria-current="step"
- Step state is in text for screen readers ("Completed", "Error")
- Moving to a step moves focus to its heading

Slots (fill them in the instance, never detach): `Steps`

Built from: `Step`

Tokens and styles:
- Spacing and size: `spacing/3`

Guides: [stepper](../../skills/build-ui/components/stepper.md)

Code: custom (no shadcn stepper)
