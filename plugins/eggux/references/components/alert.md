# Alert

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Alert](#alert) | 10 | Actions |

## Alert

Component set · 10 variants · default size 480 × 68

Persistent message about a page or section. Layout inline (card above the content) or banner (full width, top of page or panel). Options: Actions (native slot), Dismiss. Warning uses the filled style. Usage: eggux build-ui/components/alert.md

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
