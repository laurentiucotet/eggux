# Dialog

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Dialog](#dialog) | 1 | Header, Content, Footer |
| [Dialog Header](#dialog-header) | 1 | Media |
| [Dialog Footer](#dialog-footer) | 1 | Actions |
| [Alert Dialog](#alert-dialog) | 3 | Header, Footer |
| [Welcome Dialog](#welcome-dialog) | 3 | - |

On the Figma page: "Example / delete confirmation over a list", "Example / dialog over page", "Example / dialog sizes", "Stress test / Alert Dialog", "Stress test / Dialog", "Stress test / Welcome Dialog"

## Dialog

Component · 1 variant · default size 512 × 270

shadcn Dialog: Header, Content and Footer are native slots (defaults: Dialog Header, placeholder, Dialog Footer). Short focused task; never a dialog from a dialog. Usage: eggux build-ui/components/dialog.md Width: sm 384 (short confirmation), default 512, lg 672 (table, preview, longer form), xl 896 (side-by-side); resize the instance.

**Use for**

- Rename, invite a member, quick create
- A few fields where the page behind does not matter
- Re-authentication after an expired session

**Not for**

- A decision before continuing: use Alert Dialog
- Longer forms or details next to a list: use Sheet
- More than one step or ~6 fields: use a page
- Forms on mobile: use Drawer or a full-screen Sheet

**Anatomy**

1. Overlay (dialog/overlay)
2. Header slot: Dialog Header with Title, Description, Close X and optional Media
3. Content slot
4. Footer slot: Dialog Footer, Cancel outline left, primary right

**Content and behavior**

- Title says the task ("Invite member"), never "Info" or "Warning"
- One primary action, bottom right; Cancel outline to its left
- Never open a dialog from a dialog
- Long content scrolls inside; header and footer stay fixed
- Closing with unsaved input follows the unsaved changes pattern
- Fill the Header, Content and Footer slots in the instance; never detach
- Width: sm 384 for a short confirmation, default 512 for a form with a few fields, lg 672 for a table, a preview or a longer form, xl 896 only for side-by-side content; resize the instance

**Accessibility**

- Focus moves to the first field on open and returns to the trigger on close
- Focus stays inside while open; Esc closes
- Title is the accessible name, Description the accessible description
- Close X has an accessible label

| Property | Type | Default |
|---|---|---|
| Show header | boolean | true |
| Show content | boolean | true |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Header`, `Content`, `Footer`

Built from: `Dialog Footer`, `Dialog Header`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/muted`
- Spacing and size: `layout/container/lg`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`, `radius/md`
- Text styles: `ui/caption`
- Effects: `shadow/lg`

Guides: [carousel](../../skills/build-ui/components/carousel.md), [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md), [popover](../../skills/build-ui/components/popover.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Dialog`, `AlertDialog`

## Dialog Header

Component · 1 variant · default size 464 × 56

shadcn DialogHeader: title (body/large), description, close X. Turn Close off in Alert Dialog. Reuse in Sheet and Drawer.

| Property | Type | Default |
|---|---|---|
| Title | text | Invite member |
| Description | text | They will get an email with a link to join the workspace. |
| Show description | boolean | true |
| Close | boolean | true |
| Show media | boolean | false |

Slots (fill them in the instance, never detach): `Media`

Icons: info, x

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `radius/full`, `radius/sm`
- Text styles: `body/large`, `body/small`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md)

## Dialog Footer

Component · 1 variant · default size 464 × 36

shadcn DialogFooter. "Actions" is a native slot. One primary action, on the right.

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md)

## Alert Dialog

Component set · 3 variants · default size 512 × 158

shadcn AlertDialog presets. confirm = a decision with consequences; destructive = irreversible, action named with its verb; acknowledge = one button, the user only needs to know. No close button, no outside click; focus on Cancel (or the only button). Usage: eggux build-ui/patterns/delete-confirmation.md

**Use for**

- Type=confirm: a decision with consequences that can be undone or is not destructive
- Type=destructive: irreversible loss, such as delete or revoke
- Type=acknowledge: one button, the user only needs to know
- Discard unsaved changes

**Not for**

- Restorable actions: act at once and offer Undo in a toast
- Information that does not block the next step: use a toast or inline Alert
- A task with fields: use Dialog

**Anatomy**

1. Overlay (dialog/overlay)
2. Header slot: Dialog Header with Close off, title as a question, description
3. Footer slot: Cancel outline left, action verb right (destructive variant when destructive)

**Content and behavior**

- Title names the action and object: "Delete project?"
- Body says what is lost and "This can't be undone." when true
- Buttons are verbs ("Delete project"), never Yes / No
- No close button and no close on outside click
- High impact (account, project, bulk data): type the name to confirm
- On failure the dialog stays open with the error

**Accessibility**

- Focus starts on Cancel (or the only button); Esc closes as Cancel
- role="alertdialog": title and description are announced on open
- After the action, focus returns to a logical place in the list

| Variant property | Values |
|---|---|
| Type | confirm, destructive, acknowledge |

Slots (fill them in the instance, never detach): `Header`, `Footer`

Built from: `Dialog Footer`, `Dialog Header`

Tokens and styles:
- Colors: `background/default`, `border/default`
- Spacing and size: `layout/container/lg`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`
- Effects: `shadow/lg`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [popover](../../skills/build-ui/components/popover.md)

Code: shadcn `Dialog`, `AlertDialog`

## Welcome Dialog

Component set · 3 variants · default size 480 × 467

A short first-run tour in a dialog, after sign-up or a major release: image, title, one sentence, dots for 2-4 steps, Skip or Back and Next. Each step shows one thing people can do now. Shown once per person; Skip and Esc close it; the last step leads to the first task. Pointing at real UI uses Coachmark.

**Use for**

- First sign-in after sign-up
- A major release that changes how people work
- A new area of the product opened for the first time

**Not for**

- Pointing at real UI: use Coachmark
- Tasks to set up an account: use Block / Onboarding Checklist
- Small changes: use a Toast or an Announcement Pill

**Anatomy**

1. Image: Image Placeholder (illustration or short animation)
2. Title: heading/h3
3. Description: one sentence
4. Dots: step indicator
5. Footer: secondary (Skip, or Back after the first step) and primary (Next, last step: the first task)

**Content and behavior**

- 2-4 steps; each shows one thing people can do now
- Shown once per person; Skip and Esc close it and do not show it again
- The last step leads to the first task ("Create your first invoice")
- Step=first shows Skip; middle shows Back; last names the task
- Help offers a way to open it again

**Accessibility**

- role="dialog" with aria-labelledby on the title; focus starts on the primary button
- Dots are decorative; the step is in text ("Step 2 of 3") for screen readers
- The image has alt text or is decorative (alt="")

| Variant property | Values |
|---|---|
| Step | first, middle, last |

Built from: `Button`, `Image Placeholder`

Tokens and styles:
- Colors: `background/default`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `radius/full`, `radius/lg`
- Text styles: `body/default`, `heading/h3`

Guides: [dialog](../../skills/build-ui/components/dialog.md)

Code: shadcn `Dialog` with a step state (Shown once per user; Skip and Esc close it)
