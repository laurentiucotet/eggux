import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { Calendar } from './calendar';
import {
  addDays,
  addMonths,
  daysBetweenInclusive,
  formatDuration,
  formatRangeText,
  formatTime,
  isoWeek,
  monthGrid,
  timeOptions,
  weekdayLabels,
  type DateRange,
} from './calendar-date';

const TODAY = new Date(2026, 9, 19);
const SELECTED = new Date(2026, 9, 22);

const meta = {
  title: 'Components/Calendar/Calendar',
  component: Calendar,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Month view of Calendar Days, week starting on Monday, single day or range. Caption label or dropdown, 1 or 2 months, optional ISO week numbers. Needs 250 px; below that use Date Input. Keyboard: arrows move by day or week, Home and End the week, PageUp and PageDown the month, Enter and Space pick. Figma: Calendar page / Calendar. Guides: eggux build-ui/components/date-picker.md, boards-and-calendars.md' } },
  },
  args: { today: TODAY, defaultSelected: SELECTED, defaultMonth: TODAY },
} satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'backgroundColor' | 'borderTopColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const day = (canvas: { getByRole: (...a: any[]) => HTMLElement }, label: RegExp | string) => canvas.getByRole('button', { name: label });

// Date math, tested without a browser date library.
export const DateMath: Story = {
  render: () => <p>Date math is tested in the play function.</p>,
  play: async () => {
    const oct = monthGrid(2026, 9);
    await expect(oct).toHaveLength(5);
    await expect(oct[0][0].toDateString()).toBe(new Date(2026, 8, 28).toDateString());
    await expect(oct[4][6].toDateString()).toBe(new Date(2026, 10, 1).toDateString());
    await expect(monthGrid(2026, 10)).toHaveLength(6);
    await expect(monthGrid(2026, 1)).toHaveLength(5);
    await expect(monthGrid(2027, 1)).toHaveLength(4);
    // Sunday start: October 2026 begins on a Thursday, so the first row starts on Sunday 27 September.
    await expect(monthGrid(2026, 9, 0)[0][0].getDate()).toBe(27);
    await expect(oct.every(w => w.length === 7)).toBe(true);
    await expect(addMonths(new Date(2026, 0, 31), 1).toDateString()).toBe(new Date(2026, 1, 28).toDateString());
    await expect(addMonths(new Date(2026, 0, 15), -1).toDateString()).toBe(new Date(2025, 11, 15).toDateString());
    await expect(addDays(new Date(2026, 11, 31), 1).toDateString()).toBe(new Date(2027, 0, 1).toDateString());
    await expect(daysBetweenInclusive(new Date(2026, 9, 6), new Date(2026, 9, 19))).toBe(14);
    // Across the daylight saving change (25 Oct 2026 in Europe) the count stays right.
    await expect(daysBetweenInclusive(new Date(2026, 9, 24), new Date(2026, 9, 26))).toBe(3);
    await expect(isoWeek(new Date(2026, 9, 5))).toBe(41);
    await expect(isoWeek(new Date(2026, 0, 1))).toBe(1);
    await expect(isoWeek(new Date(2020, 11, 31))).toBe(53);
    await expect(isoWeek(new Date(2021, 0, 3))).toBe(53);
    await expect(weekdayLabels('en-GB', 1).map(w => w.short)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    await expect(weekdayLabels('en-GB', 0)[0].short).toBe('Su');
    await expect(formatRangeText({ from: new Date(2026, 9, 6), to: new Date(2026, 9, 19) })).toBe('6 Oct to 19 Oct 2026');
    await expect(formatRangeText({ from: new Date(2026, 11, 20), to: new Date(2027, 0, 5) })).toContain('2026 to');
    await expect(timeOptions(30, 9 * 60, 11 * 60)).toEqual(['09:00', '09:30', '10:00', '10:30', '11:00']);
    await expect(formatDuration(90)).toBe('1 h 30 min');
    await expect(formatDuration(45)).toBe('45 min');
    await expect(formatTime('14:30', true)).toMatch(/2:30\s?pm/i);
  },
};

// Figma Caption=label, Months=1: 250 x 294, Monday first, today marked, 22 selected.
export const Default: Story = {
  args: { onSelect: fn() },
  play: async ({ canvas, canvasElement, args }) => {
    const cal = canvasElement.querySelector('[data-slot="calendar"]')!;
    await expect(box(cal)).toEqual([250, 294]);
    await expect(canvas.getByRole('grid', { name: 'October 2026' })).toBeVisible();
    await expect(canvas.getAllByRole('columnheader').map(h => h.textContent)).toEqual(['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']);
    // 5 weeks (28 Sep to 1 Nov), the days of the adjacent months are shown muted.
    await expect(canvas.getAllByRole('row')).toHaveLength(6);
    await expect(day(canvas, /Monday 28 September 2026/)).toHaveAttribute('data-state', 'outside');
    await expect(day(canvas, /Monday 19 October 2026/)).toHaveAttribute('aria-current', 'date');
    await expect(day(canvas, /Monday 19 October 2026/)).toHaveAttribute('data-state', 'today');
    const selected = day(canvas, /Thursday 22 October 2026/);
    await expect(selected.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    // The day fades its color on a theme switch: wait for the end of the transition.
    // Probe outside waitFor: a probe in the callback mutates the DOM, re-triggers waitFor at once and hangs on failure.
    const primary = probe('bg-primary', 'backgroundColor');
    await waitFor(() => expect(getComputedStyle(selected).backgroundColor).toBe(primary));
    await expect(selected).toHaveTextContent('22');
    // Calendar surface.
    await expect(getComputedStyle(cal).backgroundColor).toBe(probe('bg-popover', 'backgroundColor'));
    await expect(getComputedStyle(cal).borderTopColor).toBe(probe('border-border', 'borderTopColor'));
    // Previous and next are 36 px ghost icon buttons with names.
    await expect(box(canvas.getByRole('button', { name: 'Previous month' }))).toEqual([36, 36]);
    await expect(box(canvas.getByRole('button', { name: 'Next month' }))).toEqual([36, 36]);
    // One day is in the tab order (roving tabindex).
    await expect(canvasElement.querySelectorAll('[data-date][tabindex="0"]')).toHaveLength(1);
    await userEvent.click(day(canvas, /Friday 23 October 2026/));
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
    await expect((args.onSelect as ReturnType<typeof fn>).mock.calls[0][0].getDate()).toBe(23);
    await expect(day(canvas, /Friday 23 October 2026/).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    await expect(day(canvas, /Thursday 22 October 2026/).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');
  },
};

// Month navigation with the arrows and with a click on an outside day.
export const Navigation: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await expect(canvas.getByRole('grid', { name: 'November 2026' })).toBeVisible();
    // November 2026 has 6 rows.
    await expect(canvas.getAllByRole('row')).toHaveLength(7);
    await userEvent.click(canvas.getByRole('button', { name: 'Previous month' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Previous month' }));
    await expect(canvas.getByRole('grid', { name: 'September 2026' })).toBeVisible();
    // Clicking 1 October (outside day of September) opens October and selects it.
    await userEvent.click(day(canvas, /Thursday 1 October 2026/));
    await expect(canvas.getByRole('grid', { name: 'October 2026' })).toBeVisible();
    await expect(day(canvas, /Thursday 1 October 2026/).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
  },
};

// WAI-ARIA date grid keyboard.
export const Keyboard: Story = {
  play: async ({ canvas, canvasElement }) => {
    day(canvas, /Thursday 22 October 2026/).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(day(canvas, /Friday 23 October 2026/)).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(day(canvas, /Friday 30 October 2026/)).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}');
    await expect(day(canvas, /Thursday 22 October 2026/)).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(day(canvas, /Monday 19 October 2026/)).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(day(canvas, /Sunday 25 October 2026/)).toHaveFocus();
    // Past the end of the month: the next month opens, focus follows.
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('grid', { name: 'November 2026' })).toBeVisible());
    await waitFor(() => expect(day(canvas, /Sunday 1 November 2026/)).toHaveFocus());
    // PageUp and PageDown change the month and keep the day.
    await userEvent.keyboard('{PageDown}');
    await waitFor(() => expect(day(canvas, /Tuesday 1 December 2026/)).toHaveFocus());
    await userEvent.keyboard('{PageUp}{PageUp}');
    await waitFor(() => expect(canvas.getByRole('grid', { name: 'October 2026' })).toBeVisible());
    await waitFor(() => expect(day(canvas, /Thursday 1 October 2026/)).toHaveFocus());
    // Shift+PageDown moves a year.
    await userEvent.keyboard('{Shift>}{PageDown}{/Shift}');
    await waitFor(() => expect(canvas.getByRole('grid', { name: 'October 2027' })).toBeVisible());
    // Enter and Space pick.
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvasElement.querySelector('[role="gridcell"][aria-selected="true"]')).toHaveTextContent('2'));
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard(' ');
    await waitFor(() => expect(canvasElement.querySelector('[role="gridcell"][aria-selected="true"]')).toHaveTextContent('3'));
    await expect(canvasElement.querySelectorAll('[role="gridcell"][aria-selected="true"]')).toHaveLength(1);
  },
};

// Tab reaches the arrows, then the one day in the tab order; Shift+Tab goes back.
export const TabOrder: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Previous month' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Next month' })).toHaveFocus();
    await userEvent.tab();
    await expect(day(canvas, /Thursday 22 October 2026/)).toHaveFocus();
    await userEvent.tab({ shift: true });
    await expect(canvas.getByRole('button', { name: 'Next month' })).toHaveFocus();
  },
};

