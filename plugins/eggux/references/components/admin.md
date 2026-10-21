# Admin

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Integration Card](#integration-card) | 3 | - |
| [Permission Row](#permission-row) | 2 | - |
| [API Key Row](#api-key-row) | 1 | - |
| [Session Row](#session-row) | 2 | - |
| [SSO Button](#sso-button) | 4 | - |
| [Org Chart Node](#org-chart-node) | 3 | - |

On the Figma page: "Stress test / API Key Row", "Stress test / Integration Card", "Stress test / Org Chart Node", "Stress test / Permission Row", "Stress test / SSO Button", "Stress test / Session Row"

## Integration Card

Component set · 3 variants · default size 320 × 170

One app or service in an integrations directory or settings: logo, name, category, one-line value, and its state. Available shows Connect; connected shows a switch, last sync and Settings; error says what failed and how to fix it. Put the vendor logo in the Logo tile. Grid of 3 on desktop, 1 on mobile.

**Use for**

- An integrations directory
- Connected apps in settings
- "Connect your tools" in onboarding

**Not for**

- One on/off setting: use Setting Row
- A generic record: use Entity Card
- One choice in a form: use Option Card

**Anatomy**

1. Logo tile: vendor logo (Logo)
2. Name: ui/label; Category: ui/caption, muted
3. Action: Connect Button (available), Switch (connected)
4. Description: the value in one line, two at most
5. Footer: vendor, or last sync and Settings

**Content and behavior**

- Available shows Connect (OAuth)
- Connected shows a Switch, last sync and Settings
- Error says what failed and how to fix it ("Token expired. Reconnect")
- Grid of 3 on desktop, 1 on mobile; cards in a row share height
- Disconnecting asks for confirmation and says what stops

**Accessibility**

- The name is the card heading; Connect is named with the app ("Connect Payments")
- The Switch is labelled "Payments enabled"
- Error is in text with an icon, not color alone

| Variant property | Values |
|---|---|
| Status | available, connected, error |

| Property | Type | Default |
|---|---|---|
| Name | text | Payments |
| Category | text | Finance |
| Description | text | Collect card payments on invoices and reconcile them automatically. |
| Logo | instance swap | Icon/credit-card |

Built from: `Button`, `Status Dot`, `Switch`. Icons: credit-card

Tokens and styles:
- Colors: `background/card`, `background/default`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`
- Radius: `radius/lg`, `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `Card size="sm"` + `Button`, `Switch`, `Badge` (Connect opens the provider OAuth flow)

## Permission Row

Component set · 2 variants · default size 720 × 63

One permission across roles in a role matrix: name, what it allows, one checkbox per role. Header row names the roles. Locked roles (owner, admin) show disabled checked boxes. Group rows by area with Section Heading; save changes with the Save Bar and log them in the Audit Log.

**Use for**

- A roles and permissions matrix
- A custom role editor
- Default access per role for a module

**Not for**

- The role of one person on one object: use Access Row
- One on/off setting: use Setting Row
- Many permissions for one role, as a list: use Checkbox

**Anatomy**

1. Text: title (ui/label) and description (ui/caption, muted)
2. One Checkbox per role column
3. Type=header: the row that names the roles

**Content and behavior**

- The header row names the roles; at most 5-6 role columns
- Locked roles (owner, admin) show disabled checked boxes and say why
- Group rows by area with Section Heading
- Save changes with the Save Bar and log them in the audit log
- A permission that needs another (approve needs view) ticks it too, and says so

**Accessibility**

- A real table: role names as th scope="col", permission as th scope="row"
- Each Checkbox is named by permission and role ("Approve invoices, Accountant")
- Locked boxes explain the reason with aria-describedby

| Variant property | Values |
|---|---|
| Type | row, header |

| Property | Type | Default |
|---|---|---|
| Title | text | Approve invoices |
| Description | text | Mark invoices as approved for payment |

Built from: `Checkbox`

Tokens and styles:
- Colors: `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/3`, `spacing/4`
- Text styles: `ui/caption`, `ui/label`

Guides: [permissions-and-access](../../skills/build-ui/patterns/permissions-and-access.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: shadcn `Table` with `Checkbox` cells (Form state in react-hook-form; save with `Save Bar`; log changes)

## API Key Row

Component · 1 variant · default size 800 × 65

One API key or token in developer settings: name, scope, who created it, when it was last used, the masked key, copy and a menu (rename, roll, revoke). Show the full key once, at creation, in a Dialog with copy. Revoke asks for confirmation and names the key. Unused keys older than 90 days get a warning.

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
2. Name: ui/label, with a scope Badge
3. Meta: created when and by whom, last used; ui/caption, muted
4. Key: masked, monospace ("sk_live_••••••••4f2a")
5. Copy: Button Icon; More: Button Icon (Rename, Roll, Revoke)

**Content and behavior**

- Show the full key once, at creation, in a Dialog with Copy; after that only the last 4 characters
- Revoke asks for confirmation and names the key; it stops working at once
- Roll creates a new key, shown once, and says how long the old one keeps working
- Unused keys older than 90 days get a warning
- Newest first; revoked keys leave the list and go to the audit log

**Accessibility**

- The masked key reads "Key ending in 4f2a"
- Copy and More are named with the key ("More actions for Production server")
- Revoke confirms in an Alert Dialog

| Property | Type | Default |
|---|---|---|
| Name | text | Production server |
| Meta | text | Created 12 Mar 2026 by Ana Popescu · Last used 2 hours ago |
| Key | text | sk_live_••••••••4f2a |

Built from: `Badge`, `Button Icon`. Icons: key-round

Tokens and styles:
- Colors: `background/default`, `background/muted`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: custom row + `Badge`, `Button size="icon"`, `DropdownMenu`, `AlertDialog` (Full key shown once at creation; sessions from your auth provider)

## Session Row

Component set · 2 variants · default size 720 × 63

One signed-in device in security settings: device and browser, approximate location, partial IP, last active, Sign out. The current device is marked and cannot sign itself out here. End the list with "Sign out of all other sessions". New sign-ins from unknown places also go to email.

**Use for**

- Sessions in security settings
- A user's sessions in admin
- After a sign-in alert from an unknown place

**Not for**

- API tokens: use API Key Row
- Past actions: use Timeline Item
- A list of people: use List Item

**Anatomy**

1. Device icon: monitor or smartphone (Device)
2. Name: browser and system, with a Current Badge ("This device")
3. Meta: location, partial IP, last active; ui/caption, muted
4. Action: Sign out Button

**Content and behavior**

- The current device comes first, is marked, and cannot sign itself out here
- Then sort by last active
- Location is approximate (city, country); the IP is partial
- End the list with "Sign out of all other sessions"
- Sign out works at once; the row leaves with a toast

**Accessibility**

- Sign out is named with the device ("Sign out Chrome on macOS")
- Current is in text, not only a badge color
- The list is a ul with aria-label "Active sessions"

| Variant property | Values |
|---|---|
| Device | desktop, mobile |

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

Code: custom row + `Badge`, `Button size="icon"`, `DropdownMenu`, `AlertDialog` (Full key shown once at creation; sessions from your auth provider)

## SSO Button

Component set · 4 variants · default size 360 × 40

Sign-in with an identity provider on sign-in and sign-up screens: Google, Microsoft, company SSO (SAML/OIDC), or email. Full width, stacked, same order everywhere; the provider the org enforces goes first. "Continue with SSO" asks for the work email, then redirects. Follow each provider's brand rules for the mark.

**Use for**

- Sign in and sign up screens
- Accept invite
- Sign in again before a sensitive action

**Not for**

- Any other action: use Button
- Connecting an app to the workspace: use Integration Card

**Anatomy**

1. Mark: the provider logo (key for SAML, mail for email)
2. Label: "Continue with Google"

**Content and behavior**

- Full width, stacked, in the same order everywhere; the provider the org enforces goes first
- "Continue with" on both sign in and sign up
- "Continue with SSO" asks for the work email, then redirects
- When the domain enforces SSO, the other options hide after the email is known
- Follow each provider's brand rules for the mark; the button blocks double clicks while it redirects

**Accessibility**

- A button named by its label; the mark is aria-hidden
- Focus ring visible on every provider
- Errors come back to the sign-in screen as text above the buttons

| Variant property | Values |
|---|---|
| Provider | google, microsoft, saml, email |

Icons: mail, shield-check

Tokens and styles:
- Colors: `background/default`, `border/input`, `foreground/default`
- Spacing and size: `spacing/2`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [auth](../../skills/build-ui/patterns/auth.md)

Code: shadcn `Button variant="outline"` `w-full` + provider mark (`signIn(provider)` in Auth.js, Clerk or WorkOS)

## Org Chart Node

Component set · 3 variants · default size 220 × 150

One person or open role in an org chart: photo, name, title, number of direct reports. Click opens the Person Card; the reports count expands the branch. Connect nodes with 1 px border/default lines. Vacant roles are dashed. Large orgs show 2-3 levels and a search.

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
2. Name: ui/label
3. Role: body/small, muted
4. Reports: users icon and count ("6 reports")

**Content and behavior**

- Click opens the Person Card; the reports count expands the branch
- Connect nodes with 1 px border/default lines
- Vacant roles are dashed and say "Open role", linked to the Job Listing
- Large orgs show 2-3 levels and a search
- Names and titles wrap to two lines at most

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

Built from: `Avatar`. Icons: plus, users

Tokens and styles:
- Colors: `background/card`, `background/muted`, `border/default`, `border/ring`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/4`
- Radius: `radius/full`, `radius/lg`
- Text styles: `ui/caption`, `ui/label`

Guides: [list-and-tree](../../skills/build-ui/components/list-and-tree.md)

Code: @xyflow/react with a dagre layout (or react-d3-tree); custom node with `Avatar` (`role="tree"` semantics for keyboard use)
