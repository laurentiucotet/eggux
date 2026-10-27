# Admin

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Integration Card](#integration-card) | 3 | - |
| [Permission Row](#permission-row) | 3 | - |
| [API Key Row](#api-key-row) | 1 | - |
| [Session Row](#session-row) | 4 | - |
| [Org Chart Node](#org-chart-node) | 3 | - |

On the Figma page: "Example / finance team org chart", "Example / in api keys", "Example / in integrations", "Example / in roles & permissions", "Example / in security", "Stress test / API Key Row", "Stress test / Integration Card", "Stress test / Org Chart Node", "Stress test / Permission Row", "Stress test / Session Row"

## Integration Card

Component set · 3 variants · default size 320 × 170

One app in an integrations directory or settings: logo tile, name, category, one-line value and state. Status: available (Connect, optional Learn more link), connected (Switch, last sync, Settings, optional Connected badge), error (what failed and how to fix it). Logo is an icon swap or a letter tile (Show letter + Letter). Cards in a row share height; grid of 3 on desktop.


Usage: eggux build-ui/patterns/settings-and-admin.md

**Use for**

- An integrations directory
- Connected apps in settings
- "Connect your tools" in onboarding

**Not for**

- One on/off setting: use Setting Row
- A generic record: use Entity Card
- One choice in a form: use Option Card

**Anatomy**

1. Logo tile: vendor icon (Show icon, Logo swap) or a letter (Show letter, Letter: "St")
2. Name: ui/label; Category: ui/caption, muted
3. Action: Connect Button (available), Switch (connected)
4. Connected badge (Show badge, connected): success Badge "Connected"
5. Description: the value in one line, two at most
6. Footer: Vendor (Show vendor) and Learn more link (Show link, exposed Button link), or last sync and Settings

**Content and behavior**

- Available shows Connect (OAuth); Learn more opens the integration page
- Connected shows a Switch, last sync and Settings; the Connected badge helps when cards are scanned in a grid
- Use a letter tile only when no vendor logo is available; one style per grid
- Error says what failed and how to fix it ("Token expired. Reconnect")
- Grid of 3 on desktop, 1 on mobile; cards in a row share height
- Disconnecting asks for confirmation and says what stops
- Name and category: 1 line with ellipsis; description up to 3 lines; the logo letter stays inside the tile

**Accessibility**

- The name is the card heading; Connect is named with the app ("Connect Payments")
- The Switch is labelled "Payments enabled"
- Error is in text with an icon, not color alone
- Learn more is named with the app ("Learn more about Stripe")

| Variant property | Values |
|---|---|
| Status | available, connected, error |

| Property | Type | Default |
|---|---|---|
| Name | text | Payments |
| Category | text | Finance |
| Description | text | Collect card payments on invoices and reconcile them automatically. |
| Logo | instance swap | Icon/credit-card |
| Vendor | text | By Acme Pay |
| Show icon | boolean | true |
| Show letter | boolean | false |
| Letter | text | P |
| Show badge | boolean | false |
| Show vendor | boolean | true |
| Show link | boolean | false |

Built from: `Badge`, `Button`, `Status Dot`, `Switch`. Icons: credit-card

Tokens and styles:
- Colors: `background/card`, `background/default`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`
- Radius: `radius/lg`, `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `Card` (name, category `truncate`; description `line-clamp-3`)

## Permission Row

Component set · 3 variants · default size 720 × 55

One row of a role matrix, built from Table Cells so rows, the header and group rows share one grid. Type=permission: name, optional description and one Checkbox cell per role; Type=header names the roles; Type=group is a full-width area row (Invoices, Customers). 3 role columns by default, up to 5 with Show role 4 / Show role 5. Highlight the role being edited by setting its role cell to State=selected in every row. Locked roles (owner) show disabled checked boxes. Show changed marks an unsaved change; save with the Save Bar and log it in the audit history.


Needs at least 448 wide (permission column 160 plus three 96 role columns); add 96 for each extra role. In a narrow panel list one role at a time with a Select.


Usage: eggux build-ui/patterns/permissions-and-access.md

**Use for**

- A roles and permissions matrix
- A custom role editor
- Default access per role for a module

**Not for**

- The role of one person on one object: use Access Row
- One on/off setting: use Setting Row
- Many permissions for one role, as a list: use Checkbox

**Anatomy**

1. Type=permission: Title (body/small) with Description (ui/caption, muted; Show description), then one role cell per role
2. Role cells (role 1 to role 5): Table Cell Type=body with a centered Checkbox; 3 shown, Show role 4 and Show role 5 add columns
3. Changed (Show changed): outline Badge "Changed" after the title for an unsaved edit
4. Type=header: Table Cell Type=header cells with Table Header Label (Permission, then the role names)
5. Type=group: full-width area row, Group text ("Invoices") on the expanded-row background
6. Selected column: set the role cell to State=selected in every row (role cells are exposed)

**Content and behavior**

- Start with a Type=header row; group permissions by area with Type=group rows
- At most 5 role columns; turn on the same Show role 4 / Show role 5 in every row so the grid stays aligned
- Highlight the role being edited: its role cell State=selected in every permission row, header unchanged
- Locked roles (owner) show disabled checked boxes and say why
- Show changed on rows edited since the last save; save with the Save Bar and log it in the audit log
- A permission that needs another (approve needs view) ticks it too, and says so
- Needs at least 448 wide (permission column min 160 plus three 96 role columns, minWidth 448 on every Type); add 96 for each extra role; in a narrow panel list one role at a time with a Select
- Title: 1 line with ellipsis; description up to 2 lines; the Changed badge truncates at 128

**Accessibility**

- A real table: role names as th scope="col", permission as th scope="row"
- Each Checkbox is named by permission and role ("Approve invoices, Accountant")
- Locked boxes explain the reason with aria-describedby
- The highlighted column is also named in text ("Editing Manager"), not only by its background

| Variant property | Values |
|---|---|
| Type | permission, header, group |

| Property | Type | Default |
|---|---|---|
| Title | text | Approve invoices |
| Description | text | Mark invoices as approved for payment |
| Show description | boolean | true |
| Show changed | boolean | false |
| Show role 4 | boolean | false |
| Show role 5 | boolean | false |
| Group | text | Invoices |

Built from: `Badge`, `Table Cell`

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`, `table/row-expanded`
- Spacing and size: `density/cell-padding-y`, `spacing/0_5`, `spacing/2`, `spacing/4`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: table row (`min-w-[448px]` (+96 per extra role); permission cell `min-w-40`; title `truncate`, description `line-clamp-2`)

## API Key Row

Component · 1 variant · default size 800 × 65

One API key or token in developer settings: key icon, name with a scope Badge (Show scope; set its Label, e.g. "Read only"), who created it and last use, the masked key, Copy and a More menu (Rename, Roll, Revoke). Show the full key once at creation; after that only the last 4 characters. Revoke confirms and names the key.


Usage: eggux build-ui/patterns/settings-and-admin.md

**Use for**

- API keys in developer settings
- Personal access tokens
- Webhook signing secrets

**Not for**

- Showing a new key once: use Dialog with a Code Block
- Signed-in devices: use Session Row
- A plain setting: use Setting Row

**Anatomy**

1. Key icon tile
2. Name: ui/label
3. Scope (Show scope): Badge outline, exposed (set its Label: "Read only", "Read and write")
4. Meta: created when and by whom, last used; ui/caption, muted
5. Key: masked, monospace ("sk_live_••••••••4f2a")
6. Copy: Button Icon; More: Button Icon (Rename, Roll, Revoke)

**Content and behavior**

- Show the full key once, at creation, in a Dialog with Copy; after that only the last 4 characters
- Revoke asks for confirmation and names the key; it stops working at once
- Roll creates a new key, shown once, and says how long the old one keeps working
- Unused keys older than 90 days get a warning
- Newest first; revoked keys leave the list and go to the audit log
- Show scope when keys differ in access; hide it when every key has full access
- Name and meta fill the text column (min 160); name 1 line, meta 2 lines, with ellipsis; scope badge truncates at 160
- Wraps: when the row is narrow the key, Copy and More drop under the name (row gap 8); the key truncates at 192

**Accessibility**

- The masked key reads "Key ending in 4f2a"
- Copy and More are named with the key ("More actions for Production server")
- Revoke confirms in an Alert Dialog

| Property | Type | Default |
|---|---|---|
| Name | text | Production server |
| Meta | text | Created 12 Mar 2026 by Ana Popescu · Last used 2 hours ago |
| Key | text | sk_live_••••••••4f2a |
| Show scope | boolean | true |

Built from: `Badge`, `Button Icon`. Icons: key-round

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: custom row (`flex flex-wrap gap-y-2`; text column `min-w-40 flex-1`; name `truncate`, meta `line-clamp-2`; scope / current `Badge` `max-w-40`/`max-w-32`; key `max-w-48 truncate`; buttons `shrink-0`)

## Session Row

Component set · 4 variants · default size 720 × 63

One signed-in device in security settings: device and browser, approximate location, partial IP, last active, Sign out. State=current marks this device (Badge "This device", Sign out disabled) on any Device; the current device comes first. End the list with "Sign out of all other sessions". New sign-ins from unknown places also go to email.

**Use for**

- Sessions in security settings
- A user's sessions in admin
- After a sign-in alert from an unknown place

**Not for**

- API tokens: use API Key Row
- Past actions: use Timeline Item
- A list of people: use List Item

**Anatomy**

1. Device icon: monitor or smartphone (Device=desktop|mobile)
2. Name: browser and system; State=current adds the "This device" success Badge
3. Meta: location, partial IP, last active; ui/caption, muted
4. Action: Sign out Button outline sm, disabled when State=current
5. State: default, current; any Device can be the current one

**Content and behavior**

- Any device can be the current one: set State=current on its row, State=default on the others
- The current device comes first, is marked, and cannot sign itself out here
- Then sort by last active
- Location is approximate (city, country); the IP is partial
- End the list with "Sign out of all other sessions"
- Sign out works at once; the row leaves with a toast
- Name 1 line, meta 2 lines, with ellipsis; text column min 160
- Wraps: in a narrow column the action drops under the text (row gap 8)

**Accessibility**

- Sign out is named with the device ("Sign out Chrome on macOS")
- Current is in text, not only a badge color
- The list is a ul with aria-label "Active sessions"

| Variant property | Values |
|---|---|
| Device | desktop, mobile |
| State | default, current |

| Property | Type | Default |
|---|---|---|
| Name | text | Chrome on macOS |
| Meta | text | Bucharest, Romania · 86.120.x.x · Active now |

Built from: `Badge`, `Button`. Icons: monitor, smartphone

Tokens and styles:
- Colors: `background/default`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: custom row (`flex flex-wrap gap-y-2`; text column `min-w-40 flex-1`; name `truncate`, meta `line-clamp-2`; scope / current `Badge` `max-w-40`/`max-w-32`; key `max-w-48 truncate`; buttons `shrink-0`)

## Org Chart Node

Component set · 3 variants · default size 220 × 150

One person or open role in an org chart: avatar, name, role and direct reports. State=selected for the person in focus; State=vacant is dashed: the title is the Vacancy ("Open role"), the secondary line shows the Role of the position and the Hiring status ("Hiring", "Interviewing", "Offer out"). Connect nodes with 1 px border/default lines.


Needs at least 160 wide; name wraps to 2 lines, role and reports truncate.


Usage: eggux build-ui/patterns/enterprise-apps.md

**Use for**

- An org chart or team page
- Reporting lines in HR
- Who owns which team, in a company directory

**Not for**

- A full profile with contact and actions: use Person Card
- A file or folder hierarchy: use Tree Item
- A flat list of people: use List Item

**Anatomy**

1. Avatar
2. Name: ui/label; on State=vacant the Vacancy text ("Open role") is the title
3. Role: body/small, muted; on State=vacant the title being hired for, followed by the Hiring status
4. Hiring status (State=vacant): "Hiring", "Interviewing", "Offer out", body/small, muted
5. Reports: users icon and count ("6 reports"), not on State=vacant
6. State: default, selected, vacant

**Content and behavior**

- Click opens the Person Card; the reports count expands the branch
- Connect nodes with 1 px border/default lines
- Vacant roles are dashed, titled "Open role" (Vacancy); the secondary line is Role and Hiring status ("Head of Platform · Hiring"), linked to the Job Listing
- Large orgs show 2-3 levels and a search
- Names and titles wrap to two lines at most
- Needs at least 160 wide (minWidth 160); name wraps to 2 lines, role and reports truncate to 1 line, centered

**Accessibility**

- The chart is a tree (role="tree", treeitem with aria-expanded and aria-level); arrow keys move
- The reports button is named "Show 6 reports of Ana Popescu"
- Vacant and selected are in text, not only border style

| Variant property | Values |
|---|---|
| State | default, selected, vacant |

| Property | Type | Default |
|---|---|---|
| Name | text | Ana Popescu |
| Role | text | Head of Finance |
| Reports | text | 6 reports |
| Vacancy | text | Open role |
| Hiring status | text | Hiring |

Built from: `Avatar`. Icons: plus, users

Tokens and styles:
- Colors: `background/card`, `background/muted`, `border/default`, `border/ring`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

Code: custom card (`min-w-40`; name `line-clamp-2`, role and reports `truncate`, centered)
