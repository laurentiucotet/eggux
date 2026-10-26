# Pattern: notifications

**Problem:** everything notifies through every channel, so people mute all of it and miss what
matters.
**Heuristic:** visibility of system status, aesthetic and minimalist design, user control.

## Choose the channel
| Message | Channel |
|---|---|
| Result of what the user just did | Inline or toast (`action-feedback.md`) |
| Something needs the user's action (approval, mention, assignment) | In-app notification + email (or push on mobile) |
| Something happened that the user may want to know (comment on a followed object) | In-app notification only |
| Long job finished (export, import) | In-app notification; email if it took more than a few minutes |
| Security (new sign-in, password changed) | Email, always on |
| Digest of low-priority activity | Daily or weekly email, opt-in |

## Notification center
- Bell with an unread count (`Badge Count`); list newest first, grouped Today / Earlier.
- Each item: who, what, which object, when; click opens the object at the right place.
- Mark as read on open; "Mark all as read"; filter Unread / All / Mentions.
- Actionable items can be done inline (Approve, Reply) when safe.

## Rules
- Notify people only about things that involve them (assigned, mentioned, owner, follower).
- Never notify users about their own actions.
- Batch bursts ("Elena and 4 others commented").
- Preferences per event and channel (`Block / Notification Preferences`); security emails stay on.
- Email layouts come from the Email components and the Emails page templates; security emails have
  no unsubscribe link (email.md).

## Figma
`Block / Notifications` (popover), `Badge Count`, `Toast`, `Block / Notification Preferences`.
- The bell opens `Notification Center` (tabs by type, 5-8 `Notification Item`s, Mark all as read,
  View all). Opening the panel does not mark items read; opening an item does.
- A `Mention Chip` notifies the mentioned person once. A finished `Background Job` sends an in-app
  notification when the person left the page.
- `Notification Center`: turn tabs off (Show tabs) when the product has one kind of notification.
