import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { MonthPicker } from './month-picker';

const TODAY = new Date(2026, 10, 5);
const PICKED = new Date(2026, 9, 1);

const meta = {
  title: 'Components/Calendar/Month Picker',
  component: MonthPicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'Pick a month (3 x 4), a quarter (Q1 to Q4) or a year (12 years) instead of a day. Arrows move by a year (12 years for Type=year); current marks this period, selected the pick, disabled the periods outside the data. Opens from a Date Picker. 250 wide, cells fill when it stretches. Keyboard: arrows between cells, PageUp and PageDown change the year, Enter picks. Figma: Calendar page / Month Picker. Guide: eggux build-ui/components/date-picker.md' } },
  },
  args: { today: TODAY, defaultValue: PICKED },
} satisfies Meta<typeof MonthPicker>;
export default meta;
type Story = StoryObj<typeof meta>;

const box = (el: Element) => {
  const r = el.getBoundingClientRect();
  return [Math.round(r.width), Math.round(r.height)];
};
const probe = (className: string, prop: 'color' | 'backgroundColor') => {
  const el = document.createElement('span');
  el.className = className;
  (document.querySelector('#storybook-root') ?? document.body).append(el);
  const value = getComputedStyle(el)[prop];
  el.remove();
  return value;
};
const picker = (el: HTMLElement) => el.querySelector('[data-slot="month-picker"]') as HTMLElement;

// Figma Type=month: 250 x 262, Oct selected, Nov current (the example uses today = November 2026).
export const Default: Story = {
  args: { onValueChange: fn() },
  play: async ({ canvas, canvasElement, args }) => {
    await expect(box(picker(canvasElement))).toEqual([250, 262]);
    await expect(canvas.getByText('2026')).toBeVisible();
    await expect(canvas.getAllByRole('button').filter(b => b.dataset.slot === 'month-picker-cell')).toHaveLength(12);
    const oct = canvas.getByRole('button', { name: 'Oct, October 2026' });
    await expect(oct.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    await expect(getComputedStyle(oct).backgroundColor).toBe(probe('bg-primary', 'backgroundColor'));
    const nov = canvas.getByRole('button', { name: 'Nov, November 2026' });
    await expect(nov).toHaveAttribute('aria-current', 'date');
    await expect(getComputedStyle(nov).backgroundColor).toBe(probe('bg-accent', 'backgroundColor'));
    await expect(box(nov)[1]).toBe(40);
    // Three columns with 8 px gaps: (250 - 2 - 24 - 16) / 3.
    await expect(box(oct)[0]).toBe(Math.round((250 - 2 - 24 - 16) / 3));
    await expect(box(canvas.getByRole('button', { name: 'Previous year' }))).toEqual([36, 36]);
    // One cell in the tab order.
    await expect(canvasElement.querySelectorAll('[data-index][tabindex="0"]')).toHaveLength(1);
    await userEvent.click(canvas.getByRole('button', { name: 'Mar, March 2026' }));
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    const picked = (args.onValueChange as ReturnType<typeof fn>).mock.calls[0][0] as Date;
    await expect([picked.getFullYear(), picked.getMonth(), picked.getDate()]).toEqual([2026, 2, 1]);
    await expect(canvas.getByRole('button', { name: 'Mar, March 2026' }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    await expect(oct.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');
  },
};

// Year arrows change the period; the selected month shows only in its own year.
export const YearNavigation: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Next year' }));
    await expect(canvas.getByText('2027')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Oct, October 2027' }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'false');
    await expect(canvas.getByRole('button', { name: 'Nov, November 2027' })).not.toHaveAttribute('aria-current');
    await userEvent.click(canvas.getByRole('button', { name: 'Previous year' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Previous year' }));
    await expect(canvas.getByText('2025')).toBeVisible();
  },
};

// Figma Type=quarter: 250 x 166, 2 x 2.
export const Quarter: Story = {
  args: { type: 'quarter', defaultValue: new Date(2026, 6, 1) },
  play: async ({ canvas, canvasElement }) => {
    await expect(box(picker(canvasElement))).toEqual([250, 166]);
    await expect(canvas.getAllByRole('row')).toHaveLength(2);
    const q3 = canvas.getByRole('button', { name: 'Q3, third quarter 2026' });
    await expect(q3.closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('button', { name: 'Q4, fourth quarter 2026' })).toHaveAttribute('aria-current', 'date');
    await expect(box(q3)[0]).toBe(Math.round((250 - 2 - 24 - 8) / 2));
    await userEvent.click(canvas.getByRole('button', { name: 'Q1, first quarter 2026' }));
    await expect(canvas.getByRole('button', { name: 'Q1, first quarter 2026' }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
  },
};

// Figma Type=year: 250 x 262, "2020 to 2031", arrows move by 12 years.
export const Year: Story = {
  args: { type: 'year', defaultValue: new Date(2025, 0, 1), today: new Date(2026, 3, 1) },
  play: async ({ canvas, canvasElement }) => {
    await expect(box(picker(canvasElement))).toEqual([250, 262]);
    await expect(canvas.getByText('2020 to 2031')).toBeVisible();
    await expect(canvas.getByRole('button', { name: '2025' }).closest('[role="gridcell"]')).toHaveAttribute('aria-selected', 'true');
    await expect(canvas.getByRole('button', { name: '2026' })).toHaveAttribute('aria-current', 'date');
    await userEvent.click(canvas.getByRole('button', { name: 'Next 12 years' }));
    await expect(canvas.getByText('2032 to 2043')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Previous 12 years' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Previous 12 years' }));
    await expect(canvas.getByText('2008 to 2019')).toBeVisible();
  },
};

// Disabled periods (no data in the future): announced, not pickable.
export const DisabledFuture: Story = {
  args: { disabled: d => d > TODAY, onValueChange: fn() },
  play: async ({ canvas, args }) => {
    const dec = canvas.getByRole('button', { name: 'Dec, December 2026' });
    await expect(dec).toHaveAttribute('aria-disabled', 'true');
    await expect(getComputedStyle(dec).opacity).toBe('0.5');
    await userEvent.click(dec);
    await expect(args.onValueChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Nov, November 2026' })).not.toHaveAttribute('aria-disabled');
  },
};

// Keyboard: arrows between cells, Home and End the row, PageUp and PageDown the year, Enter and Space pick.
export const Keyboard: Story = {
  args: { onValueChange: fn() },
  play: async ({ canvas, args }) => {
    canvas.getByRole('button', { name: 'Oct, October 2026' }).focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: 'Nov, November 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    await expect(canvas.getByRole('button', { name: 'Aug, August 2026' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('button', { name: 'Jul, July 2026' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: 'Sept, September 2026' })).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'Dec, December 2026' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    await expect(args.onValueChange).toHaveBeenCalledTimes(1);
    await userEvent.keyboard('{PageDown}');
    await waitFor(() => expect(canvas.getByText('2027')).toBeVisible());
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Dec, December 2027' })).toHaveFocus());
    await userEvent.keyboard('{ArrowLeft} ');
    await expect(args.onValueChange).toHaveBeenCalledTimes(2);
    await userEvent.keyboard('{PageUp}{PageUp}');
    await waitFor(() => expect(canvas.getByText('2025')).toBeVisible());
  },
};

// Tab goes through the two arrows, then one cell.
export const TabOrder: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Previous year' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Next year' })).toHaveFocus();
    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Oct, October 2026' })).toHaveFocus();
  },
};

// Controlled value.
const Controlled = () => {
  const [value, setValue] = React.useState<Date | undefined>(PICKED);
  return (
    <div className="flex flex-col gap-3">
      <MonthPicker today={TODAY} value={value} onValueChange={setValue} />
      <p>Period: <output>{value?.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</output></p>
    </div>
  );
};
export const ControlledValue: Story = {
  render: () => <Controlled />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'May, May 2026' }));
    await expect(canvas.getByRole('status')).toHaveTextContent('May 2026');
  },
};

