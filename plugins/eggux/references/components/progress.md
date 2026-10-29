# Progress

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Progress](#progress) | 179 | Segments |
| [Progress Segment](#progress-segment) | 8 | - |
| [Progress Ring](#progress-ring) | 15 | - |
| [Background Job](#background-job) | 3 | - |
| [Top Loading Bar](#top-loading-bar) | 4 | - |

On the Figma page: "Example / Progress styles", "Example / Top Loading Bar", "Example / exports panel from the top bar", "Example / uploads in progress", "Stress test / Background Job", "Stress test / Progress", "Stress test / Progress Ring", "Stress test / Top Loading Bar"

## Progress

Component set · 179 variants · default size 320 × 8

Progress bar (shadcn Progress) for work with a known share: uploads, imports, multi-step completion. Value sets the indicator width: 0 to 100 in steps of 10, plus 25 and 75 (Type=default; segmented uses 0, 25, 50, 75, 100). Pick the nearest step to the real number. Tone: default, success (complete), warning (near a limit), error (failed); the text next to it says it too.


Type: default (continuous bar for a share of work: uploads, imports, quotas), segmented (one segment per step for a count of steps: onboarding, setup checklists, a multi-step form on mobile). Segmented holds Progress Segment instances in the Segments slot.


Size (Type=default): default 8 px, sm 4 px (inside File Item, Toast, table rows and dense cards), lg 12 px (a single key bar on a page, Usage Meter heroes). Show label adds a row above the bar with Label (what is progressing, 1 line) and the value text on the right ("40%", edit it to "3 of 5" or "2 min left"). Value=indeterminate: a 40% segment that moves in code, for work with an unknown total (a Background Job before it counts, a sync); Tone=default only and no value text.


Unknown duration under ~3 s: use a Spinner; content loading: use Skeleton.


Usage: eggux build-ui/components/progress-and-slider.md

**Use for**

- Uploads, imports and exports of known size
- Completion of a profile or setup ("3 of 5")
- Bulk actions that run longer than ~2 s
- A value per row, inside Table Cell Progress
- Type=segmented: a count of steps (onboarding, setup checklist, a multi-step form on mobile), 4 to 10 segments
- Size=sm inside File Item, Toast, table rows and dense cards; Size=lg for one key bar on a page
- Show label when the bar has no label nearby: Label left, value text right
- Value=indeterminate when the total is not known yet (a sync, a job before it counts)

**Not for**

- Content loading: use Skeleton
- Steps people move through: use Stepper
- Picking a value: use Slider
- A circular indicator: use Progress Ring
- Unknown duration under ~3 s: use Spinner

**Anatomy**

1. Label row (Show label): Label (ui/label, 1 line, Label) and value text (body/small, foreground/muted; edit it to "3 of 5" or "2 min left")
2. Track: background/muted, radius/full; height by Size: sm 4, default 8, lg 12
3. Indicator: background/primary (Tone colors), width = Value (0 to 100 by 10, plus 25 and 75)
4. Value=indeterminate: a 40% segment (moves in code), no value text; Tone=default only
5. Tone: default, success, warning, error (indicator color)
6. Type=segmented: Segments (native slot) with Progress Segment instances (State complete or upcoming, Tone), 4 px gap, each FILL width; Size default only, no label row

**Content and behavior**

- Always show the number or the remaining count next to the bar; never only color
- Value variants (Type=default): 0 to 100 in steps of 10, plus 25 and 75; pick the nearest step to the real share
- Jobs over ~10 s run in the background, with a toast or notification when done
- Tone shows the outcome, not the amount: success when complete, warning near a limit, error when failed; the text says it too
- Type=segmented: one segment per step; Value sets 0 to 4 of 4 complete, add or remove segments for 4 to 10 steps and set each State
- Segmented progress still shows the count in text ("Step 2 of 4")
- Determinate whenever the share is known; Value=indeterminate only until it is
- Show label: Label says what is progressing ("Uploading invoices.csv"), 1 line with ellipsis; the value text hugs and never wraps
- FILL the column; the track and indicator follow the width (indicator scales); label row min 160 for the label

**Accessibility**

- role="progressbar" with aria-valuenow, aria-valuemin and aria-valuemax
- The accessible name says what is progressing ("Uploading invoices.csv")
- Announce completion when it matters
- Indeterminate: role="progressbar" without aria-valuenow, with aria-busy on the region

| Variant property | Values |
|---|---|
| Tone | default, success, warning, error |
| Value | 0, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100, indeterminate |
| Type | default, segmented |
| Size | default, sm, lg |

| Property | Type | Default |
|---|---|---|
| Show label | boolean | false |
| Label | text | Uploading invoices.csv |

Slots (fill them in the instance, never detach): `Segments`

Built from: `Progress Segment`

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `background/primary`, `background/success`, `background/warning`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/full`
- Text styles: `body/small`, `ui/label`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md), [bulk-actions](../../skills/build-ui/patterns/bulk-actions.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: shadcn `Slider`, `Progress` (Slider Value (0, 25, 50, 75, 100) = `value` as a percent of `max`. Progress Value (Type=default): 0 to 100 in steps of 10, plus 25 and 75 = `value`)

## Progress Segment

Component set · 8 variants · default size 64 × 8

One segment of Progress Type=segmented. State: complete (Tone color) or upcoming (background/muted). Used only inside the Segments slot of Progress; set FILL width so segments share the track. Usage: eggux build-ui/components/progress-and-slider.md

| Variant property | Values |
|---|---|
| State | complete, upcoming |
| Tone | default, success, warning, error |

Tokens and styles:
- Colors: `background/destructive`, `background/muted`, `background/primary`, `background/success`, `background/warning`
- Spacing and size: `spacing/2`
- Radius: `radius/full`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md)

Code: `<div class="flex gap-1" role="progressbar" aria-valuenow={done} aria-valuemax={total}>` of `total` × `<div class="h-2 flex-1 rounded-full bg-primary">` (complete; `bg-success`, `bg-warning`, `bg-destructive` by tone) or `bg-muted` (upcoming) (4 to 10 segments; label "Step 2 of 4" next to it. Circular progress is `Progress Ring`)

## Progress Ring

Component set · 15 variants · default size 48 × 48

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

## Background Job

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
4. Status (State=running): count and time left; Result (State=done): what is ready; Error (State=error): where it failed; body/small, muted
5. Action: Cancel Button Icon while running; Download when done; Retry when failed

**Content and behavior**

- Status, Result and Error are separate texts for the three States, so switching State never shows the wrong line
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
| State | running, done, error |

| Property | Type | Default |
|---|---|---|
| Title | text | Export invoices (CSV) |
| Status | text | 640 of 1,284 · about 1 min left |
| Result | text | 1,284 invoices · 2.4 MB · Ready |
| Error | text | Stopped at 640 of 1,284. Connection lost. |

Built from: `Button`, `Button Icon`, `Progress`. Icons: circle-alert, circle-check, download

Tokens and styles:
- Colors: `background/card`, `background/destructive`, `background/muted`, `border/default`, `foreground/card`, `foreground/muted`
- Spacing and size: `spacing/1_5`, `spacing/3`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [loading-states](../../skills/build-ui/patterns/loading-states.md), [notifications](../../skills/build-ui/patterns/notifications.md)

Code: custom row: shadcn `Progress` + `Button` (Status by polling or server-sent events; notify when done)

## Top Loading Bar

Component set · 4 variants · default size 720 × 2

A thin bar (2 px, background/primary) along the top edge of the page or of a region while a route, a page change or an in-place AI generation loads (Polaris Loading, NProgress). Value: indeterminate (default: a 40% segment that moves in code, for loads with an unknown end), 30, 60, 90 (determinate steps for uploads or a reading progress bar). Show track adds the background/muted rail (reading progress); route loads have no track. Put it FILL at the very top of Page Shell, Top Bar or the region, above everything, and remove it when the load ends; never show it for loads under about 300 ms. Long or blocking work uses Progress with a label; content loading uses Skeleton.


Resize: fills any width; the indicator scales with it.


Usage: eggux build-ui/components/progress-and-slider.md

**Use for**

- Route and page changes in Page Shell / App and Docs
- In-place AI generation or refresh of a region
- Reading progress on an article (Value with Show track)

**Not for**

- Loads under about 300 ms: show nothing
- Long or blocking work: Progress with a label or Background Job
- Content loading: Skeleton
- A button action: Button State=loading

**Anatomy**

1. Indicator: background/primary, 2 px high (spacing/0_5)
2. Value: indeterminate (40% segment that moves in code), 30, 60, 90
3. Track (Show track): background/muted rail, off for route loads

**Content and behavior**

- Put it FILL at the very top edge of the shell, Top Bar or region, above everything
- Remove it when the load ends; complete to 100% then fade
- One bar per page
- Resize: fills any width; the indicator scales with it

**Accessibility**

- role="progressbar" with aria-label "Loading page"; indeterminate omits aria-valuenow
- Set aria-busy="true" on the region that loads
- motion-reduce: no sliding animation, show a static segment

| Variant property | Values |
|---|---|
| Value | indeterminate, 30, 60, 90 |

| Property | Type | Default |
|---|---|---|
| Show track | boolean | false |

Tokens and styles:
- Colors: `background/muted`, `background/primary`
- Spacing and size: `spacing/0_5`

Guides: [progress-and-slider](../../skills/build-ui/components/progress-and-slider.md), [loading-states](../../skills/build-ui/patterns/loading-states.md)

Code: custom `<div role="progressbar" aria-label="Loading page" className="fixed inset-x-0 top-0 z-50 h-0.5">` with indicator `h-full bg-primary` (indeterminate `w-2/5 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]`, determinate `style={{ width: `${value}%` }} transition-[width]`), track `bg-muted` when Show track (Driven by the router loading state (Next.js `loading`/`useLinkStatus`, NProgress); `motion-reduce:animate-none`; skip for loads under 300 ms)
