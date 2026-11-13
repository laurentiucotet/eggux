import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor } from 'storybook/test';
import { TimeZonePicker } from './time-zone-picker';

type Args = { hour12: boolean; listHeight: number; width: number };

// Thursday 22 October 2026, 12:00 UTC: Europe is on summer time, Auckland on its own summer time.
const NOW = new Date('2026-10-22T12:00:00Z');

const meta = {
  title: 'Components/Date and Time/Time Zone Picker',
  parameters: {
    docs: {
      description: {
        component:
          'A searchable list of time zones, each with the current local time there and its offset from UTC, and a Tomorrow or Yesterday hint when the date differs from the selected zone. Focus stays in the search field; Up and Down move the highlight, Enter picks, Escape clears the search. Times come from Intl, so daylight saving follows the given date. Code only (no Figma component yet).',
      },
    },
  },
  args: { hour12: false, listHeight: 256, width: 360 },
  argTypes: {
    hour12: { name: '12-hour clock', control: 'boolean', description: 'Show 2:00 PM instead of 14:00.', table: { category: 'Picker' } },
    listHeight: { name: 'List height', control: { type: 'range', min: 120, max: 480, step: 8 }, description: 'Height of the list in px before it scrolls.', table: { category: 'Picker' } },
    width: { name: 'Width', control: { type: 'range', min: 276, max: 560, step: 4 }, description: 'Width of the container in px.', table: { category: 'Layout' } },
  },
  render: function Render({ hour12, listHeight, width }) {
    const [zone, setZone] = React.useState('Europe/Berlin');
    return (
      <div style={{ width, maxWidth: '100%' }}>
        <TimeZonePicker value={zone} onValueChange={setZone} now={NOW} hour12={hour12} listHeight={listHeight} />
      </div>
    );
  },
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwelveHour: Story = { args: { hour12: true } };

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <TimeZonePicker defaultValue="Europe/Berlin" now={NOW} onValueChange={fn()} />,
  play: async ({ canvas }) => {
    const list = canvas.getByRole('listbox', { name: 'Time zones' });
    const option = (name: RegExp) => canvas.getByRole('option', { name });
    // The local time of each zone at the fixed moment, with daylight saving.
    await expect(option(/^Berlin/)).toHaveTextContent('14:00');
    await expect(option(/^Berlin/)).toHaveTextContent('UTC+2');
    await expect(option(/^New York/)).toHaveTextContent('08:00');
    await expect(option(/^Tokyo/)).toHaveTextContent('21:00');
    await expect(option(/^Kolkata/)).toHaveTextContent('UTC+5:30');
    await expect(option(/^Auckland/)).toHaveTextContent('01:00');
    await expect(option(/^Auckland/)).toHaveTextContent('Tomorrow');
    await expect(option(/^Honolulu/)).toHaveTextContent('02:00');
    await expect(option(/^Berlin/)).toHaveAttribute('aria-selected', 'true');
    await expect(list).toBeVisible();
    // Search, then Enter picks the highlighted zone.
    const search = canvas.getByRole('combobox', { name: 'Search time zones' });
    await userEvent.click(search);
    await userEvent.type(search, 'tok');
    await waitFor(() => expect(canvas.getAllByRole('option')).toHaveLength(1));
    await expect(canvas.getByRole('status')).toHaveTextContent('1 time zone');
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('option', { name: /^Tokyo/ })).toHaveAttribute('aria-selected', 'true'));
    // Escape clears the search and the full list is back; arrows move the highlight.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.getAllByRole('option').length).toBeGreaterThan(10));
    const before = search.getAttribute('aria-activedescendant');
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(search.getAttribute('aria-activedescendant')).not.toBe(before));
    await expect(search).toHaveFocus();
    // No match says so.
    await userEvent.type(search, 'zzz');
    await waitFor(() => expect(canvas.queryAllByRole('option')).toHaveLength(0));
    await expect(canvas.getByText('No time zones match "zzz"')).toBeVisible();
  },
};

export const ClickCheck: Story = {
  tags: ['!dev'],
  render: () => <TimeZonePicker now={NOW} onValueChange={fn()} />,
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('option', { selected: true })).toBeNull();
    await userEvent.click(canvas.getByRole('option', { name: /^Sydney/ }));
    await waitFor(() => expect(canvas.getByRole('option', { name: /^Sydney/ })).toHaveAttribute('aria-selected', 'true'));
    // Sydney is 23:00 the same day as the selected zone, so no hint; Auckland is the day after.
    await expect(canvas.getByRole('option', { name: /^Sydney/ })).toHaveTextContent('23:00');
    await expect(canvas.getByRole('option', { name: /^Auckland/ })).toHaveTextContent('Tomorrow');
  },
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px] max-w-full"><Story /></div>],
  render: () => <TimeZonePicker defaultValue="America/Argentina/Buenos_Aires" zones={['America/Argentina/Buenos_Aires', 'America/Port-au-Prince', 'Asia/Kolkata', 'UTC']} now={NOW} />,
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.firstElementChild as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    const option = canvas.getByRole('option', { name: /^Buenos Aires/ });
    await expect(option).toHaveTextContent('09:00');
    await expect(option.scrollWidth).toBeLessThanOrEqual(option.clientWidth + 1);
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
