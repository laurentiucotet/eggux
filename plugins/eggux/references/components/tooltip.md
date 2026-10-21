# Tooltip

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tooltip](#tooltip) | 4 | - |

On the Figma page: "Example / icon button with tooltip", "Stress test / Tooltip"

## Tooltip

Component set · 4 variants · default size 115 × 33

shadcn Tooltip. Side = where the tooltip sits relative to its trigger. Plain text, one line; same text as the accessible label of icon-only buttons. Usage: eggux build-ui/components/tooltip.md

**Use for**

- Name of every icon-only button
- A one-line hint on a control
- Full timestamp on a relative time, or the full text of a truncated label
- Reason a control is disabled and how to fix it

**Not for**

- Interactive content: use Popover
- Preview of a person or record: use Hover Card
- Help for a field: hint text under the field
- Pointing out a new feature: use Coachmark

**Anatomy**

1. Trigger
2. Label: plain text, one line
3. Arrow pointing at the trigger (Side)

**Content and behavior**

- Same text as the accessible label of the icon-only button
- Plain text, one line; never links or buttons
- Appears on hover and on keyboard focus, after a short delay
- Never holds information needed to finish the task
- Touch has no hover: the content must also be reachable another way

**Accessibility**

- Shows on keyboard focus; Escape hides it
- Tied to the trigger with aria-describedby, or its text is the button's aria-label
- Text on background/primary meets 4.5:1

| Variant property | Values |
|---|---|
| Side | top, bottom, left, right |

| Property | Type | Default |
|---|---|---|
| Label | text | Add to calendar |

Tokens and styles:
- Colors: `background/primary`, `foreground/primary`
- Spacing and size: `spacing/1_5`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/caption`

Guides: [popover](../../skills/build-ui/components/popover.md), [tooltip](../../skills/build-ui/components/tooltip.md), [tour](../../skills/build-ui/components/tour.md), [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md)

Code: shadcn `Tooltip`, `Popover`, `HoverCard`
