# Avatar

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Avatar](#avatar) | 8 | - |
| [Avatar Group](#avatar-group) | 3 | Avatars |

## Avatar

Component set · 8 variants · default size 24 × 24

shadcn Avatar. Type=image: put the photo as an image fill on the "image" layer of the instance; the user icon is only a placeholder. Type=initials is the fallback (two letters). Status = online dot. Always pair with the person's name in text nearby or as accessible label.

| Variant property | Values |
|---|---|
| Type | initials, image |
| Size | sm, default, lg, xl |

| Property | Type | Default |
|---|---|---|
| Initials | text | AP |
| Status | boolean | false |

Icons: user

Tokens and styles:
- Colors: `background/default`, `background/muted`, `background/success`, `foreground/default`
- Spacing and size: `border-width/2`, `spacing/10`, `spacing/12`, `spacing/6`, `spacing/8`
- Radius: `radius/full`
- Text styles: `body/large`, `ui/label`, `ui/label-small`

Guides: [avatar](../../skills/build-ui/components/avatar.md)

Code: shadcn `Avatar` (Group: negative margin + ring)

## Avatar Group

Component set · 3 variants · default size 78 × 24

Stacked avatars for assignees, participants, shared with. Show 3-5 and "+N"; the full list goes in a Tooltip or Popover.

| Variant property | Values |
|---|---|
| Size | sm, default, lg |

Slots (fill them in the instance, never detach): `Avatars`

Built from: `Avatar`

Guides: [avatar](../../skills/build-ui/components/avatar.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Avatar` (Group: negative margin + ring)
