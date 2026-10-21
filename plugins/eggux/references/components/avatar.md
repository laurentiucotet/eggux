# Avatar

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Avatar](#avatar) | 8 | - |
| [Avatar Group](#avatar-group) | 3 | Avatars |
| [Byline](#byline) | 3 | - |

On the Figma page: "Example / article meta", "Example / assignees on a project page", "Example / in record header", "Stress test / Avatar", "Stress test / Avatar Group", "Stress test / Byline"

## Avatar

Component set · 8 variants · default size 24 × 24

shadcn Avatar. Type=image: put the photo as an image fill on the "image" layer of the instance; the user icon is only a placeholder. Type=initials is the fallback (two letters). Status = online dot. Always pair with the person's name in text nearby or as accessible label.

**Use for**

- People in lists, tables, comments, headers and cards
- Size sm in tables and dense lists, default in lists and sidebars, lg and xl on profiles
- Owners and assignees on Entity Cards, Post Card authors

**Not for**

- Several people in little space: use Avatar Group
- State of a system or service: use Status Dot
- Companies and objects without a photo: use an icon

**Anatomy**

1. Image fill on the image layer (Type=image) or Initials (Type=initials)
2. User icon placeholder, only when there is no name
3. Status: online dot

**Content and behavior**

- Always next to the person's name, or with the name as accessible label; never the only identifier
- Photo when available; two initials as fallback
- Status dot only when presence matters to the task
- Same size within a list or group

**Accessibility**

- Image alt is the name, or alt="" when the name is right next to it
- The Status dot has a text equivalent ("Online")
- Initials meet 4.5:1 on background/muted

| Variant property | Values |
|---|---|
| Type | initials, image |
| Size | sm, default, lg, xl |

| Property | Type | Default |
|---|---|---|
| Initials | text | AP |
| Status | boolean | false |

Icons: user

Tokens and styles:
- Colors: `background/default`, `background/muted`, `background/success`, `foreground/default`
- Spacing and size: `border-width/2`, `spacing/10`, `spacing/12`, `spacing/6`, `spacing/8`
- Radius: `radius/full`
- Text styles: `body/large`, `ui/label`, `ui/label-small`

Guides: [avatar](../../skills/build-ui/components/avatar.md)

Code: shadcn `Avatar` (Group: negative margin + ring)

## Avatar Group

Component set · 3 variants · default size 78 × 24

Stacked avatars for assignees, participants, shared with. Show 3-5 and "+N"; the full list goes in a Tooltip or Popover.

**Use for**

- Assignees on a card or a table row
- Participants of a project
- "Shared with" in sharing dialogs

**Not for**

- One person: use Avatar with the name
- A list people read or act on: use a list in a Popover

**Anatomy**

1. Avatars slot: 3-5 Avatars of one size, overlapping
2. Ring: 2 px background/default around each Avatar
3. +N for the rest, opens the full list
4. Label (Show label): body/small, muted ("Maintained by 3 analysts")

**Content and behavior**

- Show 3-5 avatars, then "+N"
- Same size inside a group: sm, default or lg
- Full list in a Tooltip (names) or a Popover (names and actions)
- Label says who they are or how many, not the names already shown

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

Slots (fill them in the instance, never detach): `Avatars`

Built from: `Avatar`

Tokens and styles:
- Colors: `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `body/small`, `ui/caption`

Guides: [avatar](../../skills/build-ui/components/avatar.md), [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Avatar` (Group: negative margin + ring)

## Byline

Component set · 3 variants · default size 168 × 36

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
3. Detail (Show detail): ui/caption, muted: role and company, or date and reading time

**Content and behavior**

- One person per Byline
- Detail is one line: role, company or date · reading time
- Size follows the context: sm in dense grids, default under titles, lg under testimonials
- The name links to the profile when there is one

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
| Detail | text | Product designer, Acme |
| Show detail | boolean | true |
| Show avatar | boolean | true |

Built from: `Avatar`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `ui/caption`, `ui/label`
