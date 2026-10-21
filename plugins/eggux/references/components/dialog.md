# Dialog

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Dialog Header](#dialog-header) | 1 | Media |
| [Dialog Footer](#dialog-footer) | 1 | Actions |
| [Dialog](#dialog) | 1 | Header, Content, Footer |
| [Alert Dialog](#alert-dialog) | 3 | Header, Footer |

On the Figma page: "Example / dialog over page"

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

## Dialog

Component · 1 variant · default size 512 × 270

shadcn Dialog: Header, Content and Footer are native slots (defaults: Dialog Header, placeholder, Dialog Footer). Short focused task; never a dialog from a dialog. Usage: eggux build-ui/components/dialog.md

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

## Alert Dialog

Component set · 3 variants · default size 512 × 158

shadcn AlertDialog presets. confirm = a decision with consequences; destructive = irreversible, action named with its verb; acknowledge = one button, the user only needs to know. No close button, no outside click; focus on Cancel (or the only button). Usage: eggux build-ui/patterns/delete-confirmation.md

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

Guides: [dialog](../../skills/build-ui/components/dialog.md)

Code: shadcn `Dialog`, `AlertDialog`
