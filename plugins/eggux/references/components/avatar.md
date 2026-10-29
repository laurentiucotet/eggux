# Avatar

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Avatar](#avatar) | 42 | - |
| [Avatar Status](#avatar-status) | 4 | - |
| [Avatar Verified](#avatar-verified) | 1 | - |
| [Avatar Group](#avatar-group) | 3 | Avatars |
| [Byline](#byline) | 3 | - |
| [Presence Bar](#presence-bar) | 1 | - |

On the Figma page: "Example / Avatar Group styles", "Example / Avatar styles", "Example / article meta", "Example / assignees on a project page", "Example / document header with live presence", "Stress test / Avatar", "Stress test / Avatar Group", "Stress test / Byline", "Stress test / Presence Bar"

## Avatar

Component set · 42 variants · default size 32 × 32

shadcn Avatar. Type=initials (default, two letters) is the fallback; Type=image shows the photo picked in the Photo swap (Image / Person / * from the Imagery page), clipped to the shape; Type=icon shows a glyph (Icon swap: user for guests and deleted accounts, bot for the AI assistant and automations, users for a team) when there is no photo or name. The sample faces are placeholders: replace them with real photos, and use a different person for each avatar in a list. Status (Show status, exposed Avatar Status): online, away, busy, offline. Show verified: a checked account or organization (info tick in the same corner; use status or verified, not both). Always pair with the name in text nearby or as accessible label. Shape: circle for people, square for companies, workspaces and apps. Size: xs (20) inline and dense cells, sm (24), default (32), lg (40), xl (48), 2xl (64) profile headers and person cards, 3xl (96) My profile and Avatar Upload preview. Usage: eggux build-ui/components/avatar.md

**Use for**

- People in lists, tables, comments, headers and cards
- Size xs and sm in tables and dense lists, default in lists and sidebars, lg and xl on cards, 2xl on profile headers and Person Card vertical, 3xl on My profile and Avatar Upload preview
- Owners and assignees on Entity Cards, Post Card authors, testimonial and team blocks
- Type=icon for guests, deleted users, system events and the AI assistant (Icon swap: user, bot, users)
- Show status for presence in chat, inbox and directories; Show verified for checked accounts and organizations

**Not for**

- Several people in little space: use Avatar Group
- State of a system or service: use Status Dot
- Large team or product photos: use Image Placeholder with Show image
- Companies and objects without a photo: use an icon or Shape=square initials

**Anatomy**

1. Type: initials (default), image or icon
2. Initials (Type=initials): two letters on background/muted
3. Photo swap (Photo, Type=image): nested Image / Person / * instance clipped to the shape; default Image / Person / 01
4. Icon swap (Icon, Type=icon): user (default), bot, users; half the avatar size, foreground/muted
5. Status (Show status): exposed Avatar Status with Status online, away, busy, offline
6. Verified (Show verified): Avatar Verified tick, background/info with a foreground/info check
7. Shape: circle for people, square (radius md, lg on lg and up) for companies, workspaces and apps
8. Size: xs (20), sm (24), default (32), lg (40), xl (48), 2xl (64), 3xl (96)

**Content and behavior**

- Always next to the person's name, or with the name as accessible label; never the only identifier
- Type=image with a Photo when a photo exists; initials stay the default and the fallback; Type=icon only when there is no name either (guest, deleted user) or the actor is not a person (bot, system)
- The Image / Person photos are sample faces (Unsplash License, not covered by the CC BY 4.0 license of the file): replace them with real photos
- Pick a photo that fits the name, use a different person for each avatar in a block, and the same photo for the same person within it
- Overflow avatars (+3) and organizations stay initials
- Status only when presence matters to the task: online (success), away (warning), busy (destructive), offline (muted); same size within a list or group; one shape per list
- Status and verified share the bottom-right corner: use one, never both
- Initials stay inside the circle: 1 line, centered, clipped by the circle, ellipsis for anything longer than 2 letters
- Fixed size: never stretch an avatar; pick the Size

**Accessibility**

- Image alt is the name, or alt="" when the name is right next to it
- Status has a text equivalent ("Ana Popescu, away"); color is never the only signal
- Verified has a text equivalent ("Verified") in the name or a Tooltip
- Initials meet 4.5:1 on background/muted; icons and dots 3:1 except the away dot (amber on white, same as Status Dot warning), which always comes with text

| Variant property | Values |
|---|---|
| Type | initials, image, icon |
| Size | sm, default, lg, xl, xs, 2xl, 3xl |
| Shape | circle, square |

| Property | Type | Default |
|---|---|---|
| Initials | text | AP |
| Show status | boolean | false |
| Photo | instance swap | Image / Person / 01 |
| Show verified | boolean | false |
| Icon | instance swap | Icon/user |

Built from: `Avatar Status`, `Avatar Verified`, `Image / Person / 01`. Icons: user

Tokens and styles:
- Colors: `background/muted`, `foreground/default`
- Spacing and size: `spacing/10`, `spacing/12`, `spacing/16`, `spacing/24`, `spacing/5`, `spacing/6`, `spacing/8`
- Radius: `radius/full`, `radius/lg`, `radius/md`
- Text styles: `body/large`, `heading/h2`, `heading/h3`, `ui/label`, `ui/label-small`

Guides: [avatar](../../skills/build-ui/components/avatar.md), [select](../../skills/build-ui/components/select.md)

Code: shadcn `Avatar` (`Type=image` = `AvatarImage` (the `Photo` swap is a sample face, use the person's photo URL); `Type=initials` = `AvatarFallback`; `Type=icon` = `AvatarFallback` with lucide `User` / `Bot` / `Users` (`size-1/2 text-muted-foreground`). Sizes `size-5` (xs) to `size-16` (2xl) and `size-24` (3xl). Status (`Avatar Status`): `absolute bottom-0 right-0 rounded-full ring-2 ring-background` with `bg-success`, `bg-warning`, `bg-destructive`, `bg-muted-foreground` + sr-only text; Show verified (`Avatar Verified`): lucide `BadgeCheck` or a check in `bg-info text-info-foreground` in the same corner. Group: negative margin + ring)

## Avatar Status

Component set · 4 variants · default size 10 × 10

Presence dot on the corner of an Avatar (part of Avatar, not used alone). Status: online (success), away (warning), busy (destructive), offline (muted). A 2 px ring in background/default separates it from the photo. Color is never the only signal: say the status in text nearby or in the accessible name ("Ana Popescu, away"). Usage: eggux build-ui/components/avatar.md

| Variant property | Values |
|---|---|
| Status | online, away, busy, offline |

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/success`, `background/warning`, `foreground/muted`
- Spacing and size: `border-width/2`

Guides: [avatar](../../skills/build-ui/components/avatar.md)

## Avatar Verified

Component · 1 variant · default size 16 × 16

Verified tick on the corner of an Avatar (part of Avatar, not used alone): an account, organization or seller whose identity was checked. background/info circle, foreground/info check, 2 px background ring. Pair it with "Verified" in the accessible name or a Tooltip. Usage: eggux build-ui/components/avatar.md

Icons: check

Tokens and styles:
- Colors: `background/default`, `background/info`
- Spacing and size: `border-width/2`

Guides: [avatar](../../skills/build-ui/components/avatar.md)

## Avatar Group

Component set · 3 variants · default size 78 × 24

Stacked avatars for assignees, participants, shared with. Show 3-5 and "+N"; the full list goes in a Tooltip or Popover. Show names adds who they are next to the avatars ("Ana, Mihai and 3 others", foreground, medium); Show label adds what they are ("Maintained by 3 analysts", muted). Both stay on one line and end with an ellipsis at 200 (sm) or 240 (default, lg). Usage: eggux build-ui/components/avatar.md

**Use for**

- Assignees on a card or a table row
- Participants of a project
- "Shared with" in sharing dialogs
- Show names: who is in the group at a glance ("Ana, Mihai and 3 others")

**Not for**

- One person: use Avatar with the name
- A list people read or act on: use a list in a Popover

**Anatomy**

1. Avatars slot: 3-5 Avatars of one size, overlapping
2. Ring: 2 px background/default around each Avatar
3. +N for the rest, opens the full list
4. Names (Show names): ui/label (ui/label-small in sm), foreground, one line, ellipsis
5. Label (Show label): body/small (ui/caption in sm), muted, one line, ellipsis

**Content and behavior**

- Show 3-5 avatars, then "+N"
- Same size inside a group: sm, default or lg
- Full list in a Tooltip (names) or a Popover (names and actions)
- Label says who they are or how many, not the names already shown
- Names lists the first two or three names and "and N others"; it matches the avatars shown
- Names and Label truncate with an ellipsis at their max width (200 sm, 240 default and lg); the full list goes in the Tooltip
- Names and Label fill the space left after the avatars and truncate; they never push the group past its column

**Accessibility**

- The group has a name with the count ("5 assignees")
- +N is focusable and opens the full list
- The Tooltip also shows on keyboard focus

| Variant property | Values |
|---|---|
| Size | sm, default, lg |

| Property | Type | Default |
|---|---|---|
| Label | text | Maintained by 3 analysts |
| Show label | boolean | false |
| Names | text | Ana, Mihai and 3 others |
| Show names | boolean | false |

Slots (fill them in the instance, never detach): `Avatars`

Built from: `Avatar`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `body/small`, `ui/caption`, `ui/label`, `ui/label-small`

Guides: [avatar](../../skills/build-ui/components/avatar.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Avatar` (`Type=image` = `AvatarImage` (the `Photo` swap is a sample face, use the person's photo URL); `Type=initials` = `AvatarFallback`; `Type=icon` = `AvatarFallback` with lucide `User` / `Bot` / `Users` (`size-1/2 text-muted-foreground`). Sizes `size-5` (xs) to `size-16` (2xl) and `size-24` (3xl). Status (`Avatar Status`): `absolute bottom-0 right-0 rounded-full ring-2 ring-background` with `bg-success`, `bg-warning`, `bg-destructive`, `bg-muted-foreground` + sr-only text; Show verified (`Avatar Verified`): lucide `BadgeCheck` or a check in `bg-info text-info-foreground` in the same corner. Group: negative margin + ring)

## Byline

Component set · 3 variants · default size 169 × 36

Who wrote, said or owns something: Avatar, name and one detail (role and company, or date and reading time). sm in dense grids and list rows, default under article titles and on cards, lg under testimonials and quotes. The name links to the profile when there is one. Several people: Avatar Group with a label; a full profile card: Person Card.

**Use for**

- Author under an article title (Size=default)
- Who said it, under a testimonial or quote (lg, or sm in a grid)
- Owner of a record, a dataset or a report
- Author in a list of posts

**Not for**

- Several people: use Avatar Group with a label
- A full profile with role, contact and actions: use Person Card
- A comment with its text: use Comment

**Anatomy**

1. Avatar (exposed: Type, Initials), Show avatar
2. Name: ui/label
3. Description (Show description): ui/caption, muted: role and company, or date and reading time

**Content and behavior**

- One person per Byline
- Detail is one line: role, company or date · reading time
- Size follows the context: sm in dense grids, default under titles, lg under testimonials
- The name links to the profile when there is one
- Name and detail: 1 line with ellipsis; the byline hugs its text and truncates when its column is narrower

**Accessibility**

- The Avatar is decorative next to the name (alt="")
- Dates in a <time> element
- The link is on the name, not on the avatar alone

| Variant property | Values |
|---|---|
| Size | sm, default, lg |

| Property | Type | Default |
|---|---|---|
| Name | text | Maria Ilie |
| Description | text | Product designer, Acme |
| Show description | boolean | true |
| Show avatar | boolean | true |

Built from: `Avatar`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `ui/caption`, `ui/label`

Guides: [avatar](../../skills/build-ui/components/avatar.md)

Code: shadcn `Avatar` + name and detail (`flex items-center gap-3`) (Name links to the profile; dates in `<time>`)

## Presence Bar

Component · 1 variant · default size 254 × 24

Who else has this document, record or board open right now: a live dot, their avatars, a short sentence. Top right of the editor, next to Share. Hovering an avatar shows the name and what they are looking at; clicking it jumps there. Only shows when someone else is present.

**Use for**

- A shared document or editor
- A record page several people edit
- A board or whiteboard

**Not for**

- Who has access, present or not: use Avatar Group
- Who is typing in a chat: use Typing Indicator
- The status of one person: use Avatar with a Status Dot

**Anatomy**

1. Live: Status Dot
2. People: Avatar Group, with a short label ("3 people here")

**Content and behavior**

- Shows only when someone else is present; the reader is not in it
- Top right of the editor, next to Share
- Hovering an avatar shows the name and what they are looking at; clicking jumps there
- Up to 4 avatars, then +N; each person keeps the same color as their cursor
- People who leave disappear; idle people fade
- The avatar group fills the bar and its label truncates; the live dot keeps its size

**Accessibility**

- A group with aria-label "People viewing"
- Each avatar is a button named with the person and place ("Maria Ilie, editing Section 2")
- Arrivals are not announced one by one; the label sums them up

Built from: `Avatar Group`, `Status Dot`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Avatar` group + `HoverCard` (Presence from Liveblocks, Yjs awareness or your websocket)
