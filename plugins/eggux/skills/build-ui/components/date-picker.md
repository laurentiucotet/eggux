# Calendar and Date Picker

Usage guidelines only. Visual specs live in the Figma components (Calendar page).

## Which input
| Date | Input |
|---|---|
| Near future or past (appointments, deadlines, filters) | `Date Picker` (Calendar in a Popover) |
| Far away or known by heart (birth date, document expiry) | Text input with mask `dd.mm.yyyy`, optional calendar button |
| A period | Date range: two months side by side on desktop, one on mobile |
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
  range-middle, range-end. `Calendar`: Month text, prev/next ghost Button Icons, Monday-first grid.
- `Date Picker` (State × Content) with calendar icon. Open state: Date Picker (focus) + Calendar
  with `shadow/md`, 4 px below. Examples "date picker open" and "date range".

## Code
shadcn `Calendar` (react-day-picker, `weekStartsOn={1}`, `locale={ro}`) and the Date Picker recipe
(`Popover` + `Calendar`).
