import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { DateStrip } from './date-strip';

type Args = { days: number; showMonth: boolean; showScrollButtons: boolean; someUnavailable: boolean; width: number };

// Thursday 22 October 2026, fixed so tests never depend on the real date.
const NOW = new Date(2026, 9, 22);
const START = new Date(2026, 9, 19);
const unavailable = [new Date(2026, 9, 24), new Date(2026, 9, 25)];

const meta = {
  title: 'Components/Date and Time/Date Strip',
  parameters: {
    docs: {
      description: {
        component:
          'A horizontal row of days with weekday and number, for picking a day close to today (the mobile booking pattern). Arrow keys move between days, Home and End jump to the ends, Enter or Space picks, and the scroll buttons move the strip for mouse users. Unavailable days stay visible and are announced. For a whole month use Calendar. Code only (no Figma component yet).',
      },
    },
  },
  args: { days: 14, showMonth: true, showScrollButtons: true, someUnavailable: false, width: 390 },
  argTypes: {
    days: { name: 'Days', control: { type: 'range', min: 7, max: 30, step: 1 }, description: 'How many days the strip holds.', table: { category: 'Strip' } },
    showMonth: { name: 'Show month', control: 'boolean', description: 'Month name over the first day and every 1st.', table: { category: 'Strip' } },
    showScrollButtons: { name: 'Show scroll buttons', control: 'boolean', description: 'Previous and next buttons that scroll the strip.', table: { category: 'Strip' } },
    someUnavailable: { name: 'Some days unavailable', control: 'boolean', description: 'Mark Saturday and Sunday as fully booked.', table: { category: 'Days' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 560, step: 4 }, description: 'Width of the container in px: the strip scrolls inside it.', table: { category: 'Layout' } },
  },
  render: function Render({ days, showMonth, showScrollButtons, someUnavailable, width }) {
    const [value, setValue] = React.useState<Date | undefined>(NOW);
    return (
      <div style={{ width, maxWidth: '100%' }}>
        <DateStrip
          value={value}
          onValueChange={setValue}
          start={START}
          now={NOW}
          days={days}
          showMonth={showMonth}
          showScrollButtons={showScrollButtons}
          disabledDates={someUnavailable ? unavailable : undefined}
        />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SomeUnavailable: Story = { args: { someUnavailable: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => {
    const onValueChange = fn();
    return <DateStrip start={START} now={NOW} defaultValue={NOW} onValueChange={onValueChange} disabledDates={unavailable} />;
  },
  play: async ({ canvas }) => {
    const strip = canvas.getByRole('listbox', { name: 'Choose a day' });
    await expect(canvas.getAllByRole('option')).toHaveLength(14);
    const today = canvas.getByRole('option', { name: 'Thursday 22 October 2026, today' });
    await expect(today).toHaveAttribute('aria-selected', 'true');
    await expect(today).toHaveAttribute('tabindex', '0');
    // Click picks.
    await userEvent.click(canvas.getByRole('option', { name: 'Friday 23 October 2026' }));
    await waitFor(() => expect(canvas.getByRole('option', { name: 'Friday 23 October 2026' })).toHaveAttribute('aria-selected', 'true'));
    await expect(canvas.getByRole('option', { name: 'Thursday 22 October 2026, today' })).toHaveAttribute('aria-selected', 'false');
    // Keyboard: arrows move focus, Enter picks, Home and End jump.
    canvas.getByRole('option', { name: 'Friday 23 October 2026' }).focus();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'Thursday 22 October 2026, today' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'Thursday 22 October 2026, today' })).toHaveAttribute('aria-selected', 'true'));
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'Sunday 1 November 2026' })).toHaveFocus());
    await userEvent.keyboard('{Home}');
    await waitFor(() => expect(canvas.getByRole('option', { name: 'Monday 19 October 2026' })).toHaveFocus());
    // Unavailable days are announced and cannot be picked.
    const sat = canvas.getByRole('option', { name: 'Saturday 24 October 2026, unavailable' });
    await expect(sat).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(sat);
    await expect(sat).toHaveAttribute('aria-selected', 'false');
    await expect(strip).toBeVisible();
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] max-w-full"><Story /></div>],
  render: () => <DateStrip start={START} now={NOW} days={30} />,
  play: async ({ canvas }) => {
    const strip = canvas.getByRole('listbox', { name: 'Choose a day' });
    const root = strip.parentElement!;
    // The strip scrolls inside the container; nothing makes the page wider.
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(strip.scrollWidth).toBeGreaterThan(strip.clientWidth);
    const earlier = canvas.getByRole('button', { name: 'Show earlier days' });
    const later = canvas.getByRole('button', { name: 'Show later days' });
    await expect(earlier).toBeDisabled();
    await userEvent.click(later);
    await waitFor(() => expect(strip.scrollLeft).toBeGreaterThan(0));
    await waitFor(() => expect(earlier).toBeEnabled());
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
