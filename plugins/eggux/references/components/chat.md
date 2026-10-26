# Chat

Generated from the EGG UI master library on 2026-10-26 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Chat Message](#chat-message) | 4 | - |
| [Typing Indicator](#typing-indicator) | 1 | - |
| [Chat Composer](#chat-composer) | 1 | - |
| [Mention Chip](#mention-chip) | 2 | - |
| [Reaction Bar](#reaction-bar) | 1 | Reactions |
| [Reaction](#reaction) | 2 | - |
| [Thread Summary](#thread-summary) | 1 | - |

On the Figma page: "Example / in conversation", "Example / team thread with mentions and reactions", "Stress test / Chat Composer", "Stress test / Chat Message", "Stress test / Mention Chip", "Stress test / Reaction Bar", "Stress test / Thread Summary", "Stress test / Typing Indicator"

## Chat Message

Component set · 4 variants · default size 640 × 56

One chat message. incoming: avatar + muted bubble on the left; outgoing: primary bubble on the right with delivery status (Sent, Delivered, Read). Size=default: bubbles max 440 wide; Size=compact: max 300, for panels and widgets under 480 wide. Text wraps by itself, never add manual line breaks; consecutive messages from the same person group (avatar and time only on the last).

**Use for**

- Support, team or buyer and seller conversations
- Direction=incoming for others, outgoing for the current user
- Show meta on the last message of a group (time, delivery status)
- Size=compact in panels and widgets under 480 wide (support widget, side panel)

**Not for**

- Discussion attached to an object, read later: use Comment
- History of changes made by the system: use Timeline Item
- Conversation with an AI assistant: use User Message and Assistant Message

**Anatomy**

1. Avatar (incoming, last message of a group)
2. Bubble: muted for incoming, primary for outgoing; max 440 (Size=default) or 300 (Size=compact)
3. Text: wraps by itself at the bubble max width
4. Meta: Time and delivery status Sent, Delivered, Read (Show meta)

**Content and behavior**

- Size=default: bubbles max 440 wide; Size=compact: max 300, for panels under 480 wide
- Never break lines by hand: short text hugs, long text wraps at the max width
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
| Size | default, compact |

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

Code: custom (Chat Message Size=default `max-w-[440px]`, Size=compact `max-w-[300px]` (panels under 480); text wraps, no manual breaks)

## Typing Indicator

Component · 1 variant · default size 146 × 100

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

Code: custom (Chat Message Size=default `max-w-[440px]`, Size=compact `max-w-[300px]` (panels under 480); text wraps, no manual breaks)

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

Code: custom (Chat Message Size=default `max-w-[440px]`, Size=compact `max-w-[300px]` (panels under 480); text wraps, no manual breaks)

## Mention Chip

Component set · 2 variants · default size 79 × 24

A person mentioned in text (comments, chat, notes): @ and the name on a tinted chip, inline with the text. Mentions of the reader (you) stand out in warning. Hover shows a Hover Card; the mention notifies the person. Typed with @ and picked from a list of people with access.

**Use for**

- Comments
- Chat messages
- Notes and task descriptions

**Not for**

- Filters people remove: use Chip
- A label or a category: use Badge
- The author of something: use Byline

**Anatomy**

1. Name: "@Maria Ilie" on a tinted background; State=you in warning

**Content and behavior**

- Typed with @ and picked from a list of people with access
- Mentioning someone without access asks to share first
- Mentions of the reader stand out in warning (State=you)
- Hover shows a Hover Card; the mention notifies the person once
- The full name shows on one line; it never truncates

**Accessibility**

- The chip is a link named with the person ("Maria Ilie"); the Hover Card also opens on focus
- Text on the tint meets 4.5:1 in both states
- The "you" state is also in the name for screen readers ("Maria Ilie, you")

| Variant property | Values |
|---|---|
| State | default, you |

| Property | Type | Default |
|---|---|---|
| Name | text | @Maria Ilie |

Tokens and styles:
- Colors: `background/accent`, `background/warning`, `foreground/accent`, `foreground/warning`
- Spacing and size: `spacing/0_5`, `spacing/1`
- Radius: `radius/sm`
- Text styles: `ui/label`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: Tiptap `Mention` extension + `Command` list; rendered as `<a>` (Mention notifies once; reader mentions use the warning tint)

## Reaction Bar

Component · 1 variant · default size 176 × 32

Reactions under a comment or message: one Reaction per emoji with its count, then a button that opens the Emoji Picker. Tapping a Reaction adds or removes the reader's own. Hover lists who reacted. Keep reactions for acknowledgement; decisions still go in a reply.

**Use for**

- Under comments
- Under chat messages
- Under announcements and posts

**Not for**

- Decisions and approvals: use a reply in Comment, or Approval Step
- Feedback on an AI answer: use Response Feedback
- Rating content: use Rating

**Anatomy**

1. Reactions slot: Reactions
2. Add reaction: Button Icon that opens the Emoji Picker

**Content and behavior**

- One Reaction per emoji, in the order they were first used
- Tapping a Reaction adds or removes the reader's own
- Hover lists who reacted (up to 10 names, then "and N others")
- With no reactions, only the add button shows, on hover or focus of the message
- Reactions are for acknowledgement; decisions still go in a reply

**Accessibility**

- A group with aria-label "Reactions"
- Add reaction has aria-label "Add reaction"; focus returns to it when the picker closes
- Each Reaction is a toggle (aria-pressed)

Slots (fill them in the instance, never detach): `Reactions`

Built from: `Button Icon`, `Reaction`

Tokens and styles:
- Spacing and size: `spacing/1`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom flex of shadcn `Toggle` (`aria-pressed`) + `Popover` emoji picker (emoji-mart or frimousse)

## Reaction

Component set · 2 variants · default size 45 × 28

One emoji reaction with its count; reacted when the reader added it. Part of Reaction Bar.

**Use for**

- Inside a Reaction Bar only

**Not for**

- Feedback on an AI answer: use Response Feedback

**Anatomy**

1. Emoji
2. Count: tabular numbers

**Content and behavior**

- Tapping it adds or removes the reader's own reaction
- Reacted is tinted so the reader sees their own
- At count 0 the Reaction is removed

**Accessibility**

- A toggle button with aria-pressed, named with emoji and count ("Thumbs up, 4 reactions")
- Hover and focus list who reacted

| Variant property | Values |
|---|---|
| State | default, reacted |

| Property | Type | Default |
|---|---|---|
| Emoji | text | 👍 |
| Count | text | 4 |

Tokens and styles:
- Colors: `background/accent`, `background/primary`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`
- Radius: `radius/full`
- Text styles: `body/small`, `ui/label`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom flex of shadcn `Toggle` (`aria-pressed`) + `Popover` emoji picker (emoji-mart or frimousse)

## Thread Summary

Component · 1 variant · default size 249 × 24

Collapsed replies under a comment or message: who replied (photo Avatars in an exposed Avatar Group; set an Avatar to Type=initials when there is no photo), how many, when the last one came. Opens the thread in place or in a side panel. Unread replies make the count bold with a dot.

**Use for**

- Comment threads
- Chat threads
- Discussions in an activity feed

**Not for**

- Showing the replies in full: use Comment
- A count on an icon: use Badge Count
- Who has access: use Avatar Group

**Anatomy**

1. Repliers: Avatar Group (exposed), up to 3 photo Avatars (Type=image) and a "+N" Avatar
2. Replies: "3 replies", ui/label, link color
3. Last: "Last reply 2 h ago", ui/caption, muted

**Content and behavior**

- Opens the thread in place or in a side panel
- Unread replies make the count bold with a dot
- Count uses singular and plural ("1 reply", "3 replies")
- Last reply time is relative; the exact time shows on hover
- Photos by default; set an Avatar to Type=initials when a person has no photo

**Accessibility**

- A button with aria-expanded when it opens in place
- The name reads count and time ("3 replies, last reply 2 hours ago")
- Unread is in text ("2 new"), not only bold and a dot

| Property | Type | Default |
|---|---|---|
| Replies | text | 3 replies |
| Last | text | Last reply 2 h ago |

Built from: `Avatar Group`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`
- Text styles: `ui/caption`, `ui/label`

Guides: [comments-and-chat](../../skills/build-ui/components/comments-and-chat.md)

Code: custom button + `Avatar` group; `Collapsible` or `Sheet` (`aria-expanded` when it opens in place)
