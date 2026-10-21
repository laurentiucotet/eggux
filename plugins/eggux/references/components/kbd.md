# Kbd

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Kbd](#kbd) | 1 | - |
| [Kbd Group](#kbd-group) | 1 | Keys |

On the Figma page: "Example / in comments", "Example / search with shortcut", "Stress test / Kbd", "Stress test / Kbd Group"

## Kbd

Component · 1 variant · default size 20 × 20

One keyboard key (shadcn Kbd). Use in menus, tooltips and help: "⌘ K". Mac symbols ⌘ ⌥ ⇧ ⌃, Windows "Ctrl"; show the user's platform.

**Use for**

- Shortcuts in menus, tooltips, the command palette and help
- Search buttons with "⌘ K"
- Keyboard help pages and onboarding tips

**Not for**

- Shortcuts made of several keys: use Kbd Group
- Inline code in prose: use the code style

**Anatomy**

1. Key surface (muted background, border)
2. Key label (Key): symbol or name
3. Used next to a menu label or in a Tooltip

**Content and behavior**

- Show the user's platform: ⌘ ⌥ ⇧ ⌃ on Mac, "Ctrl" and "Alt" on Windows and Linux
- Do not show shortcuts that are not implemented
- Never rely on a shortcut as the only way

**Accessibility**

- Use the <kbd> element; symbols get readable names ("Command")
- Text contrast at least 4.5:1 on the key background

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

**Use for**

- Multi-key shortcuts in menus, tooltips and help
- Shortcut hints next to a search field
- Command palette items with a shortcut

**Not for**

- One key: use Kbd alone
- Explaining many shortcuts: use a shortcuts dialog with a table

**Anatomy**

1. Keys slot
2. Kbd for each modifier: ⌘, Ctrl, Shift
3. Kbd for the final key: K, P

**Content and behavior**

- Platform-aware like Kbd: ⌘ ⌥ ⇧ ⌃ on Mac, "Ctrl" and "Alt" on Windows and Linux
- Same shortcut text everywhere it appears
- Show only implemented shortcuts

**Accessibility**

- Wrap keys in nested <kbd> elements
- Screen readers read key names, not only symbols

Slots (fill them in the instance, never detach): `Keys`

Built from: `Kbd`

Tokens and styles:
- Spacing and size: `spacing/1`

Guides: [indicators](../../skills/build-ui/components/indicators.md)
