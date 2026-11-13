import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { WeekPicker, type WeekValue } from './week-picker';

type Args = { weekStartsOn: 0 | 1; showWeekNumber: boolean; limited: boolean; width: number };

// Thursday 22 October 2026, fixed so tests never depend on the real date.
const NOW = new Date(2026, 9, 22);

const meta = {
  title: 'Components/Date and Time/Week Picker',
  parameters: {
    docs: {
      description: {
        component:
          'Picks a whole week. Previous and next step one week; the middle button shows the range with the week number and opens the weeks of a month as a list, with a month switcher. Weeks outside the allowed period stay in the list but cannot be picked. For one day use Date Picker; for any period use Date Range Picker. Code only (no Figma component yet).',
      },
    },
  },
  args: { weekStartsOn: 1, showWeekNumber: true, limited: false, width: 360 },
  argTypes: {
    weekStartsOn: { name: 'Week starts on', control: 'inline-radio', options: [1, 0], description: '1 is Monday, 0 is Sunday.', table: { category: 'Picker' } },
    showWeekNumber: { name: 'Show week number', control: 'boolean', description: 'The week number badge.', table: { category: 'Picker' } },
    limited: { name: 'Limit the period', control: 'boolean', description: 'Only weeks from 5 Oct to 29 Nov 2026 can be picked.', table: { category: 'Picker' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 560, step: 4 }, description: 'Width of the container in px.', table: { category: 'Layout' } },
  },
  render: function Render({ weekStartsOn, showWeekNumber, limited, width }) {
    const [value, setValue] = React.useState<Date>(NOW);
    return (
      <div style={{ width, maxWidth: '100%' }}>
        <WeekPicker
          value={value}
          onValueChange={w => setValue(w.from)}
          now={NOW}
          weekStartsOn={weekStartsOn}
          showWeekNumber={showWeekNumber}
          minDate={limited ? new Date(2026, 9, 5) : undefined}
          maxDate={limited ? new Date(2026, 10, 29) : undefined}
        />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Limited: Story = { args: { limited: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: function Render() {
    const [value, setValue] = React.useState<Date>(NOW);
    const [onValueChange] = React.useState(() => fn());
    return (
      <WeekPicker
        value={value}
        now={NOW}
        onValueChange={(w: WeekValue) => {
          onValueChange(w);
          setValue(w.from);
        }}
      />
    );
  },
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole('button', { name: /19 to 25 Oct 2026/ });
    await expect(trigger).toHaveTextContent('Week 43');
    // Previous and next step one week.
    await userEvent.click(canvas.getByRole('button', { name: 'Next week' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /26 Oct to 1 Nov 2026/ })).toHaveTextContent('Week 44'));
    await expect(canvas.getByRole('status')).toHaveTextContent('Week 44, 26 Oct to 1 Nov 2026');
    await userEvent.click(canvas.getByRole('button', { name: 'Previous week' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Previous week' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /12 to 18 Oct 2026/ })).toHaveTextContent('Week 42'));
    // The list of weeks opens from the middle button and shows the month.
    await userEvent.click(canvas.getByRole('button', { name: /12 to 18 Oct 2026/ }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Choose a week' });
    const list = within(dialog).getByRole('listbox', { name: 'Weeks of October 2026' });
    await expect(within(list).getAllByRole('option')).toHaveLength(5);
    await expect(within(list).getByRole('option', { name: /Week 42/ })).toHaveAttribute('aria-selected', 'true');
    // Month switcher.
    await userEvent.click(within(dialog).getByRole('button', { name: 'Next month' }));
    await waitFor(() => expect(within(dialog).getByRole('listbox', { name: 'Weeks of November 2026' })).toBeVisible());
    await userEvent.click(within(dialog).getByRole('button', { name: 'Previous month' }));
    await waitFor(() => expect(within(dialog).getByRole('listbox', { name: 'Weeks of October 2026' })).toBeVisible());
    // Keyboard: arrows move in the list, Enter picks and closes, focus returns to the trigger.
    const picked = within(dialog).getByRole('option', { name: /Week 42/ });
    picked.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(within(dialog).getByRole('option', { name: /Week 43/ })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull());
    await waitFor(() => expect(canvas.getByRole('button', { name: /19 to 25 Oct 2026/ })).toHaveFocus());
    await expect(canvas.getByRole('button', { name: /19 to 25 Oct 2026/ })).toHaveTextContent('Week 43');
  },
};

export const LimitCheck: Story = {
  tags: ['!dev'],
  args: { limited: true, weekStartsOn: 0 },
  play: async ({ canvas }) => {
    // Sunday start: the week of 22 Oct is 18 to 24 Oct, ISO week 43.
    await expect(canvas.getByRole('button', { name: /18 to 24 Oct 2026/ })).toHaveTextContent('Week 43');
    // Walk back to the first allowed week (4 to 10 Oct holds 5 Oct); the one before cannot be picked.
    for (let i = 0; i < 2; i++) await userEvent.click(canvas.getByRole('button', { name: 'Previous week' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: /4 to 10 Oct 2026/ })).toBeVisible());
    await expect(canvas.getByRole('button', { name: 'Previous week' })).toBeDisabled();
    // In the list, a week outside the period is announced as disabled and ignores clicks.
    await userEvent.click(canvas.getByRole('button', { name: /4 to 10 Oct 2026/ }));
    const dialog = await within(document.body).findByRole('dialog', { name: 'Choose a week' });
    const early = within(dialog).getByRole('option', { name: /^Week 40/ });
    await expect(early).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(early);
    await expect(within(document.body).getByRole('dialog')).toBeVisible();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(within(document.body).queryByRole('dialog')).toBeNull());
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] max-w-full"><Story /></div>],
  render: () => <WeekPicker defaultValue={new Date(2026, 11, 30)} now={NOW} locale="en-GB" />,
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    // A week across two years is the longest text; the range truncates, the badge stays.
    const trigger = canvas.getByRole('button', { name: /28 Dec 2026 to 3 Jan 2027/ });
    await expect(trigger).toHaveTextContent('Week 53');
    await expect(trigger.getBoundingClientRect().width).toBeGreaterThan(100);
    await expect(trigger.scrollWidth).toBeLessThanOrEqual(trigger.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