// Figma Caption=dropdown: month and year selects (native for now), 250 x 294.
export const Dropdown: Story = {
  args: { caption: 'dropdown' },
  play: async ({ canvas, canvasElement }) => {
    await expect(box(canvasElement.querySelector('[data-slot="calendar"]')!)).toEqual([250, 294]);
    const month = canvas.getByRole('combobox', { name: 'Month' });
    const year = canvas.getByRole('combobox', { name: 'Year' });
    await expect(month).toHaveDisplayValue('Oct');
    await expect(year).toHaveDisplayValue('2026');
    await expect(Math.round(month.getBoundingClientRect().height)).toBe(32);
    await userEvent.selectOptions(month, 'Mar');
    await expect(canvas.getByRole('grid', { name: 'March 2026' })).toBeVisible();
    await userEvent.selectOptions(year, '2030');
    await expect(canvas.getByRole('grid', { name: 'March 2030' })).toBeVisible();
    await userEvent.keyboard('{Tab}');
  },
};

// Figma Months=2: 498 x 334 (the second month has 6 rows), arrows on the outer edges, a spacer on the inner ones.
export const TwoMonths: Story = {
  args: { months: 2 },
  play: async ({ canvas, canvasElement }) => {
    await expect(box(canvasElement.querySelector('[data-slot="calendar"]')!)).toEqual([498, 334]);
    await expect(canvas.getByRole('grid', { name: 'October 2026' })).toBeVisible();
    await expect(canvas.getByRole('grid', { name: 'November 2026' })).toBeVisible();
    await expect(canvas.getAllByRole('button', { name: /Previous month|Next month/ })).toHaveLength(2);
    const [first, second] = [...canvasElement.querySelectorAll('[data-slot="calendar-month"]')];
    await expect(first.querySelector('[aria-label="Previous month"]')).not.toBeNull();
    await expect(first.querySelector('[aria-label="Next month"]')).toBeNull();
    await expect(second.querySelector('[aria-label="Next month"]')).not.toBeNull();
    await expect(box(first.querySelector('[data-slot="calendar-spacer"]')!)).toEqual([36, 36]);
    // The day 31 October is in October (inside) and in November (outside), only the first one is in the tab order.
    await expect(canvasElement.querySelectorAll('[data-date][tabindex="0"]')).toHaveLength(1);
    // Keyboard past the second month moves both months by one.
    day(canvas, /Thursday 22 October 2026/).focus();
    await userEvent.keyboard('{PageDown}{PageDown}');
    await waitFor(() => expect(canvas.getByRole('grid', { name: 'December 2026' })).toBeVisible());
    await expect(canvas.getByRole('grid', { name: 'November 2026' })).toBeVisible();
  },
};

