# Automation

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Automation Rule](#automation-rule) | 2 | - |
| [Workflow Node](#workflow-node) | 9 | - |
| [Mapping Row](#mapping-row) | 3 | - |

On the Figma page: "Example / in automations", "Stress test / Automation Rule", "Stress test / Mapping Row", "Stress test / Workflow Node"

## Automation Rule

Component set · 2 variants · default size 640 × 108

One automation in a rules list, written as a sentence: When trigger, and condition, then action. A switch turns it on or off without deleting it; the menu has edit, duplicate, run history, delete. Show how often it ran so people trust it. Complex multi-step flows use Workflow Node on a canvas.

**Use for**

- Rules lists in settings: routing, reminders, assignments
- Simple one-trigger, one-action automations
- Approval rules ("approves over €10,000")

**Not for**

- Multi-step flows with branches: use Workflow Node on a canvas
- A plain on/off setting: use Setting Row
- Conditions for a filter or a view: use Filter Group

**Anatomy**

1. Name and Meta ("Ran 48 times this month · last run 2 h ago")
2. Status: Switch
3. More: Button Icon ghost (edit, duplicate, run history, delete)
4. Sentence: When trigger, and condition (Show condition), then action, each with an icon

**Content and behavior**

- Read as one sentence: When, and, Then
- The Switch turns it on or off without deleting it (Status=on, off)
- Show how often it ran and when last, so people trust it; failures say so in Meta
- Delete asks for confirmation; off keeps the history
- Name says the outcome ("Route large invoices to finance")
- Name up to 2 lines, meta 1 line; trigger, condition and action chips hug up to 240 and truncate; the sentence wraps

**Accessibility**

- The Switch is labelled with the rule name ("Route large invoices to finance, on")
- The sentence is real text; icons are decorative
- The menu button is labelled "More actions for Route large invoices to finance"

| Variant property | Values |
|---|---|
| Status | on, off |

| Property | Type | Default |
|---|---|---|
| Name | text | Route large invoices to finance |
| Meta | text | Ran 48 times this month · last run 2 h ago |
| Trigger | text | Invoice is received |
| Condition | text | Amount > EUR 10,000 |
| Action | text | Assign to Finance team |
| Show condition | boolean | true |

Built from: `Button Icon`, `Switch`. Icons: file-text, list-filter, user-check

Tokens and styles:
- Colors: `background/card`, `background/muted`, `border/default`, `foreground/card`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/1`, `spacing/1_5`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/5`
- Radius: `radius/lg`, `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [approvals](../../skills/build-ui/patterns/approvals.md), [settings-and-admin](../../skills/build-ui/patterns/settings-and-admin.md)

Code: custom card (name `line-clamp-2`, meta `truncate`; sentence `flex flex-wrap`; chips `max-w-60 truncate`)

## Workflow Node

Component set · 9 variants · default size 260 × 107

One step on an automation or approval canvas: trigger, condition (branches) or action. Type icon and label, Title and a one-line Detail, ports to connect steps. Click selects and opens settings in the side panel; error says in Detail what is missing. Steps run top to bottom; connect with 1.5 px border/default lines. Simple rules use Automation Rule.

**Use for**

- Automation builders with several steps and branches
- Approval chains with conditions
- Import or sync pipelines people configure

**Not for**

- One trigger and one action: use Automation Rule
- A linear list of steps people complete: use Stepper
- Approvers of one request: use Approval Step

**Anatomy**

1. Header: type icon and type name (Trigger, Condition, Action from Type), ellipsis menu icon
2. Body: Title (what happens) and Detail (one-line summary of the settings, or what is missing when State=error)
3. Port out (and in, except the trigger)

**Content and behavior**

- Steps run top to bottom; one trigger per workflow, at the top
- Connect with 1.5 px border/default lines; condition nodes branch to Yes and No
- Click selects (State=selected) and opens settings in the Side Panel
- State=error says what is missing in Detail ("Choose a recipient"); the workflow cannot be turned on with errors
- Detail summarizes the settings in one line

**Accessibility**

- Nodes are focusable in run order; Enter opens settings; Delete removes with Undo
- Every node and edge has a text label; a list view of the steps exists for screen readers
- Error is text in the node, not only a red border

| Variant property | Values |
|---|---|
| Type | trigger, condition, action |
| State | default, selected, error |

| Property | Type | Default |
|---|---|---|
| Title | text | Invoice is received |
| Detail | text | Finance workspace |

Icons: circle-alert, ellipsis, git-branch, user-check, zap

Tokens and styles:
- Colors: `background/card`, `background/default`, `background/destructive`, `background/info`, `background/success`, `background/warning`, `border/default`, `border/ring`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/lg`, `radius/sm`
- Text styles: `ui/caption`, `ui/label`
- Effects: `shadow/sm`

Guides: [approvals](../../skills/build-ui/patterns/approvals.md), [enterprise-apps](../../skills/build-ui/patterns/enterprise-apps.md)

Code: @xyflow/react custom node (`Handle` for ports), settings in shadcn `Sheet` (Edges 1.5 px `border/default`; keyboard and list view for steps)

## Mapping Row

Component set · 3 variants · default size 720 × 55

Maps one source column or field to a target field during import or sync setup. Source name with a sample value, arrow, target Select, status. Pre-fill obvious matches; unmapped fields are skipped and say so; errors explain the type clash. A summary above counts mapped, skipped and errors.

**Use for**

- Map columns step of a CSV or XLSX import
- Field mapping of an integration or sync
- Matching fields between two systems before a migration

**Not for**

- Moving items between two lists: use Transfer List
- Editing one value: use Field
- Comparing two versions: use Diff Viewer

**Anatomy**

1. Source: name and sample value ("e.g. 1,240.00")
2. Arrow-right
3. Target: Select
4. Status: circle-check (mapped), skipped (unmapped), error

**Content and behavior**

- Pre-fill obvious matches by name; the user confirms
- Unmapped fields are skipped and say so ("Will not be imported")
- Error explains the type clash ("Text cannot go into Amount")
- Required target fields must be mapped before Continue
- A summary above counts mapped, skipped and errors; save the mapping as a template

**Accessibility**

- The Select is labelled with the source name ("Map invoice_total to")
- Status is text or an icon with a label, never color alone
- Errors are linked with aria-describedby and listed in the summary

| Variant property | Values |
|---|---|
| Status | mapped, unmapped, error |

| Property | Type | Default |
|---|---|---|
| Source | text | invoice_total |
| Sample | text | e.g. 1,240.00 |

Built from: `Select`. Icons: arrow-right, circle-alert, circle-check, minus

Tokens and styles:
- Colors: `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/0_5`, `spacing/2`, `spacing/3`, `spacing/4`
- Text styles: `ui/caption`, `ui/label`

Guides: [approvals](../../skills/build-ui/patterns/approvals.md), [enterprise-apps](../../skills/build-ui/patterns/enterprise-apps.md)

Code: shadcn `Select` (or `Combobox`) + lucide `ArrowRight` + status `Badge`; react-hook-form `useFieldArray` (Auto-match by name; save the mapping as a template)
