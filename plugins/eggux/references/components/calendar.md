# Calendar

Generated from the EGG UI master library on 2026-10-27 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Calendar](#calendar) | 1 | - |
| [Calendar Day](#calendar-day) | 10 | - |
| [Date Picker](#date-picker) | 8 | - |
| [Time Picker](#time-picker) | 8 | - |
| [Date Range Picker](#date-range-picker) | 1 | Presets |

On the Figma page: "Example / date and time", "Example / date picker open", "Example / date range", "Example / date range filter", "Example / time picker open", "Stress test / Calendar", "Stress test / Date Picker", "Stress test / Date Range Picker", "Stress test / Time Picker"

## Calendar

Component · 1 variant · default size 250 × 294

Month view (shadcn Calendar / react-day-picker). Week starts Monday (ro-RO). Set each Calendar Day state in the instance: today, selected, range, outside, disabled (past or unavailable dates). Two months side by side for ranges.


Needs at least 250 wide (seven 32 px day cells). It fits every column from 1/4 (276) up; below that use Date Input.

**Use for**

- Inside a Popover for Date Picker
- Inline for bookings with availability, with time slots next to it
- Two months side by side for ranges on desktop
- A small month with event dots on mobile schedules

**Not for**

- Far-away dates known by heart (birth date, document expiry): use a text Input with a date mask
- Planning many events: use the scheduler month view

**Anatomy**

1. Month
2. Previous and next Button Icons (ghost)
3. Weekday header
4. Grid of Calendar Days: today, selected, range, outside, disabled

**Content and behavior**

- Today is always marked (State=today)
- Week start follows the locale: Monday in most of Europe
- Unavailable dates are disabled with the reason nearby ("Closed on Sundays")
- Days of adjacent months use State=outside (muted)
- Ranges use range-start, range-middle and range-end
- Needs at least 250 wide (seven 32 px day cells, minWidth 250); fits every column from 1/4 (276) up, below that use Date Input
- Month label: 1 line with ellipsis, centered between the arrows

**Accessibility**

- Arrows move by day, PageUp/PageDown by month, Enter selects, Esc closes
- Each day has a full date label ("Thursday, 22 October 2026")
- Today and selected are not color alone (aria-current, aria-selected)
- The focused day shows the focus ring (State=focus)

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

Code: shadcn `Calendar` (react-day-picker) in `Popover`

## Date Picker

Component set · 8 variants · default size 240 × 36

Date field that opens a Calendar in a Popover (shadcn Date Picker). Value format: "22 Oct 2026" (ro-RO: "22 oct. 2026"). For birth dates or dates far away, let users type (Input with mask dd.mm.yyyy) instead of clicking through months.

**Use for**

- Dates in the near future or past: due dates, deadlines, filters, bookings
- Due dates on invoices and tasks
- Single-date filters in a list or report

**Not for**

- Birth dates and far-away dates: use a text Input with a mask and an optional calendar button
- A period: use Date Range Picker
- A time: add a Time Picker next to it

**Anatomy**

1. Value or placeholder ("Pick a date")
2. Calendar icon
3. Calendar in a Popover, 4 px below, shadow/md (open state)

**Content and behavior**

- Format follows the locale ("22 Oct 2026")
- Typing works as well as clicking; validate on blur with a format hint
- State=error shows the message under the field; never clear what was typed
- Today is marked; unavailable dates are disabled with the reason

**Accessibility**

- The field has a visible label, read together with the value
- Opening moves focus to the selected day or today; Esc closes and returns focus
- Arrows move by day, PageUp/PageDown by month, Enter selects

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
- Radius: `input/radius`
- Text styles: `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: shadcn `Calendar` (react-day-picker) in `Popover`

## Time Picker

Component set · 8 variants · default size 160 × 36

Time field (24 h, ro-RO "10:30"). Opens a list of times in fixed steps (15 or 30 min) when only some times are valid (appointments); allow typing hh:mm when any minute is valid. Pair with Date Picker for date + time.

**Use for**

- Bookings where only some times are valid: steps of 15 or 30 min
- Logs and reminders where any minute is valid: typing hh:mm
- Next to a Date Picker for date + time

**Not for**

- Booking with availability across days: use Calendar with time slots
- A date only: use Date Picker

**Anatomy**

1. Value or placeholder ("Select time")
2. Clock icon
3. Menu of times, Checked on the selected one (open state)

**Content and behavior**

- Format follows the locale: 24 h in most of Europe ("10:30"), 12 h in the US ("10:30 AM")
- Steps of 15 or 30 min for bookings
- Unavailable times are disabled in the list, not removed, when users expect them
- Date + time: Date Picker and Time Picker side by side

**Accessibility**

- The field has a visible label
- Arrow keys move in the list, Enter selects, Esc closes and returns focus
- Disabled times are announced as unavailable

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
- Radius: `input/radius`
- Text styles: `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: custom `Select` of times

## Date Range Picker

Component · 1 variant · default size 662 × 355

Date range popover for filters and reports: presets, two months (previous + current), summary with the number of days, Cancel / Apply. Future days disabled for past-data reports. Mobile: one month, full-screen Drawer.


Needs at least 658 wide (presets and two months). In a 1/2 column, a sidebar or on mobile use a Popover with one Calendar and the presets as a Select, or two Date Inputs.

**Use for**

- Date filters on lists and data grids
- Report periods (Last 30 days, This month)
- Comparing periods in dashboards

**Not for**

- A single date: use Date Picker
- Bookings with availability: use Calendar with time slots

**Anatomy**

1. Presets slot: Today, Last 7 / 14 / 30 days, This month, Last month, This year, Custom (Show presets)
2. Two Calendars: previous and current month
3. Summary: dates and number of days
4. Cancel and Apply Buttons

**Content and behavior**

- Presets first, then the calendars
- The trigger shows the preset name and the dates ("Last 14 days: 6 - 19 Oct")
- Summary counts the days ("6 Oct - 19 Oct 2026 · 14 days")
- Future dates disabled for reports on past data; past dates disabled for bookings
- Mobile: one month in a full-height Drawer, presets as chips above
- Needs at least 658 wide (presets plus two months, minWidth 658); in a 1/2 column, a sidebar or on mobile use one Calendar in a Popover with the presets as a Select, or two Date Inputs

**Accessibility**

- Focus moves into the popover on open; Esc closes and returns focus to the trigger
- Presets are buttons reachable before the calendars
- The selected range is announced with its length

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
