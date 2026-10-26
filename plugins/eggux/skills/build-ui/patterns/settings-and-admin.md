# Settings and admin pages

Blocks on the App page; put them in the App shell Page slot, one column of 768 (settings) or the
full 1136 (integrations). Navigation between settings sections: Sidebar group or Tabs.

| Block | Rules |
|---|---|
| Profile | Photo, name, title, email (re-verified on change), bio with limit, language, time zone. Save / Cancel; unsaved-changes.md |
| Team Members | Seats used; invite in the header; role per row (Owner fixed); pending invites marked; resend / revoke in the row menu |
| Billing | Current plan + renewal date, usage bars (warn at 80%, block at 100% with an upgrade path), payment method, billing email, invoices to download. Cancel is visible |
| Notification Preferences | Event × channel checkboxes; defaults on for things that need action, off for marketing; security emails always on; saves immediately with a toast |
| API Keys | Masked keys, full key shown once at creation with Copy; created / last used; revoke with confirmation |
| Integrations | Search; cards with logo, benefit, status; Connect (OAuth) or Settings + on/off |
| Onboarding Checklist | 3-6 steps to first value, progress, one highlighted next step, dismissible; steps complete automatically |
| Roles & Permissions | Roles list with member counts; permission matrix grouped by resource (rows) × roles (columns); Owner column locked; edited role highlighted; Save Bar; changes logged |
| Org Switcher | In the Sidebar Workspace: current org with a check, role and plan, search over 5 orgs, create and manage at the bottom; switching keeps the user on the same kind of page |
| Workspace Settings | The General tab, with Danger Zone last |
| Appearance Settings | The Appearance tab; saves on change with a Toast and no Save Bar |
| Plan and Usage | The Billing tab, above Billing |
| Plan Checkout | Upgrading; the Total and the pay button show the same amount |
| AI Settings | The AI tab: model defaults, data controls (training opt-in off by default, retention), memory with a destructive clear |
| Invite Members Dialog | Inviting people to the workspace (`sharing-and-invites.md`) |

Settings sections: one `Setting Row` per setting (title, what changes, control on the right:
Switch for on/off, Select for a choice, Button for Change or Connect); Show divider off on the last
row. Switches save at once unless the section has its own Save button. Example: "settings
section" on the Selection controls page and `Block / Settings Section`.

A `Switch` with its own label uses `Show description` for settings that need one sentence of
consequence. Size=sm in dense tables and toolbars, lg in mobile settings, default elsewhere; one
Size per list. Example "Switch styles".

Destructive settings (delete workspace, transfer ownership) live in a separate "Danger zone" card
at the bottom, with typed confirmation (`delete-confirmation.md`).
- Billing emails (invoice, receipt, payment failed, trial ending) use the Emails page templates with
  Email / Details and Email / Line Items (email.md).
- Start a settings page from `Block / Settings Page with Tabs` (Page Header, line Tabs, Sections slot
  960 wide, Save Bar) and put the area's blocks in Sections; finish with `Block / Danger Zone`. Full
  screens: SCREENS / Settings (General, Members, Notifications, Security, Billing, API keys,
  Integrations, Appearance).
- Account pages (My profile, public profile, activity, connected accounts, delete account) reuse the
  same block with account tabs; the entry is the Account Menu on the Sidebar User. Screens: SCREENS /
  Account.
- Users page: `Block / User Directory`; status as soft Badges with a short note, sign-in method
  and two-factor as their own columns, bulk actions in the Table Toolbar.

## Related components
- Settings pages with fields use `Form Section` (title and description on the left, fields on the
  right) and one Save. API keys and webhook URLs use `Copy Field`. Appearance settings use Option Cards
  for the theme (light, dark, system; `Block / Appearance Settings`), a segmented Toggle Group for
  density and a `Select` for the language; a compact theme control is the "theme switch" example
  on the Toggle Group page.
- Billing and Team Members show each plan limit with a `Usage Meter` (near from 80% with what to do,
  over above 100% with the consequence and date). Rules lists use `Automation Rule`: one sentence
  per rule, a Switch to pause it and how often it ran.
- Admin rows: `Integration Card` for the Integrations block, `Permission Row` for the role matrix,
  `API Key Row` for API Keys and `Session Row` for signed-in devices. Onboarding checklists use
  `Task Item`.
- `Integration Card`: use a letter tile (Show letter) only when no vendor logo is available, and the same style across the grid.
- Account security (two-factor, sign-in alerts, SSO URL, active sessions with Sign out of all other sessions): `Block / Security`. A long settings page: `Block / Account Settings Form` (Form Sections per topic, one Error Summary on top after a failed save, one Action Bar at the end).
