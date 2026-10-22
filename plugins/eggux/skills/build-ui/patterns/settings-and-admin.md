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

Settings sections: one `Setting Row` per setting (title, what changes, control on the right:
Switch for on/off, Select for a choice, Button for Change or Connect); Show divider off on the last
row. Switches save at once unless the section has its own Save button. Example: "settings
section" on the Selection controls page and `Block / Settings Section`.

Destructive settings (delete workspace, transfer ownership) live in a separate "Danger zone" card
at the bottom, with typed confirmation (`delete-confirmation.md`).

## Related components
- Settings pages with fields use `Form Section` (title and description on the left, fields on the
  right) and one Save. API keys and webhook URLs use `Copy Field`. Appearance settings use a
  `Toggle Group` for the theme (light, dark, system) and a `Select` for the language: examples
  "theme switch" on the Toggle Group page and "language switch" on the Select page.
- Billing and Team Members show each plan limit with a `Usage Meter` (near from 80% with what to do,
  over above 100% with the consequence and date). Rules lists use `Automation Rule`: one sentence
  per rule, a Switch to pause it and how often it ran.
- Admin rows: `Integration Card` for the Integrations block, `Permission Row` for the role matrix,
  `API Key Row` for API Keys and `Session Row` for signed-in devices. Onboarding checklists use
  `Task Item`.
