# Toast

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toast](#toast) | 6 | - |

On the Figma page: "Example / toast after sending an invoice", "Stress test / Toast"

## Toast

Component set · 6 variants · default size 384 × 76

Sonner toast. One line, past tense, names the object. At most one action ("Undo", "View"). Close button off by default; turn it on for toasts with an action, errors and long durations. Errors that block the goal also show inline. Usage: eggux build-ui/components/toast.md

**Use for**

- Confirming an action whose result is out of view: "Invoice INV-1048 created"
- Undo for restorable deletes and archives
- Background events: export ready, import done
- Bulk results with counts: "18 sent, 2 failed"

**Not for**

- The result is visible where the user is: the change itself is the feedback
- Errors that block the goal: inline error where the problem is
- Information people need later: put it on the page or use Alert

**Anatomy**

1. Type icon: success, error, warning, info or loading
2. Title: one line
3. Description (Show description)
4. Action button (Action)
5. Close button (Close button)

**Content and behavior**

- One line, past tense, names the object: "Invoice #1042 sent", not "Success!"
- At most one action, a verb: "Undo", "View"
- Auto-dismiss after 4-6 s, 8-10 s with an action; pause on hover and focus
- Close button off by default; on for toasts with an action, errors and long durations
- Errors that block the goal also show inline
- Same position everywhere: bottom right, top center on mobile

**Accessibility**

- aria-live="polite"; "assertive" for errors
- Timers pause on focus, so the action can be reached with the keyboard
- Nothing appears only in a toast

| Variant property | Values |
|---|---|
| Type | default, success, error, warning, info, loading |

| Property | Type | Default |
|---|---|---|
| Show description | boolean | true |
| Action | boolean | false |
| Close button | boolean | false |

Built from: `Button`. Icons: circle-alert, circle-check, info, loader-circle, triangle-alert, x

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`, `foreground/popover`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/96`
- Radius: `radius/md`, `radius/sm`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/lg`

Guides: [toast](../../skills/build-ui/components/toast.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md), [delete-confirmation](../../skills/build-ui/patterns/delete-confirmation.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: shadcn `Alert`, `Sonner`
