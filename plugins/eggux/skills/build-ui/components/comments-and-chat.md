# Comments and chat

Usage guidelines only. Visual specs live in the Figma components (Chat page) and the blocks
`Block / Comments` and `Block / Conversation` on the App page.

## Comments or chat
| Need | Use |
|---|---|
| Discussion attached to an object (task, invoice, document, design), read later | Comments: `Comment`, `Comment Composer` |
| Real-time conversation between people (support, team, buyer and seller) | Chat: `Chat Message`, `Typing Indicator`, `Chat Composer` |
| History of changes made by the system | `Timeline Item` (activity), not comments |

## Comments
- Newest at the bottom, composer under the thread. Show the count in the section title.
- One level of replies, indented under the parent. Deeper nesting becomes unreadable.
- Each comment: avatar, name, relative time ("2 h ago", full date on hover), text, actions
  (Reply, Edit, Delete for the author; Resolve when the thread is a review).
- @mentions open a people list and notify; links and mentions are styled as links.
- Resolved comments collapse or fade (`State=resolved` with a Resolved badge) and stay
  reachable with "Show resolved".
- Edit in place; show "edited" after the time. Delete asks for confirmation
  (`patterns/delete-confirmation.md`) or offers Undo.
- Comment button disabled while empty; ⌘↵ sends. Keep the draft per thread.

## Chat
- Incoming on the left with avatar and muted bubble; outgoing on the right with the primary
  bubble. Bubbles max ~480 wide.
- Group consecutive messages from one sender: one avatar and one time for the group.
- Day separators ("Today", "Yesterday", date). Delivery status on the last outgoing message
  (Sent, Delivered, Read).
- Enter sends, Shift+Enter new line. Field grows to ~5 lines, then scrolls.
- Open at the latest message; when the user scrolled up, new messages show a "New messages"
  pill instead of jumping.
- Failed send: the message stays with a Retry action, never disappears.
- `Typing Indicator` while the other person types; hide after 5 s without input.
- Layout: list of conversations + conversation in `Page Shell / Split View`; on mobile, the
  list and the conversation are separate screens.

## Figma
- `Comment`: Type comment, reply × State default, resolved; Name, Time, Text, Show actions.
- `Comment Composer`, `Chat Composer`, `Typing Indicator`: single components.
- `Chat Message`: Direction incoming, outgoing; Text, Time, Show meta.

## Code
Comments and chat are lists: render with virtualization past a few hundred items. Announce new
messages with `aria-live="polite"`; the composer is a labelled `textarea`.
