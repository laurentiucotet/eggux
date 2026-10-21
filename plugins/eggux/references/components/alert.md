# Alert

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Alert](#alert) | 10 | Actions |

On the Figma page: "Example / in import mapping", "Stress test / Alert"

## Alert

Component set · 10 variants · default size 480 × 68

Persistent message about a page or section. Layout inline (card above the content) or banner (full width, top of page or panel). Options: Actions (native slot), Dismiss. Warning uses the filled style. Usage: eggux build-ui/components/alert.md

**Use for**

- States such as trial ends in 3 days, read-only access, sync failed
- Layout=inline: a card above the content it concerns
- Layout=banner: full width at the top of a page or panel (maintenance, read-only mode)
- Notes and warnings inside documentation content

**Not for**

- Confirming an action that just happened: use Toast
- A decision before continuing: use Alert Dialog
- An error in one field: show it under the field

**Anatomy**

1. Icon by Variant: info, circle-check, triangle-alert, circle-alert
2. Title: the situation in a few words
3. Description: what to do about it (Show description)
4. Actions slot: up to three small buttons or links (Show actions)
5. Dismiss x (Dismiss)

**Content and behavior**

- Variant matches the meaning: default, info, success, warning, destructive; always with an icon
- Variant=warning is filled (background/warning) because amber fails contrast as text on white
- The action that resolves the situation comes first
- Dismiss only when no action is needed; remember the dismissal
- Never stack more than one alert in the same place; show the most important one
- Say what happened, then what to do; no blame, no "Oops"

**Accessibility**

- An alert that appears after load uses role="alert" (destructive) or role="status"
- Meaning is in icon and text, never color alone
- Dismiss x has an accessible label and is reachable by keyboard

| Variant property | Values |
|---|---|
| Variant | default, destructive, success, warning, info |
| Layout | inline, banner |

| Property | Type | Default |
|---|---|---|
| Title | text | Heads up |
| Description | text | You can add team members from the Settings page. |
| Show description | boolean | true |
| Show actions | boolean | false |
| Dismiss | boolean | false |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`. Icons: circle-alert, circle-check, info, triangle-alert, x

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `background/info`, `background/success`, `background/warning`, `border/default`, `foreground/card`, `foreground/muted`, `foreground/warning`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`, `radius/sm`
- Text styles: `body/small`, `ui/label`

Guides: [alert](../../skills/build-ui/components/alert.md), [card](../../skills/build-ui/components/card.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md), [feedback-messages](../../skills/build-ui/patterns/feedback-messages.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md)

Code: shadcn `Alert`, `Sonner`
