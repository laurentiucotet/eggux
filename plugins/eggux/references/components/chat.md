# Chat

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chat Message](#chat-message) | 2 | - |
| [Typing Indicator](#typing-indicator) | 1 | - |
| [Chat Composer](#chat-composer) | 1 | - |

On the Figma page: "Example / in conversation", "Stress test / Chat Composer", "Stress test / Chat Message", "Stress test / Typing Indicator"

## Chat Message

Component set · 2 variants · default size 640 × 56

One chat message. incoming: avatar + muted bubble on the left; outgoing: primary bubble on the right with delivery status (Sent, Delivered, Read). Bubbles max 440 wide; consecutive messages from the same person group (avatar and time only on the last).

**Use for**

- Support, team or buyer and seller conversations
- Direction=incoming for others, outgoing for the current user
- Show meta on the last message of a group (time, delivery status)

**Not for**

- Discussion attached to an object, read later: use Comment
- History of changes made by the system: use Timeline Item
- Conversation with an AI assistant: use User Message and Assistant Message

**Anatomy**

1. Avatar (incoming, last message of a group)
2. Bubble: muted for incoming, primary for outgoing
3. Text
4. Meta: Time and delivery status Sent, Delivered, Read (Show meta)

**Content and behavior**

- Bubbles max 440 wide
- Consecutive messages from one sender group: avatar and time only on the last
- Delivery status on the last outgoing message
- Day separators: Today, Yesterday, then the date
- Failed send: the message stays with Retry, never disappears
- Open at the latest message; when scrolled up, show a "New messages" pill instead of jumping

**Accessibility**

- New messages are announced with aria-live="polite"
- Delivery status is text, not only a check icon
- Outgoing text (foreground/primary on background/primary) keeps 4.5:1

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

**Use for**

- Real-time chat while the other person types
- At the bottom of the conversation, after the last message
- Support conversations, so the customer knows a reply is coming

**Not for**

- Comment threads: they are read later, no typing state
- Loading content: use Skeleton or Spinner
- AI assistant working: follow the AI chat pattern, with Stop always visible

**Anatomy**

1. Muted bubble
2. Dots that pulse in sequence
3. Caption

**Content and behavior**

- Hide after 5 s without input
- Dots pulse with motion/ease/linear
- One indicator per conversation, at the bottom
- With reduced motion the dots do not animate

**Accessibility**

- Dots are decorative (aria-hidden); a polite text status says who is typing
- Do not announce it again on every pulse or keystroke

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

**Use for**

- Bottom of a chat conversation
- Support and team messaging
- Buyer and seller conversations

**Not for**

- Comments on an object: use Comment Composer
- Long formatted text: use Rich Text Editor
- Prompts to an AI assistant: use Prompt Input

**Anatomy**

1. Attach Button Icon
2. Input for the message, grows to ~5 lines, then scrolls
3. Send Button, disabled while empty

**Content and behavior**

- Enter sends, Shift+Enter adds a new line
- Send is disabled while the field is empty
- Grows to ~5 lines, then scrolls
- Keep the draft when switching conversations

**Accessibility**

- The field is a labelled textarea
- Attach is an icon button with an accessible label
- Touch targets at least 44 x 44 on mobile

Built from: `Button`, `Button Icon`, `Input`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [rich-text-editor](../../skills/build-ui/components/rich-text-editor.md)

Code: custom
