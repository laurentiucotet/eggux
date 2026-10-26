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
  bubble. Bubbles max 440 wide.
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
- `Chat Message`: Direction incoming, outgoing × Size default, compact; Text, Time, Show meta.
  Short text hugs, long text wraps; bubbles grow up to 440 wide. In panels under 480 wide use
  Size=compact (bubble max 300); never break lines by hand.
- Team chat: `Block / Team Chat` (example "Team chat"). Customer messaging: `Block / Inbox`.
  In-app help: `Block / Support Chat Widget` (View=home, chat), launcher bottom right, 24 from the
  edges. All three on the App page.

## Code
Comments and chat are lists: render with virtualization past a few hundred items. Announce new
messages with `aria-live="polite"`; the composer is a labelled `textarea`.

## Related components
- Comments on a design, a PDF or a screenshot are marked with numbered `Annotation Pin`s that match
  the comment list order; resolved pins fade.
- A pasted URL in a comment or message shows as a `Link Preview`; the author can remove it and keep
  the plain link. Voice messages play in an `Audio Player`.
- Mentions render as `Mention Chip` (State=you for the reader). Reactions use `Reaction Bar` with
  `Reaction` parts; collapsed replies use `Thread Summary`.
