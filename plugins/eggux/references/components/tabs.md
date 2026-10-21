# Tabs

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Tab](#tab) | 8 | - |
| [Tabs](#tabs) | 1 | Tabs |
| [Tabs Line](#tabs-line) | 1 | Tabs |

## Tab

Component set · 8 variants · default size 88 × 28

Tab trigger. Put inside Tabs. "pill" is shadcn TabsTrigger (inactive text uses foreground/default: muted on muted fails contrast). "line" for page-level sections. Usage: eggux build-ui/components/tabs.md

| Variant property | Values |
|---|---|
| Style | pill, line |
| State | default, active, focus, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Overview |

Tokens and styles:
- Colors: `background/default`, `background/primary`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/3`, `spacing/7`, `spacing/9`
- Radius: `radius/md`
- Text styles: `ui/label`
- Effects: `shadow/sm`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

## Tabs

Component · 1 variant · default size 263 × 36

shadcn TabsList. "Tabs" is a native slot of Tab instances. 2-6 tabs, selected tab in the URL. Usage: eggux build-ui/components/tabs.md

Slots (fill them in the instance, never detach): `Tabs`

Built from: `Tab`

Tokens and styles:
- Colors: `background/muted`
- Spacing and size: `spacing/1`
- Radius: `radius/lg`

Guides: [tabs](../../skills/build-ui/components/tabs.md)

Code: shadcn `Tabs`, `ToggleGroup`

## Tabs Line

Component · 1 variant · default size 231 × 37

Underlined tabs for page-level sections. "Tabs" is a native slot of Tab instances. 2-6 tabs, selected tab in the URL. Usage: eggux build-ui/components/tabs.md

Slots (fill them in the instance, never detach): `Tabs`

Built from: `Tab`

Tokens and styles:
- Colors: `border/default`
- Spacing and size: `spacing/4`

Guides: [tabs](../../skills/build-ui/components/tabs.md)