export const TwoMonthsDropdown: Story = {
  args: { months: 2, caption: 'dropdown' },
  play: async ({ canvas, canvasElement }) => {
    await expect(box(canvasElement.querySelector('[data-slot="calendar"]')!)).toEqual([498, 334]);
    await expect(canvas.getAllByRole('combobox', { name: 'Month' })).toHaveLength(2);
    await userEvent.selectOptions(canvas.getAllByRole('combobox', { name: 'Month' })[1], 'Jan');
    // The second month became January 2026, so the first is December 2025.
    await expect(canvas.getByRole('grid', { name: 'December 2025' })).toBeVisible();
    await expect(canvas.getByRole('grid', { name: 'January 2026' })).toBeVisible();
  },
};

// Figma Show week numbers: an ISO week column, 282 wide.
export const WeekNumbers: Story = {
  args: { showWeekNumbers: true },
  play: async ({ canvas, canvasElement }) => {
    await expect(box(canvasElement.querySelector('[data-slot="calendar"]')!)).toEqual([282, 294]);
    await expect(canvas.getAllByRole('rowheader').map(h => h.textContent)).toEqual(['40', '41', '42', '43', '44']);
    await expect(canvas.getAllByRole('rowheader')[0]).toHaveAccessibleName('Week 40');
  },
};

