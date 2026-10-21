# Code Block

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Code Block](#code-block) | 1 | - |

## Code Block

Component · 1 variant · default size 640 × 119

Code snippet with language label and Copy (docs, API keys, install steps). Monospace `code` style, no wrapping in code (horizontal scroll); syntax colors come from the code highlighter theme, not from tokens. Inline code in prose: `code` style on background/muted, radius sm.

| Property | Type | Default |
|---|---|---|
| Language | text | bash |
| Code | text | npx shadcn@latest add button ⏎ npx shadcn@latest add dialog |
| Show header | boolean | true |

Built from: `Button Icon`

Tokens and styles:
- Colors: `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `code`, `ui/caption`

Guides: [content](../../skills/build-ui/components/content.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: Shiki or Prism + copy `Button`
