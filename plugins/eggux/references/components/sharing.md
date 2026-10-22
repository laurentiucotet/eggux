# Sharing

Generated from the EGG UI master library on 2026-10-22 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Access Row](#access-row) | 3 | - |
| [Invite Row](#invite-row) | 1 | - |
| [Share Link Row](#share-link-row) | 2 | - |

On the Figma page: "Example / in share dialog", "Example / in team members", "Stress test / Access Row", "Stress test / Invite Row", "Stress test / Share Link Row"

## Access Row

Component set · 3 variants · default size 480 × 52

One person or group with access to an object in a share dialog: avatar, Name and Email, and their role. Type: editable (role Select), owner (role as text), pending (Name is the invited address, Email says when: "Invited 2 days ago", with an Invited badge). Owner first, then you, then A-Z. Changes save at once with a toast.


Usage: eggux build-ui/patterns/sharing-and-invites.md

**Use for**

- The list of people in a share dialog
- Members of a project or a folder
- Pending invites next to members

**Not for**

- Adding people: use Invite Row
- Who can open the link: use Share Link Row
- One permission across roles: use Permission Row
- Who has access, in a page header: use Avatar Group

**Anatomy**

1. Avatar
2. Name: ui/label, "(you)" for the reader; for pending, the invited address
3. Email: body/small, muted; member count for a group; for pending, when they were invited
4. Role: Select (editable), text (owner), Invited Badge and Select (pending)

**Content and behavior**

- The role picker lists Can view, Can comment, Can edit, then Remove access at the bottom, apart
- Owner shows the role as text; owner first, then you, then the rest A-Z
- Pending shows "Invited 2 days ago"; its menu offers Resend and Cancel invite
- Changes save at once with a toast; removing your own access asks to confirm

**Accessibility**

- The list is a ul with aria-label "People with access"
- The role Select is named with the person ("Role for Maria Ilie")
- The Avatar is decorative next to the name (alt="")

| Variant property | Values |
|---|---|
| Type | editable, owner, pending |

| Property | Type | Default |
|---|---|---|
| Name | text | Maria Ilie |
| Email | text | maria@acme.com |

Built from: `Avatar`, `Badge`, `Select`

Tokens and styles:
- Colors: `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Avatar`, `Select`, `Popover` + `Command` (combobox with chips), `Button` (Copy with `navigator.clipboard.writeText`; validate emails with zod)

## Invite Row

Component · 1 variant · default size 480 × 36

Add people to an object or a workspace: email or name (suggestions from the directory), the role they get, Invite. Several addresses can be pasted at once and turn into chips. External domains get a warning before sending. Top of the share dialog, above the Access Rows.

**Use for**

- The top of a share dialog, above the Access Rows
- Invite members on a Team Members page
- Invite people to a project

**Not for**

- Picking people for an assignment: use People Picker
- Changing the role of someone with access: use Access Row
- Sharing by link: use Share Link Row

**Anatomy**

1. Input: email or name, suggestions from the directory
2. Role: Select (Show role)
3. Invite: Button, primary

**Content and behavior**

- Several addresses can be pasted at once and turn into chips; invalid ones are marked inline
- External domains get a warning before sending
- The role defaults to the most restrictive one that works (Can view)
- Invite is disabled until there is one valid address; seat limits show before sending
- After sending, people appear as pending Access Rows and a toast confirms

**Accessibility**

- The Input is labelled "Add people by name or email" and works as a combobox (aria-expanded, aria-activedescendant)
- Errors are linked with aria-describedby
- Enter adds an address; Invite submits

| Property | Type | Default |
|---|---|---|
| Show role | boolean | true |

Built from: `Button`, `Input`, `Select`

Tokens and styles:
- Spacing and size: `spacing/2`

Guides: [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Avatar`, `Select`, `Popover` + `Command` (combobox with chips), `Button` (Copy with `navigator.clipboard.writeText`; validate emails with zod)

## Share Link Row

Component set · 2 variants · default size 480 × 52

General access of an object at the bottom of a share dialog: who can open the link (restricted to people with access, the workspace, or anyone) and Copy link. The icon and sentence say the reach in plain words. Public access asks for confirmation the first time and shows it with the globe everywhere the object appears.

**Use for**

- The bottom of a share dialog
- Publish settings of a document or a dashboard
- Sharing a report outside the workspace

**Not for**

- Named people with access: use Access Row
- Inviting people: use Invite Row
- An embed code or an API URL: use Code Block

**Anatomy**

1. Icon tile: lock (restricted), globe (anyone)
2. Access: the level, with a picker (Restricted, Anyone in the workspace, Anyone with the link)
3. Detail: what that means, body/small, muted
4. Copy link: Button

**Content and behavior**

- Default to the most restrictive level that works
- The icon and the sentence say the reach in plain words ("Only people with access can open this link")
- Public access asks for confirmation the first time and shows the globe everywhere the object appears
- Copy link gives inline "Copied" feedback for about 2 seconds
- Public links can expire; say when

**Accessibility**

- The access picker is labelled "General access"
- "Link copied" is announced in a polite live region
- The icon is aria-hidden; the sentence carries the meaning

| Variant property | Values |
|---|---|
| Type | restricted, anyone |

Built from: `Button`. Icons: globe, lock

Tokens and styles:
- Colors: `background/muted`, `background/success`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`
- Radius: `radius/full`
- Text styles: `ui/caption`, `ui/label`

Guides: [sharing-and-invites](../../skills/build-ui/patterns/sharing-and-invites.md)

Code: shadcn `Avatar`, `Select`, `Popover` + `Command` (combobox with chips), `Button` (Copy with `navigator.clipboard.writeText`; validate emails with zod)
