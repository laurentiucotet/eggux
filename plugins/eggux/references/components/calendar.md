# Calendar

Generated from the EGG UI master library on 2026-10-21 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Calendar Day](#calendar-day) | 10 | - |
| [Calendar](#calendar) | 1 | - |
| [Date Picker](#date-picker) | 8 | - |
| [Time Picker](#time-picker) | 8 | - |
| [Date Range Picker](#date-range-picker) | 1 | Presets |

On the Figma page: "Example / date and time", "Example / date picker open", "Example / date range", "Example / date range filter", "Example / time picker open"

## Calendar Day

Component set · 10 variants · default size 32 × 32

One day cell, 32 x 32. today = accent, selected and range ends = primary, range-middle = accent without radius, outside = days of the adjacent months (muted).

| Variant property | Values |
|---|---|
| State | default, hover, focus, today, selected, outside, disabled, range-start, range-middle, range-end |

| Property | Type | Default |
|---|---|---|
| Day | text | 19 |

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `foreground/accent`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/8`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

## Calendar

Component · 1 variant · default size 250 × 294

Month view (shadcn Calendar / react-day-picker). Week starts Monday (ro-RO). Set each Calendar Day state in the instance: today, selected, range, outside, disabled (past or unavailable dates). Two months side by side for ranges.

| Property | Type | Default |
|---|---|---|
| Month | text | October 2026 |

Built from: `Button Icon`, `Calendar Day`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md), [date-picker](../../skills/build-ui/components/date-picker.md)

Code: shadcn `Calendar` (react-day-picker) in `Popover`

## Date Picker

Component set · 8 variants · default size 240 × 36

Date field that opens a Calendar in a Popover (shadcn Date Picker). Value format: "22 Oct 2026" (ro-RO: "22 oct. 2026"). For birth dates or dates far away, let users type (Input with mask dd.mm.yyyy) instead of clicking through months.

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Pick a date |

Icons: calendar

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: shadcn `Calendar` (react-day-picker) in `Popover`

## Time Picker

Component set · 8 variants · default size 160 × 36

Time field (24 h, ro-RO "10:30"). Opens a list of times in fixed steps (15 or 30 min) when only some times are valid (appointments); allow typing hh:mm when any minute is valid. Pair with Date Picker for date + time.

| Variant property | Values |
|---|---|
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select time |

Icons: clock

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: custom `Select` of times

## Date Range Picker

Component · 1 variant · default size 658 × 355

Date range popover for filters and reports: presets, two months (previous + current), summary with the number of days, Cancel / Apply. Future days disabled for past-data reports. Mobile: one month, full-screen Drawer.

| Property | Type | Default |
|---|---|---|
| Summary | text | 6 Oct - 19 Oct 2026 · 14 days |
| Show presets | boolean | true |

Slots (fill them in the instance, never detach): `Presets`

Built from: `Button`, `Calendar`, `Menu Item`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`, `spacing/40`
- Radius: `radius/md`
- Text styles: `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: shadcn `Calendar` (react-day-picker) in `Popover`
