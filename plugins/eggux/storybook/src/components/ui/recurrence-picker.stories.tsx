import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, screen, userEvent, waitFor, within } from 'storybook/test';
import { describeRecurrence, RecurrencePicker, toRRule } from './recurrence-picker';

// Monday 2 Nov 2026: the default weekday, day of the month and end date (+1 year) come from it.
const start = new Date(2026, 10, 2);

const meta = {
  title: 'Components/Select/Recurrence Picker',
  component: RecurrencePicker,
  parameters: {
    layout: 'padded',
    docs: { description: { component: 'How often something repeats (recurring invoices, reports by email, reminders): "Repeat every" + interval + unit; weekly days (at least one stays on) or the day of the month; Ends never, on a date or after N times; a live summary sentence. describeRecurrence gives the same sentence, toRRule the RFC 5545 rule. Figma: Select page / Recurrence Picker. Guide: eggux build-ui/components/select.md' } },
  },
  args: { startDate: start },
  decorators: [Story => <div className="w-[400px]"><Story /></div>],
} satisfies Meta<typeof RecurrencePicker>;
export default meta;
type Story = StoryObj<typeof meta>;

// Figma Frequency=weekly with summary: the start day is on; days toggle; the last day stays on.
export const Default: Story = {
  args: { onValueChange: fn() },
  play: async ({ canvas, args }) => {
    const summary = canvas.getByText(/^Every week/);
    await expect(summary).toHaveTextContent('Every week on Monday');
    const days = canvas.getByRole('toolbar', { name: 'Days' });
    const monday = within(days).getByRole('button', { name: 'Monday' });
    await expect(monday).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(within(days).getByRole('button', { name: 'Wednesday' }));
    await userEvent.click(within(days).getByRole('button', { name: 'Friday' }));
    await expect(summary).toHaveTextContent('Every week on Monday, Wednesday and Friday');
    // Unpressing every day leaves the last one on.
    await userEvent.click(within(days).getByRole('button', { name: 'Wednesday' }));
    await userEvent.click(within(days).getByRole('button', { name: 'Friday' }));
    await userEvent.click(monday);
    await expect(monday).toHaveAttribute('aria-pressed', 'true');
    // Interval 2: units go plural.
    await userEvent.click(canvas.getByRole('button', { name: /Increase interval/ }));
    await expect(summary).toHaveTextContent('Every 2 weeks on Monday');
    await expect(args.onValueChange).toHaveBeenLastCalledWith(expect.objectContaining({ interval: 2, weekdays: [1] }));
  },
};

// Figma Frequency=monthly: "On Day 2"; days 29-31 explain shorter months.
export const Monthly: Story = {
  args: { defaultValue: { frequency: 'monthly', monthDay: 31 } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('toolbar', { name: 'Days' })).toBeNull();
    await expect(canvas.getByText(/^Every month/)).toHaveTextContent('Every month on day 31 (the last day in shorter months)');
    await expect(canvas.getByRole('combobox', { name: /On Day 31/ })).toBeInTheDocument();
  },
};

// Ends: Never, On a date, After N times; changing the count picks its radio.
export const Ends: Story = {
  play: async ({ canvas }) => {
    const ends = canvas.getByRole('radiogroup', { name: 'Ends' });
    await expect(within(ends).getByRole('radio', { name: 'Never' })).toBeChecked();
    await userEvent.click(within(ends).getByRole('radio', { name: 'On' }));
    await expect(canvas.getByText(/^Every week/)).toHaveTextContent('Every week on Monday, until 2 Nov 2027');
    await userEvent.click(canvas.getByRole('button', { name: 'More times' }));
    await expect(within(ends).getByRole('radio', { name: 'After' })).toBeChecked();
    await expect(canvas.getByText(/^Every week/)).toHaveTextContent('Every week on Monday, 13 times');
  },
};

// Daily, from the unit Select.
export const Daily: Story = {
  tags: ['!dev'],
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('combobox', { name: 'Repeat unit' }));
    await userEvent.click(await screen.findByRole('option', { name: 'day' }));
    await waitFor(() => expect(canvas.getByText(/^Every day/)).toBeInTheDocument());
    await expect(canvas.queryByRole('toolbar', { name: 'Days' })).toBeNull();
  },
};

// The summary and RRULE helpers, checked directly.
export const Helpers: Story = {
  tags: ['!dev'],
  play: async () => {
    const rule = { frequency: 'weekly' as const, interval: 2, weekdays: [4, 1] as (1 | 4)[], monthDay: 1, end: { type: 'on' as const, date: new Date(2026, 11, 31) } };
    await expect(describeRecurrence(rule)).toBe('Every 2 weeks on Monday and Thursday, until 31 Dec 2026');
    await expect(toRRule(rule)).toBe('FREQ=WEEKLY;INTERVAL=2;BYDAY=MO,TH;UNTIL=20261231');
    await expect(toRRule({ ...rule, frequency: 'monthly', interval: 1, monthDay: 15, end: { type: 'after', count: 12 } } as never)).toBe('FREQ=MONTHLY;BYMONTHDAY=15;COUNT=12');
  },
};

// Disabled: every control is off.
export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Repeat unit' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Monday' })).toBeDisabled();
    await expect(canvas.getByRole('radio', { name: 'Never' })).toBeDisabled();
  },
};

// Stress: the narrowest column (276) keeps every row inside. Tests only.
export const Stress: Story = {
  tags: ['!dev'],
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  args: { defaultValue: { weekdays: [1, 2, 3, 4, 5, 6, 0] } },
  play: async ({ canvasElement, canvas }) => {
    const root = canvasElement.querySelector<HTMLElement>('[data-slot="recurrence-picker"]')!;
    await expect(root.scrollWidth).toBeLessThanOrEqual(276);
    await expect(canvas.getByText(/^Every week/)).toHaveTextContent('Every week on Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday');
  },
};

export const DefaultDark: Story = { tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { tags: ['!dev'], globals: { theme: 'Corporate Light' } };