// Stress test (Figma "Stress test / Month Picker"): wider than 250 the cells fill their columns; locale names stay on one line.
export const Wide368: Story = {
  decorators: [Story => <div className="w-[368px]"><Story /></div>],
  render: args => <MonthPicker {...args} className="w-full" />,
  play: async ({ canvas, canvasElement }) => {
    await expect(box(picker(canvasElement))[0]).toBe(368);
    await expect(box(canvas.getByRole('button', { name: 'Oct, October 2026' }))[0]).toBe(Math.round((368 - 2 - 24 - 16) / 3));
  },
};
export const LocaleRomanian: Story = {
  args: { locale: 'ro-RO' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'oct., octombrie 2026' })).toBeVisible();
    for (const cell of canvas.getAllByRole('button').filter(b => b.dataset.slot === 'month-picker-cell')) {
      await expect(Math.round(cell.getBoundingClientRect().height)).toBe(40);
    }
  },
};

const All = () => (
  <div className="flex flex-wrap items-start gap-6">
    <MonthPicker today={TODAY} defaultValue={PICKED} />
    <MonthPicker type="quarter" today={TODAY} defaultValue={new Date(2026, 6, 1)} />
    <MonthPicker type="year" today={TODAY} defaultValue={new Date(2025, 0, 1)} />
  </div>
);
export const AllTypes: Story = { render: () => <All />, name: 'All types' };
export const AllTypesDark: Story = { render: () => <All />, tags: ['!dev'], globals: { theme: 'Dark' }, name: 'All types (Dark)' };
export const AllTypesCorporate: Story = { render: () => <All />, tags: ['!dev'], globals: { theme: 'Corporate Light' }, name: 'All types (Corporate Light)' };
