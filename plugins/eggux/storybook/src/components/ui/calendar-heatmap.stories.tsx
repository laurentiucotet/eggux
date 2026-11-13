import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { CalendarHeatmap } from './calendar-heatmap';

type Args = { view: 'year' | 'month'; month: number; showLegend: boolean; showSummary: boolean; weekStartsOn: 0 | 1; clickable: boolean; width: number };

// Thursday 22 October 2026, fixed so tests never depend on the real date.
const NOW = new Date(2026, 9, 22);
const key = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const valueFor = (d: Date) => (d.getDate() * 5 + d.getMonth() * 3) % 9;
const DATA: Record<string, number> = {};
for (let d = new Date(2026, 0, 1); d.getFullYear() === 2026; d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1)) DATA[key(d)] = valueFor(d);
let TOTAL = 0;
for (const v of Object.values(DATA)) TOTAL += v;

const meta = {
  title: 'Components/Date and Time/Calendar Heatmap',
  parameters: {
    docs: {
      description: {
        component:
          'A grid of day cells coloured by intensity, like a contributions graph: a year of small cells or one month with day numbers, with a Less to More legend. Every day is a button named with its date and value and carries the same text as a tooltip. Arrow keys move by cell, Home and End jump to the ends of the row, Enter or Space picks when days are pickable. Code only (no Figma component yet).',
      },
    },
  },
  args: { view: 'year', month: 9, showLegend: true, showSummary: true, weekStartsOn: 1, clickable: true, width: 720 },
  argTypes: {
    view: { name: 'View', control: 'inline-radio', options: ['year', 'month'], description: 'One year of small cells or one month with day numbers.', table: { category: 'Heatmap' } },
    month: { name: 'Month', control: { type: 'range', min: 0, max: 11, step: 1 }, description: 'Month shown in the month view (0 is January).', table: { category: 'Heatmap' } },
    showLegend: { name: 'Show legend', control: 'boolean', description: 'The Less to More scale.', table: { category: 'Heatmap' } },
    showSummary: { name: 'Show total', control: 'boolean', description: 'The total line over the grid.', table: { category: 'Heatmap' } },
    weekStartsOn: { name: 'Week starts on', control: 'inline-radio', options: [1, 0], description: '1 is Monday, 0 is Sunday.', table: { category: 'Heatmap' } },
    clickable: { name: 'Days are pickable', control: 'boolean', description: 'Cells can be picked with a click, Enter or Space.', table: { category: 'Days' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 960, step: 4 }, description: 'Width of the container in px: the year grid scrolls sideways when it does not fit.', table: { category: 'Layout' } },
  },
  render: function Render({ view, month, showLegend, showSummary, weekStartsOn, clickable, width }) {
    const [selected, setSelected] = React.useState<Date | undefined>(undefined);
    return (
      <div style={{ width, maxWidth: '100%' }}>
        <CalendarHeatmap
          data={DATA}
          view={view}
          date={new Date(2026, view === 'month' ? month : 9, 1)}
          now={NOW}
          selected={selected}
          onSelect={clickable ? setSelected : undefined}
          showLegend={showLegend}
          showSummary={showSummary}
          weekStartsOn={weekStartsOn}
          unit="orders"
          unitSingular="order"
        />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Month: Story = { args: { view: 'month', width: 360 } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    const grid = canvas.getByRole('grid', { name: `${TOTAL.toLocaleString('en-GB')} orders in 2026` });
    await expect(grid).toBeVisible();
    await expect(canvas.getAllByRole('button')).toHaveLength(365);
    // Each day is a button named with its date and value, with the same text as its tooltip.
    const oct22 = canvas.getByRole('button', { name: '22 Oct 2026: 2 orders' });
    await expect(oct22).toHaveAttribute('title', '22 Oct 2026: 2 orders');
    await expect(oct22).toHaveAttribute('aria-current', 'date');
    await expect(oct22).toHaveAttribute('tabindex', '0');
    await expect(canvas.getByText('Less')).toBeVisible();
    await expect(canvas.getByText('More')).toBeVisible();
    // Keyboard: Down is the next day, Right the next week, Home and End the ends of the weekday row.
    oct22.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^23 Oct 2026/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^30 Oct 2026/ })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^2 Jan 2026/ })).toHaveFocus());
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^25 Dec 2026/ })).toHaveFocus());
    // One tab stop.
    await expect(canvas.getAllByRole('button').filter(b => b.getAttribute('tabindex') === '0')).toHaveLength(1);
    // Clicking picks the day.
    await userEvent.click(oct22);
    await waitFor(() => expect(oct22.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true'));
  },
};

export const MonthCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onSelect = fn();
    // Fixed values and a fixed top of the scale: 0, 1, 5, 7 and 10 give levels 0, 1, 2, 3 and 4.
    const data = { '2026-10-01': 0, '2026-10-02': 1, '2026-10-03': 5, '2026-10-04': 7, '2026-10-05': 10 };
    return (
      <div className="w-[360px] max-w-full">
        <CalendarHeatmap view="month" date={NOW} now={NOW} data={data} max={10} onSelect={onSelect} unit="visits" unitSingular="visit" />
      </div>
    );
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('grid', { name: '23 visits in October 2026' })).toBeVisible();
    await expect(canvas.getAllByRole('button')).toHaveLength(31);
    await expect(canvas.getAllByRole('columnheader')).toHaveLength(7);
    const level = (n: number) => canvas.getByRole('button', { name: new RegExp(`^${n} Oct 2026`) }).getAttribute('data-level');
    await expect([level(1), level(2), level(3), level(4), level(5)]).toEqual(['0', '1', '2', '3', '4']);
    await expect(canvas.getByRole('button', { name: '2 Oct 2026: 1 visit' })).toBeVisible();
    // Down moves one week, Left one day; Home goes to the first day of the week row.
    canvas.getByRole('button', { name: /^22 Oct 2026/ }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^29 Oct 2026/ })).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^28 Oct 2026/ })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByRole('button', { name: /^26 Oct 2026/ })).toHaveFocus());
    // Does not leave the month: Up from the first row stays.
    canvas.getByRole('button', { name: /^1 Oct 2026/ }).focus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: /^1 Oct 2026/ })).toHaveFocus();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] max-w-full"><Story /></div>],
  render: () => (
    <div className="flex flex-col gap-6">
      <CalendarHeatmap data={DATA} view="year" date={NOW} now={NOW} unit="orders" unitSingular="order" />
      <CalendarHeatmap data={DATA} view="month" date={new Date(2026, 1, 1)} now={NOW} unit="orders" unitSingular="order" />
    </div>
  ),
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    // The year grid scrolls inside its container; the page does not get wider.
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const year = canvas.getByRole('grid', { name: /in 2026$/ });
    await expect(year.parentElement!.scrollWidth).toBeGreaterThan(year.parentElement!.clientWidth);
    // February 2026 has 28 days; a month cell is at least 24 px wide at 276 px.
    const feb = canvas.getByRole('grid', { name: /in February 2026$/ });
    await expect(feb.querySelectorAll('button')).toHaveLength(28);
    await expect(feb.querySelector('button')!.getBoundingClientRect().width).toBeGreaterThanOrEqual(24);
  },
};

export const DefaultDark: Story = { ...MonthCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...MonthCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
export const YearDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const YearCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
