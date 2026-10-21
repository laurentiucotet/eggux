# Code Block

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Code Block](#code-block) | 1 | - |

On the Figma page: "Example / in article", "Stress test / Code Block"

## Code Block

Component · 1 variant · default size 640 × 119

Code snippet with language label and Copy (docs, API keys, install steps). Monospace `code` style, no wrapping in code (horizontal scroll); syntax colors come from the code highlighter theme, not from tokens. Inline code in prose: `code` style on background/muted, radius sm.

**Use for**

- Commands and install steps
- API request and response examples
- Config snippets in docs and help articles

**Not for**

- Code inside a sentence: inline code style on background/muted, radius sm
- Editing code or config: use a code editor (Monaco, CodeMirror)

**Anatomy**

1. Header (Show header): Language label and Copy Button Icon
2. Code in the monospace code style
3. Body that scrolls horizontally

**Content and behavior**

- No wrapping: long lines scroll horizontally
- Syntax colors come from the highlighter theme, not from tokens
- Copy confirms with "Copied" for 2 s
- Language names the language in lowercase (bash, json)

**Accessibility**

- Copy is an icon button labelled "Copy code"; "Copied" is announced politely
- The scrolling body is focusable, so keyboard users can scroll it
- The highlighter theme keeps 4.5:1 on background/muted

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
