# Calendar and Date Picker

Usage guidelines only. Visual specs live in the Figma components (Calendar page).

## Which input
| Date | Input |
|---|---|
| Near future or past (bookings, deadlines, filters) | `Date Picker` (Calendar in a Popover) |
| Far away or known by heart (birth date, document expiry) | Text input with mask `dd.mm.yyyy`, optional calendar button |
| A period | Date range: two months side by side on desktop, one on mobile |
| Date and time together (schedule a post, a reminder) | `Date Time Picker`: one popover, one value "22 Oct 2026, 14:30" |
| A month, quarter or year (statements, reports) | `Month Picker`, not a Calendar day |
| Booking with availability | Calendar inline + time slots next to it |

## Rules
- Format follows the locale: ro-RO `22.10.2026` in inputs, `22 oct. 2026` in text. Week starts
  Monday in Romania and most of Europe.
- Today is always marked. Unavailable dates are disabled with the reason nearby ("Closed on
  Sundays"), not just greyed out.
- Typing must work as well as clicking; validate on blur with a clear format hint.
- Presets for filters: Today, Last 7 days, This month, Custom.
- Keyboard: arrows move by day, PageUp/PageDown by month, Enter selects, Escape closes.

## Figma
- `Calendar Day` State: default, hover, focus, today, selected, outside, disabled, range-start,
  range-middle, range-end, booked. `Calendar`: Month text, prev/next ghost Button Icons,
  Monday-first grid.
- `Calendar` Caption=dropdown (month and year Selects) for far dates, Months=2 for ranges on
  desktop, Show week numbers for week-based planning. Booking days carry a note (Show note,
  price) or State=booked; a Calendar Day shows a note or a dot (Show dot), never both. Example
  "Calendar options".
- `Date Picker` (State × Content) with calendar icon. Open state: Date Picker (focus) + Calendar
  with `shadow/md`, 4 px below. Examples "date picker open" and "date range".
- A period in a filter bar or report is `Date Picker` Type=range that opens Date Range Picker;
  the trigger reads "6 Oct to 19 Oct 2026". Example "Date range filter".
- `Date Time Picker`: Calendar plus a scrolling time column and a footer (summary, Cancel,
  Apply); the trigger is a Date Picker with the date and time. Example "Date Time Picker".
- `Month Picker` Type month (3 x 4), quarter (2 x 2) or year (12 years) of `Month Picker Cell`s,
  opened from a Date Picker. Example "Month Picker".

## Code
shadcn `Calendar` (react-day-picker, `weekStartsOn={1}`, `locale={ro}`) and the Date Picker recipe
(`Popover` + `Calendar`).

## Time Picker
- Format follows the locale: 24 h in most of Europe ("10:30"), 12 h in the US ("10:30 AM"). Steps of 15 or 30 min for bookings; typing hh:mm when
  any minute is valid (logs, reminders).
- Unavailable times are disabled in the list, not removed, when users expect them ("10:00").
- Date + time: two fields side by side (Date Picker 240, Time Picker 140), or one `Date Time
  Picker` when both are picked together; for bookings prefer `patterns/booking.md` (calendar +
  slots).
- Time ranges (availability, shifts) use `Time Picker` Type=range with the duration ("09:00 to
  10:30", Show duration "1 h 30 min"). Example "Availability time ranges".
- Figma: `Time Picker` (State × Content, clock icon) on the Calendar page. Open state: Time Picker
  (focus) + Menu with times, Checked on the selected one. Examples "time picker open", "date and time".

## Date Range Picker
- For filters and reports: presets first (Today, Last 7 / 14 / 30 days, This month, Last month,
  This year, Custom), then two months (previous + current), summary with the number of days,
  Cancel / Apply.
- The trigger shows the preset name and the dates ("Last 14 days: 6 - 19 Oct").
- Future dates disabled for reports on past data; past dates disabled for bookings.
- Mobile: one month in a full-height Drawer, presets as chips above.
- Figma: `Date Range Picker` (Presets slot, Summary, Show presets) on the Calendar page. Example
  "date range filter".

## Related components
- For known dates people type (birth date, invoice date), use `Date Input`: day, month and year
  segments with a calendar button. For repeats (recurring invoices, reminders), use
  `Recurrence Picker`.
