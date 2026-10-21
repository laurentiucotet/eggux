# Approvals

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Approval Step](#approval-step) | 4 | - |

## Approval Step

Component set · 4 variants · default size 400 × 120

One approver in a chain: marker, name, role and rule, status, time, comment. current = waiting for this person (show due date); rejected always has a reason. Last step: Connector off.

| Variant property | Values |
|---|---|
| Status | approved, current, rejected, upcoming |

| Property | Type | Default |
|---|---|---|
| Name | text | Elena Dumitru |
| Role | text | Finance manager · approves over €10,000 |
| Time | text | 22 Oct 2026, 10:30 |
| Comment | text | Within budget, vendor is approved. |
| Show comment | boolean | true |
| Connector | boolean | true |

Built from: `Badge`. Icons: check, clock, x

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `background/success`, `background/warning`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/2`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/5`, `spacing/6`
- Radius: `radius/full`, `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [approvals](../../skills/build-ui/patterns/approvals.md)

Code: custom on the Timeline layout
