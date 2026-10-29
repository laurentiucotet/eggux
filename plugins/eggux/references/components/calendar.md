# Calendar

Generated from the EGG UI master library on 2026-10-29 by `scripts/component-docs.js` and
`scripts/component-docs.py`. Do not edit by hand: change the component in Figma, then regenerate.
Usage rules live in the guides linked under each component.

| Component | Variants | Slots |
|---|---|---|
| [Calendar Day](#calendar-day) | 11 | - |
| [Calendar](#calendar) | 4 | - |
| [Date Picker](#date-picker) | 60 | - |
| [Time Picker](#time-picker) | 48 | - |
| [Date Range Picker](#date-range-picker) | 1 | Presets |
| [Date Time Picker](#date-time-picker) | 1 | Times |
| [Month Picker](#month-picker) | 3 | - |
| [Month Picker Cell](#month-picker-cell) | 6 | - |

On the Figma page: "Example / Availability time ranges", "Example / Calendar options", "Example / Date Picker styles", "Example / Date Time Picker", "Example / Date range filter", "Example / Month Picker", "Example / Time Picker styles", "Example / date and time", "Example / date picker open", "Example / date range", "Example / date range filter", "Example / time picker open", "Stress test / Calendar", "Stress test / Date Picker", "Stress test / Date Range Picker", "Stress test / Date Time Picker", "Stress test / Month Picker", "Stress test / Time Picker"

## Calendar Day

Component set · 11 variants · default size 32 × 32

One day cell, 32 x 32. today = accent, selected and range ends = primary, range-middle = accent without radius, outside = days of the adjacent months (muted).


Show dot: a 4 px dot under the number for days with events (Agenda and Scheduler mini calendars). Show note: a short line under the number (Note: a price "€89" or "3 left") for booking; the cell grows to 36. Use dot or note, not both. State=booked: taken or sold out, muted with a strike line; it cannot be picked, unlike outside days.

| Variant property | Values |
|---|---|
| State | default, hover, focus, today, selected, outside, disabled, range-start, range-middle, range-end, booked |

| Property | Type | Default |
|---|---|---|
| Day | text | 19 |
| Show dot | boolean | false |
| Show note | boolean | false |
| Note | text | €89 |

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `foreground/accent`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/1`, `spacing/8`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/caption`, `ui/label`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: shadcn `Calendar` (react-day-picker) in `Popover`

## Calendar

Component set · 4 variants · default size 250 × 294

Month view (shadcn Calendar / react-day-picker). Week starts Monday (ro-RO). Set each Calendar Day state in the instance: today, selected, range, outside, disabled (past or unavailable dates). Two months side by side for ranges.


Needs at least 250 wide (seven 32 px day cells). It fits every column from 1/4 (276) up; below that use Date Input.


Caption: label shows the month name between the arrows; dropdown shows month and year Selects (ghost, sm) for dates far away (date of birth, expiry) and year jumps. Months: 1, or 2 side by side for ranges and booking on desktop (Second month text; arrows on the outer edges). Show week numbers adds an ISO week column for week-based planning.


Usage: eggux build-ui/components/date-picker.md

**Use for**

- Inside a Popover for Date Picker
- Inline for bookings with availability, with time slots next to it
- Two months side by side for ranges on desktop
- A small month with event dots on mobile schedules
- Caption=dropdown: dates far away (date of birth with a calendar, expiry) and year jumps
- Months=2: ranges and booking on desktop
- Show week numbers: week-based planning (sprints, shifts, payroll weeks)
- Calendar Day Show note: prices or places left in booking; Show dot: days with events in Agenda and Scheduler mini calendars

**Not for**

- Far-away dates known by heart (birth date, document expiry): use Date Input; Caption=dropdown when a calendar is still wanted
- Planning many events: use the scheduler month view
- Picking a month, quarter or year: use Month Picker

**Anatomy**

1. Caption: label (Month between the arrows) or dropdown (month and year Selects, ghost sm)
2. Months: 1, or 2 side by side (Second month; previous arrow on the first, next on the second)
3. Previous and next Button Icons (ghost)
4. Week numbers (Show week numbers): ISO week column, muted caption
5. Weekday header
6. Grid of Calendar Days: State default, hover, focus, today, selected, outside, disabled, range-start, range-middle, range-end, booked; Show dot; Show note + Note

**Content and behavior**

- Today is always marked (State=today)
- Week start follows the locale: Monday in most of Europe
- Unavailable dates are disabled with the reason nearby ("Closed on Sundays")
- Days of adjacent months use State=outside (muted)
- Ranges use range-start, range-middle and range-end
- Needs at least 250 wide (seven 32 px day cells, minWidth 250); fits every column from 1/4 (276) up, below that use Date Input
- Month label: 1 line with ellipsis, centered between the arrows
- Calendar Day: dot or note, not both; notes are 4 characters or fewer ("€89", "Full"); rows with notes grow to 36
- Booked days (taken, sold out) stay visible with a strike line and cannot be picked; disabled is for days outside the allowed range
- Months=2 needs at least 500 wide (minWidth from two grids); below that use Months=1
- Show week numbers adds 32 (282 wide)

**Accessibility**

- Arrows move by day, PageUp/PageDown by month, Enter selects, Esc closes
- Each day has a full date label ("Thursday, 22 October 2026")
- Today and selected are not color alone (aria-current, aria-selected)
- The focused day shows the focus ring (State=focus)
- Booked days are announced as unavailable ("24 October, booked"); notes are part of the day label ("21 October, 79 euros")
- Dropdowns are labelled Month and Year

| Variant property | Values |
|---|---|
| Caption | label, dropdown |
| Months | 1, 2 |

| Property | Type | Default |
|---|---|---|
| Month | text | October 2026 |
| Second month | text | November 2026 |
| Show week numbers | boolean | false |

Built from: `Button Icon`, `Calendar Day`, `Select`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/1`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/6`, `spacing/8`
- Radius: `radius/md`
- Text styles: `ui/caption`, `ui/label`

Guides: [boards-and-calendars](../../skills/build-ui/components/boards-and-calendars.md), [date-picker](../../skills/build-ui/components/date-picker.md)

Code: shadcn `Calendar` (react-day-picker) in `Popover`

## Date Picker

Component set · 60 variants · default size 240 × 36

Date field that opens a Calendar in a Popover (shadcn Date Picker). Value format: "22 Oct 2026" (ro-RO: "22 oct. 2026"). For birth dates or dates far away, let users type (Input with mask dd.mm.yyyy) instead of clicking through months.


Size: default 36, sm 32 (report and filter bars), lg 40 (booking and mobile forms). State=read-only: muted fill, full-contrast value, the calendar icon stays as a cue but nothing opens.


Type: single picks one day ("Pick a date"); range is the trigger of Date Range Picker and shows the period ("1 Oct to 31 Oct 2026", Range text). Use range for report periods, filters and stays; it opens Date Range Picker, or one Calendar with range days on narrow screens.


Usage: eggux build-ui/components/date-picker.md

**Use for**

- Dates in the near future or past: due dates, deadlines, filters, bookings
- Due dates on invoices and tasks
- Single-date filters in a list or report
- Type=range: report periods, dashboard and Audit Log filters, stays and bookings ("1 Oct to 31 Oct 2026")
- As the trigger of Month Picker ("October 2026", "Q3 2026") and Date Time Picker ("22 Oct 2026, 14:30")

**Not for**

- Birth dates and far-away dates: use a text Input with a mask and an optional calendar button
- A time: add a Time Picker next to it
- A period with presets and two months open by default on a phone: use one Calendar in a Drawer

**Anatomy**

1. Type: single (Value, "Pick a date") or range (Range, "1 Oct to 31 Oct 2026"; truncates to 1 line)
2. Size: default 36, sm 32, lg 40; State: default, focus, error, disabled, read-only; Content: placeholder, filled
3. Calendar icon
4. Open: Calendar in a Popover, 4 px below, shadow/md; range opens Date Range Picker; date and time opens Date Time Picker

**Content and behavior**

- Format follows the locale ("22 Oct 2026")
- Typing works as well as clicking; validate on blur with a format hint
- State=error shows the message under the field; never clear what was typed
- Today is marked; unavailable dates are disabled with the reason
- State: default, focus, error, disabled, read-only; Size: default, sm, lg
- sm in report and filter bars; lg in booking and mobile forms
- Resize: the value fills and truncates; the icon keeps its size
- Range format: "6 Oct to 19 Oct 2026" (one year at the end when both dates share it); a preset name may lead ("Last 14 days: 6 Oct to 19 Oct")
- Resize: the value truncates to 1 line with an ellipsis; a full range needs about 240 (lg 280); the icon keeps its size

**Accessibility**

- The field has a visible label, read together with the value
- Opening moves focus to the selected day or today; Esc closes and returns focus
- Arrows move by day, PageUp/PageDown by month, Enter selects
- Range: the trigger is read as "Period, 6 October to 19 October 2026"; the panel announces the length

| Variant property | Values |
|---|---|
| Type | range, single |
| Size | default, sm, lg |
| State | default, focus, error, disabled, read-only |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Pick a date |
| Range | text | 1 Oct to 31 Oct 2026 |

Icons: calendar

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `background/muted`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`, `input/filled-muted-foreground`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `input/radius`
- Text styles: `body/default`, `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md), [input](../../skills/build-ui/components/input.md)

Code: shadcn `Calendar` (react-day-picker) in `Popover`

## Time Picker

Component set · 48 variants · default size 160 × 36

Time field (24 h, ro-RO "10:30"). Opens a list of times in fixed steps (15 or 30 min) when only some times are valid (appointments); allow typing hh:mm when any minute is valid. Pair with Date Picker for date + time.


Size: default 36, sm 32, lg 40; match the Date Picker beside it.


Type: single is one time; range is a start and an end ("09:00 to 10:30", Range text) with the duration after it in muted text (Duration, Show duration). Range is 240 wide (lg 280). Use it for availability, shifts, meetings and bookings; the open state shows two time lists (start, end) and ends only after the start.


Usage: eggux build-ui/components/date-picker.md

**Use for**

- Bookings where only some times are valid: steps of 15 or 30 min
- Logs and reminders where any minute is valid: typing hh:mm
- Next to a Date Picker for date + time
- Type=range: availability rows, shifts, meetings and bookings ("09:00 to 10:30" and "1 h 30 min")

**Not for**

- Booking with availability across days: use Calendar with time slots
- A date only: use Date Picker

**Anatomy**

1. Type: single (Value, "Select time") or range (Range "09:00 to 10:30"; Duration "1 h 30 min", Show duration)
2. Size: default 36, sm 32, lg 40; State: default, focus, error, disabled; Content: placeholder, filled
3. Clock icon
4. Menu of times, Checked on the selected one (open state); range opens two lists, start and end

**Content and behavior**

- Format follows the locale: 24 h in most of Europe ("10:30"), 12 h in the US ("10:30 AM")
- Steps of 15 or 30 min for bookings
- Unavailable times are disabled in the list, not removed, when users expect them
- Date + time: Date Picker and Time Picker side by side
- Size: default, sm, lg; match the Date Picker beside it
- Range: the end is after the start; the end list starts at the start time and shows the duration next to each time
- Resize: range is 240 (lg 280) with minWidth 220; the range text truncates first, the duration keeps its width

**Accessibility**

- The field has a visible label
- Arrow keys move in the list, Enter selects, Esc closes and returns focus
- Disabled times are announced as unavailable
- Range is two fields for assistive tech: Start time and End time; the duration is read after them

| Variant property | Values |
|---|---|
| Type | range, single |
| Size | default, sm, lg |
| State | default, focus, error, disabled |
| Content | placeholder, filled |

| Property | Type | Default |
|---|---|---|
| Value | text | Select time |
| Range | text | 09:00 to 10:30 |
| Duration | text | 1 h 30 min |
| Show duration | boolean | true |

Icons: clock

Tokens and styles:
- Colors: `background/default`, `background/destructive`, `border/input`, `border/ring`, `foreground/default`, `foreground/muted`
- Spacing and size: `density/control-height`, `spacing/10`, `spacing/2`, `spacing/3`, `spacing/4`, `spacing/8`
- Radius: `input/radius`
- Text styles: `body/default`, `body/small`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md), [input](../../skills/build-ui/components/input.md)

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

## Date Time Picker

Component · 1 variant · default size 373 × 351

Pick a date and a time in one popover: Calendar (exposed) and a scrolling column of Time Slots (Times slot, steps of 15 or 30 min, unavailable times disabled), with the summary ("22 Oct 2026, 14:30") and Cancel / Apply in the footer (Show footer). The trigger is a Date Picker whose value shows date and time together. For scheduling a post, a reminder or a send time, meetings and automation triggers. Needs about 400 wide; on phones use a Drawer with the Calendar and a Time Picker under it.


Usage: eggux build-ui/components/date-picker.md

**Use for**

- Scheduling a post, an email or a reminder
- Meeting create in Scheduler blocks and booking
- Background Job schedules and Automation Rule triggers

**Not for**

- Only a date: use Date Picker
- Only a time, or a time range: use Time Picker
- Booking with availability across days: Calendar with Time Slots on the page
- Recurring schedules: use Recurrence Picker

**Anatomy**

1. Calendar (exposed): Caption and Months as in Calendar
2. Divider
3. Times: title "Time" and a scrolling viewport with the Times slot (Time Slots, 30 min steps; selected, disabled)
4. Footer (Show footer): Summary ("22 Oct 2026, 14:30"), Cancel and Apply Buttons
5. Trigger: Date Picker Type=single whose value shows date and time ("22 Oct 2026, 14:30")

**Content and behavior**

- Times follow the locale (24 h in most of Europe) and show the time zone under the field when it can differ
- Scroll the selected time into view on open
- Unavailable times stay in the list, disabled
- Apply commits both values; without the footer a pick commits at once
- Resize: fixed 373 wide (Calendar 250, times 96); on phones use a Drawer with Calendar and a Time Picker below; the viewport clips on purpose (scroll area)

**Accessibility**

- Focus moves to the selected day on open; Tab moves to the time list, arrows move in it, Enter picks
- The summary is a live region so the new value is announced
- Esc closes and returns focus to the trigger

| Property | Type | Default |
|---|---|---|
| Summary | text | 22 Oct 2026, 14:30 |
| Show footer | boolean | true |

Slots (fill them in the instance, never detach): `Times`

Built from: `Button`, `Calendar`, `Time Slot`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`, `foreground/muted`
- Spacing and size: `spacing/1`, `spacing/2`, `spacing/3`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: `Popover` with `Calendar mode="single"` + `ScrollArea className="h-[246px] w-24"` of time `Button`s (`variant={selected ? "default" : "outline"}`), footer `Button variant="outline"` Cancel and Apply (Value is one `Date`; scroll the selected time into view on open; Drawer on phones)

## Month Picker

Component set · 3 variants · default size 250 × 262

Pick a period instead of a day: a month (Type=month, 3 x 4 grid), a quarter (Type=quarter, Q1 to Q4) or a year (Type=year, 12 years). Arrows move by year (or 12 years); Period shows the year, Decade the year range. Month Picker Cells: current marks this period, selected the pick, disabled periods outside the data. Opens from a Date Picker showing "October 2026" or "Q3 2026" for report and dashboard periods, billing statements and card expiry. Needs 250 wide (minWidth 250); cells fill when it stretches.


Usage: eggux build-ui/components/date-picker.md

**Use for**

- Report and dashboard periods (Finance Dashboard, Report)
- Billing statements and invoices by month
- Card expiry and the year jump of a Calendar

**Not for**

- A day: use Calendar or Date Picker
- A custom period: use Date Range Picker
- A short fixed list (This month, Last month): use Select

**Anatomy**

1. Type: month (3 x 4), quarter (Q1 to Q4, 2 x 2), year (12 years, 3 x 4)
2. Caption: previous and next Button Icons and Period ("2026") or Decade ("2020 to 2031")
3. Month Picker Cells: Label; State default, hover, focus, current, selected, disabled
4. Popover surface as Calendar: background/popover, border/default, radius/md, padding spacing/3

**Content and behavior**

- current marks this month, quarter or year; selected the pick
- Periods without data or in the future for reports are disabled
- The trigger is a Date Picker that shows "October 2026" or "Q3 2026"
- Arrows move by a year (Type=year by 12 years)
- Resize: 250 wide (minWidth 250); when it stretches the cells fill their columns

**Accessibility**

- The grid is a listbox or grid of buttons with full names ("October 2026", "Third quarter 2026")
- Arrows move between cells, PageUp and PageDown change the year, Enter picks
- current and selected are not color alone (aria-current, aria-selected)

| Variant property | Values |
|---|---|
| Type | month, quarter, year |

| Property | Type | Default |
|---|---|---|
| Period | text | 2026 |
| Decade | text | 2020 to 2031 |

Built from: `Button Icon`, `Month Picker Cell`

Tokens and styles:
- Colors: `background/popover`, `border/default`, `foreground/default`
- Spacing and size: `spacing/2`, `spacing/3`, `spacing/4`
- Radius: `radius/md`
- Text styles: `ui/label`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: Custom: `Popover` + `grid grid-cols-3 gap-2` (quarters `grid-cols-2`) of `Button variant="ghost"` (selected `variant="default"`, current `bg-accent`), caption with ghost icon Buttons (`min-w-[250px]`; value is the first day of the period (`startOfMonth`, `startOfQuarter`, `startOfYear`))

## Month Picker Cell

Component set · 6 variants · default size 72 × 40

One month, quarter or year in Month Picker. State: default, hover, focus, current (this month, quarter or year), selected, disabled. Same tokens as Calendar Day. Fills its column in the grid.


Usage: eggux build-ui/components/date-picker.md

| Variant property | Values |
|---|---|
| State | default, hover, focus, current, selected, disabled |

| Property | Type | Default |
|---|---|---|
| Label | text | Oct |

Tokens and styles:
- Colors: `background/accent`, `background/default`, `background/primary`, `foreground/accent`, `foreground/default`, `foreground/muted`, `foreground/primary`
- Spacing and size: `spacing/10`, `spacing/2`
- Radius: `radius/md`
- Text styles: `body/small`, `ui/label`

Guides: [date-picker](../../skills/build-ui/components/date-picker.md)

Code: Custom: `Popover` + `grid grid-cols-3 gap-2` (quarters `grid-cols-2`) of `Button variant="ghost"` (selected `variant="default"`, current `bg-accent`), caption with ghost icon Buttons (`min-w-[250px]`; value is the first day of the period (`startOfMonth`, `startOfQuarter`, `startOfYear`))
