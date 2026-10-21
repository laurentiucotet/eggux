# Progress

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Progress](#progress) | 20 | - |
| [Progress Ring](#progress-ring) | 15 | - |
| [Job Item](#job-item) | 3 | - |

On the Figma page: "Example / in onboarding checklist", "Example / uploads in progress", "Stress test / Job Item", "Stress test / Progress", "Stress test / Progress Ring"

## Progress

Component set · 20 variants · default size 320 × 8

Determinate progress (shadcn Progress): uploads, imports, multi-step completion. Indicator width = value; resize the indicator for other values. Show the number or "3 of 5" next to it. Unknown duration: use a Spinner or Skeleton instead. Tone: default, success (complete), warning (near a limit), error (failed); the text next to it says it too.

**Use for**

- Uploads, imports and exports of known size
- Completion of a profile or setup ("3 of 5")
- Bulk actions that run longer than ~2 s
- A value per row, inside Table Cell Progress

**Not for**

- Unknown duration under ~3 s: use Spinner
- Content loading: use Skeleton
- Steps people move through: use Stepper
- Picking a value: use Slider

**Anatomy**

1. Track: background/muted, radius/full
2. Indicator: background/primary, width = value
3. Value text next to it: percent or "3 of 5"
4. Tone: default, success, warning, error (indicator color)

**Content and behavior**

- Determinate only: the share must be known
- Always show the number or the remaining count next to the bar; never only color
- Value variants are 0, 25, 50, 75, 100; resize the indicator for other values
- Jobs over ~10 s run in the background, with a toast or notification when done
- Tone shows the outcome, not the amount: success when complete, warning near a limit, error when failed; the text says it too

**Accessibility**

- role="progressbar" with aria-valuenow, aria-valuemin and aria-valuemax
- The accessible name says what is progressing ("Uploading invoices.csv")
- Announce completion when it matters

| Variant property | Values |
|---|---|
| Tone | default, success, warning, error |
| Value | 0, 25, 50, 75, 100 |

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `background/primary`, `background/success`, `background/warning`
- Spacing and size: `spacing/2`
- Radius: `radius/full`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Slider`, `Progress`

## Progress Ring

Component set · 15 variants · default size 32 × 32

Circular progress for compact places: uploads in a list, profile or setup completion, a quota in a card. sm (32) has no label, so put the number next to it; default (48) and lg (80) show the percent inside. Same rules as Progress: known progress only; unknown duration uses Spinner.

**Use for**

- An upload in a list row
- Profile or setup completion in a card
- A quota next to its label

**Not for**

- Unknown duration: use Spinner
- Wide areas with room for a bar: use Progress

**Anatomy**

1. Track ring: background/muted
2. Progress arc: background/primary
3. Percent inside for default and lg (Show label)
4. Number next to the ring for sm

**Content and behavior**

- Known progress only; unknown duration uses Spinner
- sm (32) has no label: put the number next to it
- default (48) and lg (80) show the percent inside
- Value variants are 0, 25, 50, 75, 100
- Color is never the only signal

**Accessibility**

- role="progressbar" with aria-valuenow, aria-valuemin and aria-valuemax
- The accessible name says what it measures ("Setup 75% complete")
- Label text meets 4.5:1 contrast

| Variant property | Values |
|---|---|
| Size | sm, default, lg |
| Value | 0, 25, 50, 75, 100 |

| Property | Type | Default |
|---|---|---|
| Show label | boolean | true |

Tokens and styles:
- Colors: `background/muted`, `background/primary`, `foreground/default`
- Spacing and size: `spacing/12`, `spacing/20`, `spacing/8`
- Text styles: `heading/h4`, `ui/label-small`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md)

Code: SVG circle with `stroke-dasharray` (or Radix Progress) (`role="progressbar"`, `aria-valuenow`)

## Job Item

Component set · 3 variants · default size 400 × 82

A task that runs in the background (export, import, bulk send, report): name, progress with count and time left, cancel; done offers the result (Download); failed says where it stopped and offers Retry. Stacked in a panel or a corner; people keep working. A notification when it finishes if they left the page.

**Use for**

- Exports and imports that take more than about 10 seconds
- Bulk actions on many records
- Reports the server builds

**Not for**

- Short reloads of a region: use Loading Overlay
- A file the person uploads: use File Item
- A short note that something started: use Toast
- A goal against a target: use Progress Card

**Anatomy**

1. Icon tile: what the job does (download, upload, send)
2. Title: ui/label, the job and format ("Export invoices (CSV)")
3. Progress bar (State=running)
4. Status: count and time left, the result, or where it failed; body/small, muted
5. Action: Cancel Button Icon while running; Download when done; Retry when failed

**Content and behavior**

- Running shows count and time left ("1,240 of 3,000 · about 2 min left"); an indeterminate bar when the total is unknown
- Done offers the result (Download) and stays until dismissed
- Failed says where it stopped ("Stopped at row 1,241: invalid date") and offers Retry
- Stack jobs in a panel or a corner, newest on top; people keep working
- Notify when it finishes if they left the page

**Accessibility**

- The bar has role="progressbar" with aria-valuenow and aria-valuetext ("1,240 of 3,000")
- Done and failed are announced in a polite live region ("Export ready")
- Cancel is named with the job ("Cancel export invoices"); failed status is text plus an icon

| Variant property | Values |
|---|---|
| State | running, done, failed |

| Property | Type | Default |
|---|---|---|
| Title | text | Export invoices (CSV) |

Built from: `Button`, `Button Icon`, `Progress`. Icons: circle-alert, circle-check, download

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `background/muted`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [loading-states](../../skills/build-ui/patterns/loading-states.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: custom row: shadcn `Progress` + `Button` (Status by polling or server-sent events; notify when done)
