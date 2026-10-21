# Chat

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chat Message](#chat-message) | 2 | - |
| [Typing Indicator](#typing-indicator) | 1 | - |
| [Chat Composer](#chat-composer) | 1 | - |

## Chat Message

Component set · 2 variants · default size 640 × 56

One chat message. incoming: avatar + muted bubble on the left; outgoing: primary bubble on the right with delivery status (Sent, Delivered, Read). Bubbles max 440 wide; consecutive messages from the same person group (avatar and time only on the last).

| Variant property | Values |
|---|---|
| Direction | incoming, outgoing |

| Property | Type | Default |
|---|---|---|
| Text | text | Hi! Is the export to Excel included in the Team plan? |
| Time | text | 10:42 |
| Show meta | boolean | true |

Built from: `Avatar`. Icons: check

Tokens and styles:
- Colors: `background/muted`, `background/primary`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `body/small`, `ui/caption`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom

## Typing Indicator

Component · 1 variant · default size 148 × 100

Shown while the other person types; dots pulse in sequence (motion/ease/linear). Hide after 5 s without input.

Tokens and styles:
- Colors: `background/muted`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/xl`
- Text styles: `ui/caption`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom

## Chat Composer

Component · 1 variant · default size 640 × 36

Message input: attach, text (grows to ~5 lines, Enter sends, Shift+Enter new line), Send (disabled while empty). Keep the draft when switching conversations.

Built from: `Button`, `Button Icon`, `Input`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: custom
