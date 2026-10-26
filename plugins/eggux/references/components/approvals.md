# Approvals

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Approval Step](#approval-step) | 4 | - |

On the Figma page: "Example / in approval request", "Stress test / Approval Step"

## Approval Step

Component set · 4 variants · default size 400 × 120

One approver in a chain: marker, name, role and rule, status, time, comment. current = waiting for this person (show due date); rejected always has a reason. Last step: Connector off.

**Use for**

- Approval chains for purchases, expenses, discounts, access and content
- The chain column of an approval request, one step per approver, in order
- The approver inbox detail, to show who the request waits for

**Not for**

- Field changes on a record: use Change Item in an audit log
- Steps the user goes through in a form: use Stepper
- Events over time without decisions: use Timeline Item

**Anatomy**

1. Marker by Status (check, clock, x) and Connector to the next step
2. Name
3. Role and rule ("Finance manager · approves over €10,000")
4. Status Badge
5. Time: drives the time line in every Status ("22 Oct 2026, 10:30", "Assigned 2 h ago · due tomorrow", "After Finance")
6. Comment (Show comment)

**Content and behavior**

- The whole chain is visible before anyone acts
- Status=current: show the due date; the approver sees "Waiting for you"
- Status=rejected always has a reason; Approve takes an optional comment
- Last step: Connector off
- Changing the request resets the steps that depend on what changed, and says so
- Every decision is an audit log entry
- Set the time line through the Time property in every Status; never type over the layer

**Accessibility**

- The chain is an ordered list; each step reads name, role, status and time
- Status is in the Badge text, not the marker color alone
- Marker icons are decorative when the Badge says the status

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
| Show connector | boolean | true |

Built from: `Badge`. Icons: check, clock, x

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `background/success`, `background/warning`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `border-width/2`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/5`, `spacing/6`
- Radius: `radius/full`, `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [approvals](../../skills/build-ui/patterns/approvals.md)

Code: custom on the Timeline layout
