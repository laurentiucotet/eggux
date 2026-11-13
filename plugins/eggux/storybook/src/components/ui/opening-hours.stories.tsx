import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { OpeningHours, type HoursException, type HoursRange } from './opening-hours';

const moments = {
  'Friday, 14:30': '2026-11-13T14:30',
  'Friday, 17:30': '2026-11-13T17:30',
  'Friday, 19:00': '2026-11-13T19:00',
  'Saturday, 17:00': '2026-11-14T17:00',
  'Sunday, 11:00': '2026-11-15T11:00',
  'Wednesday, 08:00': '2026-11-11T08:00',
} as const;

const day: HoursRange[] = [{ open: '09:00', close: '18:00' }];
const split: HoursRange[] = [{ open: '09:00', close: '13:00' }, { open: '14:00', close: '18:00' }];
const weekPlain: HoursRange[][] = [day, day, day, day, day, [{ open: '10:00', close: '16:00' }], []];
const weekSplit: HoursRange[][] = [split, split, split, split, split, [{ open: '10:00', close: '16:00' }], []];
const exceptions: HoursException[] = [
  { date: '2026-11-11', label: 'Staff training day', ranges: [{ open: '12:00', close: '18:00' }] },
  { date: '2026-12-24', label: 'Christmas Eve', ranges: [{ open: '09:00', close: '13:00' }] },
  { date: '2026-12-25', label: 'Christmas Day', ranges: [] },
];

type Args = { moment: keyof typeof moments; hourFormat: '24' | '12'; lunchBreak: boolean; showExceptions: boolean; showSummary: boolean; width: number };

const meta = {
  title: 'Components/Location/Opening Hours',
  parameters: {
    docs: {
      description: {
        component:
          'A week table with today highlighted, a summary ("Open now. Closes at 18:00") computed from a fixed `now`, and exceptions (a holiday with its own hours or closed). Several ranges per day for lunch breaks, 24 or 12 hour clock. The time is a plain local string, so the text never depends on the browser time zone. Code only (no Figma component yet).',
      },
    },
  },
  args: { moment: 'Friday, 14:30', hourFormat: '24', lunchBreak: false, showExceptions: true, showSummary: true, width: 360 },
  argTypes: {
    moment: { name: 'Now', control: 'select', options: Object.keys(moments), description: 'The moment the status is judged at.', table: { category: 'Hours' } },
    hourFormat: { name: 'Clock', control: 'inline-radio', options: ['24', '12'], description: '24 or 12 hour clock.', table: { category: 'Hours' } },
    lunchBreak: { name: 'Lunch break', control: 'boolean', description: 'Two ranges on weekdays.', table: { category: 'Hours' } },
    showExceptions: { name: 'Show exceptions', control: 'boolean', description: 'A day with its own hours and special days ahead.', table: { category: 'Parts' } },
    showSummary: { name: 'Show summary', control: 'boolean', description: 'The badge and line above the table.', table: { category: 'Parts' } },
    width: { name: 'Width', control: { type: 'range', min: 240, max: 480, step: 4 }, description: 'Width in px.', table: { category: 'Layout' } },
  },
  render: ({ moment, hourFormat, lunchBreak, showExceptions, showSummary, width }) => (
    <div style={{ width }} className="max-w-full">
      <OpeningHours hours={lunchBreak ? weekSplit : weekPlain} now={moments[moment]} hourFormat={hourFormat} showSummary={showSummary} exceptions={showExceptions ? exceptions : []} />
    </div>
  ),
} satisfies Meta<Args>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DefaultCheck: Story = {
  tags: ['!dev'],
  render: () => <OpeningHours hours={weekPlain} now={moments['Friday, 14:30']} exceptions={exceptions} />,
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('status')).toHaveTextContent('Open now');
    await expect(canvas.getByRole('status')).toHaveTextContent('Closes at 18:00');
    const rows = canvasElement.querySelectorAll('tr');
    await expect(rows.length).toBe(7);
    const current = canvasElement.querySelectorAll('[aria-current="date"]');
    await expect(current.length).toBe(1);
    await expect(current[0]).toHaveTextContent('Friday');
    await expect(canvas.getByRole('row', { name: /Wednesday/ })).toHaveTextContent('Staff training day');
    await expect(canvas.getByRole('row', { name: /Wednesday/ })).toHaveTextContent('12:00 – 18:00');
    await expect(canvas.getByRole('row', { name: /Sunday/ })).toHaveTextContent('Closed');
    await expect(canvas.getByText('Christmas Day')).toBeVisible();
  },
};

export const StatusCheck: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-4">
      <OpeningHours hours={weekPlain} now={moments['Friday, 17:30']} showSummary />
      <OpeningHours hours={weekPlain} now={moments['Friday, 19:00']} hourFormat="12" />
      <OpeningHours hours={weekPlain} now={moments['Saturday, 17:00']} />
      <OpeningHours hours={weekSplit} now="2026-11-13T13:30" exceptions={exceptions} />
    </div>
  ),
  play: async ({ canvas }) => {
    const statuses = canvas.getAllByRole('status');
    await expect(statuses[0]).toHaveTextContent('Closing soon');
    await expect(statuses[0]).toHaveTextContent('Closes at 18:00');
    await expect(statuses[1]).toHaveTextContent('Closed');
    await expect(statuses[1]).toHaveTextContent('Opens tomorrow at 10:00 AM');
    await expect(statuses[2]).toHaveTextContent('Opens Monday at 09:00');
    await expect(statuses[3]).toHaveTextContent('Opens today at 14:00');
  },
};

/** Open, closing soon and closed, side by side. The row of today is highlighted in each. */
export const Statuses: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      <OpeningHours className="w-72" hours={weekPlain} now={moments['Friday, 14:30']} />
      <OpeningHours className="w-72" hours={weekPlain} now={moments['Friday, 17:30']} />
      <OpeningHours className="w-72" hours={weekSplit} now={moments['Saturday, 17:00']} hourFormat="12" />
    </div>
  ),
};

export const Stress: Story = {
  tags: ['!dev'],
  parameters: { controls: { disable: true } },
  decorators: [Story => <div className="w-[276px]"><Story /></div>],
  render: () => <OpeningHours hours={weekSplit} now={moments['Wednesday, 08:00']} hourFormat="12" exceptions={exceptions} />,
  play: async ({ canvas, canvasElement }) => {
    const root = canvasElement.querySelector('[data-slot=opening-hours]') as HTMLElement;
    await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1);
    await expect(canvas.getByRole('status')).toHaveTextContent('Opens today at 12:00 PM');
  },
};

export const DefaultDark: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Dark' } };
export const DefaultCorporate: Story = { ...DefaultCheck, tags: ['!dev'], globals: { theme: 'Corporate Light' } };