// Range: first click starts, second click ends; range-start, middle and end styles; 6 Oct to 19 Oct in the Figma example.
const RangeCalendar = (props: { onRangeSelect?: (r: DateRange) => void }) => (
  <Calendar mode="range" today={TODAY} defaultMonth={TODAY} defaultRange={{ from: new Date(2026, 9, 6), to: new Date(2026, 9, 19) }} disabled={d => d > TODAY} {...props} />
);
export const Range: Story = {
  render: () => <RangeCalendar />,
  play: async ({ canvas }) => {
    await expect(day(canvas, /Tuesday 6 October 2026/)).toHaveAttribute('data-state', 'range-start');
    await expect(day(canvas, /Wednesday 7 October 2026/)).toHaveAttribute('data-state', 'range-middle');
    await expect(day(canvas, /Monday 19 October 2026/)).toHaveAttribute('data-state', 'range-end');
    await expect(day(canvas, /Monday 19 October 2026/)).toHaveAttribute('aria-current', 'date');
    await expect(getComputedStyle(day(canvas, /Wednesday 7 October 2026/)).backgroundColor).toBe(probe('bg-accent', 'backgroundColor'));
    // Future days are disabled and cannot be picked.
    const future = day(canvas, /Tuesday 20 October 2026/);
    await expect(future).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(future);
    await expect(day(canvas, /Monday 19 October 2026/)).toHaveAttribute('data-state', 'range-end');
    // A new range: first click starts it (a single selected day), the second ends it.
    await userEvent.click(day(canvas, /Monday 12 October 2026/));
    await expect(day(canvas, /Monday 12 October 2026/)).toHaveAttribute('data-state', 'selected');
    await expect(day(canvas, /Tuesday 6 October 2026/)).toHaveAttribute('data-state', 'default');
    await userEvent.click(day(canvas, /Thursday 15 October 2026/));
    await expect(day(canvas, /Monday 12 October 2026/)).toHaveAttribute('data-state', 'range-start');
    await expect(day(canvas, /Wednesday 14 October 2026/)).toHaveAttribute('data-state', 'range-middle');
    await expect(day(canvas, /Thursday 15 October 2026/)).toHaveAttribute('data-state', 'range-end');
    // Clicking before the start restarts the range.
    await userEvent.click(day(canvas, /Wednesday 7 October 2026/));
    await expect(day(canvas, /Wednesday 7 October 2026/)).toHaveAttribute('data-state', 'selected');
    await expect(day(canvas, /Monday 12 October 2026/)).toHaveAttribute('data-state', 'default');
  },
};

// Booking: notes with prices, a booked day (strike, announced, not pickable), a dot for events.
export const Booking: Story = {
  args: {
    defaultSelected: undefined,
    booked: d => d.getDate() === 24 && d.getMonth() === 9,
    disabled: d => d < TODAY,
    getDayMeta: d => (d.getMonth() === 9 && d.getDate() >= 19 && d.getDate() !== 22 ? { note: d.getDate() === 24 ? 'Full' : `€${60 + d.getDate()}` } : undefined),
    onSelect: fn(),
  },
  play: async ({ canvas, args }) => {
    // A row with notes grows to 36.
    await expect(box(day(canvas, /Tuesday 20 October 2026/))[1]).toBe(36);
    await expect(day(canvas, /Saturday 24 October 2026/)).toHaveAccessibleName(/^24 Full, .*, booked$/);
    await expect(day(canvas, /Saturday 24 October 2026/)).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(day(canvas, /Saturday 24 October 2026/));
    await expect(args.onSelect).not.toHaveBeenCalled();
    await expect(day(canvas, /Tuesday 20 October 2026/)).toHaveAccessibleName(/^20 €80, Tuesday/);
    await expect(day(canvas, /Monday 12 October 2026/)).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(day(canvas, /Tuesday 20 October 2026/));
    await expect(args.onSelect).toHaveBeenCalledTimes(1);
  },
};

