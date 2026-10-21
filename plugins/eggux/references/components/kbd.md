# Kbd

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Kbd](#kbd) | 1 | - |
| [Kbd Group](#kbd-group) | 1 | Keys |

## Kbd

Component · 1 variant · default size 20 × 20

One keyboard key (shadcn Kbd). Use in menus, tooltips and help: "⌘ K". Mac symbols ⌘ ⌥ ⇧ ⌃, Windows "Ctrl"; show the user's platform.

| Property | Type | Default |
|---|---|---|
| Key | text | ⌘ |

Tokens and styles:
- Colors: `background/muted`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/5`
- Radius: `radius/sm`
- Text styles: `ui/label-small`

Guides: [indicators](../../skills/build-ui/components/indicators.md)

Code: shadcn `Skeleton`, `Spinner`, `Kbd`

## Kbd Group

Component · 1 variant · default size 44 × 20

Shortcut made of several keys.

Slots (fill them in the instance, never detach): `Keys`

Built from: `Kbd`

Tokens and styles:
- Spacing and size: `spacing/1`

Guides: [indicators](../../skills/build-ui/components/indicators.md)
