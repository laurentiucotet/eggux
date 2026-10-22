# Notifications

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Notification Item](#notification-item) | 2 | Actions |
| [Notification Center](#notification-center) | 1 | Items |

On the Figma page: "Example / in notifications", "Stress test / Notification Center", "Stress test / Notification Item"

## Notification Item

Component set · 2 variants · default size 400 × 64

One notification: who (Avatar) did what to which object, when and where, and an unread dot. Show actions for something people can do from the list (Approve, View invoice). The whole row opens the object and marks it read. Read=false has a muted background and the dot.

**Use for**

- Rows in the Notification Center
- The full notifications page
- Approvals, mentions and assignments people can act on from the list

**Not for**

- Result of the person's own action: use Toast
- Changes on one record over time: use Timeline Item
- A message that blocks the page: use Alert

**Anatomy**

1. Avatar: who did it
2. Message: "Elena Popa approved INV-1041 for €2,450.00", actor and object in bold
3. Meta: time and area, body/small, muted
4. Actions slot (Show actions): one or two Buttons sm
5. Unread dot (State=unread)

**Content and behavior**

- Message names the actor, the action and the object; two lines at most
- State=unread has a muted background and the dot
- The whole row opens the object and marks it read
- Actions only for what people can do from the list (Approve, View invoice); at most two
- System notifications without a person use an icon Avatar

**Accessibility**

- The row is a link; actions are separate buttons, not nested in the link
- Unread is in the accessible name ("Unread: Elena Popa approved..."), not color or the dot alone
- The time is a <time> element with the full date in a title

| Variant property | Values |
|---|---|
| State | unread, read |

| Property | Type | Default |
|---|---|---|
| Message | text | Elena Popa approved INV-1041 for €2,450.00 |
| Meta | text | 2 h ago · Approvals |
| Show actions | boolean | false |

Slots (fill them in the instance, never detach): `Actions`

Built from: `Avatar`, `Button`

Tokens and styles:
- Colors: `background/muted`, `background/primary`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/full`, `radius/md`
- Text styles: `body/small`, `ui/caption`

Guides: [notifications](../../skills/build-ui/patterns/notifications.md)

Code: shadcn `Popover` + `Tabs` + `ScrollArea`; custom rows with `Avatar` (Bell `Button` + `Badge`; opening an item marks it read)

## Notification Center

Component · 1 variant · default size 400 × 484

The panel behind the bell in the top bar: title with Mark all as read, optional tabs by type (Show tabs: All, Mentions, Approvals), newest first, unread on top, View all at the bottom. Turn tabs off when there is one kind of notification. 5-8 items, then the full page. The bell shows a Badge Count of unread items; opening the panel does not mark them read, opening an item does. Empty: "You are all caught up."


Usage: eggux build-ui/patterns/notifications.md

**Use for**

- The bell in the Top Bar
- Products with mentions, approvals and assignments
- Quick triage without leaving the page

**Not for**

- The full history with filters: use Block / Notifications
- Choosing channels and frequency: use Block / Notification Preferences
- Feedback on the person's own action: use Toast

**Anatomy**

1. Header: title and Mark all as read (Button ghost sm)
2. Tabs (Show tabs): All, Mentions, Approvals
3. Items slot: Notification Items
4. Footer: View all (Button ghost)

**Content and behavior**

- Newest first, unread on top; 5-8 items, then View all
- The bell shows a Badge Count of unread items
- Opening the panel does not mark items read; opening an item does
- Empty: "You are all caught up."
- Mark all as read applies to the current tab
- Show tabs only when there are several kinds of notification; one kind needs no tabs

**Accessibility**

- The bell is a button with the count in its name: "Notifications, 3 unread"
- New items are announced with aria-live="polite" on the count, never by moving focus
- Escape closes the panel and returns focus to the bell

| Property | Type | Default |
|---|---|---|
| Show tabs | boolean | true |

Slots (fill them in the instance, never detach): `Items`

Built from: `Button`, `Notification Item`, `Tab`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/popover`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/lg`
- Text styles: `ui/label`

Guides: [notifications](../../skills/build-ui/patterns/notifications.md)

Code: shadcn `Popover` + `Tabs` + `ScrollArea`; custom rows with `Avatar` (Bell `Button` + `Badge`; opening an item marks it read)
