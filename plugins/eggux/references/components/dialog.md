# Dialog

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Dialog Header](#dialog-header) | 1 | Media |
| [Dialog Footer](#dialog-footer) | 1 | Actions |
| [Dialog](#dialog) | 5 | Header, Content, Footer |
| [Alert Dialog](#alert-dialog) | 3 | Header, Footer, Content |
| [Scrim](#scrim) | 3 | - |

On the Figma page: "Example / Dialog sizes", "Example / delete confirmation over a list", "Example / dialog over page", "Example / dialog sizes", "Example / in create record dialog", "Example / welcome dialog", "Stress test / Alert Dialog", "Stress test / Dialog", "Stress test / Scrim"

## Dialog Header

Component · 1 variant · default size 464 × 56

shadcn DialogHeader: title (body/large), description, close X. Turn Close off in Alert Dialog. Reuse in Sheet and Drawer.

| Property | Type | Default |
|---|---|---|
| Title | text | Invite member |
| Description | text | They will get an email with a link to join the workspace. |
| Show description | boolean | true |
| Show close | boolean | true |
| Show media | boolean | false |

Slots (fill them in the instance, never detach): `Media`

Icons: info, x

Tokens and styles:
- Colors: `background/muted`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/10`, `spacing/2`, `spacing/4`, `spacing/6`
- Radius: `radius/full`, `radius/sm`
- Text styles: `body/large`, `body/small`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md)

Code: shadcn `Dialog` (`DialogHeader`, `DialogFooter`), `AlertDialog`

## Dialog Footer

Component · 1 variant · default size 464 × 36

shadcn DialogFooter. "Actions" is a native slot. One primary action, on the right.

Slots (fill them in the instance, never detach): `Actions`

Built from: `Button`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md)

Code: shadcn `Dialog` (`DialogHeader`, `DialogFooter`), `AlertDialog`

## Dialog

Component set · 5 variants · default size 512 × 270

shadcn Dialog: Header, Content and Footer are native slots (defaults: Dialog Header, placeholder, Dialog Footer). Short focused task; never a dialog from a dialog.


Size: default 512 (a form with a few fields), sm 384 (a short confirmation or one field), lg 672 (a table, a preview or a longer form), xl 896 (side-by-side content only), fullscreen 390 x 844 (mobile: no radius, border or shadow, the footer sits at the bottom and the content scrolls; resize the instance to the screen). Pick the Size instead of resizing the instance. Put a Scrim (Tone=dialog) behind it.


Usage: eggux build-ui/components/dialog.md

**Use for**

- Rename, invite a member, quick create
- A few fields where the page behind does not matter
- Re-authentication after an expired session
- Size=fullscreen: forms and pickers on mobile when a Drawer is too small

**Not for**

- A decision before continuing: use Alert Dialog
- Longer forms or details next to a list: use Sheet
- More than one step or ~6 fields: use a page
- Short forms on mobile: use Drawer

**Anatomy**

1. Scrim behind it (Tone=dialog)
2. Header slot: Dialog Header with Title, Description, Close X and optional Media
3. Content slot
4. Footer slot: Dialog Footer, Cancel outline left, primary right
5. Size: default 512, sm 384, lg 672, xl 896 (widths bound to layout/container/*), fullscreen 390 x 844 (no radius, border or shadow; content fills the height, footer at the bottom)

**Content and behavior**

- Title says the task ("Invite member"), never "Info" or "Warning"
- One primary action, bottom right; Cancel outline to its left
- Never open a dialog from a dialog
- Long content scrolls inside; header and footer stay fixed
- Closing with unsaved input follows the unsaved changes pattern
- Fill the Header, Content and Footer slots in the instance; never detach
- Size: sm for a short confirmation or one field, default for a form with a few fields, lg for a table, a preview or a longer form, xl only for side-by-side content; pick the Size, never resize the instance
- Size=fullscreen on mobile: resize the instance to the screen; the content scrolls between the fixed header and footer

**Accessibility**

- Focus moves to the first field on open and returns to the trigger on close
- Focus stays inside while open; Esc closes
- Title is the accessible name, Description the accessible description
- Close X has an accessible label

| Variant property | Values |
|---|---|
| Size | default, sm, lg, xl, fullscreen |

| Property | Type | Default |
|---|---|---|
| Show header | boolean | true |
| Show content | boolean | true |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Header`, `Content`, `Footer`

Built from: `Dialog Footer`, `Dialog Header`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/muted`
- Spacing and size: `layout/container/2xl`, `layout/container/4xl`, `layout/container/lg`, `layout/container/sm`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`, `radius/md`, `radius/none`
- Text styles: `ui/caption`
- Effects: `shadow/lg`

Guides: [carousel](../../skills/build-ui/components/carousel.md), [dialog](../../skills/build-ui/components/dialog.md), [drawer](../../skills/build-ui/components/drawer.md), [popover](../../skills/build-ui/components/popover.md), [errors-and-recovery](../../skills/build-ui/patterns/errors-and-recovery.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Dialog` (`DialogHeader`, `DialogFooter`), `AlertDialog`

## Alert Dialog

Component set · 3 variants · default size 512 × 158

shadcn AlertDialog presets. confirm = a decision with consequences; destructive = irreversible, action named with its verb; acknowledge = one button, the user only needs to know. No close button, no outside click; focus on Cancel (or the only button).


Header slot: Dialog Header (status icon in its Media slot). Content slot (Show content, off by default) sits between header and footer: the type-to-confirm Field, a list of what is lost, an opt-in Checkbox. Footer slot: Dialog Footer with Cancel and the action.


Usage: eggux build-ui/patterns/delete-confirmation.md

**Use for**

- Type=confirm: a decision with consequences that can be undone or is not destructive
- Type=destructive: irreversible loss, such as delete or revoke
- Type=acknowledge: one button, the user only needs to know
- Discard unsaved changes

**Not for**

- Restorable actions: act at once and offer Undo in a toast
- Information that does not block the next step: use a toast or inline Alert
- A task with several fields: use Dialog

**Anatomy**

1. Overlay (dialog/overlay)
2. Header slot: Dialog Header with Close off, title as a question, description
3. Content slot (Show content, off by default): type-to-confirm Field, what is lost, an opt-in Checkbox
4. Footer slot: Cancel outline left, action verb right (destructive variant when destructive)

**Content and behavior**

- Title names the action and object: "Delete project?"
- Body says what is lost and "This can't be undone." when true
- Buttons are verbs ("Delete project"), never Yes / No
- No close button and no close on outside click
- High impact (account, project, bulk data): type the name to confirm, in the Content slot (Show content); the action stays disabled until it matches
- On failure the dialog stays open with the error

**Accessibility**

- Focus starts on Cancel (or the only button); Esc closes as Cancel
- role="alertdialog": title and description are announced on open
- After the action, focus returns to a logical place in the list

| Variant property | Values |
|---|---|
| Type | confirm, destructive, acknowledge |

| Property | Type | Default |
|---|---|---|
| Show content | boolean | false |

Slots (fill them in the instance, never detach): `Header`, `Footer`, `Content`

Built from: `Dialog Footer`, `Dialog Header`

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/muted`
- Spacing and size: `layout/container/lg`, `spacing/4`, `spacing/6`
- Radius: `radius/lg`, `radius/md`
- Text styles: `ui/caption`
- Effects: `shadow/lg`

Guides: [dialog](../../skills/build-ui/components/dialog.md), [popover](../../skills/build-ui/components/popover.md)

Code: shadcn `Dialog` (`DialogHeader`, `DialogFooter`), `AlertDialog`

## Scrim

Component set · 3 variants · default size 640 × 400

The dimmed layer behind overlays and over media. Tone: dialog (dialog/overlay: behind Dialog, Alert Dialog, Sheet, Drawer and the mobile menu), media (media/scrim: over a photo or video so text and controls on top stay readable: Hero Full-bleed Image, Carousel Hero, Lightbox), light (background/default at 80%: a soft veil over content that is busy or disabled, such as a locked section under an upgrade card). Place it as the first layer of the frame it covers and stretch it (constraints left and right, top and bottom, or FILL); never draw a rectangle by hand.


Code: the overlay of the shadcn Dialog and Sheet (bg-black/50), or absolute inset-0 with the token. It blocks clicks to the page behind; Esc and a click on it close a dismissible overlay.


Usage: eggux build-ui/components/dialog.md

**Use for**

- Behind Dialog, Alert Dialog, Sheet, Drawer, Command Palette and the mobile menu: Tone=dialog
- Over a photo or video so text and controls stay readable: Tone=media
- A soft veil over busy or locked content: Tone=light

**Not for**

- Popovers, menus and tooltips: no scrim
- A gradient fade under text on an image: use the media/scrim-fade token on the image block

**Anatomy**

1. Tone=dialog: dialog/overlay
2. Tone=media: media/scrim
3. Tone=light: background/default at opacity/80
4. 640 x 400 by default; stretch to the frame it covers

**Content and behavior**

- First layer of the frame it covers, constraints left and right plus top and bottom (or FILL)
- Never draw a rectangle with the overlay color by hand
- One scrim at a time; never stack dialogs

**Accessibility**

- Content behind is inert (aria-hidden or inert) while a modal is open
- A click on it closes only dismissible overlays

| Variant property | Values |
|---|---|
| Tone | dialog, media, light |

Tokens and styles:
- Colors: `background/default`, `dialog/overlay`, `media/scrim`

Guides: [dialog](../../skills/build-ui/components/dialog.md)

Code: the shadcn `DialogOverlay` / `SheetOverlay` (`fixed inset-0 bg-black/50`); over media `absolute inset-0` with `bg-[var(--media-scrim)]`; light `absolute inset-0 bg-background/80` (Content behind a modal is `inert`)
