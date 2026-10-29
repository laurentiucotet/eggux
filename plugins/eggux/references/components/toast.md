# Toast

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Toast](#toast) | 12 | - |

On the Figma page: "Example / Toast styles", "Example / toast after sending an invoice", "Stress test / Toast"

## Toast

Component set · 12 variants · default size 384 × 76

Sonner toast. One line, past tense, names the object. At most one action ("Undo", "View"). Close button off by default; turn it on for toasts with an action, errors and long durations. Errors that block the goal also show inline.


Style: default (popover surface with border, the standard), inverted (dark surface in Light: foreground/default fill, background/default text and icons; it flips to a light toast in Dark). Use inverted when toasts sit over busy or white content and must stand out (editors, maps, media), and keep one Style per product. Inverted icons are monochrome: the icon shape and the words carry the type.


Show avatar (Type=default): a person or app Avatar before the text, for activity from someone ("Ana Popescu replied"); the Avatar is exposed, set its photo or initials. Show progress: a 4 px Progress (Size=sm, exposed) under the text, for an upload in progress (Type=loading) or the time left to Undo; set its Value. Never both a status icon and an avatar.


Usage: eggux build-ui/components/toast.md

**Use for**

- Confirming an action whose result is out of view: "Invoice INV-1048 created"
- Undo for restorable deletes and archives
- Background events: export ready, import done
- Bulk results with counts: "18 sent, 2 failed"
- Style=inverted: dark toast in Light (light in Dark) when toasts sit over busy or white content: editors, maps, media
- Show avatar: activity from a person ("Ana Popescu replied")
- Show progress: an upload in progress (Type=loading) or the time left to Undo

**Not for**

- The result is visible where the user is: the change itself is the feedback
- Errors that block the goal: inline error where the problem is
- Information people need later: put it on the page or use Alert

**Anatomy**

1. Avatar (Show avatar, Type=default only, exposed Avatar sm)
2. Type icon: success, error, warning, info or loading
3. Title: one line (Title)
4. Description (Show description, Description)
5. Progress (Show progress, exposed Progress Size=sm under the text; set its Value)
6. Action button (Show action)
7. Close button (Show close)
8. Style: default (popover surface, border, shadow/lg) or inverted (foreground/default fill, text and icons background/default, description and close at opacity/80, no border)

**Content and behavior**

- One line, past tense, names the object: "Invoice #1042 sent", not "Success!"
- At most one action, a verb: "Undo", "View"
- Auto-dismiss after 4-6 s, 8-10 s with an action; pause on hover and focus
- Show close off by default; on for toasts with an action, errors and long durations
- Errors that block the goal also show inline
- Same position everywhere: bottom right, top center on mobile
- Style=inverted icons are monochrome; the icon shape and the words carry the type
- One Style per product; never mix default and inverted toasts in one stack
- Never a status icon and an avatar together; Show avatar is for Type=default
- Show progress: the bar shows real progress or the Undo countdown; the toast stays until the work ends

**Accessibility**

- aria-live="polite"; "assertive" for errors
- Timers pause on focus, so the action can be reached with the keyboard
- Nothing appears only in a toast

| Variant property | Values |
|---|---|
| Type | default, success, error, warning, info, loading |
| Style | default, inverted |

| Property | Type | Default |
|---|---|---|
| Show description | boolean | true |
| Show action | boolean | false |
| Show close | boolean | false |
| Title | text | Changes saved |
| Description | text | Project “Website redesign” was updated. |
| Show avatar | boolean | false |
| Show progress | boolean | false |

Built from: `Avatar`, `Button`, `Progress`. Icons: circle-alert, circle-check, info, loader-circle, triangle-alert, x

Tokens and styles:
- Colors: `background/default`, `background/popover`, `border/default`, `foreground/default`, `foreground/muted`, `foreground/popover`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/96`
- Radius: `radius/md`, `radius/sm`
- Text styles: `body/small`, `ui/label`
- Effects: `shadow/lg`

Guides: [toast](../../skills/build-ui/components/toast.md), [action-feedback](../../skills/build-ui/patterns/action-feedback.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md), [delete-confirmation](../../skills/build-ui/patterns/delete-confirmation.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: shadcn `Alert`, `Sonner`