export const EventDots: Story = {
  args: { getDayMeta: d => (d.getMonth() === 9 && [5, 12, 22].includes(d.getDate()) ? { dot: true } : undefined) },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelectorAll('[data-slot="calendar-day-dot"]')).toHaveLength(3);
    await expect(box(canvasElement.querySelector('[data-slot="calendar"]')!)).toEqual([250, 294]);
  },
};

// Locale: names come from Intl; Sunday first for en-US style calendars.
export const SundayStart: Story = {
  args: { weekStartsOn: 0, locale: 'en-US' },
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('columnheader').map(h => h.textContent)).toEqual(['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']);
    await expect(canvas.getByRole('grid', { name: 'October 2026' })).toBeVisible();
  },
};

// Controlled month and value.
const Controlled = () => {
  const [value, setValue] = React.useState<Date | undefined>(SELECTED);
  const [month, setMonth] = React.useState(TODAY);
  return (
    <div className="flex flex-col gap-3">
      <Calendar today={TODAY} selected={value} onSelect={setValue} month={month} onMonthChange={setMonth} />
      <p>Picked: <output>{value ? value.toDateString() : 'none'}</output></p>
    </div>
  );
};
export const ControlledValue: Story = {
  render: () => <Controlled />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next month' }));
    await userEvent.click(day(canvas, /Sunday 15 November 2026/));
    await expect(canvas.getByRole('status')).toHaveTextContent('Sun Nov 15 2026');
  },
};

// Stress test (Figma "Stress test / Calendar"): 276 and 368 px columns. The calendar keeps 250 and does not overflow.
export const Column276: Story = {
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const cal = canvasElement.querySelector('[data-slot="calendar"]') as HTMLElement;
    await expect(cal.scrollWidth).toBeLessThanOrEqual(cal.clientWidth);
    await expect(cal.getBoundingClientRect().width).toBeLessThanOrEqual(276);
  },
};
export const Column368: Story = {
  args: { months: 1, caption: 'dropdown', showWeekNumbers: true },
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const cal = canvasElement.querySelector('[data-slot="calendar"]') as HTMLElement;
    await expect(cal.scrollWidth).toBeLessThanOrEqual(cal.clientWidth);
    await expect(box(cal)).toEqual([282, 294]);
  },
};
// A long month name (locale) is cut with an ellipsis, never wrapped.
export const LongMonthName: Story = {
  args: { locale: 'ro-RO' },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  play: async ({ canvasElement }) => {
    const label = canvasElement.querySelector('[data-slot="calendar-label"]') as HTMLElement;
    await expect(getComputedStyle(label).textOverflow).toBe('ellipsis');
    await expect(Math.round(label.getBoundingClientRect().height)).toBe(20);
  },
};

// Theme copies: axe checks contrast of every day state in each mode.
const Showcase = () => (
  <div className="flex flex-wrap items-start gap-6">
    <Calendar today={TODAY} defaultSelected={SELECTED} defaultMonth={TODAY} aria-label="Selected day" />
    <Calendar mode="range" months={1} today={TODAY} defaultMonth={TODAY} defaultRange={{ from: new Date(2026, 9, 6), to: new Date(2026, 9, 12) }} aria-label="Range" caption="dropdown" />
  </div>
);
export const ThemeLight: Story = { render: () => <Showcase />, name: 'Day and range' };
export const ThemeDark: Story = { render: () => <Showcase />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'Day and range (Dark)' };
export const ThemeCorporate: Story = { render: () => <Showcase />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'Day and range (Corporate Light)' };
export const DefaultDark: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...Default, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
